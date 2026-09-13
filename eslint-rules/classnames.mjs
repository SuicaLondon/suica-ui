import path from 'node:path'

const isCnCall = (node) =>
	node?.type === 'CallExpression' &&
	node.callee.type === 'Identifier' &&
	node.callee.name === 'cn'

function splitClasses(value, maxLength) {
	const chunks = []
	for (const token of value.trim().split(/\s+/u)) {
		const last = chunks.at(-1)
		if (last && last.length + token.length + 1 <= maxLength)
			chunks[chunks.length - 1] += ` ${token}`
		else chunks.push(token)
	}
	return chunks
}

export default {
	meta: { name: 'suica-classnames' },
	rules: {
		'consistent-classnames': {
			meta: {
				type: 'suggestion',
				fixable: 'code',
				schema: [
					{
						type: 'object',
						properties: { maxLength: { type: 'integer', minimum: 20 } },
						additionalProperties: false,
					},
				],
				messages: {
					useCn: 'Wrap className values in cn(...).',
					longString:
						'Split class strings into cn(...) arguments of at most {{maxLength}} characters. Keep individual utility tokens intact.',
					importCn: 'Import the shared cn helper for class composition.',
				},
			},
			create(context) {
				const source = context.sourceCode
				const maxLength = context.options[0]?.maxLength ?? 80
				let needsCn = false
				let hasCn = false

				function requireCn(node, value, jsx = false) {
					if (!value || isCnCall(value)) return
					needsCn = true
					context.report({
						node,
						messageId: 'useCn',
						fix(fixer) {
							let expression = source.getText(value)
							if (jsx && value.type === 'Literal')
								expression = JSON.stringify(value.value)
							if (node.type === 'Property' && node.shorthand)
								return fixer.replaceText(node, `className: cn(${expression})`)
							if (jsx) return fixer.replaceText(node.value, `{cn(${expression})}`)
							return fixer.replaceText(value, `cn(${expression})`)
						},
					})
				}

				return {
					ImportDeclaration(node) {
						if (node.specifiers.some((specifier) => specifier.local.name === 'cn'))
							hasCn = true
					},
					JSXAttribute(node) {
						if (node.name.name !== 'className' || !node.value) return
						const value =
							node.value.type === 'JSXExpressionContainer'
								? node.value.expression
								: node.value
						requireCn(node, value, true)
					},
					Property(node) {
						if (node.parent.type !== 'ObjectExpression' || node.computed) return
						if (node.key.name === 'className' || node.key.value === 'className')
							requireCn(node, node.value)
					},
					TemplateLiteral(node) {
						const oversized = node.quasis.some((part) => {
							const value = part.value.cooked ?? part.value.raw
							return (
								value.includes('sui:') &&
								value.length > maxLength &&
								splitClasses(value, maxLength).length > 1
							)
						})
						if (oversized)
							context.report({ node, messageId: 'longString', data: { maxLength } })
					},
					Literal(node) {
						if (typeof node.value !== 'string' || !node.value.includes('sui:')) return
						if (node.value.length <= maxLength || !/\s/u.test(node.value)) return
						const chunks = splitClasses(node.value, maxLength)
						if (chunks.length < 2) return
						needsCn = true
						context.report({
							node,
							messageId: 'longString',
							data: { maxLength },
							fix(fixer) {
								const args = chunks.map((chunk) => JSON.stringify(chunk)).join(',\n')
								if (node.parent.type === 'Property' && node.parent.key === node)
									return fixer.replaceText(node, `[cn(\n${args},\n)]`)
								if (isCnCall(node.parent)) return fixer.replaceText(node, args)
								const call = `cn(\n${args},\n)`
								if (node.parent.type === 'JSXAttribute')
									return fixer.replaceText(node, `{${call}}`)
								return fixer.replaceText(node, call)
							},
						})
					},
					'Program:exit'(node) {
						if (!needsCn || hasCn) return
						let importPath = path
							.relative(
								path.dirname(context.filename),
								path.join(context.cwd, 'src/cn.js'),
							)
							.split(path.sep)
							.join('/')
						if (!importPath.startsWith('.')) importPath = `./${importPath}`
						const directive = node.body.findLast(
							(statement) =>
								statement.type === 'ExpressionStatement' && statement.directive,
						)
						const declaration = `\nimport { cn } from ${JSON.stringify(importPath)}\n`
						context.report({
							node,
							messageId: 'importCn',
							fix: (fixer) =>
								directive
									? fixer.insertTextAfter(directive, declaration)
									: fixer.insertTextBefore(node, declaration),
						})
					},
				}
			},
		},
	},
}
