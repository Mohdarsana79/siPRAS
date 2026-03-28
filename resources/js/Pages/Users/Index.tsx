import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SearchableSelect from '@/Components/SearchableSelect';
import { Transition } from '@headlessui/react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    users: User[];
}

const Icons = {
    UserPlus: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg>
    ),
    Edit: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    ),
    ChevronRight: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
    ),
    Users: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
};

export default function UserIndex({ users }: Props) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [confirmingUserCreation, setConfirmingUserCreation] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: users.length,
            admin: users.filter(u => u.role === 'administrator').length,
            staff: users.filter(u => u.role === 'guru / Staf').length,
            others: users.filter(u => !['administrator', 'guru / Staf'].includes(u.role)).length
        };
    }, [users]);

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setConfirmingUserCreation(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            username: user.username || '',
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role,
        });
        clearErrors();
        setConfirmingUserCreation(true);
    };

    const closeModal = () => {
        setConfirmingUserCreation(false);
        setEditingUser(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const confirmUserDeletion = (user: User) => {
        setUserToDelete(user);
        setConfirmingUserDeletion(true);
    };

    const deleteUser = () => {
        if (userToDelete) {
            destroy(route('users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setConfirmingUserDeletion(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const getRoleBadge = (role: string) => {
        const base = "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ";
        switch (role) {
            case 'administrator':
                return <span className={base + "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10"}>Administrator</span>;
            case 'kepala sekolah':
                return <span className={base + "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10"}>Kepala Sekolah</span>;
            case 'guru / Staf':
                return <span className={base + "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10"}>Guru / Staf</span>;
            case 'siswa':
                return <span className={base + "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"}>Siswa</span>;
            default:
                return <span className={base + "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-700/10"}>User</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-1">
                            <Icons.Users className="w-4 h-4" />
                            <span>Pengaturan</span>
                            <Icons.ChevronRight className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500 font-normal">Manajemen Pengguna</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-700">Manajemen Pengguna</h2>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="max-w-7xl mx-auto space-y-6 pb-12 py-6 sm:px-6 lg:px-8">
                {/* Stats Grid - Responsive widths */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                        { label: 'Total User', value: stats.total, color: 'indigo', icon: (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                        { label: 'Admin', value: stats.admin, color: 'rose', icon: (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                        { label: 'Guru/Staf', value: stats.staff, color: 'emerald', icon: (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                        { label: 'Others', value: stats.others, color: 'blue', icon: (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 shrink-0`}>
                                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{item.label}</p>
                                <p className="text-lg sm:text-2xl font-black text-gray-900">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Filter Area */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                        <div className="relative group max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama, email, atau role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3 self-start md:self-auto uppercase tracking-widest">
                            <div className="text-[10px] font-black text-gray-400 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center h-[42px] tabular-nums">
                                {filteredUsers.length} PERSONIL
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-100 h-[42px]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden sm:inline">Tambah Pengguna</span>
                                <span className="sm:hidden">Tambah</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/30">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pengguna</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hak Akses</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-indigo-50/30 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-white text-indigo-600 flex items-center justify-center font-black text-lg shrink-0 uppercase border border-indigo-100/50 shadow-sm group-hover:scale-110 transition-transform">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{user.name}</div>
                                                    <div className="text-[11px] text-gray-500 truncate font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 transition-transform">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Edit Pengguna"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmUserDeletion(user)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Hapus Pengguna"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest italic">Personel Tidak Ditemukan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card List View */}
                    <div className="lg:hidden divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <div key={user.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0 uppercase border border-indigo-100/50 shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-gray-900 truncate text-[13px] uppercase tracking-tight">{user.name}</div>
                                        <div className="text-[10px] text-gray-500 truncate font-medium">{user.email}</div>
                                        <div className="mt-1.5">{getRoleBadge(user.role)}</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <button onClick={() => openEditModal(user)} className="p-2.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => confirmUserDeletion(user)} className="p-2.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest italic">Tidak ada personel</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Colorful Modal - Add / Edit */}
            <Modal show={confirmingUserCreation} onClose={closeModal} maxWidth="2xl">
                <div className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem]">
                    {/* Artistic Header */}
                    <div className={`px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden ${editingUser ? 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800' : 'bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700'}`}>
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
                        
                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-5 shadow-2xl relative z-10">
                            {editingUser ? <Icons.Edit className="w-8 h-8 text-white" /> : <Icons.UserPlus className="w-8 h-8 text-white" />}
                        </div>
                        
                        <h3 className="text-2xl font-black text-white tracking-tight relative z-10 uppercase">
                            {editingUser ? 'UPDATE PERSONIL' : 'REGISTRASI PERSONIL'}
                        </h3>
                        <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 relative z-10">
                            Manajemen Hak Akses & Profil Pengguna
                        </p>
                    </div>

                    <form onSubmit={submit} className="px-8 pb-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-20 pt-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                    <div className="w-6 h-px bg-indigo-100"></div> Identitas Utama
                                </h4>
                                
                                <div className="group/field">
                                    <InputLabel htmlFor="name" value="NAMA LENGKAP" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-5 rounded-2xl border-gray-100 bg-gray-50 py-4 font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm uppercase placeholder:text-gray-300"
                                        required
                                        placeholder="NAMA PERSONIL..."
                                    />
                                    <InputError message={errors.name} className="mt-2 text-[10px] font-bold" />
                                </div>

                                <div className="group/field">
                                    <InputLabel htmlFor="username" value="USERNAME" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput
                                        id="username"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full px-5 rounded-2xl border-gray-100 bg-gray-50 py-4 font-bold text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm placeholder:text-gray-300"
                                        required
                                        placeholder="USER ID..."
                                    />
                                    <InputError message={errors.username} className="mt-2 text-[10px] font-bold" />
                                </div>

                                <div className="group/field">
                                    <InputLabel htmlFor="email" value="ALAMAT EMAIL" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-5 rounded-2xl border-gray-100 bg-gray-50 py-4 font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm placeholder:text-gray-300"
                                        required
                                        placeholder="EMAIL@INSTANSI.COM..."
                                    />
                                    <InputError message={errors.email} className="mt-2 text-[10px] font-bold" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                    <div className="w-6 h-px bg-indigo-100"></div> Keamanan & Akses
                                </h4>

                                <div className="group/field">
                                    <SearchableSelect
                                        label="HAK AKSES / ROLE"
                                        value={data.role}
                                        onChange={(val) => setData('role', val as string)}
                                        options={[
                                            { value: 'administrator', label: 'ADMINISTRATOR' },
                                            { value: 'kepala sekolah', label: 'KEPALA SEKOLAH' },
                                            { value: 'guru / Staf', label: 'GURU / STAF' },
                                            { value: 'siswa', label: 'SISWA' },
                                            { value: 'user', label: 'USER UMUM' },
                                        ]}
                                        error={errors.role}
                                        required
                                    />
                                </div>

                                <div className="group/field">
                                    <InputLabel htmlFor="password" value={editingUser ? "GANTI PASSWORD (OPSIONAL)" : "PASSWORD"} className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-5 rounded-2xl border-gray-100 bg-gray-50 py-4 font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm placeholder:text-gray-400"
                                        required={!editingUser}
                                        placeholder="********"
                                    />
                                    <InputError message={errors.password} className="mt-2 text-[10px] font-bold" />
                                </div>

                                <div className="group/field">
                                    <InputLabel htmlFor="password_confirmation" value="KONFIRMASI PASSWORD" className="mb-2 ml-1 text-[10px] font-black text-gray-400 tracking-widest" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-5 rounded-2xl border-gray-100 bg-gray-50 py-4 font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm placeholder:text-gray-400"
                                        required={!editingUser}
                                        placeholder="********"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-8">
                            <SecondaryButton onClick={closeModal} className="flex-1 !rounded-2xl !py-4 justify-center !border-none !bg-gray-100 !text-gray-500 font-black uppercase tracking-widest text-[10px] hover:!bg-gray-200 transition-all">
                                BATAL
                            </SecondaryButton>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-[1.5] py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {processing ? 'MEMPROSES...' : (editingUser ? 'SIMPAN PERUBAHAN' : 'REGISTRASI SEKARANG')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Deletion Confirmation Modal */}
            <Modal show={confirmingUserDeletion} onClose={() => setConfirmingUserDeletion(false)} maxWidth="md">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-100/50">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Hapus Pengguna?</h3>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed font-medium">
                        Anda akan menghapus akun <span className="font-black text-gray-900">{userToDelete?.name}</span> secara permanen. Tindakan ini <span className="text-rose-600 font-bold">tidak dapat dibatalkan</span>.
                    </p>
                    <div className="mt-10 flex flex-col gap-3">
                        <button
                            onClick={deleteUser}
                            disabled={processing}
                            className="w-full py-4 bg-rose-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-100"
                        >
                            {processing ? 'MENGHAPUS...' : 'YA, HAPUS PERMANEN'}
                        </button>
                        <SecondaryButton 
                            onClick={() => setConfirmingUserDeletion(false)} 
                            className="w-full !justify-center !rounded-2xl !py-4 !border-none !text-gray-400 font-black uppercase text-[10px] tracking-widest hover:!bg-gray-50"
                        >
                            BATALKAN
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
