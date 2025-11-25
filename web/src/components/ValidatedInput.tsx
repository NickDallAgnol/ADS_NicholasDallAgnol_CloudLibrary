import { InputHTMLAttributes, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface ValidatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  showValidIcon?: boolean;
}

export function ValidatedInput({
  label,
  error,
  touched,
  showValidIcon = true,
  className = '',
  ...props
}: ValidatedInputProps) {
  const [focused, setFocused] = useState(false);
  
  const hasError = touched && error;
  const isValid = touched && !error && props.value;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full px-4 py-3 pr-10 rounded-lg border-2 transition-all duration-200
            ${hasError 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : isValid
              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-100'
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }
            outline-none
            ${className}
          `}
        />
        {showValidIcon && isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="text-green-500" size={20} />
          </div>
        )}
        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="text-red-500" size={20} />
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

interface ValidatedTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  touched?: boolean;
  rows?: number;
}

export function ValidatedTextarea({
  label,
  error,
  touched,
  rows = 4,
  className = '',
  ...props
}: ValidatedTextareaProps) {
  const hasError = touched && error;
  const isValid = touched && !error && props.value;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...props}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none
          ${hasError 
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
            : isValid
            ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-100'
            : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
          }
          outline-none
          ${className}
        `}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

