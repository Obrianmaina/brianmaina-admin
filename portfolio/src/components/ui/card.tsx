import React from "react";

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = "",
  onClick,
}) => (
  <div
    className={`bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-2xl shadow-md dark:shadow-none hover:shadow-xl dark:hover:bg-gray-800/80 transition-all duration-300 p-4 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
);