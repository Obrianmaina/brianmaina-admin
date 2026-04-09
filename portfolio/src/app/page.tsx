"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function HomePage() {
  const actions = [
    { text: "Explore My Work", href: "/portfolio" },
    { text: "Read My Blog", href: "/blog" },
    { text: "View Brian's CV", href: "/resume" }
  ];

  const [actionIndex, setActionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActionIndex((prevIndex) => (prevIndex + 1) % actions.length);
    }, 3500); // Changes the button every 3.5 seconds

    return () => clearInterval(interval);
  }, [actions.length]);

  return (
    <main className="relative text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden pt-16 transition-colors duration-300">
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-50"
        >
          Brian Maina
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg mb-6 text-gray-700 dark:text-gray-300"
        >
          Visual Designer
        </motion.p>

        {/* Dynamic Button Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-12 flex justify-center items-center" // Fixed height prevents layout shift during animations
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={actionIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={actions[actionIndex].href}>
                <Button>{actions[actionIndex].text}</Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      
    </main>
  );
}