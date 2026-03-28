import { Link, useLocation } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import analyticsLogo from "@/assets/analytics-logo.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DUR = "0.45s";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href.replace("/#", ""));

  const transition = `opacity ${DUR} ${EASE}, transform ${DUR} ${EASE}`;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 inset-x-0 z-50">

        {/* ─── STATE 1: transparent full-width bar (top of page) ─── */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-5"
          style={{
            opacity: isScrolled ? 0 : 1,
            transform: isScrolled ? "translateY(-10px)" : "translateY(0)",
            pointerEvents: isScrolled ? "none" : "auto",
            transition,
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center p-1.5">
              <img src={analyticsLogo} alt="Analytics" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              {settings?.siteTitle || "Farzeena P A"}
            </span>
          </Link>

          {/* Desktop nav — plain links, no capsule */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* ─── STATE 2: floating dark capsule (on scroll) — nav links only ─── */}
        <div
          className="absolute inset-x-0 top-0 flex justify-center pt-3 px-4"
          style={{
            opacity: isScrolled ? 1 : 0,
            transform: isScrolled ? "translateY(0)" : "translateY(-14px)",
            pointerEvents: isScrolled ? "auto" : "none",
            transition,
          }}
        >
          <nav className="hidden md:flex items-center gap-0.5 bg-white/75 backdrop-blur-2xl rounded-full px-2.5 py-2 shadow-lg shadow-indigo-100/60 border border-indigo-100/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive(link.href)
                    ? "bg-primary text-white font-semibold shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle in scrolled state */}
          <button
            className="md:hidden p-2 text-foreground bg-white/75 backdrop-blur-2xl rounded-full border border-indigo-100/50 shadow-lg"
            style={{ pointerEvents: isScrolled ? "auto" : "none" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
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
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1">
                <img src={analyticsLogo} alt="Analytics" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-lg text-white">
                {settings?.siteTitle || "Farzeena P A"}
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
