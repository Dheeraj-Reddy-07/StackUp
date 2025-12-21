// ============================================
// Input Component
// ============================================
// Reusable form input with label, error handling, and password toggle

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="w-full">
            {label && (
                <label className="label">
                    {label}
                </label>
            )}
            <div className="relative">
                {/* Left Icon - positioned outside input */}
                {Icon && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 text-[var(--color-text-tertiary)]">
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                <input
                    ref={ref}
                    type={inputType}
                    className={`input ${error ? 'input-error' : ''} ${isPassword ? 'pr-10' : ''} ${className}`}
                    {...props}
                />

                {/* Password Toggle Icon */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-error">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
