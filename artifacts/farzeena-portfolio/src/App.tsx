import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useVerifySession } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public Pages
import Home from "@/pages/public/Home";
import CaseStudies from "@/pages/public/CaseStudies";
import CaseStudyDetail from "@/pages/public/CaseStudyDetail";
import Blogs from "@/pages/public/Blogs";
import BlogDetail from "@/pages/public/BlogDetail";

// Admin Pages
import Login from "@/pages/admin/Login";
import MagicLinkSent from "@/pages/admin/MagicLinkSent";
import Dashboard from "@/pages/admin/Dashboard";
import { CaseStudiesManager, BlogsManager } from "@/pages/admin/ContentManagers";
import { CaseStudyEditor, BlogEditor } from "@/pages/admin/ContentEditor";
import { HeroEditor, AboutEditor, SiteSettingsEditor, ContactSubmissions } from "@/pages/admin/SectionEditors";

// 404
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading, isError } = useVerifySession();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (isError || !session?.authenticated)) {
      setLocation("/admin/login");
    }
  }, [isLoading, isError, session, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return null;
  }

  return <>{children}</>;
}

function AdminRoute({ component: Component, ...rest }: { component: any; path: string }) {
  return (
    <Route {...rest}>
      {params => (
        <AuthGuard>
          <AdminLayout>
            <Component params={params} />
          </AdminLayout>
        </AuthGuard>
      )}
    </Route>
  );
}

function PublicRoute({ component: Component, ...rest }: { component: any; path?: string }) {
  return (
    <Route {...rest}>
      {params => (
        <PublicLayout>
          <Component params={params} />
        </PublicLayout>
      )}
    </Route>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <PublicRoute path="/" component={Home} />
      <PublicRoute path="/case-studies" component={CaseStudies} />
      <PublicRoute path="/case-studies/:slug" component={CaseStudyDetail} />
      <PublicRoute path="/blogs" component={Blogs} />
      <PublicRoute path="/blogs/:slug" component={BlogDetail} />

      {/* Admin Auth Routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin/magic-link-sent" component={MagicLinkSent} />

      {/* Admin Protected Routes */}
      <AdminRoute path="/admin" component={Dashboard} />
      <AdminRoute path="/admin/dashboard" component={Dashboard} />
      <AdminRoute path="/admin/case-studies" component={CaseStudiesManager} />
      <AdminRoute path="/admin/case-studies/new" component={CaseStudyEditor} />
      <AdminRoute path="/admin/case-studies/:id/edit" component={CaseStudyEditor} />
      <AdminRoute path="/admin/blogs" component={BlogsManager} />
      <AdminRoute path="/admin/blogs/new" component={BlogEditor} />
      <AdminRoute path="/admin/blogs/:id/edit" component={BlogEditor} />
      <AdminRoute path="/admin/hero" component={HeroEditor} />
      <AdminRoute path="/admin/about" component={AboutEditor} />
      <AdminRoute path="/admin/site-settings" component={SiteSettingsEditor} />
      <AdminRoute path="/admin/contact-submissions" component={ContactSubmissions} />

      {/* 404 */}
      <PublicRoute component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
