import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import FormModal from '@/Components/FormModal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import axios from 'axios';

// Icons
const DatabaseIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
);

const DownloadIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const UploadCloudIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 16 4-4 4 4"/></svg>
);

const TrashIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

export default function BackupIndex() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        backup_file: null as File | null,
    });

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [confirmingRestore, setConfirmingRestore] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [restoreProgress, setRestoreProgress] = useState(0);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data: resetData,
        setData: setResetData,
        post: postReset,
        processing: processingReset,
        reset: resetResetForm,
        errors: resetErrors,
        clearErrors: clearResetErrors,
    } = useForm({
        password: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            // @ts-ignore
            setData('backup_file', file);
        }
    };

    const handleRestore = (e: React.FormEvent) => {
        e.preventDefault();
        setConfirmingRestore(true);
    };

    const executeRestore = async () => {
        if (!data.backup_file) return;

        setConfirmingRestore(false);
        setShowProgress(true);
        setRestoreProgress(0);

        let currentProgress = 0;
        // Interval to simulate progress up to 95%
        const interval = setInterval(() => {
            setRestoreProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                // Logarithmic-like decay so it never quite hits 100% until forced
                const remaining = 100 - prev;
                const increment = Math.random() * (remaining * 0.05);
                return Math.min(prev + increment, 95);
            });
        }, 300);

        const formData = new FormData();
        formData.append('backup_file', data.backup_file);

        try {
            const response = await axios.post(route('backup-restore.restore'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });

            clearInterval(interval);
            
            // Smoothly finish to 100%
            let finishVal = 95;
            const finishInterval = setInterval(() => {
                finishVal += (100 - finishVal) * 0.3 + 0.5;
                if (finishVal >= 99.8) {
                    setRestoreProgress(100);
                    clearInterval(finishInterval);
                    
                    setTimeout(() => {
                        setShowProgress(false);
                        // Force a clean redirect to login since session is likely gone
                        window.location.href = route('login');
                    }, 1000);
                } else {
                    setRestoreProgress(finishVal);
                }
            }, 50);

        } catch (error: any) {
            clearInterval(interval);
            setShowProgress(false);
            
            const message = error.response?.data?.error || 'Terjadi kesalahan saat melakukan restore.';
            alert(message);
            
            // Re-sync Inertia state if needed, though with axios we just stay here
            reset();
            setFileName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDownload = () => {
        window.location.href = route('backup-restore.download');
    };

    const confirmReset = () => {
        setConfirmingUserDeletion(true);
    };

    const resetDatabase = (e: React.FormEvent) => {
        e.preventDefault();

        postReset(route('backup-restore.reset'), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingUserDeletion(false);
                resetResetForm();
            },
            onError: () => passwordInput.current?.focus(),
            onFinish: () => {
                if (!resetErrors.password) {
                    closeModal();
                }
            },
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearResetErrors();
        resetResetForm();
    };

    const handleReset = () => {
        confirmReset();
    };

    return (
        <AuthenticatedLayout header="Backup & Restore Database">
            <Head title="Backup & Restore" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
                
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
                    <div className="p-6 sm:p-8 flex items-start sm:items-center gap-6">
                        <div className="p-4 rounded-full bg-cyan-50 text-cyan-600 shrink-0 shadow-inner">
                            <DatabaseIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Manajemen Database siPRAS</h2>
                            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
                                Fitur ini memungkinkan Anda untuk melakukan pencadangan (backup) seluruh data sistem dan memulihkannya (restore) jika diperlukan. Format file yang didukung adalah <span className="font-semibold text-cyan-600">.rsv</span> (siPRAS Backup Volume).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Backup Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <DownloadIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight text-gray-900">Backup Data</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                            Unduh salinan terbaru dari seluruh database sistem Anda. Sangat disarankan untuk melakukan backup secara rutin untuk menghindari kehilangan data akibat hal yang tidak terduga.
                        </p>

                        <button
                            onClick={handleDownload}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-0.5"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            Download File .rsv
                        </button>
                    </div>

                    {/* Restore Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                                <UploadCloudIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight text-gray-900">Restore Data</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Pulihkan data sistem dari file backup sebelumnya. <strong className="text-red-600">Peringatan:</strong> Proses ini akan menghapus semua data saat ini dan menggantinya dengan data dari file backup.
                        </p>

                        <form onSubmit={handleRestore} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File Backup (.rsv)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="space-y-1 text-center">
                                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative cursor-pointer rounded-md bg-transparent font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2">
                                                <span>Upload file</span>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".rsv"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                />
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {fileName ? <span className="font-semibold text-orange-600">{fileName}</span> : 'Hanya mendukung ekstensi .rsv'}
                                        </p>
                                    </div>
                                </div>
                                {errors.backup_file && (
                                    <p className="mt-2 text-sm text-red-600">{errors.backup_file}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.backup_file}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <UploadCloudIcon className="w-5 h-5" />
                                {processing ? 'Memproses Restore...' : 'Mulai Restore Database'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reset Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-red-50 text-red-600">
                            <TrashIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-red-600">Reset Database (Kosongkan)</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        Hapus <strong className="text-red-600">SEMUA</strong> data operasional, master data, dan aset di sistem ini kembali menjadi kosong seperti awal mula, kecuali akun Pengguna dan Profil Sekolah. Proses ini tidak dapat dibatalkan, sangat disarankan untuk melakukan <strong className="text-indigo-600">Backup Data</strong> terlebih dahulu.
                    </p>

                    <button
                        onClick={handleReset}
                        disabled={processing}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-red-200 rounded-xl shadow-sm text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <TrashIcon className="w-5 h-5" />
                        Kosongkan (Reset) Database
                    </button>
                </div>

            {/* Reset Database Confirmation */}
            <FormModal
                show={confirmingUserDeletion}
                onClose={closeModal}
                title="Reset Database"
                subtitle="Kosongkan seluruh data operasional"
                maxWidth="lg"
                accentColor="rose"
                icon={<TrashIcon className="w-6 h-6" />}
                onSubmit={resetDatabase}
                submitLabel="Kosongkan Sekarang"
                processing={processingReset}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <p className="text-sm text-rose-700 leading-relaxed">
                            <strong className="font-black text-rose-800 uppercase tracking-tight">Peringatan Keras:</strong><br/>
                            Seluruh data operasional, master data, dan aset di sistem ini akan dihapus secara permanen. Tindakan ini <strong className="font-bold">TIDAK BISA</strong> dibatalkan tanpa file backup yang sesuai.
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="Masukkan Password untuk Konfirmasi" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={resetData.password}
                            onChange={(e) => setResetData('password', e.target.value)}
                            className="w-full bg-gray-50/50 font-bold"
                            placeholder="Password Anda"
                            isFocused
                        />
                        <InputError message={resetErrors.password} />
                    </div>
                </div>
            </FormModal>

            {/* Restore Database Confirmation */}
            <FormModal
                show={confirmingRestore}
                onClose={() => setConfirmingRestore(false)}
                title="Konfirmasi Restore"
                subtitle="Pulihkan data dari file cadangan"
                maxWidth="lg"
                accentColor="amber"
                icon={<UploadCloudIcon className="w-6 h-6" />}
                onSubmit={(e: React.FormEvent) => { e.preventDefault(); executeRestore(); }}
                submitLabel="Ya, Restore Sekarang"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Apakah Anda yakin ingin melakukan <strong className="text-amber-600">Restore Database</strong>? 
                        Proses ini akan menghapus seluruh data sistem saat ini dan menggantinya dengan data dari file backup yang Anda unggah.
                    </p>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs text-amber-700 font-bold italic">
                            * Pastikan file yang Anda gunakan adalah file backup yang benar (ekstensi .rsv).
                        </p>
                    </div>
                </div>
            </FormModal>

            {/* Restore Progress Modal */}
            <Modal show={showProgress} onClose={() => {}} maxWidth="md">
                <div className="p-10 text-center">
                    <div className="mb-8 relative inline-flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center animate-pulse">
                            <UploadCloudIcon className="w-12 h-12 text-indigo-600" />
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 uppercase">Proses Pemulihan</h3>
                    <p className="text-sm text-gray-500 font-medium mb-10 max-w-xs mx-auto leading-relaxed">
                        Jangan tutup atau muat ulang halaman ini sampai proses selesai.
                    </p>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Progress</span>
                            <span className="text-xl font-black text-gray-900 tabular-nums">{Math.round(restoreProgress)}%</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-50">
                            <div 
                                style={{ width: `${restoreProgress}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-500 ease-out shadow-lg"
                            ></div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                            {restoreProgress < 100 ? 'Sedang menulis ulang struktur data...' : 'Sinkronisasi berhasil! Menyelesaikan...'}
                        </p>
                    </div>
                </div>
            </Modal>

            </div>
        </AuthenticatedLayout>
    );
}
