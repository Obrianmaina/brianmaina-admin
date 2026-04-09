"use client";

import React from "react";
import { SiWhatsapp } from "react-icons/si";

export default function WhatsAppWidget() {
  // Replace with your actual WhatsApp number with country code
  const phoneNumber = "254728036420"; 
  
  // Optional: A default message the user will send you
  const message = "Hello Brian, I am reaching out from your portfolio website!"; 
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      // Positioned fixed at the bottom right. 
      // Added z-50 to ensure it stays above other content.
      // Adjusted bottom padding for mobile (bottom-24) to clear bottom nav bars, 
      // and standard (bottom-6) for desktop.
      className="fixed bottom-24 md:bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-black/20 hover:bg-[#1EBE5D] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp size={32} />
      
      {/* Optional tooltip that shows on hover for desktop */}
      <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block pointer-events-none">
        Chat with me
      </span>
    </a>
  );
}