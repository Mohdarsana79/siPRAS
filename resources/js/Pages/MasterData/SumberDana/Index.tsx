import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import FormModal from '@/Components/FormModal';
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

interface Props {
    sumberDanas: PaginatedSumberDana;
    filters: { search?: string };
    flash: { success: string | null; error: string | null };
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

export default function Index({ sumberDanas, filters, flash }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUsedModalOpen, setIsUsedModalOpen] = useState(false);
    const [usedAssets, setUsedAssets] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        if (flash.error?.startsWith('used:')) {
            setUsedAssets(flash.error.split('used:')[1]);
            setIsUsedModalOpen(true);
        }
    }, [flash.error]);

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
                                {sumberDanas.data.map((sumber: SumberDana) => (
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

            {/* Form Modal - Add / Edit */}
            <FormModal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditing ? 'Update Sumber Dana' : 'Tambah Sumber Dana'}
                subtitle={isEditing ? 'Sinkronisasi Asal Anggaran' : 'Registrasi Saluran Pendanaan Baru'}
                maxWidth="lg"
                accentColor="emerald"
                icon={isEditing ? <Icons.Edit className="w-6 h-6" /> : <Icons.Plus className="w-6 h-6" />}
                processing={processing}
                onSubmit={submit}
                submitLabel={isEditing ? 'Simpan Perubahan' : 'Tambah Sumber Dana'}
            >
                <div className="space-y-6">
                    <div className="space-y-1">
                        <InputLabel htmlFor="kode" value="Kode Singkatan (Contoh: BOS, APBD)" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                        <TextInput
                            id="kode"
                            className="w-full bg-gray-50/50 font-black tracking-widest uppercase"
                            value={data.kode}
                            onChange={(e) => setData('kode', e.target.value)}
                            placeholder="KODE DANA..."
                            required
                        />
                        <InputError message={errors.kode} />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="nama_sumber" value="Nama Lengkap Sumber Dana" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" />
                        <TextInput
                            id="nama_sumber"
                            className="w-full bg-gray-50/50 font-bold"
                            value={data.nama_sumber}
                            onChange={(e) => setData('nama_sumber', e.target.value)}
                            placeholder="Masukkan nama sumber dana..."
                            required
                        />
                        <InputError message={errors.nama_sumber} />
                    </div>
                </div>
            </FormModal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Sumber Dana?"
                message="Data yang dihapus mungkin krusial untuk pelaporan aset. Apakah Anda yakin ingin melanjutkan?"
                processing={processing}
            />

            <ConfirmationModal
                show={isUsedModalOpen}
                onClose={() => setIsUsedModalOpen(false)}
                onConfirm={() => setIsUsedModalOpen(false)}
                title="Gagal Menghapus"
                message={`Data ini tidak dapat dihapus karena masih digunakan oleh: ${usedAssets}. Silakan ubah atau hapus aset yang terkait terlebih dahulu.`}
                confirmText="Tutup"
                cancelText=""
            />
        </AuthenticatedLayout>
    );
}
