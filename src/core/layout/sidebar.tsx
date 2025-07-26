import { Link } from '@tanstack/react-router';
import { BookOpen, Braces, Gavel, House, LogOut, MessageSquare } from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';

interface MenuItem {
  href: string
  label: string
  icon: JSX.Element
}

export default function Sidebar() {
  const menuItems: Array<MenuItem> = [
    { href: '/app/home', label: 'Inicio', icon: <House /> },
    { href: '/app/resources', label: 'Recursos', icon: <BookOpen /> },
    { href: '/app/glossary', label: 'Glosario técnico', icon: <Gavel /> },
    { href: '/app/feedback', label: 'Enviar comentario', icon: <MessageSquare /> },
  ]

  const handleLogout = (): void => { }

  return (
    <aside className={`min-h-full w-64 bg-base-200`}>
      <div className="py-4">
        <div className="flex items-center mb-4 px-5 py-2">
          <div className="bg-blue-500 rounded-full p-2">
            <Braces size={24} color='white' />
          </div>
          <div>
            <h2 className="ml-3 text-lg font-semibold">CodeSign</h2>
          </div>
        </div>

        <nav>
          <ul className="menu menu-vertical w-full">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 transition-colors duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="divider"></div>
          <button onClick={handleLogout} className="btn btn-block flex items-center space-x-3">
            <LogOut />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}