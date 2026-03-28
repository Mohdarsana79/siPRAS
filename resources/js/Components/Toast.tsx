import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';

interface ToastProps {
    message: string | null;
    type?: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300); // Wait for transition out
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const bgClass = type === 'success' 
        ? 'bg-emerald-500 shadow-emerald-200' 
        : 'bg-rose-500 shadow-rose-200';
    
    const icon = type === 'success' ? (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    ) : (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="fixed z-[100] top-5 right-5 pointer-events-none sm:top-8 sm:right-8">
            <Transition
                show={show}
                enter="transition ease-out duration-300 transform"
                enterFrom="translate-y-[-20px] opacity-0 scale-95"
                enterTo="translate-y-0 opacity-100 scale-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl ${bgClass}`}>
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                    <div className="text-sm font-bold text-white pr-4">
                        {message}
                    </div>
                    <button
                        onClick={() => setShow(false)}
                        className="p-1 -mr-1 text-white/70 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </Transition>
        </div>
    );
}
