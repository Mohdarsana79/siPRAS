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

            <div className="py-8 animate-fade-in-up text-[9pt]">
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
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">No</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Barang</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Peminjam</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Tgl Pinjam</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Batas Kembali</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Tgl Kembali</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Status</th>
                                        <th className="px-4 py-3 text-center text-white/90 text-[9pt]">Aksi</th>
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
            <FormModal
                show={isModalOpen}
                onClose={closeModal}
                title="Catat Peminjaman Barang"
                subtitle="Formulir pencatatan peminjaman aset"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                accentColor="indigo"
                maxWidth="2xl"
                onSubmit={submit}
                submitLabel="Proses Pinjam"
                bodyClassName="text-[9pt]"
                processing={processing}
            >
                <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="nama_peminjam" value="Nama Peminjam" />
                            <TextInput id="nama_peminjam" className="w-full mt-1" placeholder="Nama lengkap peminjam" value={data.nama_peminjam} onChange={(e) => setData('nama_peminjam', e.target.value)} required />
                            <InputError message={errors.nama_peminjam} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nip_nik" value="NIP / NIK / NISN" />
                            <TextInput id="nip_nik" className="w-full mt-1" placeholder="Nomor identitas" value={data.nip_nik} onChange={(e) => setData('nip_nik', e.target.value)} />
                            <InputError message={errors.nip_nik} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="tanggal_pinjam" value="Tanggal Pinjam" />
                            <div className="mt-1">
                                <ModernDatePicker id="tanggal_pinjam" value={data.tanggal_pinjam} onChange={(date) => setData('tanggal_pinjam', date)} />
                            </div>
                            <InputError message={errors.tanggal_pinjam} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="estimasi_kembali" value="Batas Kembali" />
                            <div className="mt-1">
                                <ModernDatePicker id="estimasi_kembali" value={data.estimasi_kembali} onChange={(date) => setData('estimasi_kembali', date)} />
                            </div>
                            <InputError message={errors.estimasi_kembali} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="keterangan" value="Keperluan / Alasan" />
                        <textarea
                            id="keterangan"
                            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                            rows={3}
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Jelaskan keperluan peminjaman..."
                        />
                        <InputError message={errors.keterangan} className="mt-1" />
                    </div>
                </div>
            </FormModal>

            {/* Modal Pengembalian */}
            <FormModal
                show={isReturnModalOpen}
                onClose={closeReturnModal}
                title="Konfirmasi Pengembalian"
                subtitle={selectedPeminjaman ? `${selectedPeminjaman.item?.nama_barang} — Peminjam: ${selectedPeminjaman.nama_peminjam}` : ''}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                accentColor="emerald"
                maxWidth="md"
                onSubmit={submitReturn}
                submitLabel="Selesaikan Pengembalian"
                bodyClassName="text-[9pt]"
                processing={processing}
            >
                <div>
                    <InputLabel htmlFor="tanggal_kembali" value="Tanggal Dikembalikan" />
                    <div className="mt-1">
                        <ModernDatePicker
                            id="tanggal_kembali"
                            value={data.tanggal_kembali}
                            onChange={(date) => setData('tanggal_kembali', date)}
                        />
                    </div>
                    <InputError message={errors.tanggal_kembali} className="mt-1" />
                </div>
            </FormModal>

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
