import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { BookOpen, Gavel, House, LogOut, MessageSquare } from 'lucide-react'
import type React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/modules/auth/auth.provider'

interface MenuItem {
  href: string
  label: string
  icon: React.JSX.Element
}

const menuItems: MenuItem[] = [
  { href: '/app/home', label: 'Inicio', icon: <House /> },
  { href: '/app/resources', label: 'Recursos', icon: <BookOpen /> }, // No debería estar disponible para Alumnos, debería ser el crud (?).
  { href: '/app/glossary', label: 'Glosario técnico', icon: <Gavel /> },
  { href: '/app/feedback', label: 'Enviar comentario', icon: <MessageSquare /> }
]

export default function AppSidebar(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, name } = useAuth()

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (!error) navigate({ to: '/' })
  }

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="rounded-lg w-10 h-10">
            <AvatarImage src="/universidad_american_college.svg" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-600">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item: MenuItem): React.JSX.Element => {
                const isActive: boolean = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild className={`${isActive && 'bg-sidebar-accent text-blue-600'} hover:text-blue-600 active:text-blue-600`}>
                      <Link to={item.href}>
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter className="p-4">
        <Button
          variant={'outline'}
          className="w-full cursor-pointer hover:bg-black hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
