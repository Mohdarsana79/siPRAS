import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
