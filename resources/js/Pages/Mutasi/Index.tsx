import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ModernDatePicker from '@/Components/ModernDatePicker';
import SearchableSelect from '@/Components/SearchableSelect';

interface Ruangan { id: number; nama_ruangan: string; kode_ruangan: string; }
interface Item { id: string; nama_barang: string; kode_barang: string; ruangan_id: number | null; ruangan?: Ruangan; }

interface Mutasi {
    id: number;
    item_id: string;
    jenis_mutasi: string;
    dari_ruangan_id: number | null;
    ke_ruangan_id: number | null;
    tipe_penghapusan: string | null;
    tanggal_mutasi: string;
    keterangan: string | null;
    item?: Item;
    dari_ruangan?: Ruangan;
    ke_ruangan?: Ruangan;
}

export default function Index({ mutasis, items, ruangans }: { mutasis: Mutasi[], items: Item[], ruangans: Ruangan[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Print Settings State
    const [printSettings, setPrintSettings] = useState({
        paper_size: 'a4',
        font_size: '10pt',
        orientation: 'landscape'
    });

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        item_id: '',
        jenis_mutasi: 'Pindah Ruangan',
        ke_ruangan_id: '',
        tipe_penghapusan: '',
        tanggal_mutasi: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    const openModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('mutasi.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedId) {
            destroy(route('mutasi.destroy', selectedId.toString()), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    const handlePrint = () => {
        const queryParams = new URLSearchParams({
            paper_size: printSettings.paper_size,
            font_size: printSettings.font_size,
            orientation: printSettings.orientation
        }).toString();
        
        window.open(`${route('mutasi.cetak')}?${queryParams}`, '_blank');
        setIsPrintModalOpen(false);
    };

    // Cari letak ruangan barang saat ini berdasarkan item_id yang dipilih
    const selectedItem = items.find(i => i.id === data.item_id);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight drop-shadow-sm">Mutasi Barang</h2>}
        >
            <Head title="Mutasi Barang" />

            <div className="py-8 animate-fade-in-up">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="text-lg font-bold text-gray-800">Riwayat Pindah Ruangan & Penghapusan</h3>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={() => setIsPrintModalOpen(true)}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-white border-2 border-indigo-100 rounded-xl font-black text-xs text-indigo-600 uppercase tracking-widest shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak PDF
                                </button>
                                <PrimaryButton onClick={openModal} className="flex-1 sm:flex-none shadow-md shadow-blue-500/30 hover:-translate-y-0.5 transition-all !rounded-xl">Catat Mutasi Baru</PrimaryButton>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full whitespace-nowrap text-sm text-left text-gray-600">
                                <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                    <tr>
                                        <th className="px-4 py-3 text-white/90">No</th>
                                        <th className="px-4 py-3 text-white/90">Tanggal</th>
                                        <th className="px-4 py-3 text-white/90">Barang Mutasi</th>
                                        <th className="px-4 py-3 text-white/90">Jenis Mutasi</th>
                                        <th className="px-4 py-3 text-white/90">Detail Mutasi (Asal &rarr; Tujuan / Tipe)</th>
                                        <th className="px-4 py-3 text-white/90">Keterangan</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mutasis.map((mutasi, index) => (
                                        <tr key={mutasi.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition duration-150">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">{mutasi.tanggal_mutasi}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-gray-900">{mutasi.item?.nama_barang}</div>
                                                <div className="text-xs text-gray-500">{mutasi.item?.kode_barang}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${mutasi.jenis_mutasi === 'Pindah Ruangan' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                                    {mutasi.jenis_mutasi}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {mutasi.jenis_mutasi === 'Pindah Ruangan' ? (
                                                    <div>
                                                        <span className="text-gray-500 line-through mr-1">{mutasi.dari_ruangan?.nama_ruangan || 'Tanpa Ruangan'}</span>
                                                        &rarr; <span className="font-medium text-green-700 ml-1">{mutasi.ke_ruangan?.nama_ruangan || 'Tanpa Ruangan'}</span>
                                                    </div>
                                                ) : (
                                                    <div className="font-medium">{mutasi.tipe_penghapusan}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-pre-wrap">{mutasi.keterangan || '-'}</td>
                                            <td className="px-4 py-3 flex justify-center gap-2">
                                                <button onClick={() => confirmDelete(mutasi.id)} className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 border border-transparent rounded-lg font-bold text-xs text-white uppercase tracking-widest shadow-md shadow-red-500/30 hover:from-red-600 hover:to-rose-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {mutasis.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-4 text-center text-gray-500">Belum ada riwayat mutasi barang.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="flex flex-col max-h-[90vh]">
                    {/* Modal Header */}
                    <div className="flex-shrink-0 relative px-8 py-10 overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700">
                        <div className="relative z-10 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Catat Mutasi Barang</h2>
                                <p className="text-sm font-medium text-white/80 mt-1">Lakukan pemindahan lokasi atau penghapusan aset inventaris.</p>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-spin-slow" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <form onSubmit={submit} className="p-8 bg-white">
                            <div className="space-y-6">
                                {/* Pemilihan Barang */}
                                <SearchableSelect
                                    label="Pilih Aset yang Akan Dimutasi"
                                    value={data.item_id}
                                    onChange={(val) => setData('item_id', val as string)}
                                    options={items.map(item => ({
                                        value: item.id,
                                        label: `${item.kode_barang} - ${item.nama_barang} (Lokasi: ${item.ruangan?.nama_ruangan || 'Tanpa Ruangan'})`
                                    }))}
                                    error={errors.item_id}
                                    required
                                    placeholder="-- Cari & Pilih Barang --"
                                />

                                {/* Jenis & Tanggal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SearchableSelect
                                        label="Jenis Mutasi"
                                        value={data.jenis_mutasi}
                                        onChange={(val) => setData('jenis_mutasi', val as string)}
                                        options={[
                                            { value: 'Pindah Ruangan', label: '↔ Pindah Ruangan' },
                                            { value: 'Penghapusan/Afkir', label: '✖ Penghapusan / Afkir' },
                                        ]}
                                        error={errors.jenis_mutasi}
                                        required
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <InputLabel htmlFor="tanggal_mutasi" value="Tanggal Mutasi" className="font-bold text-gray-700" />
                                        </div>
                                        <ModernDatePicker
                                            id="tanggal_mutasi"
                                            value={data.tanggal_mutasi}
                                            onChange={(date) => setData('tanggal_mutasi', date)}
                                        />
                                        <InputError message={errors.tanggal_mutasi} className="mt-2" />
                                    </div>
                                </div>

                                {/* Konteks Spesifik: Pindah Ruangan */}
                                {data.jenis_mutasi === 'Pindah Ruangan' && (
                                    <div className="relative group p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 shadow-inner">
                                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                            <div className="flex-1 w-full">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">Lokasi Saat Ini</label>
                                                <div className="px-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 text-sm font-bold text-gray-500">
                                                    {selectedItem?.ruangan?.nama_ruangan || 'Tanpa Ruangan'}
                                                </div>
                                            </div>

                                            <div className="rotate-90 md:rotate-0">
                                                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 w-full">
                                                <SearchableSelect
                                                    label="Pilih Ruangan Tujuan"
                                                    value={data.ke_ruangan_id}
                                                    onChange={(val) => setData('ke_ruangan_id', String(val))}
                                                    options={ruangans.map(r => ({ value: r.id, label: `${r.kode_ruangan} - ${r.nama_ruangan}` }))}
                                                    error={errors.ke_ruangan_id}
                                                    required
                                                    placeholder="-- Pilih Ruangan --"
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 rounded-full -mr-12 -mt-12 blur-2xl" />
                                    </div>
                                )}

                                {/* Konteks Spesifik: Penghapusan */}
                                {data.jenis_mutasi === 'Penghapusan/Afkir' && (
                                    <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100 shadow-inner">
                                        <SearchableSelect
                                            label="Metode Penghapusan Aset"
                                            value={data.tipe_penghapusan || ''}
                                            onChange={(val) => setData('tipe_penghapusan', val as string)}
                                            options={[
                                                { value: 'Dijual / Dilelang', label: '💰 Dijual / Dilelang' },
                                                { value: 'Dihibahkan', label: '🤝 Dihibahkan' },
                                                { value: 'Dimusnahkan', label: '🔥 Dimusnahkan' },
                                                { value: 'Hilang / Dicuri', label: '⚠️ Hilang / Dicuri' },
                                                { value: 'Lainnya', label: '📝 Lainnya...' },
                                            ]}
                                            error={errors.tipe_penghapusan}
                                            required
                                            placeholder="-- Pilih Alasan Penghapusan --"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <InputLabel htmlFor="keterangan" value="Surat Tugas / Keterangan Tambahan" className="font-bold text-gray-700" />
                                    </div>
                                    <textarea
                                        id="keterangan"
                                        className="w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl py-3 shadow-sm transition-all text-sm font-medium"
                                        rows={3}
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Contoh: Berdasarkan SK Mutasi No. 123/2024..."
                                    ></textarea>
                                    <InputError message={errors.keterangan} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-10 pt-8 border-t border-gray-100">
                                <SecondaryButton
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3.5 !rounded-2xl font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 border-none transition-all"
                                >
                                    Batal
                                </SecondaryButton>
                                <PrimaryButton
                                    className="px-10 py-3.5 !rounded-2xl font-bold shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all text-sm tracking-widest bg-gradient-to-r from-indigo-600 to-blue-700"
                                    disabled={processing || !data.item_id}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Mutasi'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Riwayat Mutasi"
                message="Apakah Anda yakin ingin menghapus data mutasi ini? Posisi barang saat ini tidak akan dikembalikan secara otomatis."
                processing={processing}
            />

            {/* Print Settings Modal */}
            <Modal show={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} maxWidth="md">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Pengaturan Cetak</h3>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Laporan Mutasi Barang</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-left">
                        {/* Paper Size */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Ukuran Kertas</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['a4', 'folio', 'letter', 'legal'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setPrintSettings({ ...printSettings, paper_size: size })}
                                        className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                            printSettings.paper_size === size
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                        }`}
                                    >
                                        {size.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Ukuran Font</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['8pt', '9pt', '10pt', '11pt', '12pt'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setPrintSettings({ ...printSettings, font_size: size })}
                                        className={`py-2 rounded-lg border-2 font-bold text-xs transition-all ${
                                            printSettings.font_size === size
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orientation */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Orientasi</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'portrait', label: 'Portrait', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                                    { id: 'landscape', label: 'Landscape', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPrintSettings({ ...printSettings, orientation: opt.id })}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                            printSettings.orientation === opt.id
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={opt.icon} />
                                        </svg>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-3">
                        <SecondaryButton className="flex-1 !rounded-2xl justify-center py-4 text-sm font-bold tracking-widest uppercase" onClick={() => setIsPrintModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="flex-1 !rounded-2xl justify-center py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-indigo-100" onClick={handlePrint}>
                            Proses Cetak
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
