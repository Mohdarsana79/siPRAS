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
import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import ModernDatePicker from '@/Components/ModernDatePicker';
import SearchableSelect from '@/Components/SearchableSelect';

// Interfaces based on our data structure
interface KibD {
    id: number;
    konstruksi: string;
    panjang: string;
    lebar: string;
    luas: string;
    letak_lokasi: string;
    dokumen_tanggal: string;
    dokumen_nomor: string;
    status_tanah: string;
    kode_tanah: string | null;
}

interface Kategori { id: number; nama_kategori: string; kode_kategori: string; }
interface Ruangan { id: number; nama_ruangan: string; kode_ruangan: string; }
interface SumberDana { id: number; nama_sumber: string; }

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Item {
    id: string; // uuid
    kode_barang: string;
    nama_barang: string;
    nomor_register: string;
    kondisi: string;
    tanggal_perolehan: string;
    harga: string;
    asal_usul: string;
    keterangan: string | null;
    kategori_id: number;
    ruangan_id: number | null;
    sumber_dana_id: number;
    kib_d?: KibD;
    kategori?: Kategori;
    ruangan?: Ruangan;
    sumber_dana?: SumberDana;
}

const Icons = {
    Road: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="8" x="2" y="3" rx="2" /><rect width="20" height="8" x="2" y="13" rx="2" /><line x1="12" x2="12" y1="3" y2="21" /></svg>
    ),
    Plus: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    ),
    Edit: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
    ),
    Trash: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
    ),
    Search: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    ChevronRight: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6" /></svg>
    ),
    Eye: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    )
};

export default function Index({ items, kategoris, ruangans, sumberDanas, filters }: { items: PaginatedData<Item>, kategoris: Kategori[], ruangans: Ruangan[], sumberDanas: SumberDana[], filters: { search?: string } }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('kib-d.index'), { search: searchTerm }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kategori_id: (kategoris.length > 0 ? kategoris[0].id : '') as number | string,
        ruangan_id: '' as number | string,
        sumber_dana_id: (sumberDanas.length > 0 ? sumberDanas[0].id : '') as number | string,
        kode_barang: '',
        nama_barang: '',
        nomor_register: '',
        kondisi: 'Baik',
        tanggal_perolehan: '',
        harga: '',
        asal_usul: '',
        keterangan: '',
        // KIB D fields
        konstruksi: '',
        panjang: '',
        lebar: '',
        luas: '',
        letak_lokasi: '',
        dokumen_tanggal: '',
        dokumen_nomor: '',
        status_tanah: '',
        kode_tanah: '',
    });

    const openModal = (item?: Item) => {
        clearErrors();
        if (item) {
            setIsEditing(true);
            setEditingId(item.id);
            setData({
                kategori_id: item.kategori_id,
                ruangan_id: item.ruangan_id || '',
                sumber_dana_id: item.sumber_dana_id,
                kode_barang: item.kode_barang,
                nama_barang: item.nama_barang,
                nomor_register: item.nomor_register,
                kondisi: item.kondisi,
                tanggal_perolehan: item.tanggal_perolehan,
                harga: item.harga,
                asal_usul: item.asal_usul,
                keterangan: item.keterangan || '',
                konstruksi: item.kib_d?.konstruksi || '',
                panjang: item.kib_d?.panjang || '',
                lebar: item.kib_d?.lebar || '',
                luas: item.kib_d?.luas || '',
                letak_lokasi: item.kib_d?.letak_lokasi || '',
                dokumen_tanggal: item.kib_d?.dokumen_tanggal || '',
                dokumen_nomor: item.kib_d?.dokumen_nomor || '',
                status_tanah: item.kib_d?.status_tanah || '',
                kode_tanah: item.kib_d?.kode_tanah || '',
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            reset();
            if (kategoris.length > 0) setData('kategori_id', kategoris[0].id);
            if (sumberDanas.length > 0) setData('sumber_dana_id', sumberDanas[0].id);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const openDetailModal = (item: Item) => {
        setSelectedItemForDetail(item);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedItemForDetail(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingId) {
            put(route('kib-d.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('kib-d.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (id: string) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedId) {
            destroy(route('kib-d.destroy', selectedId), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    const formatRupiah = (angka: string | number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(angka));
    };

    const formatDecimal = (angka: string | number | undefined) => {
        if (angka === undefined || angka === null || angka === '') return '-';
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(angka));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">KIB D - Jalan & Jaringan</h2>
                    </div>
                </div>
            }
        >
            <Head title="KIB D - Jalan & Jaringan" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

                    {/* Toolbar Section */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                        <div className="relative w-full md:max-w-md group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500">
                                <Icons.Search className="w-4 h-4" />
                            </div>
                            <TextInput
                                type="text"
                                className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-gray-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                                placeholder="Cari nama, kode, atau register..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PrimaryButton
                                onClick={() => openModal()}
                                className="!rounded-xl !py-2.5 px-5 flex items-center gap-2 !bg-emerald-600 hover:!bg-emerald-700 shadow-sm transition-all justify-center whitespace-nowrap !text-xs"
                            >
                                <Icons.Plus className="w-4 h-4" />
                                <span>Tambah Jaringan</span>
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                <tr>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Info Dasar</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Dimensi & Konstruksi</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Dokumen</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Perolehan</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px] text-right text-transparent">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.data.map((item) => (
                                    <tr key={item.id} className="group hover:bg-emerald-50/30 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight leading-tight">{item.nama_barang}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded leading-none">{item.kode_barang}</span>
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Reg: {item.nomor_register}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-teal-600 text-xs">{formatDecimal(item.kib_d?.luas)} m²</span>
                                                <span className="text-[10px] text-gray-500 mt-1 uppercase truncate max-w-[200px]" title={item.kib_d?.konstruksi}>{item.kib_d?.konstruksi}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-800">{item.kib_d?.dokumen_nomor || '-'}</span>
                                                <span className="text-[10px] text-gray-400 mt-0.5">Tgl: {item.kib_d?.dokumen_tanggal || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-xs">{formatRupiah(item.harga)}</span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.kondisi === 'Baik' ? 'bg-emerald-500' : (item.kondisi === 'Kurang Baik' ? 'bg-amber-500' : 'bg-rose-500')}`}></span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">{item.kondisi}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => openDetailModal(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Detail Aset"
                                                >
                                                    <Icons.Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Edit Data"
                                                >
                                                    <Icons.Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item.id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Hapus Aset"
                                                >
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {items.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 rounded-full">
                                                    <Icons.Road className="w-10 h-10 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tidak ada data jaringan ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Section */}
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                            <div className="text-sm font-medium text-gray-500">
                                Menampilkan <span className="text-gray-900 font-black">{items.data.length}</span> dari <span className="text-gray-900 font-black">{items.total}</span> Aset Jalan & Jaringan
                            </div>
                            <Pagination links={items.links} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Premium Colorful Modal - Add / Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="6xl">
                <div className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem]">
                    {/* Artistic Header */}
                    <div className={`px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden ${isEditing ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700' : 'bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700'}`}>
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-5 shadow-2xl relative z-10">
                            {isEditing ? <Icons.Edit className="w-8 h-8 text-white" /> : <Icons.Plus className="w-8 h-8 text-white" />}
                        </div>

                        <h3 className="text-2xl font-black text-white tracking-tight relative z-10 uppercase">
                            {isEditing ? 'UPDATE JALAN & JARINGAN' : 'TAMBAH JALAN & JARINGAN'}
                        </h3>
                        <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 relative z-10">
                            Pencatatan Kartu Inventaris Barang - KIB D
                        </p>
                    </div>

                    <form onSubmit={submit} className="px-8 pb-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-20 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-5">

                            {/* Left Column: General Info */}
                            <div className="space-y-4 md:col-span-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">
                                    <div className="w-6 h-px bg-emerald-100"></div> Informasi Utama
                                </h4>

                                <div className="group/field relative">
                                    <SearchableSelect
                                        label="KATEGORI BARANG"
                                        value={data.kategori_id}
                                        onChange={(val) => setData('kategori_id', val)}
                                        options={kategoris.map(k => ({ value: k.id, label: `${k.kode_kategori} - ${k.nama_kategori}` }))}
                                        error={errors.kategori_id}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="kode_barang" value="KODE BARANG" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="kode_barang" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm uppercase tracking-widest" value={data.kode_barang} onChange={(e) => setData('kode_barang', e.target.value)} required placeholder="KODE..." />
                                        <InputError message={errors.kode_barang} className="mt-2 text-[10px] font-bold" />
                                    </div>
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="nomor_register" value="NO. REGISTER" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="nomor_register" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm uppercase tracking-widest" value={data.nomor_register} onChange={(e) => setData('nomor_register', e.target.value)} required placeholder="REG..." />
                                        <InputError message={errors.nomor_register} className="mt-2 text-[10px] font-bold" />
                                    </div>
                                </div>

                                <div className="group/field relative">
                                    <InputLabel htmlFor="nama_barang" value="NAMA LENGKAP ASET" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput id="nama_barang" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm" value={data.nama_barang} onChange={(e) => setData('nama_barang', e.target.value)} required placeholder="CONTOH: JALAN LINGKUNGAN BLOK A..." />
                                    <InputError message={errors.nama_barang} className="mt-2 text-[10px] font-bold" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group/field relative">
                                        <SearchableSelect
                                            label="KONDISI"
                                            value={data.kondisi}
                                            onChange={(val) => setData('kondisi', val as string)}
                                            options={[
                                                { value: 'Baik', label: 'BAIK' },
                                                { value: 'Kurang Baik', label: 'KURANG BAIK' },
                                                { value: 'Rusak Berat', label: 'RUSAK BERAT' },
                                            ]}
                                        />
                                    </div>
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="tanggal_perolehan" value="TGL PEROLEHAN" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <ModernDatePicker
                                            id="tanggal_perolehan"
                                            value={data.tanggal_perolehan}
                                            onChange={(date) => setData('tanggal_perolehan', date)}
                                        />
                                        <InputError message={errors.tanggal_perolehan} className="mt-2 text-[10px] font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="harga" value="NILAI HARGA / PEROLEHAN (RP)" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput
                                            id="harga"
                                            type="text"
                                            className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm uppercase placeholder:text-gray-300 tracking-widest"
                                            value={data.harga ? new Intl.NumberFormat('id-ID').format(Number(data.harga)) : ''}
                                            onChange={(e) => setData('harga', e.target.value.replace(/\D/g, ''))}
                                            required
                                            placeholder="0"
                                        />
                                        <InputError message={errors.harga} className="mt-2 text-[10px] font-bold" />
                                    </div>

                                    <div className="group/field relative">
                                        <InputLabel htmlFor="asal_usul" value="ASAL USUL" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput
                                            id="asal_usul"
                                            className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm uppercase tracking-widest"
                                            value={data.asal_usul}
                                            onChange={(e) => setData('asal_usul', e.target.value)}
                                            required
                                            placeholder="PEMBELIAN / HIBAH..."
                                        />
                                        <InputError message={errors.asal_usul} className="mt-2 text-[10px] font-bold" />
                                    </div>
                                </div>

                                <div className="group/field relative">
                                    <SearchableSelect
                                        label="SUMBER DANA"
                                        value={data.sumber_dana_id}
                                        onChange={(val) => setData('sumber_dana_id', val)}
                                        options={sumberDanas.map(s => ({ value: s.id, label: s.nama_sumber }))}
                                        error={errors.sumber_dana_id}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column: KIB Specific */}
                            <div className="space-y-4 md:col-span-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-4">
                                    <div className="w-6 h-px bg-teal-100"></div> Spesifikasi KIB D
                                </h4>

                                <div className="group/field relative">
                                    <InputLabel htmlFor="konstruksi" value="JENIS KONSTRUKSI" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput id="konstruksi" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm uppercase" value={data.konstruksi} onChange={(e) => setData('konstruksi', e.target.value)} required placeholder="ASPAL / BETON / PIPA PVC..." />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="panjang" value="PANJANG" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="panjang" type="text" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm tracking-widest" value={data.panjang} onChange={(e) => {
                                            const val = e.target.value;
                                            setData(prev => {
                                                const p = parseFloat(val.replace(',', '.')) || 0;
                                                const l = parseFloat((prev.lebar || '').replace(',', '.')) || 0;
                                                return {
                                                    ...prev,
                                                    panjang: val,
                                                    luas: (p > 0 && l > 0) ? Number((p * l).toFixed(4)).toString() : ''
                                                };
                                            });
                                        }} required placeholder="M..." />
                                    </div>
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="lebar" value="LEBAR" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="lebar" type="text" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm tracking-widest" value={data.lebar} onChange={(e) => {
                                            const val = e.target.value;
                                            setData(prev => {
                                                const l = parseFloat(val.replace(',', '.')) || 0;
                                                const p = parseFloat((prev.panjang || '').replace(',', '.')) || 0;
                                                return {
                                                    ...prev,
                                                    lebar: val,
                                                    luas: (p > 0 && l > 0) ? Number((p * l).toFixed(4)).toString() : ''
                                                };
                                            });
                                        }} required placeholder="M..." />
                                    </div>
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="luas" value="LUAS (M²)" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="luas" type="text" className="w-full px-4 rounded-xl border-gray-200 bg-gray-100 py-2.5 font-black text-gray-600 focus:ring-0 cursor-not-allowed transition-all text-sm tracking-widest" value={data.luas} readOnly required placeholder="M²..." />
                                    </div>
                                </div>

                                <div className="group/field relative">
                                    <InputLabel htmlFor="letak_lokasi" value="ALAMAT LOKASI" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <textarea
                                        id="letak_lokasi"
                                        className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm outline-none resize-none"
                                        rows={2}
                                        value={data.letak_lokasi}
                                        onChange={(e) => setData('letak_lokasi', e.target.value)}
                                        required
                                        placeholder="ALAMAT LOKASI JALAN/JARINGAN..."
                                    />
                                    <InputError message={errors.letak_lokasi} className="mt-2 text-[10px] font-bold" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="dokumen_tanggal" value="TGL DOKUMEN" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <ModernDatePicker
                                            id="dokumen_tanggal"
                                            value={data.dokumen_tanggal}
                                            onChange={(date) => setData('dokumen_tanggal', date)}
                                        />
                                    </div>
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="dokumen_nomor" value="NO. DOKUMEN" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="dokumen_nomor" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm uppercase tracking-widest" value={data.dokumen_nomor} onChange={(e) => setData('dokumen_nomor', e.target.value)} required placeholder="NO. SERTI..." />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group/field relative">
                                        <InputLabel htmlFor="status_tanah" value="STATUS TANAH" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                        <TextInput id="status_tanah" className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm uppercase" value={data.status_tanah} onChange={(e) => setData('status_tanah', e.target.value)} required placeholder="TANAH NEGARA..." />
                                    </div>

                                    <div className="group/field relative">
                                        <SearchableSelect
                                            label="LOKASI RUANG (OPTS)"
                                            value={data.ruangan_id}
                                            onChange={(val) => setData('ruangan_id', val)}
                                            options={[
                                                { value: '', label: '-- TIDAK TERHUBUNG RUANG --' },
                                                ...ruangans.map(r => ({ value: r.id, label: `${r.kode_ruangan} - ${r.nama_ruangan}` }))
                                            ]}
                                            error={errors.ruangan_id}
                                        />
                                    </div>
                                </div>

                                <div className="group/field relative">
                                    <InputLabel htmlFor="keterangan" value="KETERANGAN TAMBAHAN" className="mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <textarea
                                        id="keterangan"
                                        className="w-full px-4 rounded-xl border-gray-100 bg-gray-50 py-2.5 font-black text-gray-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm outline-none resize-none"
                                        rows={2}
                                        value={data.keterangan || ''}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="CATATAN TAMBAHAN MENGENAI KONDISI ASET..."
                                    />
                                    <InputError message={errors.keterangan} className="mt-2 text-[10px] font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-12">
                            <SecondaryButton type="button" onClick={closeModal} className="flex-1 !rounded-[1.2rem] !py-3.5 justify-center !border-none !bg-gray-100 !text-gray-500 font-black uppercase tracking-widest text-[10px] hover:!bg-gray-200 transition-all">
                                BATAL
                            </SecondaryButton>
                            <PrimaryButton
                                className={`flex-[1.5] !rounded-[1.2rem] !py-3.5 shadow-xl border-none justify-center ${isEditing ? '!bg-gradient-to-r from-teal-600 to-emerald-700 shadow-teal-100' : '!bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-100'} hover:-translate-y-1 active:translate-y-0 transition-all`}
                                disabled={processing}
                            >
                                <span className="font-black text-white tracking-[0.2em] text-[10px] uppercase">
                                    {processing ? 'PROSES...' : (isEditing ? 'SIMPAN PERUBAHAN' : 'TAMBAH DATA ASET')}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Premium Detail Modal */}
            <Modal show={isDetailModalOpen} onClose={closeDetailModal} maxWidth="3xl">
                <div className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem]">
                    <div className="px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4">
                            <Icons.Eye className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">Detail Jalan & Jaringan</h3>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Status Verifikasi Kartu Inventaris</p>
                    </div>

                    <div className="p-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-20">
                        {selectedItemForDetail && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Identifikasi Aset</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Nama Barang', value: selectedItemForDetail.nama_barang, bold: true },
                                                { label: 'Kode Barang', value: selectedItemForDetail.kode_barang },
                                                { label: 'No. Register', value: selectedItemForDetail.nomor_register },
                                                { label: 'Kategori', value: selectedItemForDetail.kategori?.nama_kategori },
                                                { label: 'Ruangan', value: selectedItemForDetail.ruangan?.nama_ruangan || '-' },
                                                { label: 'Sumber Dana', value: selectedItemForDetail.sumber_dana?.nama_sumber || '-' },
                                                { label: 'Asal Usul', value: selectedItemForDetail.asal_usul || '-' },
                                            ].map((d, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{d.label}</span>
                                                    <span className={`text-sm ${d.bold ? 'font-black text-gray-900' : 'font-bold text-gray-600'}`}>{d.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">KIB D - Spesifikasi</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Dimensi (P x L)', value: `${formatDecimal(selectedItemForDetail.kib_d?.panjang)} x ${formatDecimal(selectedItemForDetail.kib_d?.lebar)} m` },
                                                { label: 'Luas Total', value: `${formatDecimal(selectedItemForDetail.kib_d?.luas)} m²` },
                                                { label: 'Konstruksi', value: selectedItemForDetail.kib_d?.konstruksi },
                                                { label: 'Alamat / Lokasi', value: selectedItemForDetail.kib_d?.letak_lokasi },
                                                { label: 'No. Dokumen', value: selectedItemForDetail.kib_d?.dokumen_nomor || '-' },
                                            ].map((d, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{d.label}</span>
                                                    <span className="text-sm font-bold text-gray-600">{d.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                                    {[
                                        { label: 'Kondisi', value: selectedItemForDetail.kondisi, type: 'badge' },
                                        { label: 'Tgl Perolehan', value: selectedItemForDetail.tanggal_perolehan },
                                        { label: 'Nilai Harga', value: formatRupiah(selectedItemForDetail.harga), color: 'text-emerald-600' },
                                    ].map((d, i) => (
                                        <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{d.label}</span>
                                            {d.type === 'badge' ? (
                                                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${d.value === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {d.value}
                                                </span>
                                            ) : (
                                                <span className={`text-sm font-black ${d.color || 'text-gray-800'}`}>{d.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {selectedItemForDetail.keterangan && (
                                    <div className="bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100">
                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-2">Keterangan Tambahan</span>
                                        <p className="text-xs font-medium text-gray-500 italic leading-relaxed">{selectedItemForDetail.keterangan}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-10">
                            <SecondaryButton onClick={closeDetailModal} className="w-full !py-4 justify-center !rounded-2xl !bg-gray-800 !text-white font-black text-[10px] tracking-[0.2em] shadow-xl shadow-gray-200">
                                TUTUP JENDELA DETAIL
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </Modal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Aset Jaringan"
                message="Data yang dihapus akan hilang dari pencatatan inventaris utama. Apakah Anda yakin ingin melanjutkan?"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
