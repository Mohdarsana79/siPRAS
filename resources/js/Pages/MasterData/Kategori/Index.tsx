import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/Components/Modal';
import FormModal from '@/Components/FormModal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmationModal from '@/Components/ConfirmationModal';
import Pagination from '@/Components/Pagination';
import SearchableSelect from '@/Components/SearchableSelect';

interface Objek {
    id: number;
    kode_kelompok: string;
    kode_jenis: string;
    kode_objek: string;
    nama_objek: string;
}

interface RincianObjek {
    id: number;
    master_objek_id: number;
    kode_rincian_objek: string;
    nama_rincian_objek: string;
    objek?: Objek;
}

interface Kategori {
    id: number;
    master_rincian_objek_id: number;
    kode_sub_rincian_objek: string;
    nama_kategori: string;
    tipe_kib: string;
    rincian_objek?: RincianObjek;
    kode_barang?: string; // Virtual from model
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface Props {
    objeks: Objek[];
    rincianObjeks: RincianObjek[];
    kategoris: PaginatedData<Kategori>;
    filters: { search?: string };
    kelompokMap: Record<string, string>;
    jenisMap: Record<string, string>;
    jenisToKib: Record<string, string>;
    flash: { success: string | null; error: string | null };
}

const KIB_COLORS: Record<string, string> = {
    A: 'bg-blue-50 text-blue-700 border-blue-200',
    B: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    C: 'bg-violet-50 text-violet-700 border-violet-200',
    D: 'bg-purple-50 text-purple-700 border-purple-200',
    E: 'bg-teal-50 text-teal-700 border-teal-200',
    F: 'bg-pink-50 text-pink-700 border-pink-200',
};

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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
    ),
    Search: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    Info: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    ),
    Layers: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    ),
    GitBranch: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
    )
};

function KodeInput({
    id, label, value, onChange, error, hint, maxLength = 2
}: {
    id: string; label: string; value: string;
    onChange: (val: string) => void; error?: string; hint?: string; maxLength?: number;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-[10px] font-black text-gray-500 tracking-widest uppercase">{label}</label>
            <input
                id={id}
                type="text"
                maxLength={maxLength}
                value={value}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, maxLength);
                    onChange(val);
                }}
                className="w-full text-center text-lg font-black text-gray-800 border border-gray-200 rounded-xl py-3 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all tracking-widest"
                placeholder={Array(maxLength).fill('X').join('')}
            />
            {hint && <p className="text-[9px] text-gray-400 text-center">{hint}</p>}
            {error && <p className="text-[10px] text-rose-500 font-bold">{error}</p>}
        </div>
    );
}

export default function Index({ objeks, rincianObjeks, kategoris, filters, kelompokMap, jenisMap, jenisToKib, flash }: Props) {
    const [activeTab, setActiveTab] = useState<'kategori' | 'objek' | 'rincian'>('kategori');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Common Modals State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

    // Form Objek (Level 4)
    const formObjek = useForm({
        kode_kelompok: '3',
        kode_jenis: '1',
        kode_objek: '',
        nama_objek: '',
    });

    // Form Rincian Objek (Level 5)
    const formRincian = useForm({
        master_objek_id: '',
        kode_rincian_objek: '',
        nama_rincian_objek: '',
    });

    // Form Kategori (Level 6)
    const formKategori = useForm({
        master_rincian_objek_id: '',
        kode_sub_rincian_objek: '',
        nama_kategori: '',
        tipe_kib: '',
    });

    // Handle Search
    useEffect(() => {
        const t = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('master-kategori.index'), { search: searchTerm }, {
                    preserveState: true, replace: true
                });
            }
        }, 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    useEffect(() => {
        if (formKategori.errors.kode_sub_rincian_objek) {
            setIsDuplicateModalOpen(true);
        }
    }, [formKategori.errors.kode_sub_rincian_objek]);

    const openCreateModal = () => {
        setIsEditing(false);
        setEditingId(null);
        if (activeTab === 'objek') { formObjek.reset(); formObjek.clearErrors(); }
        if (activeTab === 'rincian') { formRincian.reset(); formRincian.clearErrors(); }
        if (activeTab === 'kategori') { formKategori.reset(); formKategori.clearErrors(); }
        setIsFormModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setIsEditing(true);
        setEditingId(item.id);
        if (activeTab === 'objek') {
            formObjek.setData({
                kode_kelompok: item.kode_kelompok,
                kode_jenis: item.kode_jenis,
                kode_objek: item.kode_objek,
                nama_objek: item.nama_objek,
            });
            formObjek.clearErrors();
        } else if (activeTab === 'rincian') {
            formRincian.setData({
                master_objek_id: item.master_objek_id,
                kode_rincian_objek: item.kode_rincian_objek,
                nama_rincian_objek: item.nama_rincian_objek,
            });
            formRincian.clearErrors();
        } else {
            formKategori.setData({
                master_rincian_objek_id: item.master_rincian_objek_id,
                kode_sub_rincian_objek: item.kode_sub_rincian_objek,
                nama_kategori: item.nama_kategori,
                tipe_kib: item.tipe_kib,
            });
            formKategori.clearErrors();
        }
        setIsFormModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'objek') {
            if (isEditing && editingId) formObjek.put(route('master-objek.update', editingId), { onSuccess: () => setIsFormModalOpen(false) });
            else formObjek.post(route('master-objek.store'), { onSuccess: () => setIsFormModalOpen(false) });
        } else if (activeTab === 'rincian') {
            if (isEditing && editingId) formRincian.put(route('master-rincian-objek.update', editingId), { onSuccess: () => setIsFormModalOpen(false) });
            else formRincian.post(route('master-rincian-objek.store'), { onSuccess: () => setIsFormModalOpen(false) });
        } else {
            if (isEditing && editingId) formKategori.put(route('master-kategori.update', editingId), { onSuccess: () => setIsFormModalOpen(false) });
            else formKategori.post(route('master-kategori.store'), { onSuccess: () => setIsFormModalOpen(false) });
        }
    };

    const confirmDelete = (id: number) => {
        setSelectedDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedDeleteId) return;
        if (activeTab === 'objek') router.delete(route('master-objek.destroy', selectedDeleteId), { onSuccess: () => setIsDeleteModalOpen(false) });
        else if (activeTab === 'rincian') router.delete(route('master-rincian-objek.destroy', selectedDeleteId), { onSuccess: () => setIsDeleteModalOpen(false) });
        else router.delete(route('master-kategori.destroy', selectedDeleteId), { onSuccess: () => setIsDeleteModalOpen(false) });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hirarki Kategori Barang</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Permendagri No. 108 Tahun 2016 (Level 4, 5, dan 6)</p>
                    </div>
                </div>
            }
        >
            <Head title="Master Kategori Berjenjang" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
                
                {/* Tabs Navigation */}
                <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm w-fit">
                    <button onClick={() => setActiveTab('kategori')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'kategori' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Icons.Category className="w-4 h-4" />
                        LEVEL 6 - KATEGORI
                    </button>
                    <button onClick={() => setActiveTab('rincian')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'rincian' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Icons.GitBranch className="w-4 h-4" />
                        LEVEL 5 - RINCIAN
                    </button>
                    <button onClick={() => setActiveTab('objek')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'objek' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Icons.Layers className="w-4 h-4" />
                        LEVEL 4 - OBJEK
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Icons.Search className="w-4 h-4" />
                        </div>
                        <TextInput
                            type="text"
                            className="block w-full pl-10 pr-4 py-2 text-sm rounded-xl border-gray-200 bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium"
                            placeholder="Pencarian universal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <PrimaryButton onClick={openCreateModal} className="!rounded-xl !py-2.5 px-5 flex items-center gap-2 !bg-rose-600 hover:!bg-rose-700 shadow-sm transition-all justify-center whitespace-nowrap !text-xs">
                        <Icons.Plus className="w-4 h-4" />
                        <span>TAMBAH {activeTab === 'objek' ? 'OBJEK' : (activeTab === 'rincian' ? 'RINCIAN' : 'KATEGORI')}</span>
                    </PrimaryButton>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            {activeTab === 'objek' && (
                                <tr>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Kelompok</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Kode Jenis</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Kode Objek</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Nama Objek</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Aksi</th>
                                </tr>
                            )}
                            {activeTab === 'rincian' && (
                                <tr>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Parent Objek</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Kode Rincian</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Nama Rincian Objek</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Aksi</th>
                                </tr>
                            )}
                            {activeTab === 'kategori' && (
                                <tr>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Nama Kategori (Level 6)</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Kode Barang</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">KIB</th>
                                    <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Aksi</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activeTab === 'objek' && objeks.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 group transition-all">
                                    <td className="px-6 py-4 font-black text-gray-400">{item.kode_kelompok} ({kelompokMap[item.kode_kelompok] || '?'})</td>
                                    <td className="px-6 py-4 font-black text-indigo-600">{item.kode_jenis} ({jenisMap[item.kode_jenis] || '?'})</td>
                                    <td className="px-6 py-4 font-black text-gray-900">{item.kode_objek}</td>
                                    <td className="px-6 py-4 font-bold text-gray-700 uppercase">{item.nama_objek}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openEditModal(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Icons.Edit className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"><Icons.Trash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activeTab === 'rincian' && rincianObjeks.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 group transition-all">
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{item.objek?.nama_objek}</div>
                                        <div className="text-xs font-black text-indigo-600">OBJ: {item.objek?.kode_objek}</div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-gray-900">{item.kode_rincian_objek}</td>
                                    <td className="px-6 py-4 font-bold text-gray-700 uppercase">{item.nama_rincian_objek}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openEditModal(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Icons.Edit className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"><Icons.Trash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activeTab === 'kategori' && kategoris.data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 group transition-all">
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{item.rincian_objek?.nama_rincian_objek}</div>
                                        <div className="text-sm font-black text-gray-900 uppercase">{item.nama_kategori}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-gray-900 text-emerald-400 rounded-lg text-[11px] font-black font-mono tracking-widest">{item.kode_barang}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${KIB_COLORS[item.tipe_kib] || 'bg-gray-100'}`}>KIB {item.tipe_kib}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openEditModal(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Icons.Edit className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"><Icons.Trash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {activeTab === 'kategori' && (
                        <div className="p-6 border-t border-gray-50">
                            <Pagination links={kategoris.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            <FormModal
                show={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={isEditing ? `Edit ${activeTab.toUpperCase()}` : `Tambah ${activeTab.toUpperCase()}`}
                subtitle={`Level ${activeTab === 'objek' ? '4' : (activeTab === 'rincian' ? '5' : '6')} Permendagri 108`}
                onSubmit={handleSubmit}
                processing={activeTab === 'objek' ? formObjek.processing : (activeTab === 'rincian' ? formRincian.processing : formKategori.processing)}
            >
                <div className="space-y-6">
                    {activeTab === 'objek' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SearchableSelect
                                    label="KELOMPOK (LEVEL 2)"
                                    value={formObjek.data.kode_kelompok}
                                    onChange={(val) => formObjek.setData('kode_kelompok', val as string)}
                                    options={Object.entries(kelompokMap).map(([k, v]) => ({ value: k, label: `${k} - ${v}` }))}
                                    required
                                />
                                <SearchableSelect
                                    label="JENIS (LEVEL 3)"
                                    value={formObjek.data.kode_jenis}
                                    onChange={(val) => formObjek.setData('kode_jenis', val as string)}
                                    options={Object.entries(jenisMap).map(([k, v]) => ({ value: k, label: `${k} - ${v}` }))}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <KodeInput id="kode_objek" label="Kode Objek (XX)" value={formObjek.data.kode_objek} onChange={(val) => formObjek.setData('kode_objek', val)} error={formObjek.errors.kode_objek} />
                                <div className="space-y-1">
                                    <InputLabel value="Nama Objek" className="text-[10px] font-black text-gray-400 uppercase" />
                                    <TextInput value={formObjek.data.nama_objek} onChange={e => formObjek.setData('nama_objek', e.target.value.toUpperCase())} className="w-full" placeholder="ALAT BESAR..." required />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'rincian' && (
                        <>
                            <SearchableSelect
                                label="PILIH OBJEK (LEVEL 4)"
                                value={formRincian.data.master_objek_id}
                                onChange={(val) => formRincian.setData('master_objek_id', val as string)}
                                options={objeks.map(o => ({ value: o.id, label: `(${o.kode_jenis}.${o.kode_objek}) ${o.nama_objek}` }))}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <KodeInput id="kode_rincian" label="Kode Rincian (XX)" value={formRincian.data.kode_rincian_objek} onChange={(val) => formRincian.setData('kode_rincian_objek', val)} error={formRincian.errors.kode_rincian_objek} />
                                <div className="space-y-1">
                                    <InputLabel value="Nama Rincian Objek" className="text-[10px] font-black text-gray-400 uppercase" />
                                    <TextInput value={formRincian.data.nama_rincian_objek} onChange={e => formRincian.setData('nama_rincian_objek', e.target.value.toUpperCase())} className="w-full" placeholder="ALAT BESAR DARAT..." required />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'kategori' && (
                        <>
                            <SearchableSelect
                                label="PILIH RINCIAN OBJEK (LEVEL 5)"
                                value={formKategori.data.master_rincian_objek_id}
                                onChange={(val) => formKategori.setData('master_rincian_objek_id', val as string)}
                                options={rincianObjeks.map(r => ({ value: r.id, label: `(${r.objek?.kode_jenis}.${r.objek?.kode_objek}.${r.kode_rincian_objek}) ${r.nama_rincian_objek}` }))}
                                error={formKategori.errors.master_rincian_objek_id}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <KodeInput id="kode_kategori" label="Kode Kategori (XX)" value={formKategori.data.kode_sub_rincian_objek} onChange={(val) => formKategori.setData('kode_sub_rincian_objek', val)} error={formKategori.errors.kode_sub_rincian_objek} />
                                <div className="space-y-1">
                                    <InputLabel value="Nama Kategori Barang" className="text-[10px] font-black text-gray-400 uppercase" />
                                    <TextInput value={formKategori.data.nama_kategori} onChange={e => formKategori.setData('nama_kategori', e.target.value.toUpperCase())} className="w-full" placeholder="TRAKTOR..." required />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </FormModal>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={`Hapus ${activeTab.toUpperCase()}?`}
                message={`Peringatan: Menghapus data ini akan menghapus semua item yang bergantung di bawahnya. Apakah Anda yakin?`}
            />

            <ConfirmationModal
                show={isDuplicateModalOpen}
                onClose={() => setIsDuplicateModalOpen(false)}
                onConfirm={() => setIsDuplicateModalOpen(false)}
                title="Kode Sudah Digunakan"
                message="Kombinasi kodefikasi ini sudah terdaftar. Silakan gunakan nomor urut lain."
                confirmText="Tutup"
                cancelText=""
            />
        </AuthenticatedLayout>
    );
}
