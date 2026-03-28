import { Link, useLocation } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import analyticsLogo from "@/assets/analytics-logo.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
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

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href.replace("/#", ""));

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Sticky Navbar */}
      <header className="fixed top-0 inset-x-0 z-50">

        {/* ── INITIAL STATE: transparent, logo left / links right ── */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-5"
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center p-1.5">
                  <img src={analyticsLogo} alt="Analytics" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl text-foreground hidden sm:block">
                  {settings?.siteTitle || "Farzeena P A"}
                </span>
              </Link>

              {/* Desktop Nav — no capsule, plain links */}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SCROLLED STATE: floating dark capsule pill ── */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              key="capsule"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="flex justify-center pt-3 px-4"
            >
              <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl rounded-full px-2 py-1.5 shadow-xl border border-white/10">
                {/* Logo inside pill */}
                <Link
                  href="/"
                  className="flex items-center gap-2 pl-1 pr-3 mr-1 border-r border-white/10"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center p-0.5">
                    <img src={analyticsLogo} alt="Analytics" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-sm text-white hidden sm:block">
                    {settings?.siteTitle || "Farzeena P A"}
                  </span>
                </Link>

                {/* Nav links inside pill */}
                <nav className="hidden md:flex items-center gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                        isActive(link.href)
                          ? "bg-white text-slate-900 font-semibold"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile toggle inside pill */}
                <button
                  className="md:hidden p-1.5 text-white ml-1"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
