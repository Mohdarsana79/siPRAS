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
import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import ModernDatePicker from '@/Components/ModernDatePicker';
import SearchableSelect from '@/Components/SearchableSelect';

// Interfaces based on our data structure
interface KibA {
    id: number;
    luas: string;
    letak_alamat: string;
    hak_tanah: string;
    tanggal_sertifikat: string;
    nomor_sertifikat: string;
    penggunaan: string;
}

interface Kategori { id: number; nama_kategori: string; kode_barang: string; }
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
    kib_a?: KibA;
    kategori?: Kategori;
    ruangan?: Ruangan;
    ruangans?: Ruangan[];
    sumber_dana?: SumberDana;
    label_bmd?: string;
    identitas_barang?: string;
    kode_lokasi_full?: string;
    kode_barang_full?: string;
    kode_komptabel?: string;
}

const Icons = {
    Map: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
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
                router.get(route('kib-a.index'), { search: searchTerm }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kategori_id: (kategoris.length > 0 ? kategoris[0].id : '') as number | string,
        ruangan_id: [] as (number | string)[],
        sumber_dana_id: (sumberDanas.length > 0 ? sumberDanas[0].id : '') as number | string,
        kode_barang: '',
        nama_barang: '',
        nomor_register: '',
        kondisi: 'Baik',
        tanggal_perolehan: '',
        harga: '',
        asal_usul: '',
        keterangan: '',
        // KIB A fields
        luas: '',
        letak_alamat: '',
        hak_tanah: '',
        tanggal_sertifikat: '',
        nomor_sertifikat: '',
        penggunaan: '',
        kode_komptabel: '01',
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error("Form Validation Errors:", errors);
            alert("Oops... Data tidak tersimpan karena ada input yang kurang tepat atau wajib diisi:\n" + JSON.stringify(errors, null, 2));
        }
    }, [errors]);

    const openModal = (item?: Item) => {
        clearErrors();
        if (item) {
            setIsEditing(true);
            setEditingId(item.id);
            setData({
                kategori_id: item.kategori_id,
                ruangan_id: item.ruangans?.length ? item.ruangans.map(r => r.id) : (item.ruangan_id ? [item.ruangan_id] : []),
                sumber_dana_id: item.sumber_dana_id,
                kode_barang: item.kode_barang,
                nama_barang: item.nama_barang,
                nomor_register: item.nomor_register,
                kondisi: item.kondisi,
                tanggal_perolehan: item.tanggal_perolehan,
                harga: item.harga,
                asal_usul: item.asal_usul,
                keterangan: item.keterangan || '',
                luas: item.kib_a?.luas || '',
                letak_alamat: item.kib_a?.letak_alamat || '',
                hak_tanah: item.kib_a?.hak_tanah || '',
                tanggal_sertifikat: item.kib_a?.tanggal_sertifikat || '',
                nomor_sertifikat: item.kib_a?.nomor_sertifikat || '',
                penggunaan: item.kib_a?.penggunaan || '',
                kode_komptabel: item.kode_komptabel || '01',
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            reset();
            // Default select
            if (kategoris.length > 0) setData('kategori_id', kategoris[0].id);
            if (sumberDanas.length > 0) setData('sumber_dana_id', sumberDanas[0].id);
            setData('kode_komptabel', '01');
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
            put(route('kib-a.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('kib-a.store'), {
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
            destroy(route('kib-a.destroy', selectedId), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    // Helper formatter
    const formatRupiah = (angka: string | number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(angka));
    };

    const formatLuas = (angka: string | number | undefined) => {
        if (angka === undefined || angka === null) return '-';
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(angka));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">KIB A - Tanah</h2>
                    </div>
                </div>
            }
        >
            <Head title="KIB A - Tanah" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4 text-[9pt]">

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

                    {/* Toolbar Section */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                        <div className="relative w-full md:max-w-md group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500">
                                <Icons.Search className="w-4 h-4" />
                            </div>
                            <TextInput
                                type="text"
                                className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-gray-200 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                placeholder="Cari nama, kode, atau register..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PrimaryButton
                                onClick={() => openModal()}
                                className="!rounded-xl !py-2.5 px-5 flex items-center gap-2 !bg-blue-600 hover:!bg-blue-700 shadow-sm transition-all justify-center whitespace-nowrap !text-xs"
                            >
                                <Icons.Plus className="w-4 h-4" />
                                <span>Tambah Tanah</span>
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                <tr>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Info Dasar</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Luas & Lokasi</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Legalitas</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px]">Perolehan</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[10px] text-right">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.data.map((item) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{item.nama_barang}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50 w-fit">
                                                            {item.kode_lokasi_full}
                                                        </span>
                                                        <span className="text-[10px] font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 w-fit">
                                                            {item.kode_barang_full}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-indigo-600 text-xs">{formatLuas(item.kib_a?.luas)} m²</span>
                                                <span className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-[200px]" title={item.kib_a?.letak_alamat}>{item.kib_a?.letak_alamat}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-800">{item.kib_a?.hak_tanah}</span>
                                                <span className="text-[10px] text-gray-400 mt-0.5">Sert: {item.kib_a?.nomor_sertifikat || '-'}</span>
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
                                                    <Icons.Map className="w-10 h-10 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tidak ada data tanah ditemukan</p>
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
                                Menampilkan <span className="text-gray-900 font-black">{items.data.length}</span> dari <span className="text-gray-900 font-black">{items.total}</span> Aset Tanah
                            </div>
                            <Pagination links={items.links} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Form Modal - Add / Edit */}
            <FormModal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditing ? 'Edit Aset Tanah' : 'Tambah Aset Tanah'}
                subtitle="Kartu Inventaris Barang — KIB A"
                icon={isEditing ? <Icons.Edit className="w-5 h-5" /> : <Icons.Plus className="w-5 h-5" />}
                accentColor="blue"
                headerVariant="gradient"
                maxWidth="5xl"
                onSubmit={submit}
                submitLabel={isEditing ? 'Simpan Perubahan' : 'Tambah Data'}
                processing={processing}
                bodyClassName="text-[9pt]"
            >
                <div className="space-y-8">
                    {/* section: Informasi Identitas */}
                    <div className="space-y-5">
                            <h4 className="text-[10pt] font-bold text-gray-800 tracking-tight">IDENTITAS ASET</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-5">
                                <div className="group">
                                    <SearchableSelect
                                        label="KATEGORI BARANG (LEVEL 1-6)"
                                        value={data.kategori_id}
                                        onChange={(val) => setData('kategori_id', val)}
                                        options={kategoris.map(k => ({ value: k.id, label: `${k.kode_barang} - ${k.nama_kategori}` }))}
                                        error={errors.kategori_id}
                                        required
                                    />
                                    <p className="text-[9pt] text-blue-500 mt-1.5 font-bold italic opacity-80 leading-tight">
                                        * Level 7 (Sub-sub rincian) direkam otomatis di sistem KIB.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <InputLabel htmlFor="nama_barang" value="NAMA LENGKAP ASET" className="text-[9pt] font-semibold text-gray-500" />
                                    <TextInput 
                                        id="nama_barang" 
                                        className="text-[9pt]" 
                                        value={data.nama_barang} 
                                        onChange={(e) => setData('nama_barang', e.target.value.toUpperCase())} 
                                        required 
                                        placeholder="CONTOH: TANAH BANGUNAN SEKOLAH..." 
                                    />
                                    <InputError message={errors.nama_barang} className="mt-1 text-[9pt] font-bold" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <InputLabel value="KODE BARANG" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput className="bg-gray-50 text-gray-500 cursor-not-allowed text-[9pt]" value={data.kode_barang || 'AUTO'} readOnly />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel value="NO. REGISTER" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput className="bg-gray-50 text-gray-500 cursor-not-allowed text-[9pt]" value={data.nomor_register || 'AUTO'} readOnly />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 px-4 py-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <SearchableSelect
                                    label="SUMBER DANA"
                                    value={data.sumber_dana_id}
                                    onChange={(val) => setData('sumber_dana_id', val)}
                                    options={sumberDanas.map(s => ({ value: s.id, label: s.nama_sumber }))}
                                    error={errors.sumber_dana_id}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
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
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="tanggal_perolehan" value="TGL PEROLEHAN" className="text-[9pt] font-semibold text-gray-500" />
                                        <ModernDatePicker
                                            id="tanggal_perolehan"
                                            value={data.tanggal_perolehan}
                                            onChange={(date) => setData('tanggal_perolehan', date)}
                                        />
                                        <InputError message={errors.tanggal_perolehan} className="mt-1 text-[9pt] font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="asal_usul" value="ASAL USUL" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput
                                            id="asal_usul"
                                            className="text-[9pt] uppercase"
                                            value={data.asal_usul}
                                            onChange={(e) => setData('asal_usul', e.target.value)}
                                            required
                                            placeholder="PEMBELIAN..."
                                        />
                                        <InputError message={errors.asal_usul} className="mt-1 text-[9pt] font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="harga" value="NILAI HARGA (RP)" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput
                                            id="harga"
                                            className="font-bold text-indigo-600 text-[9pt]"
                                            value={data.harga ? new Intl.NumberFormat('id-ID').format(Number(data.harga)) : ''}
                                            onChange={(e) => setData('harga', e.target.value.replace(/\D/g, ''))}
                                            required
                                            placeholder="0"
                                        />
                                        <InputError message={errors.harga} className="mt-1 text-[9pt] font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* section: Spesifikasi Teknis */}
                    <div className="space-y-5 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                            <h4 className="text-[10pt] font-bold text-gray-800 tracking-tight uppercase">Detail Spesifikasi KIB A</h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <InputLabel htmlFor="luas" value="LUAS TANAH (M²)" className="text-[9pt] font-semibold text-gray-500" />
                                <TextInput id="luas" className="text-[11pt]" value={data.luas} onChange={(e) => setData('luas', e.target.value)} required placeholder="0.00" />
                                <InputError message={errors.luas} className="mt-1 text-[9pt] font-bold" />
                            </div>
                            <div className="space-y-1">
                                <InputLabel htmlFor="hak_tanah" value="STATUS HAK" className="text-[9pt] font-semibold text-gray-500" />
                                <TextInput id="hak_tanah" className="text-[11pt] uppercase" value={data.hak_tanah} onChange={(e) => setData('hak_tanah', e.target.value)} required placeholder="MISAL: HAK PAKAI" />
                            </div>
                            <div className="space-y-1">
                                <InputLabel htmlFor="penggunaan" value="TUJUAN PENGGUNAAN" className="text-[9pt] font-semibold text-gray-500" />
                                <TextInput id="penggunaan" className="text-[11pt] uppercase" value={data.penggunaan} onChange={(e) => setData('penggunaan', e.target.value)} required placeholder="CONTOH: GEDUNG SEKOLAH" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="letak_alamat" value="LOKASI / ALAMAT LENGKAP" className="text-[9pt] font-semibold text-gray-500" />
                                <textarea
                                    id="letak_alamat"
                                    className="w-full px-3 rounded-md border-gray-300 bg-white py-2 text-[9pt] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm"
                                    rows={3}
                                    value={data.letak_alamat}
                                    onChange={(e) => setData('letak_alamat', e.target.value)}
                                    required
                                    placeholder="MASUKKAN ALAMAT LOKASI TANAH SECARA LENGKAP..."
                                />
                            </div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <InputLabel value="TGL SERTIFIKAT" className="text-[9pt] font-semibold text-gray-500" />
                                        <ModernDatePicker value={data.tanggal_sertifikat} onChange={(date) => setData('tanggal_sertifikat', date)} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel value="NO. SERTIFIKAT" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput className="text-[9pt] uppercase" value={data.nomor_sertifikat} onChange={(e) => setData('nomor_sertifikat', e.target.value)} placeholder="NO..." />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <SearchableSelect
                                        label="KETERKAITAN DATA RUANG (OPTS)"
                                        isMulti={true}
                                        value={data.ruangan_id}
                                        onChange={(val) => setData('ruangan_id', val)}
                                        options={ruangans.map(r => ({ value: r.id, label: `${r.kode_ruangan} - ${r.nama_ruangan}` }))}
                                        placeholder="-- PILIH RUANG JIKA ADA --"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                             <SearchableSelect
                                label="STATUS KOMPTABEL (KLASIFIKASI BMD)"
                                value={data.kode_komptabel}
                                onChange={(val) => setData('kode_komptabel', val as string)}
                                options={[
                                    { value: '01', label: '01 - INTRAKOMPTABEL (MODAL)' },
                                    { value: '02', label: '02 - EKSTRAKOMPTABEL (NON-MODAL)' },
                                ]}
                            />
                            <p className="text-[9pt] text-indigo-500 mt-2 font-semibold italic opacity-80">* Berpengaruh pada segmen ke-2 kode lokasi BMD sesuai Permendagri 108/2016.</p>
                        </div>

                    <div className="group/field">
                        <InputLabel htmlFor="keterangan" value="CATATAN / KETERANGAN TAMBAHAN" className="mb-1 text-[9pt] font-semibold text-gray-500" />
                        <textarea
                            id="keterangan"
                            className="w-full px-4 rounded-md border-gray-300 bg-white py-2 font-medium text-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-[9pt] outline-none resize-none"
                            rows={2}
                            value={data.keterangan || ''}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="TAMBAHKAN INFO PENDUKUNG JIKA DIPERLUKAN..."
                        />
                    </div>
                </div>
            </div>
            </FormModal>

            {/* Detail Modal */}
            <FormModal
                show={isDetailModalOpen}
                onClose={closeDetailModal}
                title="Detail Informasi Aset"
                subtitle="Kartu Inventaris Barang — KIB A Tanah"
                icon={<Icons.Eye className="w-5 h-5" />}
                accentColor="indigo"
                headerVariant="gradient"
                maxWidth="3xl"
                bodyClassName="text-[9pt]"
                footer={
                    <div className="flex justify-end gap-3">
                        <PrimaryButton onClick={() => {
                            closeDetailModal();
                            openModal(selectedItemForDetail!);
                        }} className="!bg-indigo-600 hover:!bg-indigo-700">
                            Edit Data
                        </PrimaryButton>
                        <SecondaryButton onClick={closeDetailModal}>Tutup</SecondaryButton>
                    </div>
                }
            >
                {selectedItemForDetail && (
                    <div className="space-y-8 py-2">
                        {/* Section 1: Identitas Produk */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10pt] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 leading-none">Nama Barang</p>
                                    <p className="text-[11pt] font-black text-gray-900 leading-tight border-l-4 border-indigo-500 pl-4">{selectedItemForDetail.nama_barang}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100/50">
                                        <p className="text-[9pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedItemForDetail.kondisi === 'Baik' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        <span className="text-[9pt] font-black text-gray-700 uppercase">{selectedItemForDetail.kondisi}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100/50">
                                        <p className="text-[8pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Perolehan</p>
                                        <span className="text-[9pt] font-black text-gray-700">{selectedItemForDetail.tanggal_perolehan}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100/30 flex flex-col gap-3">
                                    <div>
                                        <p className="text-[9pt] font-black text-indigo-400 uppercase tracking-widest mb-1">Kode Lokasi BMD</p>
                                        <code className="text-[10pt] font-black text-indigo-700 bg-indigo-100/50 px-3 py-1 rounded-lg block w-fit border border-indigo-200/50">{selectedItemForDetail.kode_lokasi_full}</code>
                                    </div>
                                    <div>
                                        <p className="text-[9pt] font-black text-indigo-400 uppercase tracking-widest mb-1">Kode Barang BMD</p>
                                        <code className="text-[10pt] font-black text-indigo-700 bg-indigo-100/50 px-3 py-1 rounded-lg block w-fit border border-indigo-200/50">{selectedItemForDetail.kode_barang_full}</code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Spesifikasi Tanah */}
                        <div className="p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 pointer-events-none">
                                <Icons.Map className="w-32 h-32" />
                            </div>
                            
                            <div className="col-span-2">
                                <p className="text-[9pt] font-black text-gray-400 uppercase tracking-widest mb-1">Lokasi / Alamat</p>
                                <p className="text-[9pt] font-bold text-gray-700 leading-relaxed uppercase">{selectedItemForDetail.kib_a?.letak_alamat || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[8pt] font-black text-gray-400 uppercase tracking-widest mb-1">Luas</p>
                                <p className="text-[11pt] font-black text-indigo-600">{formatLuas(selectedItemForDetail.kib_a?.luas)} m²</p>
                            </div>
                            <div>
                                <p className="text-[8pt] font-black text-gray-400 uppercase tracking-widest mb-1">Hak Tanah</p>
                                <p className="text-[9pt] font-black text-gray-700 uppercase">{selectedItemForDetail.kib_a?.hak_tanah || '-'}</p>
                            </div>
                        </div>

                        {/* Section 3: Legalitas & Nilai */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h5 className="text-[10pt] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Administrasi</h5>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-[8pt] text-gray-400 font-bold uppercase mb-0.5">Nomor Sertifikat</p>
                                        <p className="text-[9pt] font-black text-gray-800 uppercase tracking-wider">{selectedItemForDetail.kib_a?.nomor_sertifikat || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8pt] text-gray-400 font-bold uppercase mb-0.5">Tujuan Penggunaan</p>
                                        <p className="text-[9pt] font-bold text-gray-800 uppercase">{selectedItemForDetail.kib_a?.penggunaan || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-[10pt] font-black text-emerald-400 uppercase tracking-[0.2em] border-b border-emerald-50 pb-2">Nilai & Asal Usul</h5>
                                <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[8pt] text-emerald-600 font-black uppercase">Harga Perolehan</p>
                                        <p className="text-[12pt] font-black text-emerald-700 tracking-tight">{formatRupiah(selectedItemForDetail.harga)}</p>
                                    </div>
                                    <div className="pt-2 border-t border-emerald-100/50 flex items-center justify-between">
                                        <p className="text-[8pt] text-emerald-600/70 font-bold uppercase tracking-wider">Asal Usul</p>
                                        <p className="text-[9pt] font-black text-emerald-800 uppercase">{selectedItemForDetail.asal_usul || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedItemForDetail.keterangan && (
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <p className="text-[8pt] text-gray-400 font-black uppercase tracking-widest mb-2">Keterangan Tambahan</p>
                                <p className="text-[9pt] text-gray-600 italic leading-relaxed">"{selectedItemForDetail.keterangan}"</p>
                            </div>
                        )}
                    </div>
                )}
            </FormModal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Aset Tanah"
                message="Data yang dihapus akan hilang dari pencatatan inventaris utama. Apakah Anda yakin ingin melanjutkan?"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
