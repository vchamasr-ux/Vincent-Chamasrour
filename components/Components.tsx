
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false, icon: Icon }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] focus:ring-primary",
    secondary: "bg-surface text-white hover:bg-zinc-800 border border-zinc-700 focus:ring-zinc-500",
    outline: "border-2 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon size={18} />}
    </motion.button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>}
    <input
      className={`w-full bg-surface/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${className}`}
      {...props}
    />
  </div>
);

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-3 h-3 bg-accent rounded-full animate-bounce"></div>
  </div>
);

export const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const progress = Math.min(100, (current / total) * 100);
  
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-8">
      <motion.div 
        className="h-full bg-gradient-to-r from-primary to-secondary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};
