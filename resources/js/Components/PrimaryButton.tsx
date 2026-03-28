import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-in-out hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
