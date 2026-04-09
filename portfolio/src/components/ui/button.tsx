import { ButtonProps } from "@/types";

const Button: React.FC<ButtonProps> = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950";
  
  const variants = {
    // Updated default variant to use dark grey background and white text in dark mode
    default: "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 shadow-sm",
    // Outline remains a teal border with highly visible text
    outline: "border border-teal-600 text-gray-900 hover:bg-teal-50 dark:border-teal-500 dark:text-gray-100 dark:hover:bg-teal-900/40",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;