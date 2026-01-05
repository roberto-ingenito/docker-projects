import React from "react";

// Definiamo i tipi di varianti disponibili
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Classi base comuni a tutti i bottoni
  const baseStyles =
    "px-6 py-3 rounded-lg font-bold cursor-pointer " +
    "transition-all duration-200 active:scale-95 " +
    "disabled:opacity-50 disabled:active:scale-100 " +
    "flex items-center justify-center gap-2 outline-none " +
    "focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  // Mappatura degli stili per variante
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 focus:ring-cyan-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500",
    outline: "border-2 border-slate-600 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 focus:ring-cyan-500",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white focus:ring-slate-500",
    danger: "bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-lg shadow-rose-900/20",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
      {children}
    </button>
  );
}
