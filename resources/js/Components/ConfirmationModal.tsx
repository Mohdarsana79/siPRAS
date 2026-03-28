import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

interface ConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    processing?: boolean;
}

export default function ConfirmationModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Hapus Data',
    cancelText = 'Batal',
    processing = false,
}: ConfirmationModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="overflow-hidden bg-white rounded-3xl">
                <div className="p-8">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-rose-100 rounded-2xl mb-6">
                        <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    
                    <div className="text-center">
                        <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                        <p className="text-sm text-gray-500 font-medium px-4">{message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <SecondaryButton 
                            onClick={onClose} 
                            disabled={processing}
                            className="w-full justify-center !rounded-2xl py-3.5 font-bold shadow-sm"
                        >
                            {cancelText}
                        </SecondaryButton>
                        <DangerButton 
                            onClick={onConfirm} 
                            disabled={processing}
                            className="w-full justify-center !rounded-2xl py-3.5 font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50"
                        >
                            {processing ? 'Memproses...' : confirmText}
                        </DangerButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
