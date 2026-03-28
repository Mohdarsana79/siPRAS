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

interface Pemeliharaan {
    id: number;
    item_id: string;
    tanggal_pemeliharaan: string;
    jenis_pemeliharaan: string;
    biaya: string;
    penyedia_jasa: string | null;
    bukti_nota: string | null;
    keterangan: string | null;
    item?: Item;
}

export default function Index({ pemeliharaans, items }: { pemeliharaans: Pemeliharaan[], items: Item[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        item_id: '',
        tanggal_pemeliharaan: new Date().toISOString().split('T')[0],
        jenis_pemeliharaan: '',
        biaya: '',
        penyedia_jasa: '',
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
        post(route('pemeliharaan.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedId) {
            destroy(route('pemeliharaan.destroy', selectedId.toString()), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    const formatRupiah = (angka: string | number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(angka));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight drop-shadow-sm">Pemeliharaan / Perbaikan Aset</h2>}
        >
            <Head title="Pemeliharaan Aset" />

            <div className="py-8 animate-fade-in-up">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Riwayat Pemeliharaan & Perbaikan</h3>
                            <PrimaryButton onClick={openModal} className="shadow-md shadow-blue-500/30 hover:-translate-y-0.5 transition-all">Catat Pemeliharaan</PrimaryButton>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full whitespace-nowrap text-sm text-left text-gray-600">
                                <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                    <tr>
                                        <th className="px-4 py-3 text-white/90">No</th>
                                        <th className="px-4 py-3 text-white/90">Tanggal</th>
                                        <th className="px-4 py-3 text-white/90">Barang</th>
                                        <th className="px-4 py-3 text-white/90">Jenis Pemeliharaan</th>
                                        <th className="px-4 py-3 text-white/90">Biaya</th>
                                        <th className="px-4 py-3 text-white/90">Penyedia Jasa & Ket.</th>
                                        <th className="px-4 py-3 text-center text-white/90">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pemeliharaans.map((p, index) => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition duration-150">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">{p.tanggal_pemeliharaan}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-gray-900">{p.item?.nama_barang}</div>
                                                <div className="text-xs text-gray-500">{p.item?.kode_barang}</div>
                                            </td>
                                            <td className="px-4 py-3">{p.jenis_pemeliharaan}</td>
                                            <td className="px-4 py-3 font-medium text-red-600">{formatRupiah(p.biaya)}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold">{p.penyedia_jasa || '-'}</div>
                                                <div className="text-xs text-gray-500 whitespace-pre-wrap">{p.keterangan}</div>
                                            </td>
                                            <td className="px-4 py-3 flex justify-center gap-2">
                                                <button onClick={() => confirmDelete(p.id)} className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 border border-transparent rounded-lg font-bold text-xs text-white uppercase tracking-widest shadow-md shadow-red-500/30 hover:from-red-600 hover:to-rose-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pemeliharaans.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-4 text-center text-gray-500">Belum ada data pemeliharaan aset.</td>
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
                    <div className="flex-shrink-0 relative px-8 py-10 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
                        <div className="relative z-10 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Catat Pemeliharaan Aset</h2>
                                <p className="text-sm font-medium text-white/80 mt-1">Rekam riwayat perbaikan dan perawatan berkala barang inventaris.</p>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <form onSubmit={submit} className="p-8 bg-white">
                            <div className="space-y-6">
                                {/* Pemilihan Barang */}
                                <SearchableSelect
                                    label="Pilih Aset yang Diperbaiki"
                                    value={data.item_id}
                                    onChange={(val) => setData('item_id', val as string)}
                                    options={items.map(item => ({
                                        value: item.id,
                                        label: `${item.kode_barang} - ${item.nama_barang}`
                                    }))}
                                    error={errors.item_id}
                                    required
                                    placeholder="-- Cari Barang --"
                                />

                                {/* Waktu & Jenis */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="tanggal_pemeliharaan" value="Tanggal Perbaikan" className="mb-2 font-bold text-gray-700 px-1" />
                                        <ModernDatePicker
                                            id="tanggal_pemeliharaan"
                                            value={data.tanggal_pemeliharaan}
                                            onChange={(date) => setData('tanggal_pemeliharaan', date)}
                                        />
                                        <InputError message={errors.tanggal_pemeliharaan} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="jenis_pemeliharaan" value="Jenis Perbaikan" className="mb-2 font-bold text-gray-700 px-1" />
                                        <TextInput id="jenis_pemeliharaan" placeholder="Misal: Ganti Oli, Servis AC" className="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl py-3.5 transition-all shadow-sm" value={data.jenis_pemeliharaan} onChange={(e) => setData('jenis_pemeliharaan', e.target.value)} required />
                                        <InputError message={errors.jenis_pemeliharaan} className="mt-2" />
                                    </div>
                                </div>

                                {/* Biaya & Penyedia */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="biaya" value="Estimasi Biaya (Rp)" className="mb-2 font-bold text-gray-700 px-1" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-bold text-sm">Rp</span>
                                            </div>
                                            <TextInput
                                                id="biaya"
                                                type="text"
                                                className="w-full pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl py-3.5 transition-all shadow-sm"
                                                value={data.biaya ? new Intl.NumberFormat('id-ID').format(Number(data.biaya)) : ''}
                                                onChange={(e) => setData('biaya', e.target.value.replace(/\D/g, ''))}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.biaya} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="penyedia_jasa" value="Penyedia Jasa / Bengkel" className="mb-2 font-bold text-gray-700 px-1" />
                                        <TextInput id="penyedia_jasa" placeholder="Nama Toko atau Teknisi" className="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl py-3.5 transition-all shadow-sm" value={data.penyedia_jasa} onChange={(e) => setData('penyedia_jasa', e.target.value)} />
                                        <InputError message={errors.penyedia_jasa} className="mt-2" />
                                    </div>
                                </div>

                                {/* Keterangan */}
                                <div>
                                    <InputLabel htmlFor="keterangan" value="Rincian Kerusakan / Tindakan" className="mb-2 font-bold text-gray-700 px-1" />
                                    <textarea
                                        id="keterangan"
                                        className="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-3xl py-3.5 transition-all text-sm font-medium shadow-sm"
                                        rows={3}
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Tuliskan detail part yang diganti atau kendala aset..."
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
                                    className="px-10 py-3.5 !rounded-2xl font-bold shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all text-sm tracking-widest bg-gradient-to-r from-emerald-600 to-teal-700"
                                    disabled={processing || !data.item_id}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perawatan'}
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
                title="Hapus Riwayat Pemeliharaan"
                message="Apakah Anda yakin ingin menghapus data pemeliharaan ini? Tindakan ini tidak dapat dibatalkan."
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
