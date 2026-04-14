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
};
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

            <div className="py-8 animate-fade-in-up text-[9pt]">
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
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">No</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Tanggal</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Barang</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Jenis Pemeliharaan</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Biaya</th>
                                        <th className="px-4 py-3 text-white/90 text-[9pt]">Penyedia Jasa & Ket.</th>
                                        <th className="px-4 py-3 text-center text-white/90 text-[9pt]">Aksi</th>
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

            <FormModal
                show={isModalOpen}
                onClose={closeModal}
                title="Catat Pemeliharaan Aset"
                subtitle="Rekam riwayat perbaikan dan perawatan berkala barang inventaris."
                maxWidth="2xl"
                accentColor="emerald"
                icon={<Icons.Plus className="w-6 h-6" />}
                processing={processing}
                onSubmit={submit}
                submitLabel="Simpan Perawatan"
                submitDisabled={!data.item_id}
                bodyClassName="text-[9pt]"
            >
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
                        <div className="space-y-1">
                            <InputLabel htmlFor="tanggal_pemeliharaan" value="Tanggal Perbaikan" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                            <ModernDatePicker
                                id="tanggal_pemeliharaan"
                                value={data.tanggal_pemeliharaan}
                                onChange={(date) => setData('tanggal_pemeliharaan', date)}
                            />
                            <InputError message={errors.tanggal_pemeliharaan} />
                        </div>
                        <div className="space-y-1">
                            <InputLabel htmlFor="jenis_pemeliharaan" value="Jenis Perbaikan" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                            <TextInput id="jenis_pemeliharaan" placeholder="Misal: Ganti Oli, Servis AC" className="w-full bg-gray-50/50 font-bold" value={data.jenis_pemeliharaan} onChange={(e) => setData('jenis_pemeliharaan', e.target.value)} required />
                            <InputError message={errors.jenis_pemeliharaan} />
                        </div>
                    </div>

                    {/* Biaya & Penyedia */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <InputLabel htmlFor="biaya" value="Estimasi Biaya (Rp)" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold text-sm">Rp</span>
                                </div>
                                <TextInput
                                    id="biaya"
                                    type="text"
                                    className="w-full pl-10 bg-gray-50/50 font-bold"
                                    value={data.biaya ? new Intl.NumberFormat('id-ID').format(Number(data.biaya)) : ''}
                                    onChange={(e) => setData('biaya', e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>
                            <InputError message={errors.biaya} />
                        </div>
                        <div className="space-y-1">
                            <InputLabel htmlFor="penyedia_jasa" value="Penyedia Jasa / Bengkel" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                            <TextInput id="penyedia_jasa" placeholder="Nama Toko atau Teknisi" className="w-full bg-gray-50/50 font-bold" value={data.penyedia_jasa} onChange={(e) => setData('penyedia_jasa', e.target.value)} />
                            <InputError message={errors.penyedia_jasa} />
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div className="space-y-1">
                        <InputLabel htmlFor="keterangan" value="Rincian Kerusakan / Tindakan" className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                        <textarea
                            id="keterangan"
                            className="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl py-3 text-[9pt] font-medium bg-gray-50/50 transition-all"
                            rows={3}
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Tuliskan detail part yang diganti atau kendala aset..."
                        ></textarea>
                        <InputError message={errors.keterangan} />
                    </div>
                </div>
            </FormModal>

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
