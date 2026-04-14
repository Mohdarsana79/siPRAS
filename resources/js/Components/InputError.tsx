import { HTMLAttributes } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={'mt-1.5 text-xs font-medium text-red-500 ' + className}
        >
            {message}
        </p>
    ) : null;
}
