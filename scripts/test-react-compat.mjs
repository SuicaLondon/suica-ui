import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const reactVersions = ['18.3.1', '19.2.8']
const temporaryRoot = await mkdtemp(join(tmpdir(), 'suica-ui-react-compat-'))
const environment = {
	...process.env,
	HUSKY: '0',
	npm_config_cache: join(temporaryRoot, 'npm-cache'),
}

try {
	const packOutput = execFileSync(
		'npm',
		['pack', '--json', '--ignore-scripts', '--pack-destination', temporaryRoot],
		{ encoding: 'utf8', env: environment },
	)
	const [packResult] = JSON.parse(packOutput)
	const tarballPath = resolve(temporaryRoot, packResult.filename)

	for (const reactVersion of reactVersions) {
		const reactMajor = reactVersion.split('.')[0]
		const consumerDirectory = join(temporaryRoot, `react-${reactVersion}`)
		await mkdir(consumerDirectory)
		await writeFile(
			join(consumerDirectory, 'package.json'),
			JSON.stringify(
				{
					private: true,
					type: 'module',
					dependencies: {
						'@types/react': reactMajor,
						'@types/react-dom': reactMajor,
						react: reactVersion,
						'react-dom': reactVersion,
						'suica-ui': `file:${tarballPath}`,
					},
				},
				null,
				2,
			),
		)
		await writeFile(
			join(consumerDirectory, 'render.mjs'),
			`import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DatePicker } from 'suica-ui/date-picker'
import { Separator } from 'suica-ui/separator'
import { Card as RootCard } from 'suica-ui'
import { Card } from 'suica-ui/card'

const markup = renderToStaticMarkup(createElement(Card, null, 'Compatible'))
if (!markup.includes('data-slot="card"')) throw new Error('Card did not render')
const rootMarkup = renderToStaticMarkup(createElement(RootCard, null, 'Compatible'))
if (!rootMarkup.includes('data-slot="card"')) throw new Error('Root Card did not render')
const calendarMarkup = renderToStaticMarkup(createElement(DatePicker, { today: new Date(2026, 8, 13) }))
if (!calendarMarkup.includes('September')) throw new Error('DatePicker did not render')
const separatorMarkup = renderToStaticMarkup(createElement(Separator, { decorative: false }))
if (!separatorMarkup.includes('role="separator"')) throw new Error('Separator did not render')
`,
		)
		await writeFile(
			join(consumerDirectory, 'typecheck.tsx'),
			`import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { DatePicker } from 'suica-ui/date-picker'
import { Separator } from 'suica-ui/separator'
import { Card as RootCard } from 'suica-ui'
import { Button, buttonClassName } from 'suica-ui/button'
import { Card } from 'suica-ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'suica-ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLink, DropdownMenuTrigger } from 'suica-ui/dropdown-menu'
import { SidebarItem } from 'suica-ui/sidebar'

const CustomLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => <a {...props} ref={ref} />)
const menuLink = <DropdownMenuLink render={(props) => <CustomLink {...props} href="/posts" />}>Posts</DropdownMenuLink>
const sidebarLink = <SidebarItem render={(props) => <CustomLink {...props} href="/posts" />}>Posts</SidebarItem>

const className: string = buttonClassName({ variant: 'outline' })
const calendar = <DatePicker selected={new Date(2026, 8, 13)} onSelect={() => undefined} />
const separator = <Separator decorative={false} />
void [calendar, separator]
const serverSafe = <Card><Button className={className}>Compatible</Button></Card>
const rootCompatible = <RootCard>Compatible</RootCard>
const interactive = (
  <Dialog defaultOpen>
    <DialogContent>
      <DialogTitle>Compatible</DialogTitle>
      <DialogDescription>React ${reactMajor} types</DialogDescription>
    </DialogContent>
  </Dialog>
)
const menu = (
  <DropdownMenu><DropdownMenuTrigger>Menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Item</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
)
void [serverSafe, rootCompatible, interactive, menu, menuLink, sidebarLink]
`,
		)
		await writeFile(
			join(consumerDirectory, 'tsconfig.json'),
			JSON.stringify(
				{
					compilerOptions: {
						strict: true,
						noEmit: true,
						jsx: 'react-jsx',
						module: 'NodeNext',
						moduleResolution: 'NodeNext',
						noUncheckedSideEffectImports: true,
					},
					include: ['typecheck.tsx'],
				},
				null,
				2,
			),
		)

		execFileSync(
			'npm',
			['install', '--ignore-scripts', '--no-audit', '--no-fund'],
			{ cwd: consumerDirectory, env: environment, stdio: 'inherit' },
		)
		execFileSync(process.execPath, ['render.mjs'], {
			cwd: consumerDirectory,
			stdio: 'inherit',
		})
		execFileSync(resolve('node_modules/.bin/tsc'), ['-p', 'tsconfig.json'], {
			cwd: consumerDirectory,
			stdio: 'inherit',
		})
	}
} finally {
	await rm(temporaryRoot, { recursive: true, force: true })
}
