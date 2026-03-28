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

interface Item { id: string; nama_barang: string; kode_barang: string; }

interface Peminjaman {
    id: number;
    item_id: string;
    nama_peminjam: string;
    nip_nik: string | null;
    tanggal_pinjam: string;
    estimasi_kembali: string;
    tanggal_kembali: string | null;
    status: string;
    keterangan: string | null;
    item?: Item;
}

export default function Index({ peminjamans, items }: { peminjamans: Peminjaman[], items: Item[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        item_id: '',
        nama_peminjam: '',
        nip_nik: '',
        tanggal_pinjam: new Date().toISOString().split('T')[0],
        estimasi_kembali: new Date().toISOString().split('T')[0],
        keterangan: '',

        // fields for return update
        status: 'Dikembalikan',
        tanggal_kembali: new Date().toISOString().split('T')[0],
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

    const openReturnModal = (pinjam: Peminjaman) => {
        clearErrors();
        setSelectedPeminjaman(pinjam);
        setData({
            ...data,
            status: 'Dikembalikan',
            tanggal_kembali: new Date().toISOString().split('T')[0]
        });
        setIsReturnModalOpen(true);
    };

    const closeReturnModal = () => {
        setIsReturnModalOpen(false);
        setSelectedPeminjaman(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('peminjaman.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const submitReturn = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPeminjaman) {
            put(route('peminjaman.update', selectedPeminjaman.id), {
                onSuccess: () => closeReturnModal(),
            });
        }
    };

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedId) {
            destroy(route('peminjaman.destroy', selectedId.toString()), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight drop-shadow-sm">Peminjaman Barang</h2>}
        >
            <Head title="Peminjaman Barang" />

            <div className="py-8 animate-fade-in-up">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Daftar Peminjaman Barang</h3>
                            <PrimaryButton onClick={openModal} className="shadow-md shadow-blue-500/30 hover:-translate-y-0.5 transition-all">Catat Peminjaman</PrimaryButton>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full whitespace-nowrap text-sm text-left text-gray-600">
                                <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                    <tr>
                                        <th className="px-4 py-3 text-white/90">No</th>
                                        <th className="px-4 py-3 text-white/90">Barang</th>
                                        <th className="px-4 py-3 text-white/90">Peminjam</th>
                                        <th className="px-4 py-3 text-white/90">Tgl Pinjam</th>
                                        <th className="px-4 py-3 text-white/90">Batas Kembali</th>
                                        <th className="px-4 py-3 text-white/90">Tgl Kembali</th>
                                        <th className="px-4 py-3 text-white/90">Status</th>
                                        <th className="px-4 py-3 text-center text-white/90">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {peminjamans.map((p, index) => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition duration-150">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-gray-900">{p.item?.nama_barang}</div>
                                                <div className="text-xs text-gray-500">{p.item?.kode_barang}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold">{p.nama_peminjam}</div>
                                                <div className="text-xs text-gray-500">NIP/NIK: {p.nip_nik || '-'}</div>
                                            </td>
                                            <td className="px-4 py-3">{p.tanggal_pinjam}</td>
                                            <td className="px-4 py-3">{p.estimasi_kembali}</td>
                                            <td className="px-4 py-3">{p.tanggal_kembali || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Dikembalikan' ? 'bg-green-100 text-green-800' : (p.status === 'Dipinjam' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800')}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 flex justify-center gap-2">
                                                {(p.status === 'Dipinjam' || p.status === 'Terlambat') && (
                                                    <PrimaryButton onClick={() => openReturnModal(p)} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 border border-transparent rounded-lg font-bold text-xs text-white uppercase tracking-widest shadow-md shadow-green-500/30 hover:from-emerald-600 hover:to-green-700 hover:-translate-y-0.5 transition-all">Pengembalian</PrimaryButton>
                                                )}
                                                <button onClick={() => confirmDelete(p.id)} className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 border border-transparent rounded-lg font-bold text-xs text-white uppercase tracking-widest shadow-md shadow-red-500/30 hover:from-red-600 hover:to-rose-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {peminjamans.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-4 text-center text-gray-500">Belum ada data peminjaman.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Peminjaman */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="flex flex-col max-h-[90vh]">
                    {/* Modal Header */}
                    <div className="flex-shrink-0 relative px-8 py-10 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                        <div className="relative z-10 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Formulir Peminjaman</h2>
                                <p className="text-sm font-medium text-white/80 mt-1">Catat penggunaan aset oleh civitas sekolah.</p>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <form onSubmit={submit} className="p-8 bg-white">
                            <div className="space-y-6">
                                {/* Pemilihan Barang */}
                                <SearchableSelect
                                    label="Pilih Aset yang Tersedia"
                                    value={data.item_id}
                                    onChange={(val) => setData('item_id', val as string)}
                                    options={items.map(item => ({
                                        value: item.id,
                                        label: `${item.kode_barang} - ${item.nama_barang}`
                                    }))}
                                    error={errors.item_id}
                                    required
                                    placeholder="-- Pilih Barang --"
                                />

                                {/* Data Peminjam */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nama_peminjam" value="Nama Lengkap Peminjam" className="mb-2 font-bold text-gray-700 px-1" />
                                        <TextInput id="nama_peminjam" placeholder="Misal: Bapak Budi Santoso" className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-2xl py-3.5 transition-all shadow-sm" value={data.nama_peminjam} onChange={(e) => setData('nama_peminjam', e.target.value)} required />
                                        <InputError message={errors.nama_peminjam} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nip_nik" value="NIP / NIK / NISN" className="mb-2 font-bold text-gray-700 px-1" />
                                        <TextInput id="nip_nik" placeholder="Nomor Identitas" className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-2xl py-3.5 transition-all shadow-sm" value={data.nip_nik} onChange={(e) => setData('nip_nik', e.target.value)} />
                                        <InputError message={errors.nip_nik} className="mt-2" />
                                    </div>
                                </div>

                                {/* Waktu Peminjaman */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <InputLabel htmlFor="tanggal_pinjam" value="Tanggal Pinjam" className="font-bold text-gray-700" />
                                        </div>
                                        <ModernDatePicker
                                            id="tanggal_pinjam"
                                            value={data.tanggal_pinjam}
                                            onChange={(date) => setData('tanggal_pinjam', date)}
                                        />
                                        <InputError message={errors.tanggal_pinjam} className="mt-2" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <InputLabel htmlFor="estimasi_kembali" value="Batas Kembali" className="font-bold text-gray-700" />
                                        </div>
                                        <ModernDatePicker
                                            id="estimasi_kembali"
                                            value={data.estimasi_kembali}
                                            onChange={(date) => setData('estimasi_kembali', date)}
                                        />
                                        <InputError message={errors.estimasi_kembali} className="mt-2" />
                                    </div>
                                </div>

                                {/* Keperluan */}
                                <div>
                                    <InputLabel htmlFor="keterangan" value="Keperluan / Alasan Pinjam" className="mb-2 font-bold text-gray-700 px-1" />
                                    <textarea
                                        id="keterangan"
                                        className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-3xl py-3.5 transition-all text-sm font-medium shadow-sm"
                                        rows={3}
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Jelaskan untuk kegiatan apa aset ini dipinjam..."
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
                                    className="px-10 py-3.5 !rounded-2xl font-bold shadow-xl shadow-purple-600/30 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all text-sm tracking-widest bg-gradient-to-r from-indigo-600 to-purple-700"
                                    disabled={processing || !data.item_id}
                                >
                                    {processing ? 'Menyimpan...' : 'Proses Pinjam'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Modal Pengembalian */}
            <Modal show={isReturnModalOpen} onClose={closeReturnModal} maxWidth="md">
                <div className="flex flex-col max-h-[90vh]">
                    <div className="flex-shrink-0 px-6 py-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-black">Konfirmasi Kembali</h2>
                        </div>
                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <form onSubmit={submitReturn} className="p-6 bg-white space-y-6">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 group hover:bg-emerald-50 hover:border-emerald-100 transition-all">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-400">Detil Peminjaman</p>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-gray-700">{selectedPeminjaman?.item?.nama_barang}</span>
                                    <span className="text-xs text-gray-500">Peminjam: {selectedPeminjaman?.nama_peminjam}</span>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="tanggal_kembali" value="Tanggal Dikembalikan" className="mb-2 font-bold text-gray-700" />
                                <ModernDatePicker
                                    id="tanggal_kembali"
                                    value={data.tanggal_kembali}
                                    onChange={(date) => setData('tanggal_kembali', date)}
                                />
                                <InputError message={errors.tanggal_kembali} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <SecondaryButton onClick={closeReturnModal} className="!rounded-xl px-4">Batal</SecondaryButton>
                                <PrimaryButton className="!rounded-xl px-6 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Selesaikan Pinjaman'}
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
                title="Hapus Riwayat Peminjaman"
                message="Apakah Anda yakin ingin menghapus data peminjaman ini? Tindakan ini akan menghapus riwayat secara permanen."
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
