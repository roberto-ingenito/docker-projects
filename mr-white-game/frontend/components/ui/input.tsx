import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function Input({ label, error, fullWidth = true, className = "", id, ...props }: InputProps) {
  // Classi per il contenitore e l'input
  const containerStyle = fullWidth ? "w-full" : "w-auto";

  const baseInputStyles = "bg-slate-900 border text-slate-200 rounded-lg p-3 outline-none transition-all duration-200 placeholder:text-slate-600";

  // Cambia colore bordo in base allo stato (errore o normale)
  const stateStyles = error
    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
    : "border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <div className={`flex flex-col gap-1.5 ${containerStyle} ${className}`}>
      {/* Label opzionale */}
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-400 ml-1">
          {label}
        </label>
      )}

      <input id={id} className={`${baseInputStyles} ${stateStyles} ${widthStyle}`} {...props} />

      {/* Messaggio di errore opzionale */}
      {error && <span className="text-xs text-rose-500 ml-1 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
    </div>
  );
}
