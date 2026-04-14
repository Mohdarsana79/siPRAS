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
                setTimeout(onClose, 250);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const config = {
        success: {
            bg: 'bg-emerald-500',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            bg: 'bg-red-500',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
    }[type];

    return (
        <div className="fixed z-[200] top-5 right-5 pointer-events-none">
            <Transition
                show={show}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 translate-y-[-8px] scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-lg text-white ${config.bg} max-w-sm`}>
                    <div className="flex-shrink-0 bg-white/20 rounded-lg p-1">
                        {config.icon}
                    </div>
                    <p className="text-sm font-medium flex-1">{message}</p>
                    <button
                        onClick={() => setShow(false)}
                        className="p-1 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
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
