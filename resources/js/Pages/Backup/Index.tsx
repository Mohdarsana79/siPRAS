import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import Modal from '@/Components/Modal';
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

                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={resetDatabase} className="p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-red-50 text-red-600 block shrink-0">
                                <TrashIcon className="w-6 h-6" />
                            </span>
                            Apakah Anda yakin ingin mengosongkan database?
                        </h2>

                        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                            <strong className="text-red-600">Peringatan Keras:</strong> Seluruh data operasional, master data, dan aset di sistem ini akan dihapus secara permanen, kecuali data Pengguna dan Profil Sekolah. Tindakan ini <strong className="text-red-500">TIDAK BISA</strong> dibatalkan tanpa file backup yang sesuai.
                        </p>
                        
                        <p className="mt-4 text-sm text-gray-600 mb-6 font-medium">
                            Silakan masukkan password akun Anda untuk mengonfirmasi tindakan ini:
                        </p>

                        <div className="mt-2">
                            <InputLabel htmlFor="password" value="Password" className="sr-only" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={resetData.password}
                                onChange={(e) => setResetData('password', e.target.value)}
                                className="mt-1 block w-full px-4 py-3"
                                isFocused
                                placeholder="Password Anda"
                            />

                            <InputError message={resetErrors.password} className="mt-2" />
                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3">
                            <SecondaryButton onClick={closeModal} className="px-6 py-3 rounded-xl border-gray-200 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-offset-2 focus:ring-gray-200">
                                Batal
                            </SecondaryButton>

                            <DangerButton className="px-6 py-3 rounded-xl shadow-sm border border-transparent bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2" disabled={processingReset}>
                                <TrashIcon className="w-4 h-4" />
                                {processingReset ? 'Memproses...' : 'Kosongkan Sekarang'}
                            </DangerButton>
                        </div>
                    </form>
                </Modal>

                <Modal show={confirmingRestore} onClose={() => setConfirmingRestore(false)}>
                    <div className="p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-orange-50 text-orange-600 block shrink-0">
                                <UploadCloudIcon className="w-6 h-6" />
                            </span>
                            Konfirmasi Restore Database
                        </h2>

                        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                            Apakah Anda yakin ingin melakukan <strong className="text-orange-600">Restore Database</strong>? 
                            Proses ini akan menghapus seluruh data sistem saat ini dan menggantinya dengan data dari file backup yang Anda unggah.
                        </p>
                        
                        <p className="mt-2 text-sm text-red-600 font-medium italic">
                            * Pastikan file yang Anda gunakan adalah file backup yang benar.
                        </p>

                        <div className="mt-8 flex items-center justify-end gap-3">
                            <SecondaryButton onClick={() => setConfirmingRestore(false)} className="px-6 py-3 rounded-xl border-gray-200 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-offset-2 focus:ring-gray-200">
                                Batal
                            </SecondaryButton>

                            <button
                                onClick={executeRestore}
                                className="px-6 py-3 rounded-xl shadow-sm border border-transparent bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <UploadCloudIcon className="w-4 h-4" />
                                Ya, Restore Sekarang
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal 
                    show={showProgress} 
                    onClose={() => {}} // Disable closing during progress
                    maxWidth="md"
                >
                    <div className="p-8 text-center">
                        <div className="mb-6 relative inline-flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center animate-pulse">
                                <UploadCloudIcon className="w-10 h-10 text-orange-600" />
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Proses Restore Sedang Berjalan</h3>
                        <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
                            Mohon tunggu sejenak, jangan tutup atau muat ulang halaman ini sampai proses selesai.
                        </p>

                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-100">
                                        Status
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-orange-600">
                                        {Math.round(restoreProgress)}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                                <div 
                                    style={{ width: `${restoreProgress}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-out h-full"
                                ></div>
                            </div>
                        </div>
                        
                        <p className="text-xs text-gray-400 italic">
                            {restoreProgress < 100 ? 'Sedang melakukan pemulihan struktur dan data...' : 'Berhasil! Sinkronisasi data selesai.'}
                        </p>
                    </div>
                </Modal>

            </div>
        </AuthenticatedLayout>
    );
}
