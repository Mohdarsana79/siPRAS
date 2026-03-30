import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';

interface SchoolProfile {
    id: number;
    nama_sekolah: string;
    npsn: string | null;
    kabupaten_kota: string | null;
    provinsi: string | null;
    kecamatan: string | null;
    unor_induk: string | null;
    alamat: string | null;
    email_sekolah: string | null;
    nama_kepala_sekolah: string | null;
    nip_kepala_sekolah: string | null;
    nama_pengelola_aset: string | null;
    nip_pengelola_aset: string | null;
    logo: string | null;
    logo_daerah: string | null;
    tipe_wilayah: string;
}

export default function Index({ profile }: { profile: SchoolProfile | null }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.logo ? `/storage/${profile.logo}` : null);
    const [previewDaerahUrl, setPreviewDaerahUrl] = useState<string | null>(profile?.logo_daerah ? `/storage/${profile.logo_daerah}` : null);
    const fileInput = useRef<HTMLInputElement>(null);
    const fileDaerahInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        nama_sekolah: profile?.nama_sekolah || '',
        npsn: profile?.npsn || '',
        kabupaten_kota: profile?.kabupaten_kota || '',
        provinsi: profile?.provinsi || '',
        kecamatan: profile?.kecamatan || '',
        unor_induk: profile?.unor_induk || '',
        alamat: profile?.alamat || '',
        email_sekolah: profile?.email_sekolah || '',
        nama_kepala_sekolah: profile?.nama_kepala_sekolah || '',
        nip_kepala_sekolah: profile?.nip_kepala_sekolah || '',
        nama_pengelola_aset: profile?.nama_pengelola_aset || '',
        nip_pengelola_aset: profile?.nip_pengelola_aset || '',
        logo: null as File | null,
        logo_daerah: null as File | null,
        tipe_wilayah: profile?.tipe_wilayah || 'kabupaten',
        _method: 'POST',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFileDaerahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo_daerah', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewDaerahUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('school-profile.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Profil Instansi</h2>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
                            <p className="text-sm font-medium uppercase tracking-widest">Manajemen Identitas</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Profil Sekolah" />

            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-20 mt-6">
                
                {/* Hero Banner Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-600 to-indigo-800 rounded-3xl shadow-2xl p-8 sm:p-12 text-white">
                    <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -m-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-40 h-40 bg-white rounded-2xl flex items-center justify-center p-4 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-500">
                                {previewDaerahUrl ? (
                                    <img src={previewDaerahUrl} alt="Logo Daerah" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-indigo-200 flex flex-col items-center gap-2">
                                        <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">Logo Daerah</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-3 flex-1">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm uppercase">
                                {data.nama_sekolah || 'Nama Sekolah'}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/30 tracking-widest shadow-lg">
                                    NPSN: {data.npsn || '-'}
                                </span>
                                <span className="px-4 py-1.5 bg-indigo-500/30 backdrop-blur-md rounded-full text-sm font-bold border border-white/20 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                    {data.provinsi || 'Provinsi'}
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button 
                                onClick={(e) => submit(e)}
                                disabled={processing}
                                className="group relative w-full md:w-auto px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-xl overflow-hidden shadow-white/20 active:scale-95 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest">
                                    {processing ? 'Menyimpan...' : 'Update Data'}
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 h-full w-0 group-hover:w-full transition-all duration-500 ease-out"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left & Middle Column (Form Content) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Identitas Section */}
                        <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 rotate-3 group-hover:rotate-0 transition-transform">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 leading-none tracking-tight">Identitas Dasar</h3>
                                        <p className="text-sm text-gray-400 mt-1 font-medium">Informasi utama satuan pendidikan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                                <div className="md:col-span-2 group/field">
                                    <InputLabel htmlFor="nama_sekolah" value="Nama Sekolah/Instansi" className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 group-focus-within/field:text-indigo-600" />
                                    <TextInput 
                                        id="nama_sekolah" 
                                        className="w-full !rounded-2xl border-gray-100 bg-gray-50 px-5 py-4 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-semibold text-gray-800"
                                        value={data.nama_sekolah}
                                        onChange={(e) => setData('nama_sekolah', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nama_sekolah} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="npsn" value="NPSN" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <TextInput id="npsn" className="w-full !rounded-2xl border-gray-100 bg-gray-50 px-5" value={data.npsn} onChange={(e) => setData('npsn', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="email_sekolah" value="Email Instansi" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <TextInput type="email" id="email_sekolah" className="w-full !rounded-2xl border-gray-100 bg-gray-50 px-5" value={data.email_sekolah} onChange={(e) => setData('email_sekolah', e.target.value)} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <InputLabel htmlFor="unor_induk" value="Unor Induk / Dinas" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <TextInput id="unor_induk" className="w-full !rounded-2xl border-gray-100 bg-gray-50 px-5 py-4" value={data.unor_induk} onChange={(e) => setData('unor_induk', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Personalia Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kepala Sekolah */}
                            <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                <div className="p-6 bg-violet-600/5 border-b border-violet-100 flex items-center gap-4">
                                    <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-100 group-hover:scale-90 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <h3 className="font-black text-gray-900 tracking-tight leading-none uppercase text-sm">Kepala Sekolah</h3>
                                </div>
                                <div className="p-6 space-y-5 mt-2">
                                    <div className="space-y-1.5">
                                        <InputLabel value="Nama Lengkap" className="text-[10px] uppercase font-black text-gray-400 tracking-widest" />
                                        <TextInput className="w-full !rounded-xl border-gray-100 bg-gray-50 font-bold" value={data.nama_kepala_sekolah} onChange={(e) => setData('nama_kepala_sekolah', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel value="NIP" className="text-[10px] uppercase font-black text-gray-400 tracking-widest" />
                                        <TextInput className="w-full !rounded-xl border-gray-100 bg-gray-50 font-medium" value={data.nip_kepala_sekolah} onChange={(e) => setData('nip_kepala_sekolah', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* Pengelola Aset */}
                            <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                <div className="p-6 bg-emerald-600/5 border-b border-emerald-100 flex items-center gap-4">
                                    <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-100 group-hover:scale-90 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <h3 className="font-black text-gray-900 tracking-tight leading-none uppercase text-sm">Pengelola Aset</h3>
                                </div>
                                <div className="p-6 space-y-5 mt-2">
                                    <div className="space-y-1.5">
                                        <InputLabel value="Nama Lengkap" className="text-[10px] uppercase font-black text-gray-400 tracking-widest" />
                                        <TextInput className="w-full !rounded-xl border-gray-100 bg-gray-50 font-bold" value={data.nama_pengelola_aset} onChange={(e) => setData('nama_pengelola_aset', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel value="NIP" className="text-[10px] uppercase font-black text-gray-400 tracking-widest" />
                                        <TextInput className="w-full !rounded-xl border-gray-100 bg-gray-50 font-medium" value={data.nip_pengelola_aset} onChange={(e) => setData('nip_pengelola_aset', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lokasi Section */}
                        <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
                                <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-100 transition-transform">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Wilayah Sekolah</h3>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
                                <div className="space-y-2">
                                    <InputLabel value="Kecamatan" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <TextInput className="w-full !rounded-2xl border-gray-100 bg-gray-50 font-semibold" value={data.kecamatan} onChange={(e) => setData('kecamatan', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Tipe Wilayah" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <select 
                                        className="w-full !rounded-2xl border-gray-100 bg-gray-50 font-semibold text-gray-800 focus:ring-4 focus:ring-indigo-50 border-0 transition-all"
                                        value={data.tipe_wilayah}
                                        onChange={(e) => setData('tipe_wilayah', e.target.value)}
                                    >
                                        <option value="kabupaten">Kabupaten</option>
                                        <option value="kota">Kota</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Kabupaten / Kota" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <TextInput className="w-full !rounded-2xl border-gray-100 bg-gray-50 font-semibold" value={data.kabupaten_kota} onChange={(e) => setData('kabupaten_kota', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Provinsi" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <TextInput className="w-full !rounded-2xl border-gray-100 bg-gray-50 font-semibold" value={data.provinsi} onChange={(e) => setData('provinsi', e.target.value)} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <InputLabel value="Alamat Lengkap" className="text-xs font-bold uppercase tracking-widest text-gray-400" />
                                    <textarea 
                                        className="w-full !rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-medium text-gray-700 min-h-[100px] transition-all border-0 focus:ring-4 focus:ring-indigo-50"
                                        value={data.alamat || ''}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Visual Attributes & Status) */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Logo Sekolah Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6 flex flex-col items-center">
                            <div className="w-full flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Logo Sekolah</h3>
                                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </div>
                            
                            <div 
                                onClick={() => fileInput.current?.click()}
                                className="relative group w-full aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 hover:border-amber-400 overflow-hidden cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-100"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Logo" className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                                        <div className="p-5 bg-white rounded-full shadow-sm">
                                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-amber-500 transition-colors">Tambah Logo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="px-6 py-2 bg-white text-indigo-900 rounded-full text-xs font-black uppercase tracking-widest">Ubah Foto</span>
                                </div>
                            </div>
                            <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleFileChange} />
                            
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">Format: JPG, PNG, WEBP (Max 2MB).<br/>Sangat disarankan logo transparan.</p>
                        </div>

                        {/* Logo Daerah Detail Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest border-b border-gray-50 pb-4">Ganti Logo Daerah</h3>
                            <div className="p-4 bg-indigo-50/50 rounded-2xl flex items-start gap-4">
                                <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">Logo daerah digunakan untuk kop surat resmi dan laporan mutasi aset Pemerintah Daerah.</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => fileDaerahInput.current?.click()}
                                className="w-full py-4 px-6 border-2 border-indigo-100 border-dashed rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Unggah Logo Baru
                            </button>
                            <input type="file" ref={fileDaerahInput} className="hidden" accept="image/*" onChange={handleFileDaerahChange} />
                        </div>

                        {/* Helper Box */}
                        <div className="relative group overflow-hidden bg-slate-900 rounded-3xl shadow-2xl p-8 text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="p-3 bg-amber-400 rounded-2xl w-fit text-slate-900 font-black shadow-lg shadow-amber-400/20">TIP</div>
                                <h4 className="text-lg font-black tracking-tight leading-tight">Keamanan Data</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Gunakan NPSN yang valid sesuai dengan Dapodik untuk memastikan sinkronisasi identitas laporan ke tingkat pusat.</p>
                                
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-out duration-500"
                                    enterFrom="opacity-0 translate-y-4"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-300"
                                    leaveTo="opacity-0 -translate-y-4 shadow-none scale-95"
                                >
                                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 mt-4">
                                        <svg className="w-5 h-5 flex-shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Berhasil Disimpan!</span>
                                    </div>
                                </Transition>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
