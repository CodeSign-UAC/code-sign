import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookOpen, Braces, Gavel, House, LogOut, MessageSquare, User } from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';

interface MenuItem {
  href: string
  label: string
  icon: JSX.Element
}

export default function AppSidebar(): JSX.Element {
  const navigate = useNavigate()

  const menuItems: Array<MenuItem> = [
    { href: '/app/home', label: 'Inicio', icon: <House /> },
    // { href: '/app/resources', label: 'Recursos', icon: <BookOpen /> }, // No disponible para Alumnos.
    { href: '/app/glossary', label: 'Glosario técnico', icon: <Gavel /> },
    { href: '/app/feedback', label: 'Enviar comentario', icon: <MessageSquare /> },
  ]

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (!error) navigate({ to: '/' })
  }

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className='p-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='rounded-lg w-10 h-10'>
            <AvatarImage src="/universidad_american_college.svg" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm font-medium text-gray-600'>Roberto Amador</p>
            <p className='text-xs text-muted-foreground'>2430400</p>
          </div>
        </div>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item: MenuItem): JSX.Element => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter className='p-4'>
        <Button variant={'outline'} className='w-full cursor-pointer hover:bg-black hover:text-white' onClick={handleLogout}>
          <LogOut className='h-4 w-4' />
          Cerrar sesión
        </Button>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}