import React from "react";

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = "",
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
          ${error ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-blue-500"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          focus:outline-none
        `}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
