import { PanelLeftClose } from "lucide-react"
import { useSidebar } from "../providers"
import { useLocation } from "@tanstack/react-router"
import { useEffect, type JSX } from "react"

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
    <header className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="flex items-center">
          <button className="btn btn-ghost" onClick={(): void => onToggleSidebar(!isSidebarOpen)}>
            <PanelLeftClose size={20} />
          </button>
          {/* <div className="border-l-2 border-base-content h-2"></div> */}
          <h2 className="text-xl font-bold leading-tight">{routeTitle[location.pathname]}</h2>
        </div>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
        </div>
      </div>
    </header>
  )
}