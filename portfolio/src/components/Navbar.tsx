"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Home, PenTool, Settings, Briefcase, FileText, BookOpen } from "lucide-react";
import { useState } from "react";
import GetQuoteModal from "./GetQuoteModal";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to control top navbar visibility
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Listen to scroll events to hide or show the top navbar
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // If scrolling down and past 150px, hide the navbar
    if (latest > previous && latest > 150) {
      setHidden(true);
    } 
    // If scrolling up, show the navbar
    else {
      setHidden(false);
    }
  });

  // Define navigation links to map them easily in both navbars
  const navLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/portfolio", icon: Briefcase, label: "Portfolio" },
    { href: "/resume", icon: FileText, label: "Resume" },
    { href: "/blog", icon: BookOpen, label: "Blog" },
  ];

  return (
    <>
      {/* Top Navbar (Desktop & Mobile) - Animates out of view on scroll down */}
      <motion.nav 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Desktop Home Icon (Hidden on Mobile) */}
          <div className="hidden sm:block">
            <Link
              href="/"
              className="p-3 -m-3 text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Home"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>

          {/* Spacer to push mobile icons to the right */}
          <div className="sm:hidden flex-1" />

          {/* Right Side Items */}
          <div className="flex items-center gap-2 sm:gap-6 md:gap-8">
            
            {/* Desktop Links (Hidden on Mobile) */}
            <div className="hidden sm:flex items-center gap-6">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative p-3 -m-1 text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center justify-center"
                  aria-label={link.label}
                  title={link.label}
                >
                  <link.icon className="w-5 h-5" />
                  {pathname.includes(link.href) && (
                    <motion.div
                      layoutId="desktop-underline"
                      className="absolute left-3 top-full w-5 h-0.5 bg-teal-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Always Visible Icons (Mobile & Desktop) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-3 text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Get a Quote"
              title="Get a Quote"
            >
              <PenTool className="w-5 h-5" />
            </button>

            <Link
              href="/admin"
              className="p-3 text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Admin Portal"
              title="Admin Portal"
            >
              <Settings className="w-5 h-5" />
            </Link>

            <div className="p-3">
              <ThemeToggle />
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Bottom Mobile Navbar (Floating Capsule) - Hidden on Desktop */}
      <nav className="fixed bottom-6 inset-x-0 z-50 sm:hidden flex justify-center px-4 pointer-events-none">
        <div className="bg-white/40 dark:bg-gray-950/40 backdrop-blur-xl backdrop-saturate-150 border border-white/40 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/40 rounded-full px-2 h-16 w-full max-w-[22rem] flex items-center justify-between relative pointer-events-auto">
          {navLinks.map((link) => {
            // Check if active (exact match for home, partial for others)
            const isActive = link.href === "/" ? pathname === "/" : pathname.includes(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center justify-center w-14 h-12 z-10 group"
                aria-label={link.label}
              >
                {/* Active Background Pill (Sliding Animation) */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-pill"
                    className="absolute inset-0 bg-teal-500/10 dark:bg-teal-400/20 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Floating Icon */}
                <motion.div
                  animate={{ 
                    y: isActive ? -1 : 0,
                    scale: isActive ? 1.05 : 1
                  }}
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  }`}
                >
                  <link.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                
                {/* Tiny Active Dot */}
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active-dot"
                    className="absolute bottom-1.5 w-1 h-1 bg-teal-600 dark:bg-teal-400 rounded-full z-10"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {isModalOpen && <GetQuoteModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}