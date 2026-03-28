import { Link, useLocation } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import analyticsLogo from "@/assets/analytics-logo.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { data: settings } = useGetSiteSettings();

  // Scroll-linked MotionValues — drive the animation directly from scroll position
  const { scrollY } = useScroll();

  // ── Expanded bar (logo + right nav): fades out as you scroll 0→80px ──
  const expandedOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const expandedY      = useTransform(scrollY, [0, 80], [0, -12]);

  // ── Capsule: fades in as you scroll 30→100px ──
  const capsuleOpacity = useTransform(scrollY, [30, 100], [0, 1]);
  const capsuleY       = useTransform(scrollY, [30, 100], [-18, 0]);
  const capsuleScale   = useTransform(scrollY, [30, 100], [0.94, 1]);

  // Pointer-events threshold (still need a boolean for click targets)
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setIsScrolled(v > 50));
    return unsub;
  }, [scrollY]);

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
      <header className="fixed top-0 inset-x-0 z-50">

        {/* ── EXPANDED: transparent full-width bar, driven by scroll ── */}
        <motion.div
          style={{ opacity: expandedOpacity, y: expandedY, pointerEvents: isScrolled ? "none" : "auto" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-5"
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

          {/* Desktop nav — no capsule, plain text links */}
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

        {/* ── CAPSULE: floats in as you scroll, driven by scroll ── */}
        <motion.div
          style={{ opacity: capsuleOpacity, y: capsuleY, scale: capsuleScale, pointerEvents: isScrolled ? "auto" : "none" }}
          className="absolute inset-x-0 top-0 flex justify-center pt-3 px-4"
        >
          {/* Desktop capsule — nav links only, same theme */}
          <nav className="hidden md:flex items-center gap-0.5 bg-white/80 backdrop-blur-2xl rounded-full px-2.5 py-2 shadow-lg shadow-indigo-100/70 border border-indigo-100/60 ring-1 ring-indigo-50">
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

          {/* Mobile toggle inside capsule */}
          <button
            className="md:hidden p-2.5 text-foreground bg-white/80 backdrop-blur-2xl rounded-full border border-indigo-100/60 shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
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
