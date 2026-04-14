import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { PropsWithChildren, ReactNode } from 'react';

/**
 * FormModal — komponen modal form yang sederhana, rapi, dan konsisten.
 * Gunakan komponen ini untuk semua modal form di seluruh sistem.
 */

interface FormModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    accentColor?: 'indigo' | 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'teal' | 'sky' | 'purple' | 'pink' | 'green' | 'cyan';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    onSubmit?: (e: React.FormEvent) => void;
    submitLabel?: string;
    cancelLabel?: string;
    processing?: boolean;
    submitDisabled?: boolean;
    children: ReactNode;
    footer?: ReactNode; // custom footer, overrides default buttons
    scrollable?: boolean;
    headerVariant?: 'default' | 'gradient';
    bodyClassName?: string;
}

const accentMap: Record<string, { dot: string; title: string; gradient: string }> = {
    indigo:  { dot: 'bg-indigo-500',  title: 'text-indigo-600', gradient: 'from-indigo-600 to-indigo-700' },
    blue:    { dot: 'bg-blue-500',    title: 'text-blue-600',   gradient: 'from-blue-600 to-indigo-600' },
    emerald: { dot: 'bg-emerald-500', title: 'text-emerald-600', gradient: 'from-emerald-600 to-teal-600' },
    violet:  { dot: 'bg-violet-500',  title: 'text-violet-600', gradient: 'from-violet-600 to-purple-600' },
    amber:   { dot: 'bg-amber-500',   title: 'text-amber-600',  gradient: 'from-amber-500 to-orange-500' },
    rose:    { dot: 'bg-rose-500',    title: 'text-rose-600',   gradient: 'from-rose-600 to-pink-600' },
    teal:    { dot: 'bg-teal-500',    title: 'text-teal-600',   gradient: 'from-teal-600 to-emerald-600' },
    sky:     { dot: 'bg-sky-500',     title: 'text-sky-600',    gradient: 'from-sky-500 to-blue-500' },
    purple:  { dot: 'bg-purple-500',  title: 'text-purple-600', gradient: 'from-purple-600 to-indigo-600' },
    pink:    { dot: 'bg-pink-500',    title: 'text-pink-600',   gradient: 'from-pink-500 to-rose-500' },
    green:   { dot: 'bg-green-500',   title: 'text-green-600',  gradient: 'from-green-600 to-emerald-600' },
    cyan:    { dot: 'bg-cyan-500',    title: 'text-cyan-600',   gradient: 'from-cyan-500 to-blue-500' },
};

export default function FormModal({
    show,
    onClose,
    title,
    subtitle,
    icon,
    accentColor = 'indigo',
    maxWidth = '2xl',
    onSubmit,
    submitLabel = 'Simpan',
    cancelLabel = 'Batal',
    processing = false,
    submitDisabled = false,
    children,
    footer,
    headerVariant = 'default',
    bodyClassName = '',
    scrollable = true,
}: FormModalProps) {
    const accent = accentMap[accentColor] ?? accentMap.indigo;

    const inner = (
        <>
            {/* ── Header ────────────────────────────────────────────── */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${
                headerVariant === 'gradient'
                    ? `bg-gradient-to-r ${accent.gradient} border-transparent`
                    : 'border-gray-100'
            }`}>
                {icon && (
                    <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${
                        headerVariant === 'gradient'
                            ? 'bg-white/20'
                            : `${accent.dot} bg-opacity-10`
                    } flex-shrink-0`}>
                        <span className={headerVariant === 'gradient' ? 'text-white' : accent.title}>{icon}</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-semibold leading-tight truncate ${
                        headerVariant === 'gradient' ? 'text-white' : 'text-gray-900'
                    }`}>{title}</h3>
                    {subtitle && <p className={`text-xs mt-0.5 ${
                        headerVariant === 'gradient' ? 'text-white/70' : 'text-gray-400'
                    }`}>{subtitle}</p>}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                        headerVariant === 'gradient'
                            ? 'text-white/60 hover:text-white hover:bg-white/10'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label="Tutup"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* ── Body ─────────────────────────────────────────────── */}
            <div className={`${bodyClassName} px-6 py-5 ${scrollable ? 'overflow-y-auto max-h-[calc(90vh-130px)]' : ''}`}>
                {children}
            </div>

            {/* ── Footer ───────────────────────────────────────────── */}
            {footer !== undefined ? (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
                    {footer}
                </div>
            ) : onSubmit ? (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
                    <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                        {cancelLabel}
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={processing || submitDisabled}
                        className={`${
                            accentColor === 'emerald' ? '!bg-emerald-600 hover:!bg-emerald-700' :
                            accentColor === 'blue'    ? '!bg-blue-600    hover:!bg-blue-700'    :
                            accentColor === 'teal'    ? '!bg-teal-600    hover:!bg-teal-700'    :
                            accentColor === 'sky'     ? '!bg-sky-600     hover:!bg-sky-700'     :
                            accentColor === 'violet'  ? '!bg-violet-600  hover:!bg-violet-700'  :
                            accentColor === 'rose'    ? '!bg-rose-600    hover:!bg-rose-700'    :
                            accentColor === 'amber'   ? '!bg-amber-500   hover:!bg-amber-600'   :
                            accentColor === 'purple'  ? '!bg-purple-600  hover:!bg-purple-700'  :
                            ''
                        }`}
                    >
                        {processing ? 'Menyimpan...' : submitLabel}
                    </PrimaryButton>
                </div>
            ) : null}
        </>
    );

    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            {onSubmit ? (
                <form onSubmit={onSubmit} method="POST" className="flex flex-col">
                    {inner}
                </form>
            ) : (
                <div className="flex flex-col">{inner}</div>
            )}
        </Modal>
    );
}
