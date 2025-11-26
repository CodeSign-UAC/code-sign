import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  type SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/_layout/editor/')({
  component: ResourcePage,
})

const VANILLA_TEMPLATES = [
  'static',
  'vanilla',
  'vanilla-ts',
  'angular',
  'react',
  'react-ts',
  'svelte',
  'vue',
  'vue-ts',
  'solid',
]

const NODE_TEMPLATES = ['node', 'nextjs', 'astro']

const VITE_TEMPLATES = [
  'vite',
  'vite-react',
  'vite-react-ts',
  'vite-svelte',
  'vite-svelte-ts',
  'vite-vue',
  'vite-vue-ts',
  'vite-preact',
  'vite-preact-ts',
]

function getDevIconFromTemplate(
  template: SandpackPredefinedTemplate,
): string[] {
  switch (template) {
    case 'static':
      return ['html5-plain']
    case 'angular':
      return ['angularjs-plain']
    case 'react':
      return ['react-original']
    case 'react-ts':
      return ['react-original']
    case 'solid':
      return ['solidjs-plain']
    case 'svelte':
      return ['svelte-plain']
    case 'vanilla-ts':
      return ['typescript-plain']
    case 'vanilla':
      return ['javascript-plain']
    case 'vue':
      return ['vuejs-plain']
    case 'vue-ts':
      return ['vuejs-plain']
    case 'node':
      return ['nodejs-plain']
    case 'nextjs':
      return ['nextjs-plain']
    case 'vite':
      return ['vitejs-plain']
    case 'vite-react':
      return ['react-original']
    case 'vite-react-ts':
      return ['react-original']
    case 'vite-preact':
      return ['react-original']
    case 'vite-preact-ts':
      return ['react-original']
    case 'vite-vue':
      return ['vuejs-plain']
    case 'vite-vue-ts':
      return ['vuejs-plain']
    case 'vite-svelte':
      return ['svelte-plain']
    case 'vite-svelte-ts':
      return ['svelte-plain']
    case 'astro':
      return ['astro-plain']
  }
  return ['']
}
function getLabelFromTemplate(template: SandpackPredefinedTemplate): string {
  switch (template) {
    case 'static':
      return 'Static'
    case 'angular':
      return 'Angular'
    case 'react':
    case 'vite-react':
      return 'React'
    case 'react-ts':
    case 'vite-react-ts':
      return 'React TS'
    case 'solid':
      return 'Solid'
    case 'svelte':
    case 'vite-svelte':
      return 'Svelte'
    case 'vite-svelte-ts':
      return 'Svelte TS'
    case 'vanilla-ts':
      return 'Vanilla TS'
    case 'vanilla':
      return 'Vanilla'
    case 'vue':
    case 'vite-vue':
      return 'Vue'
    case 'vue-ts':
    case 'vite-vue-ts':
      return 'Vue TS'
    case 'node':
      return 'Node.js'
    case 'nextjs':
      return 'Next.js'
    case 'vite':
      return 'Vite'
    case 'vite-preact':
      return 'Preact'
    case 'vite-preact-ts':
      return 'Preact TS'
    case 'astro':
      return 'Astro'
  }
  return ''
}

interface TemplateIconProp {
  template: SandpackPredefinedTemplate
}

function TemplateIcon({ template }: TemplateIconProp): React.JSX.Element {
  const icons = getDevIconFromTemplate(template)
  return (
    <>
      {icons.map((icon) => (
        <i className={cn(['devicon-' + icon, 'colored'])}></i>
      ))}
    </>
  )
}

export default function ResourcePage(): React.JSX.Element {
  const [template, setTemplate] = useState<string>('vanilla')

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-3xl font-bold">Editor de código integrado</h1>
      </section>
      <section className="mt-8">
        <Select value={template} onValueChange={setTemplate}>
          <label className="flex items-center gap-2 mb-4 w-fit">
            Plantilla:
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona..." />
            </SelectTrigger>
          </label>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Vanilla</SelectLabel>
              {VANILLA_TEMPLATES.map((template) => (
                <SelectItem value={template} key={template}>
                  <TemplateIcon
                    template={template as SandpackPredefinedTemplate}
                  />
                  {getLabelFromTemplate(template as SandpackPredefinedTemplate)}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Node</SelectLabel>
              {NODE_TEMPLATES.map((template) => (
                <SelectItem value={template} key={template}>
                  <TemplateIcon
                    template={template as SandpackPredefinedTemplate}
                  />
                  {getLabelFromTemplate(template as SandpackPredefinedTemplate)}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>
                Vite
                <TemplateIcon template="vite" />
              </SelectLabel>
              {VITE_TEMPLATES.map((template) => (
                <SelectItem value={template} key={template}>
                  <TemplateIcon
                    template={template as SandpackPredefinedTemplate}
                  />
                  {getLabelFromTemplate(template as SandpackPredefinedTemplate)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <SandpackProvider
          theme="light"
          template={template as SandpackPredefinedTemplate}
        >
          <SandpackLayout>
            <SandpackFileExplorer className="!h-auto md:!h-[600px]" />
            <SandpackCodeEditor
              closableTabs
              showTabs
              showLineNumbers
              showRunButton
              initMode="immediate"
              className="!h-[300px] md:!h-[600px]"
              style={{ height: 600 }}
            />
            <div
              className="flex flex-col w-full md:w-[40%]"
              style={{ height: 600 }}
            >
              <SandpackPreview className="border-solid border-b-1 !h-[60%] grow" />
              <SandpackConsole className="!h-[30%]" />
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </section>
    </div>
  )
}
