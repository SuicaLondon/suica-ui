import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Textarea } from './index'

describe('Textarea', () => {
	it('forwards native props and its textarea ref', async () => {
		const user = userEvent.setup()
		const ref = createRef<HTMLTextAreaElement>()

		render(
			<Textarea
				ref={ref}
				aria-label="Content"
				name="content"
				rows={8}
				maxLength={200}
			/>,
		)

		const textarea = screen.getByLabelText('Content')
		await user.type(textarea, 'A post')

		expect(ref.current).toBe(textarea)
		expect(textarea).toHaveValue('A post')
		expect(textarea).toHaveAttribute('name', 'content')
		expect(textarea).toHaveAttribute('rows', '8')
		expect(textarea).toHaveAttribute('maxlength', '200')
		expect(textarea).toHaveAttribute('data-slot', 'textarea')
		expect(textarea).toHaveClass(
			'sui:min-h-[60px]',
			'sui:rounded-control',
			'sui:bg-transparent',
			'sui:focus-visible:ring-1',
		)
	})

	it('preserves invalid, disabled, and caller styling', () => {
		render(
			<Textarea
				aria-label="Content"
				aria-invalid
				disabled
				className="sui:min-h-64 sui:font-mono"
			/>,
		)

		const textarea = screen.getByLabelText('Content')
		expect(textarea).toBeDisabled()
		expect(textarea).toHaveAttribute('aria-invalid', 'true')
		expect(textarea).toHaveClass('sui:min-h-64', 'sui:font-mono')
		expect(textarea).not.toHaveClass('sui:min-h-[60px]')
	})
})
