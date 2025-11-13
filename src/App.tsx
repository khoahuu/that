import { useState } from 'react';
import { LayoutDashboard, FolderKanban, Calendar, Users, CheckSquare, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ProjectsView } from './components/ProjectsView';
import { GanttView } from './components/GanttView';
import { TeamView } from './components/TeamView';
import { TasksView } from './components/TasksView';
import { SettingsPage } from './components/SettingsPage';
import { LandingPage } from './components/LandingPage';
import { AuthPage, type UserData } from './components/AuthPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { DataProvider, useData } from './components/DataContext';
import { TaskDetailDialog } from './components/TaskDetailDialog';
import { MyTasksSidebar } from './components/MyTasksSidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
} from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';

type AppView = 'landing' | 'auth' | 'app';
type MainView = 'dashboard' | 'projects' | 'tasks' | 'gantt' | 'team' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeView, setActiveView] = useState<MainView>('dashboard');
  const [user, setUser] = useState<UserData | null>(null);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setCurrentView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setActiveView('dashboard');
    toast.success('Đã đăng xuất thành công!');
  };

  const handleUpdateUser = (userData: UserData) => {
    setUser(userData);
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setCurrentView('auth')}
          onLogin={() => setCurrentView('auth')}
        />
        <Toaster />
      </>
    );
  }

  // Auth Page
  if (currentView === 'auth') {
    return (
      <>
        <AuthPage
          onLogin={handleLogin}
          onBack={() => setCurrentView('landing')}
        />
        <Toaster />
      </>
    );
  }

  // Main App (requires login)
  return (
    <DataProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        {/* Header */}
        {user && (
          <Header
            user={user}
            onNavigateToSettings={() => setActiveView('settings')}
            onLogout={handleLogout}
          />
        )}

        <div className="flex flex-1">
          {/* Sidebar Navigation */}
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 shadow-lg">
                  <span className="text-white font-semibold">PM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Quản lý dự án</span>
                  <span className="text-xs text-muted-foreground">Workspace</span>
                </div>
              </div>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'dashboard'}
                        onClick={() => setActiveView('dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Tổng quan</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'projects'}
                        onClick={() => setActiveView('projects')}
                      >
                        <FolderKanban className="w-4 h-4" />
                        <span>Dự án</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'tasks'}
                        onClick={() => setActiveView('tasks')}
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>Công việc</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'gantt'}
                        onClick={() => setActiveView('gantt')}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Lịch trình</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeView === 'team'}
                        onClick={() => setActiveView('team')}
                      >
                        <Users className="w-4 h-4" />
                        <span>Nhóm</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <Separator className="my-2" />
              
              {/* My Tasks Section */}
              {user && <MyTasksSidebar currentUser={user} />}
            </SidebarContent>
          </Sidebar>

          {/* Main Content Area */}
          <SidebarInset className="flex flex-col">
            {/* Toolbar with sidebar toggle */}
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                {activeView === 'dashboard' && (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Tổng quan</span>
                  </>
                )}
                {activeView === 'projects' && (
                  <>
                    <FolderKanban className="w-4 h-4" />
                    <span>Dự án</span>
                  </>
                )}
                {activeView === 'tasks' && (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Công việc</span>
                  </>
                )}
                {activeView === 'gantt' && (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Lịch trình</span>
                  </>
                )}
                {activeView === 'team' && (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Nhóm</span>
                  </>
                )}
                {activeView === 'settings' && (
                  <>
                    <Settings className="w-4 h-4" />
                    <span>Cài đặt</span>
                  </>
                )}
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeView === 'dashboard' && <Dashboard />}
                {activeView === 'projects' && <ProjectsView />}
                {activeView === 'tasks' && user && <TasksView currentUser={user} />}
                {activeView === 'gantt' && <GanttView />}
                {activeView === 'team' && user && <TeamView currentUser={user} />}
                {activeView === 'settings' && user && <SettingsPage user={user} onUpdateUser={handleUpdateUser} />}
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </SidebarInset>
        </div>

        {/* ChatBot */}
        <ChatBot />

        <Toaster />
        </div>
      </SidebarProvider>
    </DataProvider>
  );
}