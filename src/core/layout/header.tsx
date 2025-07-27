import { PanelLeftClose } from "lucide-react"
import { useSidebar } from "../providers"
import { useLocation } from "@tanstack/react-router"
import { useEffect, type JSX } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function Header(): JSX.Element {
  const { isSidebarOpen, onToggleSidebar } = useSidebar()
  const location = useLocation()

  useEffect(() => {
    console.log(`Current route: ${location.pathname}`)
  }, [location])

  const routeTitle: { [key: string]: string } = {
    '/app/home': 'Inicio',
    '/app/resources': 'Recursos',
    '/app/glossary': 'Glosario técnico',
    '/app/feedback': 'Enviar comentario',
  }

  return (
    <header className="flex h-16 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <div className="h-full py-4">
        <Separator orientation="vertical" className="h-4 mr-2" />
      </div>
      <div className="flex items-center">
        <h2 className="text-xl font-bold leading-tight">{routeTitle[location.pathname]}</h2>
      </div>
    </header>
  )
}