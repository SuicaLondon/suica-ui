import { cn } from './cn'

describe('cn', () => {
	it('combines static classes with object-mapped state classes', () => {
		expect(
			cn('block', {
				'text-accent': true,
				'opacity-50': false,
			}),
		).toBe('block text-accent')
	})

	it('lets later Tailwind utilities override conflicting defaults', () => {
		expect(cn('px-3 text-muted', 'px-6 text-accent')).toBe('px-6 text-accent')
	})
	it('merges theme radii while preserving unrelated host classes', () => {
		expect(cn('host-card rounded-panel', 'rounded-sm')).toBe(
			'host-card rounded-sm',
		)
		expect(cn('rounded-lg', 'rounded-control')).toBe('rounded-control')
		expect(cn('host-card p-2', 'p-4')).toBe('host-card p-4')
	})

	it('merges responsive and state variants independently', () => {
		expect(cn('p-2 hover:p-3 md:p-4', 'hover:p-6 md:p-8')).toBe(
			'p-2 hover:p-6 md:p-8',
		)
		expect(cn('text-sm text-muted', 'text-lg')).toBe('text-muted text-lg')
	})
})
