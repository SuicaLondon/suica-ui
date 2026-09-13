import { createElement } from 'react'
import { Card as RootCard } from 'suica-ui'
import { Alert } from 'suica-ui/alert'
import { Badge } from 'suica-ui/badge'
import { Button, buttonClassName } from 'suica-ui/button'
import { Card, CardContent } from 'suica-ui/card'
import { Checkbox } from 'suica-ui/checkbox'
import { Field } from 'suica-ui/field'
import { Input } from 'suica-ui/input'
import { Label } from 'suica-ui/label'
import { LoadingIndicator } from 'suica-ui/loading-indicator'
import { Overlay } from 'suica-ui/overlay'
import { SectionHeading } from 'suica-ui/section-heading'
import { Select } from 'suica-ui/select'
import { Skeleton } from 'suica-ui/skeleton'
import { Spinner } from 'suica-ui/spinner'
import { Table, TableBody, TableCell, TableRow } from 'suica-ui/table'
import { Textarea } from 'suica-ui/textarea'

export function ServerFixture() {
	return createElement(
		Card,
		null,
		createElement(CardContent, null, [
			createElement(Alert, { key: 'alert', title: 'Ready' }),
			createElement(Badge, { key: 'badge' }, 'New'),
			createElement(Button, { key: 'button' }, 'Save'),
			createElement(Checkbox, { key: 'checkbox' }),
			createElement(Field, {
				key: 'field',
				label: 'Name',
				children: createElement(Input),
			}),
			createElement(Label, { key: 'label' }, 'Label'),
			createElement(LoadingIndicator, { key: 'loading', label: 'Loading' }),
			createElement(Overlay, { key: 'overlay' }),
			createElement(SectionHeading, {
				key: 'heading',
				title: 'Heading',
				titleId: 'heading',
				eyebrow: 'Section',
				description: 'Description',
			}),
			createElement(Select, { key: 'select' }),
			createElement(Skeleton, { key: 'skeleton' }),
			createElement(Spinner, { key: 'spinner', label: 'Loading' }),
			createElement(
				Table,
				{ key: 'table' },
				createElement(
					TableBody,
					null,
					createElement(TableRow, null, createElement(TableCell, null, 'Cell')),
				),
			),
			createElement(Textarea, { key: 'textarea' }),
		]),
	)
}

void buttonClassName({ variant: 'outline' })
void createElement(RootCard, null, 'Root server import')

import { Separator } from 'suica-ui/separator'
void createElement(Separator, { decorative: false })
