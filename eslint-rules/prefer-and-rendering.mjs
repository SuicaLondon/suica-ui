function isBooleanExpression(node) {
	if (node.type === 'Literal') return typeof node.value === 'boolean'
	if (node.type === 'UnaryExpression') return node.operator === '!'
	if (node.type === 'BinaryExpression')
		return [
			'===',
			'!==',
			'==',
			'!=',
			'<',
			'<=',
			'>',
			'>=',
			'in',
			'instanceof',
		].includes(node.operator)
	if (node.type === 'LogicalExpression')
		return isBooleanExpression(node.left) && isBooleanExpression(node.right)
	return false
}

export default {
	meta: {
		type: 'suggestion',
		fixable: 'code',
		schema: [],
		messages: {
			preferAnd:
				'Use && for conditional JSX children with a null fallback. Coerce non-boolean conditions to avoid rendering 0.',
		},
	},
	create(context) {
		const source = context.sourceCode
		return {
			ConditionalExpression(node) {
				if (node.alternate.type !== 'Literal' || node.alternate.value !== null)
					return
				const container = node.parent
				if (container.type !== 'JSXExpressionContainer') return
				if (!['JSXElement', 'JSXFragment'].includes(container.parent.type)) return
				context.report({
					node,
					messageId: 'preferAnd',
					fix(fixer) {
						if (source.getCommentsInside(node).length) return null
						const test = source.getText(node.test)
						const condition = isBooleanExpression(node.test)
							? `(${test})`
							: `!!(${test})`
						return fixer.replaceText(
							node,
							`${condition} && (${source.getText(node.consequent)})`,
						)
					},
				})
			},
		}
	},
}
