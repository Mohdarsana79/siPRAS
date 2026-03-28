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

interface SumberDana {
    id: number;
    kode: string;
    nama_sumber: string;
}

interface PaginatedSumberDana {
    data: SumberDana[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    total: number;
}

const Icons = {
    Vault: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="12" r="3" /></svg>
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

export default function Index({ sumberDanas, filters }: { sumberDanas: PaginatedSumberDana, filters: { search?: string } }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('master-sumber-dana.index'), { search: searchTerm }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kode: '',
        nama_sumber: '',
    });

    const openModal = (sumberDana?: SumberDana) => {
        clearErrors();
        if (sumberDana) {
            setIsEditing(true);
            setEditingId(sumberDana.id);
            setData({
                kode: sumberDana.kode,
                nama_sumber: sumberDana.nama_sumber,
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
            put(route('master-sumber-dana.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('master-sumber-dana.store'), {
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
            destroy(route('master-sumber-dana.destroy', selectedId), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };



    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Sumber Dana</h2>
                    </div>
                </div>
            }
        >
            <Head title="Master Sumber Dana" />

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
                                className="block w-full pl-10 pr-4 py-2 text-sm rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                placeholder="Cari sumber dana..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <PrimaryButton
                                onClick={() => openModal()}
                                className="!rounded-xl !py-2 px-4 flex items-center gap-2 !bg-emerald-600 hover:!bg-emerald-700 shadow-sm transition-all justify-center whitespace-nowrap !text-xs"
                            >
                                <Icons.Plus className="w-4 h-4" />
                                <span>Tambah Sumber</span>
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-white/90 uppercase tracking-wider text-[11px]">Nama Sumber</th>
                                    <th className="px-6 py-4 font-bold text-white/90 uppercase tracking-wider text-[11px]">Kode Singkatan</th>
                                    <th className="px-6 py-4 font-bold text-white/90 uppercase tracking-wider text-[11px] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sumberDanas.data.map((sumber) => (
                                    <tr key={sumber.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{sumber.nama_sumber}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-mono font-bold">
                                                {sumber.kode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(sumber)}
                                                    className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                >
                                                    <Icons.Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(sumber.id)}
                                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sumberDanas.data.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                            Data tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination Section */}
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm font-medium text-gray-500">
                            Menampilkan <span className="text-gray-900 font-bold">{sumberDanas.data.length}</span> dari <span className="text-gray-900 font-bold">{sumberDanas.total}</span> data
                        </div>
                        <Pagination links={sumberDanas.links} />
                    </div>
                </div>

            </div>

            {/* Premium Colorful Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem]">
                    {/* Artistic Header */}
                    <div className={`px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden ${isEditing ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600' : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600'}`}>
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-5 shadow-2xl relative z-10">
                            {isEditing ? <Icons.Edit className="w-8 h-8 text-white" /> : <Icons.Plus className="w-8 h-8 text-white" />}
                        </div>

                        <h3 className="text-2xl font-black text-white tracking-tight relative z-10">
                            {isEditing ? 'UPDATE SUMBER DANA' : 'TAMBAH SUMBER DANA'}
                        </h3>
                        <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mt-2 relative z-10">
                            {isEditing ? 'Sinkronisasi Asal Anggaran' : 'Registrasi Saluran Pendanaan Baru'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="px-8 pb-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-20 space-y-8 pt-8">
                        <div className="space-y-6">
                            <div className="group/field relative">
                                <InputLabel htmlFor="kode" value="KODE SINGKATAN (CONTOH: BOS, APBD)" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-indigo-500">
                                        <Icons.Plus className="w-4 h-4" />
                                    </div>
                                    <TextInput
                                        id="kode"
                                        className="w-full pl-11 rounded-2xl border-gray-100 bg-gray-50 py-4 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm uppercase placeholder:text-gray-300 tracking-widest"
                                        value={data.kode}
                                        onChange={(e) => setData('kode', e.target.value)}
                                        placeholder="KODE DANA..."
                                        required
                                    />
                                </div>
                                <InputError message={errors.kode} className="mt-2 ml-1 text-[10px] font-bold" />
                            </div>

                            <div className="group/field relative">
                                <InputLabel htmlFor="nama_sumber" value="NAMA LENGKAP SUMBER DANA" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within/field:text-indigo-500">
                                        <Icons.Vault className="w-4 h-4" />
                                    </div>
                                    <TextInput
                                        id="nama_sumber"
                                        className="w-full pl-11 rounded-2xl border-gray-100 bg-gray-50 py-4 font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm placeholder:text-gray-300 tracking-tight"
                                        value={data.nama_sumber}
                                        onChange={(e) => setData('nama_sumber', e.target.value)}
                                        placeholder="MASUKKAN NAMA SUMBER..."
                                        required
                                    />
                                </div>
                                <InputError message={errors.nama_sumber} className="mt-2 ml-1 text-[10px] font-bold" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <SecondaryButton type="button" onClick={closeModal} className="flex-1 !rounded-2xl !py-4 justify-center !border-none !bg-gray-100 !text-gray-500 font-black uppercase tracking-widest text-[10px] hover:!bg-gray-200 transition-all">
                                BATAL
                            </SecondaryButton>
                            <PrimaryButton
                                className={`flex-[1.5] !rounded-2xl !py-4 shadow-xl border-none justify-center ${isEditing ? '!bg-gradient-to-r from-indigo-600 to-violet-700 shadow-indigo-100' : '!bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-100'} hover:-translate-y-1 active:translate-y-0 transition-all`}
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
                title="Hapus Sumber Dana?"
                message="Data yang dihapus mungkin krusial untuk pelaporan aset. Apakah Anda yakin ingin melanjutkan?"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
