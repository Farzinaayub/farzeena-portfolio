import { Link, useLocation } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Menu, X, Search, Github, Linkedin, Twitter } from "lucide-react";
import analystAvatar from "@/assets/analyst-caricature.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/blogs", label: "Insights" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith("/#")) return;
    e.preventDefault();
    const sectionId = href.slice(2);
    setMobileMenuOpen(false);
    if (location === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Sticky Navbar */}
      <header 
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled ? "glass py-3 shadow-sm" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
              <img src={analystAvatar} alt="Farzeena" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              {settings?.siteTitle || "Farzeena."}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-border/50 shadow-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  location === link.href || (link.href === "/" && location === "/")
                    ? "bg-primary text-white shadow-md shadow-primary/25" 
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full transition-colors text-sm font-semibold">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-4 pb-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "p-4 rounded-xl text-lg font-semibold transition-colors",
                    location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-[80px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                <img src={analystAvatar} alt="Farzeena" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg text-white">
                {settings?.siteTitle || "Farzeena."}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.githubUrl && (
                <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            {settings?.footerText || `© ${new Date().getFullYear()} Farzeena. All rights reserved.`}
          </div>
        </div>
      </footer>
    </div>
  );
}
