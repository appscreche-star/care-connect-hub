import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import NotificationSheet from '@/components/NotificationSheet';
import OnlineStatus from '@/components/OnlineStatus';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Settings, LogOut, HeartPulse } from 'lucide-react';
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarHeader, SidebarFooter, SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const links = [
  { title: 'Visão Geral', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Turmas', url: '/admin/turmas', icon: BookOpen },
  { title: 'Alunos', url: '/admin/alunos', icon: Users },
  { title: 'Educadores', url: '/admin/educadores', icon: GraduationCap },
  { title: 'Saúde', url: '/admin/saude', icon: HeartPulse },
  { title: 'Configurações', url: '/admin/configuracoes', icon: Settings },
];

const AdminLayout = () => {
  const { user, instituicao, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <img src={instituicao.logo_url} alt="Logo" className="h-6 w-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground">{instituicao.nome}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.nome}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map(l => (
                    <SidebarMenuItem key={l.url}>
                      <SidebarMenuButton asChild>
                        <NavLink to={l.url} end className="hover:bg-accent/50 rounded-xl" activeClassName="bg-accent text-primary font-medium">
                          <l.icon className="mr-2 h-4 w-4" />
                          <span>{l.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-1">
              <OnlineStatus />
              <NotificationSheet />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
