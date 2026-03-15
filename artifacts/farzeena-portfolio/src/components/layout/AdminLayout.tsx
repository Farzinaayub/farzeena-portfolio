import { Link, useLocation } from "wouter";
import { useVerifySession, useSignOut } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  LayoutDashboard, FolderKanban, FileText, LayoutTemplate, 
  UserCircle, Settings, Mail, LogOut, Menu, X, Cloud
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: session, isLoading, isError } = useVerifySession();
  const { mutate: signOut } = useSignOut({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/admin/login");
      }
    }
  });

  useEffect(() => {
    if (!isLoading && (isError || !session?.authenticated)) {
      setLocation("/admin/login");
    }
  }, [isLoading, isError, session, setLocation]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session?.authenticated) return null;

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/case-studies", label: "Case Studies", icon: FolderKanban },
    { href: "/admin/blogs", label: "Blogs", icon: FileText },
    { href: "/admin/hero", label: "Hero Section", icon: LayoutTemplate },
    { href: "/admin/about", label: "About Section", icon: UserCircle },
    { href: "/admin/site-settings", label: "Site Settings", icon: Settings },
    { href: "/admin/contact-submissions", label: "Submissions", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 fixed inset-y-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <Cloud className="w-6 h-6 text-primary mr-3" />
          <span className="font-bold text-white tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                  active ? "bg-primary text-white" : "hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4", active ? "text-white" : "text-slate-400")} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
              {session.email?.charAt(0) || 'A'}
            </div>
            <div className="text-xs truncate w-full">
              <p className="text-white font-medium truncate">{session.name || 'Admin User'}</p>
              <p className="text-slate-500 truncate">{session.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-destructive hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <span className="font-bold text-white">Menu</span>
          <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                location.startsWith(item.href) ? "bg-primary text-white" : "hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-1 -ml-1 text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-semibold text-slate-800 capitalize hidden sm:block">
              {location.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
               View Live Site
             </Link>
          </div>
        </header>
        
        <div className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
