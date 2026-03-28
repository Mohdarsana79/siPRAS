import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmationModal from '@/Components/ConfirmationModal';
import Pagination from '@/Components/Pagination';
import SearchableSelect from '@/Components/SearchableSelect';

interface Kategori {
    id: number;
    kode_kategori: string;
    nama_kategori: string;
    tipe_kib: string;
}

interface PaginatedKategoris {
    data: Kategori[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    total: number;
}

const Icons = {
    Category: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
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
    )
};

export default function Index({ kategoris, filters }: { kategoris: PaginatedKategoris, filters: { search?: string } }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('master-kategori.index'), { search: searchTerm }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kode_kategori: '',
        nama_kategori: '',
        tipe_kib: 'A',
    });

    const openModal = (kategori?: Kategori) => {
        clearErrors();
        if (kategori) {
            setIsEditing(true);
            setEditingId(kategori.id);
            setData({
                kode_kategori: kategori.kode_kategori,
                nama_kategori: kategori.nama_kategori,
                tipe_kib: kategori.tipe_kib,
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingId) {
            put(route('master-kategori.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('master-kategori.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedId) {
            destroy(route('master-kategori.destroy', selectedId), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };



    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Master Kategori</h2>
                    </div>
                </div>
            }
        >
            <Head title="Master Kategori" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

                    {/* Toolbar Section */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:max-w-xs group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Icons.Search className="w-4 h-4" />
                            </div>
                            <TextInput
                                type="text"
                                className="block w-full pl-10 pr-4 py-2 text-sm rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                                placeholder="Cari kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <PrimaryButton
                                onClick={() => openModal()}
                                className="!rounded-xl !py-2 px-4 flex items-center gap-2 !bg-rose-600 hover:!bg-rose-700 shadow-sm transition-all justify-center whitespace-nowrap !text-xs"
                            >
                                <Icons.Plus className="w-4 h-4" />
                                <span>Tambah Kategori</span>
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-white/90 uppercase tracking-wider text-[11px]">Nama Kategori</th>
                                    <th className="px-6 py-4 font-semibold text-white/90 uppercase tracking-wider text-[11px]">Kode</th>
                                    <th className="px-6 py-4 font-semibold text-white/90 uppercase tracking-wider text-[11px] hidden md:table-cell">Klasifikasi KIB</th>
                                    <th className="px-6 py-4 font-semibold text-white/90 uppercase tracking-wider text-[11px] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {kategoris.data.map((kategori) => (
                                    <tr key={kategori.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 leading-tight">
                                            {kategori.nama_kategori}
                                            <div className="md:hidden mt-1 inline-flex">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tighter ${kategori.tipe_kib === 'A' ? 'bg-blue-100 text-blue-700' :
                                                    kategori.tipe_kib === 'B' ? 'bg-indigo-100 text-indigo-700' :
                                                        kategori.tipe_kib === 'C' ? 'bg-violet-100 text-violet-700' :
                                                            kategori.tipe_kib === 'D' ? 'bg-purple-100 text-purple-700' :
                                                                kategori.tipe_kib === 'E' ? 'bg-teal-100 text-teal-700' :
                                                                    'bg-pink-100 text-pink-700'
                                                    }`}>KIB {kategori.tipe_kib}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-mono font-bold">
                                                {kategori.kode_kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell font-medium">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${kategori.tipe_kib === 'A' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                kategori.tipe_kib === 'B' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    kategori.tipe_kib === 'C' ? 'bg-violet-50 text-violet-600 border-violet-100' :
                                                        kategori.tipe_kib === 'D' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                            kategori.tipe_kib === 'E' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                                                                'bg-pink-50 text-pink-600 border-pink-100'
                                                }`}>
                                                Kartu Inventaris {kategori.tipe_kib}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(kategori)}
                                                    className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                >
                                                    <Icons.Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(kategori.id)}
                                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {kategoris.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                            Data kategori tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination Section */}
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm font-medium text-gray-500">
                            Menampilkan <span className="text-gray-900 font-bold">{kategoris.data.length}</span> dari <span className="text-gray-900 font-bold">{kategoris.total}</span> data
                        </div>
                        <Pagination links={kategoris.links} />
                    </div>
                </div>

            </div>

            {/* Premium Colorful Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem]">
                    {/* Artistic Header */}
                    <div className={`px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden ${isEditing ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600' : 'bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700'}`}>
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-5 shadow-2xl relative z-10">
                            {isEditing ? <Icons.Edit className="w-8 h-8 text-white" /> : <Icons.Plus className="w-8 h-8 text-white" />}
                        </div>

                        <h3 className="text-2xl font-black text-white tracking-tight relative z-10">
                            {isEditing ? 'UPDATE KATEGORI' : 'TAMBAH KATEGORI'}
                        </h3>
                        <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mt-2 relative z-10">
                            {isEditing ? 'Sinkronisasi Klasifikasi Aset' : 'Registrasi Kategori Baru'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="px-8 pb-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-20 space-y-8 pt-8">
                        <div className="space-y-6">
                            <div className="group/field relative">
                                <InputLabel htmlFor="kode_kategori" value="KODE KATEGORI (MISAL: KIB-01)" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-rose-500">
                                        <Icons.Plus className="w-4 h-4" />
                                    </div>
                                    <TextInput
                                        id="kode_kategori"
                                        className="w-full pl-11 rounded-2xl border-gray-100 bg-gray-50 py-4 font-black text-gray-800 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-sm uppercase placeholder:text-gray-300 tracking-widest"
                                        value={data.kode_kategori}
                                        onChange={(e) => setData('kode_kategori', e.target.value)}
                                        placeholder="KODE..."
                                        required
                                    />
                                </div>
                                <InputError message={errors.kode_kategori} className="mt-2 ml-1 text-[10px] font-bold" />
                            </div>

                            <div className="group/field relative">
                                <InputLabel htmlFor="nama_kategori" value="NAMA LENGKAP KATEGORI" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-rose-500">
                                        <Icons.Category className="w-4 h-4" />
                                    </div>
                                    <TextInput
                                        id="nama_kategori"
                                        className="w-full pl-11 rounded-2xl border-gray-100 bg-gray-50 py-4 font-black text-gray-800 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-sm placeholder:text-gray-300 tracking-tight"
                                        value={data.nama_kategori}
                                        onChange={(e) => setData('nama_kategori', e.target.value)}
                                        placeholder="MASUKKAN NAMA KATEGORI..."
                                        required
                                    />
                                </div>
                                <InputError message={errors.nama_kategori} className="mt-2 ml-1 text-[10px] font-bold" />
                            </div>

                            <SearchableSelect
                                label="KLASIFIKASI JENIS KIB"
                                value={data.tipe_kib}
                                onChange={(val) => setData('tipe_kib', val as string)}
                                options={[
                                    { value: 'A', label: 'KARTU INVENTARIS A - TANAH' },
                                    { value: 'B', label: 'KARTU INVENTARIS B - PERALATAN' },
                                    { value: 'C', label: 'KARTU INVENTARIS C - GEDUNG' },
                                    { value: 'D', label: 'KARTU INVENTARIS D - JALAN/IRIGASI' },
                                    { value: 'E', label: 'KARTU INVENTARIS E - ASET LAIN' },
                                    { value: 'F', label: 'KARTU INVENTARIS F - KONSTRUKSI' },
                                ]}
                                error={errors.tipe_kib}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <SecondaryButton type="button" onClick={closeModal} className="flex-1 !rounded-2xl !py-4 justify-center !border-none !bg-gray-100 !text-gray-500 font-black uppercase tracking-widest text-[10px] hover:!bg-gray-200 transition-all">
                                BATAL
                            </SecondaryButton>
                            <PrimaryButton
                                className={`flex-[1.5] !rounded-2xl !py-4 shadow-xl border-none justify-center ${isEditing ? '!bg-gradient-to-r from-indigo-600 to-violet-700 shadow-indigo-100' : '!bg-gradient-to-r from-rose-600 to-rose-700 shadow-rose-100'} hover:-translate-y-1 active:translate-y-0 transition-all`}
                                disabled={processing}
                            >
                                <span className="font-black text-white tracking-[0.15em] text-[11px] uppercase">
                                    {processing ? 'PROSES...' : (isEditing ? 'SIMPAN PERUBAHAN' : 'TAMBAH DATA')}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Kategori?"
                message="Kategori yang dihapus akan mempengaruhi sinkronisasi data pada KIB terkait. Apakah Anda yakin ingin melanjutkan?"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
