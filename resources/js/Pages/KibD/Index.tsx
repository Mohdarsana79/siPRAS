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

interface Kategori { id: number; nama_kategori: string; kode_kategori: string; kode_barang: string; }
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
    kode_lokasi_full?: string;
    kode_barang_full?: string;
    kode_komptabel?: string;
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
        kode_komptabel: '01',
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
                kode_komptabel: item.kode_komptabel || '01',
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            reset();
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

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4 text-[9pt]">

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
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[9pt]">Info Dasar</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[9pt]">Dimensi & Konstruksi</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[9pt]">Dokumen</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[9pt]">Perolehan</th>
                                    <th className="px-6 py-4 font-black text-white/90 uppercase tracking-widest text-[9pt] text-right">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.data.map((item) => (
                                    <tr key={item.id} className="group hover:bg-emerald-50/30 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight leading-tight">{item.nama_barang}</span>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50 w-fit">
                                                        {item.kode_lokasi_full}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                                                        {item.kode_barang_full}
                                                    </span>
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

            {/* Form Modal - Add / Edit */}
            <FormModal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditing ? 'Edit Jalan, Irigasi & Jaringan' : 'Tambah Jalan, Irigasi & Jaringan'}
                subtitle="Kartu Inventaris Barang — KIB D"
                icon={isEditing ? <Icons.Edit className="w-5 h-5" /> : <Icons.Plus className="w-5 h-5" />}
                accentColor="indigo"
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
                            <h4 className="text-[10pt] font-bold text-indigo-600 tracking-tight">IDENTITAS ASET</h4>
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
                                    <InputLabel htmlFor="nama_barang" value="NAMA LENGKAP ASET (JALAN/IRIGASI/JARINGAN)" className="text-[9pt] font-semibold text-gray-500" />
                                    <TextInput 
                                        id="nama_barang" 
                                        className="text-[9pt]" 
                                        value={data.nama_barang} 
                                        onChange={(e) => setData('nama_barang', e.target.value.toUpperCase())} 
                                        required 
                                        placeholder="CONTOH: JALAN LINGKUNGAN BLOK A / JARINGAN PIPA..." 
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
                                            placeholder="PEMBELIAN / HIBAH..."
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
                                <SearchableSelect
                                    label="STATUS KOMPTABEL"
                                    value={data.kode_komptabel}
                                    onChange={(val) => setData('kode_komptabel', val as string)}
                                    options={[
                                        { value: '01', label: '01 - INTRAKOMPTABEL' },
                                        { value: '02', label: '02 - EKSTRAKOMPTABEL' },
                                    ]}
                                    error={errors.kode_komptabel}
                                    required
                                />
                            </div>
                        </div>

                    {/* section: Spesifikasi Jalan */}
                    <div className="space-y-5 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                            <h4 className="text-[10pt] font-bold text-indigo-600 tracking-tight uppercase">SPESIFIKASI JALAN, IRIGASI & LOKASI</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <InputLabel htmlFor="konstruksi" value="JENIS KONSTRUKSI" className="text-[9pt] font-semibold text-gray-500" />
                                    <TextInput id="konstruksi" className="text-[9pt]" value={data.konstruksi} onChange={(e) => setData('konstruksi', e.target.value.toUpperCase())} required placeholder="ASPAL / BETON / PIPA PVC..." />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="panjang" value="PANJANG (M)" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput 
                                            id="panjang" 
                                            className="text-[9pt]" 
                                            value={data.panjang} 
                                            onChange={(e) => {
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
                                            }} 
                                            placeholder="0" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="lebar" value="LEBAR (M)" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput 
                                            id="lebar" 
                                            className="text-[9pt]" 
                                            value={data.lebar} 
                                            onChange={(e) => {
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
                                            }} 
                                            placeholder="0" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="luas" value="LUAS (M²)" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput id="luas" className="bg-gray-100 text-[9pt] font-bold cursor-not-allowed" value={data.luas} readOnly placeholder="0" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <InputLabel htmlFor="letak_lokasi" value="ALAMAT LOKASI ASET" className="text-[9pt] font-semibold text-gray-500" />
                                    <textarea
                                        id="letak_lokasi"
                                        className="w-full border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 rounded-2xl py-2.5 text-[9pt] bg-white transition-all min-h-[80px]"
                                        value={data.letak_lokasi}
                                        onChange={(e) => setData('letak_lokasi', e.target.value)}
                                        required
                                        placeholder="TULIS ALAMAT LENGKAP LOKASI ASET..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="dokumen_tanggal" value="TGL DOKUMEN / SERTIFIKAT" className="text-[9pt] font-semibold text-gray-500" />
                                        <ModernDatePicker
                                            id="dokumen_tanggal"
                                            value={data.dokumen_tanggal}
                                            onChange={(date) => setData('dokumen_tanggal', date)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="dokumen_nomor" value="NOMOR DOKUMEN" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput id="dokumen_nomor" className="text-[9pt]" value={data.dokumen_nomor} onChange={(e) => setData('dokumen_nomor', e.target.value.toUpperCase())} placeholder="NO SERTIFIKAT..." />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="status_tanah" value="STATUS TANAH" className="text-[9pt] font-semibold text-gray-500" />
                                        <TextInput id="status_tanah" className="text-[9pt]" value={data.status_tanah} onChange={(e) => setData('status_tanah', e.target.value.toUpperCase())} placeholder="HAK PAKAI / MILIK..." />
                                    </div>
                                    <SearchableSelect
                                        label="RUANGAN (OPSIONAL)"
                                        value={data.ruangan_id}
                                        onChange={(val) => setData('ruangan_id', val)}
                                        options={[
                                            { value: '', label: '-- TIDAK TERHUBUNG RUANG --' },
                                            ...ruangans.map(r => ({ value: r.id, label: `${r.kode_ruangan} - ${r.nama_ruangan}` }))
                                        ]}
                                        error={errors.ruangan_id}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <InputLabel htmlFor="keterangan" value="KETERANGAN TAMBAHAN" className="text-[9pt] font-semibold text-gray-500" />
                                    <textarea
                                        id="keterangan"
                                        className="w-full border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 rounded-2xl py-2.5 text-[9pt] bg-white transition-all min-h-[60px]"
                                        value={data.keterangan || ''}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="CATATAN TAMBAHAN..."
                                    />
                                    <InputError message={errors.keterangan} className="mt-1 text-[9pt] font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* Detail Modal */}
            <FormModal
                show={isDetailModalOpen}
                onClose={closeDetailModal}
                title="Detail Jalan, Irigasi & Jaringan"
                subtitle="Informasi Kartu Inventaris — KIB D"
                maxWidth="4xl"
                accentColor="indigo"
                headerVariant="gradient"
                icon={<Icons.Eye className="w-5 h-5" />}
                footer={
                    <SecondaryButton onClick={closeDetailModal} className="w-full justify-center py-3 !rounded-2xl font-bold bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600 transition-all">
                        Tutup Detail Aset
                    </SecondaryButton>
                }
            >
                {selectedItemForDetail && (
                    <div className="space-y-8 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                                        <h5 className="text-[10pt] font-black text-gray-400 uppercase tracking-[0.2em]">Identifikasi Aset</h5>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9pt] font-bold text-gray-400 uppercase tracking-wider">Nama Barang</span>
                                            <span className="text-[11pt] font-black text-gray-800 leading-tight">{selectedItemForDetail.nama_barang}</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-wider">Kode Lokasi</span>
                                                <span className="text-[10pt] font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50 w-fit">{selectedItemForDetail.kode_lokasi_full}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-wider">Kode Barang</span>
                                                <span className="text-[10pt] font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50 w-fit">{selectedItemForDetail.kode_barang_full}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-wider">Kategori</span>
                                            <span className="text-[9pt] font-bold text-gray-700">{selectedItemForDetail.kategori?.nama_kategori}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-wider">Koneksi Ruang</span>
                                            <span className="text-[9pt] font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 leading-relaxed">
                                                {selectedItemForDetail.ruangan?.nama_ruangan || 'TIDAK TERHUBUNG'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                                        <h5 className="text-[10pt] font-black text-gray-400 uppercase tracking-[0.2em]">Spesifikasi Teknis</h5>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-5 space-y-4">
                                        {[
                                            { label: 'Konstruksi', value: selectedItemForDetail.kib_d?.konstruksi || '-' },
                                            { label: 'Dimensi (P x L)', value: `${selectedItemForDetail.kib_d?.panjang || '0'} m x ${selectedItemForDetail.kib_d?.lebar || '0'} m` },
                                            { label: 'Total Luas', value: `${selectedItemForDetail.kib_d?.luas || '0'} m²` },
                                            { label: 'No. Dokumen', value: selectedItemForDetail.kib_d?.dokumen_nomor || '-' },
                                            { label: 'Status Tanah', value: selectedItemForDetail.kib_d?.status_tanah || '-' },
                                        ].map((d, i) => (
                                            <div key={i} className="flex justify-between items-start group border-b border-gray-100/50 pb-2 last:border-0 last:pb-0">
                                                <span className="text-[7.5pt] font-bold text-gray-400 uppercase pt-0.5">{d.label}</span>
                                                <span className="text-[9pt] font-bold text-gray-700 text-right max-w-[150px]">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <div className="w-1 h-3 bg-emerald-400 rounded-full"></div>
                                        <h5 className="text-[10pt] font-black text-gray-400 uppercase tracking-[0.2em]">Nilai & Asal Usul</h5>
                                    </div>
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
                        </div>

                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                            <span className="text-[7.5pt] font-black text-gray-400 uppercase tracking-widest">Alamat Lokasi Aset</span>
                            <span className="text-[9pt] font-bold text-gray-700 leading-relaxed">{selectedItemForDetail.kib_d?.letak_lokasi}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex-1 min-w-[200px] bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <span className="text-[8pt] font-black text-gray-400 uppercase tracking-widest">Kondisi</span>
                                <span className={`px-4 py-1.5 rounded-xl text-[9pt] font-black uppercase ${
                                    selectedItemForDetail.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 
                                    selectedItemForDetail.kondisi === 'Kurang Baik' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                    {selectedItemForDetail.kondisi}
                                </span>
                            </div>
                            <div className="flex-1 min-w-[200px] bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <span className="text-[8pt] font-black text-gray-400 uppercase tracking-widest">Tgl Perolehan</span>
                                <span className="text-[9pt] font-black text-gray-700">{selectedItemForDetail.tanggal_perolehan}</span>
                            </div>
                        </div>

                        {selectedItemForDetail.keterangan && (
                            <div className="bg-indigo-50/20 p-6 rounded-3xl border border-indigo-100/50">
                                <h6 className="text-[8pt] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Catatan / Keterangan</h6>
                                <p className="text-[9pt] text-gray-600 italic leading-relaxed font-medium">"{selectedItemForDetail.keterangan}"</p>
                            </div>
                        )}
                    </div>
                )}
            </FormModal>

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
