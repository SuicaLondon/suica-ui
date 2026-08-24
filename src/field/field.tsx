import {
	cloneElement,
	forwardRef,
	useId,
	type AriaAttributes,
	type ComponentPropsWithoutRef,
	type ReactElement,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'
import { Label } from '../label/index.js'

type FieldControlProps = {
	id?: string
	disabled?: boolean
	'aria-describedby'?: string
	'aria-invalid'?: AriaAttributes['aria-invalid']
}

export interface FieldProps
	extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: ReactElement<FieldControlProps>
	label: ReactNode
	description?: ReactNode
	error?: ReactNode
}

function hasContent(content: ReactNode): boolean {
	return (
		content !== undefined &&
		content !== null &&
		content !== false &&
		content !== true &&
		content !== ''
	)
}

function isInvalid(ariaInvalid: AriaAttributes['aria-invalid']): boolean {
	return (
		ariaInvalid === true ||
		ariaInvalid === 'true' ||
		ariaInvalid === 'grammar' ||
		ariaInvalid === 'spelling'
	)
}

function mergeIdReferences(...references: Array<string | false | undefined>) {
	const ids = new Set<string>()

	for (const reference of references) {
		if (!reference) continue
		for (const id of reference.split(/\s+/)) {
			if (id) ids.add(id)
		}
	}

	return Array.from(ids).join(' ') || undefined
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
	{ children, label, description, error, className, ...fieldProps },
	ref,
) {
	const generatedId = useId()
	const controlId = children.props.id ?? `sui-field-${generatedId}`
	const descriptionId = `${controlId}-description`
	const errorId = `${controlId}-error`
	const hasDescription = hasContent(description)
	const hasError = hasContent(error)
	let ariaInvalid = children.props['aria-invalid']
	if (hasError) ariaInvalid = true
	const invalid = hasError || isInvalid(ariaInvalid)
	const ariaDescribedBy = mergeIdReferences(
		children.props['aria-describedby'],
		hasDescription && descriptionId,
		hasError && errorId,
	)
	const control = cloneElement(children, {
		id: controlId,
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': ariaInvalid,
	})

	return (
		<div
			{...fieldProps}
			ref={ref}
			data-slot="field"
			data-disabled={children.props.disabled || undefined}
			data-invalid={invalid || undefined}
			className={cn(
				'sui:group/field sui:grid sui:box-border sui:gap-2 sui:font-[family-name:var(--sui-theme-font-sans)]',
				className,
			)}
		>
			<Label
				htmlFor={controlId}
				data-slot="field-label"
				data-disabled={children.props.disabled || undefined}
				className="sui:group-data-[invalid=true]/field:text-danger"
			>
				{label}
			</Label>
			{hasDescription && (
				<p
					id={descriptionId}
					data-slot="field-description"
					className="sui:m-0 sui:text-muted sui:text-xs sui:leading-relaxed"
				>
					{description}
				</p>
			)}
			{control}
			{hasError && (
				<p
					id={errorId}
					role="alert"
					data-slot="field-error"
					className="sui:m-0 sui:text-danger sui:text-sm sui:font-medium"
				>
					{error}
				</p>
			)}
		</div>
	)
})
