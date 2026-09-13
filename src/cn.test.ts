import { cn } from './cn'

describe('cn', () => {
	it('combines static classes with object-mapped state classes', () => {
		expect(
			cn('sui:block', {
				'sui:text-accent': true,
				'sui:opacity-50': false,
			}),
		).toBe('sui:block sui:text-accent')
	})

	it('lets later Tailwind utilities override conflicting defaults', () => {
		expect(cn('sui:px-3 sui:text-muted', 'sui:px-6 sui:text-accent')).toBe(
			'sui:px-6 sui:text-accent',
		)
	})
	it('merges theme radii while preserving unrelated host classes', () => {
		expect(cn('host-card sui:rounded-panel', 'sui:rounded-sm')).toBe(
			'host-card sui:rounded-sm',
		)
		expect(cn('sui:rounded-lg', 'sui:rounded-control')).toBe(
			'sui:rounded-control',
		)
		expect(cn('host-card p-2', 'p-4')).toBe('host-card p-2 p-4')
	})

	it('merges responsive and state variants independently', () => {
		expect(
			cn('sui:p-2 sui:hover:p-3 sui:md:p-4', 'sui:hover:p-6 sui:md:p-8'),
		).toBe('sui:p-2 sui:hover:p-6 sui:md:p-8')
		expect(cn('sui:text-sm sui:text-muted', 'sui:text-lg')).toBe(
			'sui:text-muted sui:text-lg',
		)
	})
})
