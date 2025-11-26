import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { BookOpen, Code, Gavel, House, LogOut, ChevronRight } from 'lucide-react'
import type React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/modules/auth/auth.provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface MenuItem {
  href: string
  label: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  {
    href: '/app/home',
    label: 'Inicio',
    icon: House
  },
  {
    href: '/app/resources',
    label: 'Recursos',
    icon: BookOpen,
  },
  {
    href: '/app/glossary',
    label: 'Glosario técnico',
    icon: Gavel
  },
  {
    href: '/app/editor',
    label: 'Editor de código',
    icon: Code
  }
]

export default function AppSidebar(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, name } = useAuth()

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (!error) navigate({ to: '/' })
  }

  const imgFallback = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <Sidebar>
      <SidebarHeader className="p-4 pb-2 border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-sidebar-accent group">
              <Avatar className="h-10 w-10 border border-border shadow-sm">
                <AvatarImage src="/universidad_american_college.svg" alt={name || 'Usuario'} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {imgFallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-foreground">
                  {name || 'Usuario'}
                </span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {role || 'Invitado'}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`
                        transition-all duration-200 ease-in-out py-5 
                        ${isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                        }
                      `}
                    >
                      <Link to={item.href} className="flex items-center gap-3 w-full">
                        <item.icon className={`h-5 w-5${isActive ? " text-blue-500" : "opacity-70"}`} />
                        <span className={`${isActive && 'text-blue-500'}`}>{item.label}</span>
                        {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className={`
                w-full justify-start gap-3 pl-2
                text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors
              `}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Cerrar sesión</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}