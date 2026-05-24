import React from 'react';
import { Mail, Lock } from 'lucide-react';

interface TextInputProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function TextInput({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
}: TextInputProps) {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5 text-gray-400" />;
      case 'password':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {getIcon() && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {getIcon()}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full ${getIcon() ? 'pl-10' : 'pl-3'} pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          style={{ backgroundColor: '#FFFDF8' }}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
