import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
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
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileDaerahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo_daerah', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewDaerahUrl(reader.result as string);
            };
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
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Profil Instansi</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola identitas dan data administratif satuan pendidikan</p>
                    </div>
                </div>
            }
        >
            <Head title="Profil Sekolah" />

            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                <form onSubmit={submit} className="space-y-6">
                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* Left Column: Identitas & Personalia */}
                        <div className="xl:col-span-2 space-y-6">
                            
                            {/* Section: Identitas Dasar */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Identitas Dasar</h3>
                                            <p className="text-xs text-gray-500">Informasi utama satuan pendidikan</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <InputLabel htmlFor="nama_sekolah" value="Nama Sekolah/Instansi" className="mb-1.5" />
                                            <TextInput
                                                id="nama_sekolah"
                                                className="w-full rounded-xl border-gray-200 focus:ring-indigo-500"
                                                value={data.nama_sekolah}
                                                onChange={(e) => setData('nama_sekolah', e.target.value)}
                                                placeholder="Contoh: SMA Negeri 1 Jakarta"
                                                required
                                            />
                                            <InputError message={errors.nama_sekolah} className="mt-1" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="npsn" value="NPSN" className="mb-1.5" />
                                            <TextInput
                                                id="npsn"
                                                className="w-full rounded-xl border-gray-200 focus:ring-indigo-500"
                                                value={data.npsn}
                                                onChange={(e) => setData('npsn', e.target.value)}
                                                placeholder="NPSN"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="email_sekolah" value="Email Instansi" className="mb-1.5" />
                                            <TextInput
                                                id="email_sekolah"
                                                type="email"
                                                className="w-full rounded-xl border-gray-200 focus:ring-indigo-500"
                                                value={data.email_sekolah}
                                                onChange={(e) => setData('email_sekolah', e.target.value)}
                                                placeholder="instansi@email.com"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <InputLabel htmlFor="unor_induk" value="Unor Induk / Dinas" className="mb-1.5" />
                                            <TextInput
                                                id="unor_induk"
                                                className="w-full rounded-xl border-gray-200 focus:ring-indigo-500"
                                                value={data.unor_induk}
                                                onChange={(e) => setData('unor_induk', e.target.value)}
                                                placeholder="Nama Dinas Pendidikan / Unit Kerja Atasan"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Penanggung Jawab */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kepala Sekolah */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-gray-900">Kepala Sekolah</h3>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <InputLabel value="Nama Lengkap" className="mb-1.5" />
                                            <TextInput
                                                className="w-full rounded-xl border-gray-200"
                                                value={data.nama_kepala_sekolah}
                                                onChange={(e) => setData('nama_kepala_sekolah', e.target.value)}
                                                placeholder="Nama & Gelar"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="NIP" className="mb-1.5" />
                                            <TextInput
                                                className="w-full rounded-xl border-gray-200"
                                                value={data.nip_kepala_sekolah}
                                                onChange={(e) => setData('nip_kepala_sekolah', e.target.value)}
                                                placeholder="NIP"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pengelola Aset */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-gray-900">Pengelola Aset</h3>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <InputLabel value="Nama Lengkap" className="mb-1.5" />
                                            <TextInput
                                                className="w-full rounded-xl border-gray-200"
                                                value={data.nama_pengelola_aset}
                                                onChange={(e) => setData('nama_pengelola_aset', e.target.value)}
                                                placeholder="Nama & Gelar"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="NIP" className="mb-1.5" />
                                            <TextInput
                                                className="w-full rounded-xl border-gray-200"
                                                value={data.nip_pengelola_aset}
                                                onChange={(e) => setData('nip_pengelola_aset', e.target.value)}
                                                placeholder="NIP"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Logos & Address */}
                        <div className="space-y-6">
                            
                            {/* Section: Logos */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Atribut Visual</h3>
                                
                                {/* Logo Daerah */}
                                <div className="space-y-3">
                                    <InputLabel value="Logo Daerah" className="text-gray-500 font-semibold" />
                                    <div 
                                        onClick={() => fileDaerahInput.current?.click()}
                                        className="relative group aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50 flex items-center justify-center cursor-pointer transition-all overflow-hidden"
                                    >
                                        {previewDaerahUrl ? (
                                            <img src={previewDaerahUrl} alt="Logo Daerah" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span className="text-xs font-medium">Klik untuk pilih logo</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] text-center py-1 hidden group-hover:block uppercase tracking-wider font-bold transition-all">Ganti Foto</div>
                                    </div>
                                    <input type="file" ref={fileDaerahInput} className="hidden" accept="image/*" onChange={handleFileDaerahChange} />
                                    <InputError message={errors.logo_daerah} />
                                </div>

                                {/* Logo Sekolah */}
                                <div className="space-y-3">
                                    <InputLabel value="Logo Sekolah" className="text-gray-500 font-semibold" />
                                    <div 
                                        onClick={() => fileInput.current?.click()}
                                        className="relative group aspect-square max-w-[200px] mx-auto rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 bg-gray-50 flex items-center justify-center cursor-pointer transition-all overflow-hidden"
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Logo Sekolah" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                <span className="text-xs font-medium">Pilih Logo</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] text-center py-1 hidden group-hover:block uppercase tracking-wider font-bold transition-all">Ganti Foto</div>
                                    </div>
                                    <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <InputError message={errors.logo} />
                                </div>
                            </div>

                            {/* Section: Lokasi */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Wilayah Operasional</h3>
                                <div>
                                    <InputLabel value="Kecamatan" className="mb-1.5" />
                                    <TextInput
                                        className="w-full rounded-xl border-gray-200"
                                        value={data.kecamatan}
                                        onChange={(e) => setData('kecamatan', e.target.value)}
                                        placeholder="Kecamatan"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Tipe Wilayah" className="mb-1.5" />
                                    <select
                                        className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        value={data.tipe_wilayah}
                                        onChange={(e) => setData('tipe_wilayah', e.target.value)}
                                    >
                                        <option value="kabupaten">Kabupaten</option>
                                        <option value="kota">Kota</option>
                                    </select>
                                    <InputError message={errors.tipe_wilayah} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel value="Kabupaten / Kota" className="mb-1.5" />
                                    <TextInput
                                        className="w-full rounded-xl border-gray-200"
                                        value={data.kabupaten_kota}
                                        onChange={(e) => setData('kabupaten_kota', e.target.value)}
                                        placeholder="Kabupaten / Kota"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Provinsi" className="mb-1.5" />
                                    <TextInput
                                        className="w-full rounded-xl border-gray-200"
                                        value={data.provinsi}
                                        onChange={(e) => setData('provinsi', e.target.value)}
                                        placeholder="Provinsi"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Alamat Lengkap" className="mb-1.5" />
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        value={data.alamat || ''}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Jl. Nama Jalan No. ..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Action Card */}
                            <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold">Simpan Profil</h3>
                                </div>
                                <p className="text-indigo-100 text-xs leading-relaxed">Pastikan semua data sudah benar. Data ini akan ditampilkan pada kop laporan dan surat-surat resmi.</p>
                                <div className="space-y-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-md active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Update Profil'}
                                    </button>
                                    
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 translate-y-1"
                                        leave="transition ease-in duration-300"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <div className="bg-emerald-500/20 text-emerald-100 text-[10px] font-bold text-center py-2 rounded-lg border border-emerald-500/30 uppercase tracking-widest">
                                            Berhasil Diperbarui!
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
