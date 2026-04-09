"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Home } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
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

  return (
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
        
        {/* Dashboard Home Icon */}
        <div>
          <Link
            href="/admin"
            className="p-3 -m-3 text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors inline-block"
            aria-label="Dashboard"
            title="Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <div className="p-3 -m-3">
            <ThemeToggle />
          </div>
        </div>

      </div>
    </motion.nav>
  );
}