"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const loadingMessages = [
  "Checking ARIA attributes...",
  "Analyzing color contrast...",
  "Validating form controls...",
  "Inspecting image alternatives...",
  "Checking keyboard navigation...",
  "Validating heading structure...",
  "Testing focus indicators...",
  "Analyzing link descriptions..."
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-full border-4 border-primary/20" />
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-primary border-l-primary border-r-transparent border-b-transparent" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-lg text-muted-foreground text-center min-h-[28px]"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}