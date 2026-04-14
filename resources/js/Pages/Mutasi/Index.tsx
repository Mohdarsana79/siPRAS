import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import FormModal from '@/Components/FormModal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ModernDatePicker from '@/Components/ModernDatePicker';

const Icons = {
    Plus: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
    Edit: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Print: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
};
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

    const handlePrint = (e: React.FormEvent) => {
        if (e) e.preventDefault();
        
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

            <div className="py-8 animate-fade-in-up text-[9pt]">
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
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">No</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Tanggal</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Barang Mutasi</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Jenis Mutasi</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Detail Mutasi (Asal &rarr; Tujuan / Tipe)</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Keterangan</th>
                                        <th className="px-4 py-3 text-center text-[9pt]">Aksi</th>
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

            {/* Modal Add Mutasi */}
            <FormModal
                show={isModalOpen}
                onClose={closeModal}
                title="Catat Mutasi Barang"
                subtitle="Lakukan pemindahan lokasi atau penghapusan aset inventaris."
                maxWidth="2xl"
                accentColor="indigo"
                icon={<Icons.Plus className="w-6 h-6" />}
                processing={processing}
                onSubmit={submit}
                submitLabel="Simpan Mutasi"
                bodyClassName="text-[9pt]"
            >
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
                        <div className="space-y-1">
                            <InputLabel htmlFor="tanggal_mutasi" value="Tanggal Mutasi" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                            <ModernDatePicker
                                id="tanggal_mutasi"
                                value={data.tanggal_mutasi}
                                onChange={(date) => setData('tanggal_mutasi', date)}
                            />
                            <InputError message={errors.tanggal_mutasi} />
                        </div>
                    </div>

                    {/* Konteks Spesifik: Pindah Ruangan */}
                    {data.jenis_mutasi === 'Pindah Ruangan' && (
                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1 w-full">
                                <label className="text-[9pt] font-black uppercase tracking-widest text-blue-400 mb-2 block ml-1">Lokasi Saat Ini</label>
                                <div className="px-4 py-3 bg-white rounded-xl border border-blue-100 text-sm font-bold text-gray-500">
                                    {selectedItem?.ruangan?.nama_ruangan || 'Tanpa Ruangan'}
                                </div>
                            </div>

                            <div className="rotate-90 md:rotate-0 text-blue-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    )}

                    {/* Konteks Spesifik: Penghapusan */}
                    {data.jenis_mutasi === 'Penghapusan/Afkir' && (
                        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
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

                    <div className="space-y-1">
                        <InputLabel htmlFor="keterangan" value="Surat Tugas / Keterangan Tambahan" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                        <textarea
                            id="keterangan"
                            className="w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl py-3 text-[9pt] font-medium bg-gray-50/50 transition-all"
                            rows={3}
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Contoh: Berdasarkan SK Mutasi No. 123/2024..."
                        ></textarea>
                        <InputError message={errors.keterangan} />
                    </div>
                </div>
            </FormModal>

            {/* Print Settings Modal */}
            <FormModal
                show={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                title="Pengaturan Cetak"
                subtitle="Laporan Mutasi Barang"
                maxWidth="md"
                accentColor="indigo"
                icon={<Icons.Plus className="w-6 h-6" />}
                onSubmit={handlePrint}
                submitLabel="Proses Cetak"
                bodyClassName="text-[9pt]"
            >
                <div className="space-y-8">
                    {/* Paper Size */}
                    <div className="space-y-3">
                        <label className="block text-[9pt] font-black uppercase tracking-widest text-gray-400 ml-1">Ukuran Kertas</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['a4', 'folio', 'letter', 'legal'].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setPrintSettings({ ...printSettings, paper_size: size })}
                                    className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                        printSettings.paper_size === size
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {size.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-3">
                        <label className="block text-[9pt] font-black uppercase tracking-widest text-gray-400 ml-1">Ukuran Font</label>
                        <div className="grid grid-cols-5 gap-2">
                            {['8pt', '9pt', '10pt', '11pt', '12pt'].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setPrintSettings({ ...printSettings, font_size: size })}
                                    className={`py-2 rounded-lg border-2 font-bold text-xs transition-all ${
                                        printSettings.font_size === size
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orientation */}
                    <div className="space-y-3">
                        <label className="block text-[9pt] font-black uppercase tracking-widest text-gray-400 ml-1">Orientasi</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'portrait', label: 'Portrait' },
                                { id: 'landscape', label: 'Landscape' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setPrintSettings({ ...printSettings, orientation: opt.id })}
                                    className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                        printSettings.orientation === opt.id
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </FormModal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Data Mutasi"
                message="Apakah Anda yakin ingin menghapus data mutasi ini? Data yang dihapus tidak dapat dikembalikan."
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
