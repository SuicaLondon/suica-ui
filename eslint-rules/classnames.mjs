import path from 'node:path'
import noStaticInlineStyles from './no-static-inline-styles.mjs'
import { hasArbitraryValue } from './arbitrary-values.mjs'
import { normalizeNumericUtilities } from './numeric-utilities.mjs'
import preferAndRendering from './prefer-and-rendering.mjs'

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

function isClassContext(node) {
	for (let parent = node.parent; parent; parent = parent.parent) {
		if (isCnCall(parent)) return true
		if (parent.type === 'JSXAttribute')
			return /className$/i.test(parent.name.name)
		if (
			parent.type === 'Property' &&
			/className$/i.test(parent.key.name ?? parent.key.value ?? '')
		)
			return true
		if (parent.type === 'VariableDeclarator')
			return /class|variant/i.test(parent.id.name ?? '')
		if (parent.type === 'ReturnStatement') return false
	}
	return false
}

export default {
	meta: { name: 'suica-classnames' },
	rules: {
		'no-static-inline-styles': noStaticInlineStyles,
		'no-arbitrary-values': {
			meta: {
				type: 'suggestion',
				schema: [],
				messages: {
					arbitrary:
						'Use a standard utility or a named theme token instead of an arbitrary value or property.',
				},
			},
			create(context) {
				function check(node, value) {
					if (isClassContext(node) && hasArbitraryValue(value))
						context.report({ node, messageId: 'arbitrary' })
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
		'prefer-and-rendering': preferAndRendering,
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
					useCn: 'Use cn(...) to merge class names instead of string concatenation.',
					longString:
						'Split class strings into cn(...) arguments of at most {{maxLength}} characters. Keep individual utility tokens intact.',
					importCn: 'Import the shared cn helper for class composition.',
				},
			},
			create(context) {
				const maxLength = context.options[0]?.maxLength ?? 80
				let needsCn = false
				let hasCn = false

				return {
					ImportDeclaration(node) {
						if (node.specifiers.some((specifier) => specifier.local.name === 'cn'))
							hasCn = true
					},
					BinaryExpression(node) {
						if (node.operator === '+' && isClassContext(node))
							context.report({ node, messageId: 'useCn' })
					},
					TemplateLiteral(node) {
						if (node.expressions.length && isClassContext(node))
							context.report({ node, messageId: 'useCn' })
						const oversized = node.quasis.some((part) => {
							const value = part.value.cooked ?? part.value.raw
							return (
								isClassContext(node) &&
								value.length > maxLength &&
								splitClasses(value, maxLength).length > 1
							)
						})
						if (oversized)
							context.report({ node, messageId: 'longString', data: { maxLength } })
					},
					Literal(node) {
						if (typeof node.value !== 'string' || !isClassContext(node)) return
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

		'prefer-numeric-utilities': {
			meta: {
				type: 'suggestion',
				fixable: 'code',
				schema: [],
				messages: {
					numeric:
						'Use standard numeric Tailwind utilities instead of equivalent arbitrary values.',
				},
			},
			create(context) {
				function check(node, value) {
					if (!isClassContext(node) || normalizeNumericUtilities(value) === value)
						return
					context.report({
						node,
						messageId: 'numeric',
						fix: (fixer) =>
							fixer.replaceText(
								node,
								normalizeNumericUtilities(context.sourceCode.getText(node)),
							),
					})
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
		'no-css-variable-classes': {
			meta: {
				type: 'suggestion',
				schema: [],
				messages: {
					themeVariable:
						'Reference CSS variables through a named Tailwind theme token or @utility, not directly in class strings.',
				},
			},
			create(context) {
				function check(node, value) {
					if (
						isClassContext(node) &&
						/(?:var\(\s*--|\([^)]*--[\w-]+\))/u.test(value)
					)
						context.report({ node, messageId: 'themeVariable' })
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
		'no-arbitrary-blur': {
			meta: {
				type: 'suggestion',
				schema: [],
				messages: {
					namedBlur:
						'Use a named blur theme token instead of an arbitrary blur value.',
				},
			},
			create(context) {
				function check(node, value) {
					if (
						isClassContext(node) &&
						/(?:^|[\s:!])(?:backdrop-)?blur-[[(]/u.test(value)
					)
						context.report({ node, messageId: 'namedBlur' })
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
		'no-arbitrary-css-math': {
			meta: {
				type: 'suggestion',
				schema: [],
				messages: {
					namedMath:
						'Move CSS math out of arbitrary class values into a named Tailwind @utility or theme token.',
				},
			},
			create(context) {
				function check(node, value) {
					if (
						isClassContext(node) &&
						/\[[^\]]*\b(?:calc|min|max|clamp)\(/u.test(value)
					)
						context.report({ node, messageId: 'namedMath' })
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
		'no-arbitrary-leading': {
			meta: {
				type: 'suggestion',
				fixable: 'code',
				schema: [],
				messages: {
					named:
						'Use a named line-height utility (for example leading-tight), or define a --leading-* theme token.',
				},
			},
			create(context) {
				const replacements = {
					1: 'none',
					1.25: 'tight',
					1.375: 'snug',
					1.5: 'normal',
					1.625: 'relaxed',
					2: 'loose',
				}
				function check(node, value) {
					if (!isClassContext(node)) return
					const pattern = /(?<![\w-])leading-(?:\[[^\]]+\]|\([^)]*\))/gu
					if (!pattern.test(value)) return
					context.report({
						node,
						messageId: 'named',
						fix(fixer) {
							const original = context.sourceCode.getText(node)
							const fixed = original.replace(
								/leading-\[([\d.]+)\]/gu,
								(token, number) =>
									replacements[number] ? `leading-${replacements[number]}` : token,
							)
							return fixed === original ? null : fixer.replaceText(node, fixed)
						},
					})
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
		'no-arbitrary-variants': {
			meta: {
				type: 'suggestion',
				schema: [],
				messages: {
					selector:
						'Use explicit element classes or a named Tailwind utility instead of arbitrary selector variants.',
				},
			},
			create(context) {
				function check(node, value) {
					if (!isClassContext(node)) return
					for (const token of value.split(/\s+/u)) {
						let depth = 0
						let start = 0
						for (let index = 0; index < token.length; index++) {
							if (token[index] === '[') depth++
							if (token[index] === ']') depth--
							if (token[index] === ':' && depth === 0) {
								if (token[start] === '[') {
									context.report({ node, messageId: 'selector' })
									return
								}
								start = index + 1
							}
						}
					}
				}
				return {
					Literal(node) {
						if (typeof node.value === 'string') check(node, node.value)
					},
					TemplateElement(node) {
						check(node, node.value.cooked ?? node.value.raw)
					},
				}
			},
		},
	},
}
