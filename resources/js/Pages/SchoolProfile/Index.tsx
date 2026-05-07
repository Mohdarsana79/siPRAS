import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import FormModal from '@/Components/FormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

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
    kode_entitas: string | null;
    kode_provinsi: string | null;
    kode_kab_kota: string | null;
    kode_skpd: string | null;
    kode_unit: string | null;
    kode_sub_unit: string | null;
}

interface FormDataType {
    nama_sekolah: string;
    npsn: string;
    kabupaten_kota: string;
    provinsi: string;
    kecamatan: string;
    unor_induk: string;
    alamat: string;
    email_sekolah: string;
    nama_kepala_sekolah: string;
    nip_kepala_sekolah: string;
    nama_pengelola_aset: string;
    nip_pengelola_aset: string;
    logo: File | null;
    logo_daerah: File | null;
    tipe_wilayah: string;
    kode_entitas: string;
    kode_provinsi: string;
    kode_kab_kota: string;
    kode_skpd: string;
    kode_unit: string;
    kode_sub_unit: string;
    _method: string;
}

const Icons = {
    Building: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
    ),
    Mail: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
    MapPin: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    User: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    Edit: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
    ),
    Code: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    ),
    Camera: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    ),
    Trash: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
    )
};

export default function Index({ profile }: { profile: SchoolProfile | null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.logo ? `/storage/${profile.logo}` : null);
    const [previewDaerahUrl, setPreviewDaerahUrl] = useState<string | null>(profile?.logo_daerah ? `/storage/${profile.logo_daerah}` : null);
    const fileInput = useRef<HTMLInputElement>(null);
    const fileDaerahInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<FormDataType>({
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
        logo: null,
        logo_daerah: null,
        tipe_wilayah: profile?.tipe_wilayah || 'kabupaten',
        kode_entitas: profile?.kode_entitas || '12',
        kode_provinsi: profile?.kode_provinsi || '',
        kode_kab_kota: profile?.kode_kab_kota || '',
        kode_skpd: profile?.kode_skpd || '',
        kode_unit: profile?.kode_unit || '',
        kode_sub_unit: profile?.kode_sub_unit || '',
        _method: 'POST',
    });

    const kodeLokasiBmd = `${(data.kode_entitas || '12').padStart(2, '0')}.XX.${(data.kode_provinsi || '00').padStart(2, '0')}.${(data.kode_kab_kota || '00').padStart(2, '0')}.${(data.kode_skpd || '000000').padStart(6, '0')}.${(data.kode_unit || '00001').padStart(5, '0')}.${(data.kode_sub_unit || '00001').padStart(5, '0')}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'logo_daerah') => {
        const file = e.target.files?.[0];
        if (file) {
            // Limit size to 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file maksimal 2 MB');
                e.target.value = '';
                return;
            }

            setData(field, file);
            const reader = new FileReader();
            reader.onloadend = () => field === 'logo' ? setPreviewUrl(reader.result as string) : setPreviewDaerahUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (e: React.MouseEvent, field: 'logo' | 'logo_daerah') => {
        e.stopPropagation();
        setData(field, null);
        if (field === 'logo') {
            setPreviewUrl(null);
            if (fileInput.current) fileInput.current.value = '';
        } else {
            setPreviewDaerahUrl(null);
            if (fileDaerahInput.current) fileDaerahInput.current.value = '';
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('school-profile.update'), {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Profil Instansi</h2>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Identitas Satuan Kerja & BMD</p>
                    </div>
                </div>
            }
        >
            <Head title="Profil Sekolah" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 text-[9pt]">
                
                {/* Identity Highlight Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-gray-50 rounded-xl p-4 flex items-center justify-center border border-gray-100 group-hover:border-indigo-100 transition-colors overflow-hidden">
                            {previewDaerahUrl ? (
                                <img src={previewDaerahUrl} alt="Logo Daerah" className="w-full h-full object-contain" />
                            ) : (
                                <Icons.Building className="w-12 h-12 text-gray-300" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="space-y-0.5">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[8pt] font-black uppercase tracking-widest">NPSN: {profile?.npsn || 'BELUM DISET'}</span>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight">{profile?.nama_sekolah || 'Nama Sekolah Belum Diisi'}</h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Icons.MapPin className="w-3.5 h-3.5 text-rose-500" />
                                <span className="font-bold uppercase">{profile?.kabupaten_kota || 'Kota'}, {profile?.provinsi || 'Provinsi'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Icons.Mail className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="font-bold uppercase tracking-tight">{profile?.email_sekolah || 'email@instansi.go.id'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <PrimaryButton 
                            onClick={() => setIsModalOpen(true)}
                            className="!rounded-xl !py-3 !px-6 !bg-indigo-600 hover:!bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 group transition-all"
                        >
                            <Icons.Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span className="font-black uppercase tracking-widest text-[8pt]">Edit Profil</span>
                        </PrimaryButton>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Card: Pejabat */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <Icons.User className="w-4 h-4" />
                            </div>
                            <h3 className="text-gray-900 font-bold">Pejabat Berwenang</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 font-medium mb-0.5">Kepala Sekolah</p>
                                <p className="text-gray-900 font-semibold leading-tight">{profile?.nama_kepala_sekolah || '-'}</p>
                                <p className="text-gray-500 text-[8pt] font-mono mt-0.5">NIP: {profile?.nip_kepala_sekolah || '-'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-gray-400 font-medium mb-0.5">Pengelola Aset</p>
                                <p className="text-gray-900 font-semibold leading-tight">{profile?.nama_pengelola_aset || '-'}</p>
                                <p className="text-gray-500 text-[8pt] font-mono mt-0.5">NIP: {profile?.nip_pengelola_aset || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card: Wilayah */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Icons.MapPin className="w-4 h-4" />
                            </div>
                            <h3 className="text-gray-900 font-bold">Detail Wilayah</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 font-medium mb-0.5">Kecamatan</p>
                                    <p className="text-gray-900 font-semibold uppercase">{profile?.kecamatan || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-medium mb-0.5">Dinas/Induk</p>
                                    <p className="text-gray-900 font-semibold uppercase leading-tight">{profile?.unor_induk || '-'}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-gray-400 font-medium mb-0.5">Alamat Lengkap</p>
                                <p className="text-gray-900 font-medium leading-normal">{profile?.alamat || 'Belum ada alamat terdaftar.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card: Kode BMD */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                <Icons.Code className="w-4 h-4" />
                            </div>
                            <h3 className="text-gray-900 font-bold">Kode Lokasi BMD</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100 group-hover:bg-indigo-50 transition-colors">
                                <p className="text-indigo-600 font-mono font-bold text-[10pt] tracking-tight break-all">{kodeLokasiBmd}</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div>
                                    <p className="text-gray-400 text-[7pt] font-bold uppercase tracking-tighter">Prov</p>
                                    <p className="text-gray-900 font-semibold">{data.kode_provinsi || '00'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[7pt] font-bold uppercase tracking-tighter">Kab</p>
                                    <p className="text-gray-900 font-semibold">{data.kode_kab_kota || '00'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[7pt] font-bold uppercase tracking-tighter">SKPD</p>
                                    <p className="text-gray-900 font-semibold leading-none">{data.kode_skpd || '00'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[7pt] font-bold uppercase tracking-tighter">Unit</p>
                                    <p className="text-gray-900 font-semibold leading-none">{data.kode_unit || '00'}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="py-1.5 px-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                    <p className="text-[8pt] text-gray-500 font-medium">Regulasi Permendagri 108/2016</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Form Modal */}
            <FormModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update Profil Instansi"
                subtitle="Perbarui Identitas Satuan Kerja & Parameter BMD"
                maxWidth="4xl"
                accentColor="indigo"
                headerVariant="gradient"
                icon={<Icons.Building className="w-5 h-5" />}
                processing={processing}
                onSubmit={submit}
                submitLabel="Simpan Perubahan"
                bodyClassName="text-[9pt]"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-2">
                    {/* Group: Dasar */}
                    <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-[8pt] font-black text-gray-400 uppercase tracking-[0.2em] pb-1.5 border-b border-gray-100">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                            Identitas Dasar
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <InputLabel value="Nama Sekolah/Instansi" className="text-[8pt]" />
                                <TextInput className="w-full bg-gray-50/50 focus:bg-white text-[9pt]" value={data.nama_sekolah} onChange={(e) => setData('nama_sekolah', e.target.value)} required />
                                <InputError message={errors.nama_sekolah} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <InputLabel value="NPSN" className="text-[8pt]" />
                                    <TextInput className="w-full bg-gray-50/50 text-[9pt]" value={data.npsn} onChange={(e) => setData('npsn', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <InputLabel value="Email Instansi" className="text-[8pt]" />
                                    <TextInput type="email" className="w-full bg-gray-50/50 text-[9pt]" value={data.email_sekolah} onChange={(e) => setData('email_sekolah', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Dinas / Unor Induk" className="text-[8pt]" />
                                <TextInput className="w-full bg-gray-50/50 text-[9pt]" value={data.unor_induk} onChange={(e) => setData('unor_induk', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Alamat Lengkap" className="text-[8pt]" />
                                <textarea 
                                    className="w-full rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all border font-medium text-gray-700 min-h-[80px] p-3 text-[9pt] focus:ring-2 focus:ring-indigo-50"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                />
                            </div>
                        </div>

                        <h4 className="flex items-center gap-2 text-[8pt] font-black text-gray-400 uppercase tracking-[0.2em] pt-2 pb-1.5 border-b border-gray-100">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                            Detail Wilayah
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <InputLabel value="Provinsi" className="text-[8pt]" />
                                <TextInput className="w-full bg-gray-50/50 font-bold uppercase text-[9pt]" value={data.provinsi} onChange={(e) => setData('provinsi', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Kabupaten/Kota" className="text-[8pt]" />
                                <TextInput className="w-full bg-gray-50/50 font-bold uppercase text-[9pt]" value={data.kabupaten_kota} onChange={(e) => setData('kabupaten_kota', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Kecamatan" className="text-[8pt]" />
                                <TextInput className="w-full bg-gray-50/50 font-bold uppercase text-[9pt]" value={data.kecamatan} onChange={(e) => setData('kecamatan', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Tipe Wilayah" className="text-[8pt]" />
                                <select 
                                    className="w-full rounded-lg border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-indigo-50 border transition-all text-[9pt] py-1.5"
                                    value={data.tipe_wilayah}
                                    onChange={(e) => setData('tipe_wilayah', e.target.value)}
                                >
                                    <option value="kabupaten">Kabupaten</option>
                                    <option value="kota">Kota</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Group: Digital */}
                    <div className="space-y-8">
                        <h4 className="flex items-center gap-2 text-[8pt] font-black text-gray-400 uppercase tracking-[0.2em] pb-1.5 border-b border-gray-100">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Parameter Kode BMD
                        </h4>
                        
                        <div className="bg-gray-900 rounded-xl p-4 shadow-inner text-center">
                            <p className="text-amber-400 font-mono font-black text-sm tracking-tight break-all">{kodeLokasiBmd}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="space-y-1">
                                <InputLabel value="Provinsi (2 Dig)" className="text-[8pt]" />
                                <TextInput maxLength={2} className="w-full bg-gray-50/50 font-mono text-center font-black text-[9pt]" value={data.kode_provinsi} onChange={(e) => setData('kode_provinsi', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Kab/Kota (2 Dig)" className="text-[8pt]" />
                                <TextInput maxLength={2} className="w-full bg-gray-50/50 font-mono text-center font-black text-[9pt]" value={data.kode_kab_kota} onChange={(e) => setData('kode_kab_kota', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Kepemilikan (2 Dig)" className="text-[8pt]" />
                                <TextInput maxLength={2} className="w-full bg-gray-50/50 font-mono text-center font-black text-[9pt]" value={data.kode_entitas} onChange={(e) => setData('kode_entitas', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                            </div>
                            <div className="space-y-1 pointer-events-none opacity-60">
                                <InputLabel value="Komptabel" className="text-[8pt]" />
                                <TextInput className="w-full bg-gray-200 text-center text-[9pt]" value="XX" readOnly />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <InputLabel value="Kode SKPD / Pengguna Barang (6 Dig)" className="text-[8pt]" />
                                <TextInput maxLength={6} className="w-full bg-gray-50/50 font-mono text-lg text-center font-black text-[9pt]" value={data.kode_skpd} onChange={(e) => setData('kode_skpd', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Kuasa Pengguna (5 Dig)" className="text-[8pt]" />
                                <TextInput maxLength={5} className="w-full bg-gray-50/50 font-mono text-center font-black text-[9pt]" value={data.kode_unit} onChange={(e) => setData('kode_unit', e.target.value.replace(/\D/g, '').slice(0, 5))} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Sub Kuasa (5 Dig)" className="text-[8pt]" />
                                <TextInput maxLength={5} className="w-full bg-gray-50/50 font-mono text-center font-black text-[9pt]" value={data.kode_sub_unit} onChange={(e) => setData('kode_sub_unit', e.target.value.replace(/\D/g, '').slice(0, 5))} />
                            </div>
                        </div>

                        <div className="pt-2 space-y-6">
                             <h4 className="flex items-center gap-2 text-[8pt] font-black text-gray-400 uppercase tracking-[0.2em] pb-1.5 border-b border-gray-100">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Pejabat Berwenang
                            </h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <InputLabel value="Nama Kepala" className="text-[8pt]" />
                                        <TextInput className="w-full bg-gray-50/50 font-bold text-[9pt]" value={data.nama_kepala_sekolah} onChange={(e) => setData('nama_kepala_sekolah', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel value="NIP Kepala" className="text-[8pt]" />
                                        <TextInput className="w-full bg-gray-50/50 font-mono text-[9pt]" value={data.nip_kepala_sekolah} onChange={(e) => setData('nip_kepala_sekolah', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                                    <div className="space-y-1">
                                        <InputLabel value="Pengelola Barang" className="text-[8pt]" />
                                        <TextInput className="w-full bg-gray-50/50 font-bold text-[9pt]" value={data.nama_pengelola_aset} onChange={(e) => setData('nama_pengelola_aset', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel value="NIP Pengelola" className="text-[8pt]" />
                                        <TextInput className="w-full bg-gray-50/50 font-mono text-[9pt]" value={data.nip_pengelola_aset} onChange={(e) => setData('nip_pengelola_aset', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 space-y-4">
                            <h4 className="flex items-center gap-2 text-[8pt] font-black text-gray-400 uppercase tracking-[0.2em] pb-1.5 border-b border-gray-100">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                Logo & Identitas Visual
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <InputLabel value="Logo Sekolah" className="text-center w-full text-[8pt]" />
                                    <div 
                                        onClick={() => fileInput.current?.click()}
                                        className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-200 hover:border-indigo-500 cursor-pointer overflow-hidden flex items-center justify-center relative group"
                                    >
                                        {previewUrl ? (
                                            <>
                                                <img src={previewUrl} className="w-full h-full object-contain p-3" />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => removeFile(e, 'logo')}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg shadow-sm border border-rose-100 transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    title="Hapus Logo"
                                                >
                                                    <Icons.Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        ) : <Icons.Camera className="w-6 h-6 text-gray-300" />}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9pt] uppercase font-bold">Ubah</div>
                                    </div>
                                    <p className="text-[7pt] text-gray-400 text-center">Max. 2MB (Image)</p>
                                    <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Logo Daerah" className="text-center w-full text-[8pt]" />
                                    <div 
                                        onClick={() => fileDaerahInput.current?.click()}
                                        className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-200 hover:border-emerald-500 cursor-pointer overflow-hidden flex items-center justify-center relative group"
                                    >
                                        {previewDaerahUrl ? (
                                            <>
                                                <img src={previewDaerahUrl} className="w-full h-full object-contain p-3" />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => removeFile(e, 'logo_daerah')}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg shadow-sm border border-rose-100 transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    title="Hapus Logo"
                                                >
                                                    <Icons.Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        ) : <Icons.Camera className="w-6 h-6 text-gray-300" />}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9pt] uppercase font-bold">Ubah</div>
                                    </div>
                                    <p className="text-[7pt] text-gray-400 text-center">Max. 2MB (Image)</p>
                                    <input type="file" ref={fileDaerahInput} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo_daerah')} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </FormModal>
        </AuthenticatedLayout>
    );
}
