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
})
