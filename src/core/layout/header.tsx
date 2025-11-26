import { useLocation, useMatches } from '@tanstack/react-router'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const routeTitle: Record<string, string> = {
  '/app/home': 'Inicio',
  '/app/resources': 'Recursos',
  '/app/glossary': 'Glosario técnico',
  '/app/editor': 'Editor de código',
}

export default function Header(): React.JSX.Element {
  const location = useLocation()

  const matches = useMatches()
  const match = matches.find((v) => v.pathname == location.pathname)

  const pageEntry = Object.entries(routeTitle).find(([k, _v]) =>
    location.pathname.startsWith(k),
  )
  const page = pageEntry ? pageEntry[1] : ''

  let subPage: string | undefined
  if (match?.loaderData) {
    subPage = match.loaderData.resource.title
  }

  return (
    <header className="flex h-16 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <div className="h-full py-4">
        <Separator orientation="vertical" className="h-4 mr-2" />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden lg:block">
            Plataforma estudiantil
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden lg:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-md font-medium text-blue-600">
              {page}
            </BreadcrumbPage>
          </BreadcrumbItem>
          {subPage && (
            <>
              <BreadcrumbSeparator className="hidden lg:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-md font-medium text-blue-600">
                  {subPage}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

