function unwrap(node) {
	while (
		[
			'TSAsExpression',
			'TSSatisfiesExpression',
			'TSNonNullExpression',
			'ChainExpression',
		].includes(node?.type)
	)
		node = node.expression
	return node
}

export default {
	meta: {
		type: 'suggestion',
		schema: [],
		messages: {
			staticStyle:
				'Move fixed inline styles to classes or named utilities. Inline styles are reserved for runtime values or CSS variables.',
		},
	},
	create(context) {
		const checked = new Set()
		function initializer(node) {
			const variable = context.sourceCode.getScope(node).set.get(node.name)
			let scope = context.sourceCode.getScope(node)
			let resolved = variable
			while (!resolved && scope.upper) {
				scope = scope.upper
				resolved = scope.set.get(node.name)
			}
			return resolved?.defs.find((def) => def.type === 'Variable')?.node.init
		}
		function isFixed(node, seen = new Set()) {
			node = unwrap(node)
			if (!node || seen.has(node)) return false
			seen = new Set(seen).add(node)
			switch (node.type) {
				case 'Literal':
					return typeof node.value !== 'string' || !/var\(\s*--/u.test(node.value)
				case 'Identifier':
					return node.name === 'undefined' || isFixed(initializer(node), seen)
				case 'TemplateLiteral':
					return (
						node.expressions.every((value) => isFixed(value, seen)) &&
						!node.quasis.some((part) => /var\(\s*--/u.test(part.value.raw))
					)
				case 'UnaryExpression':
					return isFixed(node.argument, seen)
				case 'BinaryExpression':
				case 'LogicalExpression':
					return isFixed(node.left, seen) && isFixed(node.right, seen)
				case 'ConditionalExpression':
					return (
						isFixed(node.test, seen) &&
						isFixed(node.consequent, seen) &&
						isFixed(node.alternate, seen)
					)
				default:
					return false
			}
		}
		function check(node) {
			node = unwrap(node)
			if (!node || checked.has(node)) return
			checked.add(node)
			if (node.type === 'Identifier') {
				check(initializer(node))
				return
			}
			if (node.type === 'ConditionalExpression') {
				check(node.consequent)
				check(node.alternate)
				return
			}
			if (node.type === 'LogicalExpression') {
				check(node.left)
				check(node.right)
				return
			}
			if (node.type !== 'ObjectExpression') return
			for (const property of node.properties) {
				if (property.type === 'SpreadElement') check(property.argument)
				else if (isFixed(property.value))
					context.report({ node: property, messageId: 'staticStyle' })
			}
		}
		return {
			JSXAttribute(node) {
				if (
					node.name.name === 'style' &&
					node.value?.type === 'JSXExpressionContainer'
				)
					check(node.value.expression)
			},
			Property(node) {
				if ((node.key.name ?? node.key.value) === 'style') check(node.value)
			},
		}
	},
}
