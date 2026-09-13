// Colons inside brackets belong to the variant or value, not the utility separator.
export function hasArbitraryValue(value) {
	return value.split(/\s+/u).some((token) => {
		let depth = 0
		let start = 0
		for (let index = 0; index < token.length; index += 1) {
			if (token[index] === '[' || token[index] === '(') depth += 1
			else if (token[index] === ']' || token[index] === ')') depth -= 1
			else if (token[index] === ':' && depth === 0) start = index + 1
		}
		return /\[|\(--/u.test(token.slice(start))
	})
}
