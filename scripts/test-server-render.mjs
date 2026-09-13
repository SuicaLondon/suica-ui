import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Card as RootCard } from '../dist/index.js'
import { Badge } from '../dist/badge/index.js'
import { Button } from '../dist/button/index.js'
import { Card, CardContent } from '../dist/card/index.js'

const markup = renderToStaticMarkup(
	createElement(
		Card,
		null,
		createElement(
			CardContent,
			null,
			createElement(Badge, null, 'Ready'),
			createElement(Button, null, 'Open'),
		),
	),
)

if (!markup.includes('data-slot="card"')) {
	throw new Error('The server fixture did not render the Card subpath')
}

const rootMarkup = renderToStaticMarkup(createElement(RootCard, null, 'Root'))
if (!rootMarkup.includes('data-slot="card"')) {
	throw new Error(
		'The server fixture did not render Card from the mixed root entry',
	)
}

// Client components must also survive the initial server render in Next.js.
const { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } =
	await import('../dist/dropdown-menu/index.js')
for (const props of [{ defaultOpen: true }, { open: true }]) {
	const menuMarkup = renderToStaticMarkup(
		createElement(
			DropdownMenu,
			props,
			createElement(DropdownMenuTrigger, null, 'Actions'),
			createElement(DropdownMenuContent, null, 'Menu content'),
		),
	)
	if (
		!menuMarkup.includes('aria-expanded="true"') ||
		menuMarkup.includes('role="menu"')
	) {
		throw new Error(
			'Initially open menus must defer their portal until hydration',
		)
	}
}

const { DatePicker } = await import('../dist/date-picker/index.js')
if (renderToStaticMarkup(createElement(DatePicker)) !== '') {
	throw new Error('The local-date calendar must wait until hydration')
}
const previousTimeZone = process.env.TZ
try {
	const calendarProps = {
		today: new Date('2026-12-31T23:30:00Z'),
		timeZone: 'Asia/Singapore',
	}
	process.env.TZ = 'UTC'
	const serverCalendar = renderToStaticMarkup(
		createElement(DatePicker, calendarProps),
	)
	process.env.TZ = 'America/Los_Angeles'
	const clientCalendar = renderToStaticMarkup(
		createElement(DatePicker, calendarProps),
	)
	if (
		serverCalendar !== clientCalendar ||
		!serverCalendar.includes('January 2027')
	) {
		throw new Error(
			'Explicit calendar dates and time zones must render identically across hosts',
		)
	}
} finally {
	if (previousTimeZone === undefined) delete process.env.TZ
	else process.env.TZ = previousTimeZone
}
