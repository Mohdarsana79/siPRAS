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
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-50 rounded-2xl mb-4">
                    <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>

                <div className="flex gap-3">
                    <SecondaryButton
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1 justify-center"
                    >
                        {cancelText}
                    </SecondaryButton>
                    <DangerButton
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 justify-center"
                    >
                        {processing ? 'Memproses...' : confirmText}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
