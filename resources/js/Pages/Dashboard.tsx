import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Statistik {
    totalAset: number;
    totalNilaiAset: number;
    kondisiAset: { kondisi: string; total: number }[];
    kibAset: { tipe_kib: string; total: number }[];
    peminjamanAktif: number;
    totalBiayaPemeliharaan: number;
}

const Icons = {
    Aset: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
    ),
    Wallet: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
    ),
    Peminjaman: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 17 2 2 6-6" /><path d="m8 14 2 2 6-6" /><path d="m5 11 2 2 6-6" /><path d="M3 10v4a2 2 0 0 0 2 2h3.8" /><path d="M21 10v4a2 2 0 0 1-2 2h-3.8" /></svg>
    ),
    Servis: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
    Chart: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
    ),
    List: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
    )
};

export default function Dashboard({ statistik }: { statistik: Statistik }) {

    // Format nilai penuh (untuk tooltip)
    const formatRupiahFull = (angka: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // Format ringkas: T / M / Jt agar tidak meluber di card
    const formatRupiah = (angka: number): string => {
        if (angka >= 1_000_000_000_000)
            return `Rp ${(angka / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} T`;
        if (angka >= 1_000_000_000)
            return `Rp ${(angka / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`;
        if (angka >= 1_000_000)
            return `Rp ${(angka / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Jt`;
        return formatRupiahFull(angka);
    };

    const getKondisiStyle = (kondisi: string) => {
        if (kondisi === 'Baik') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (kondisi === 'Kurang Baik') return 'bg-amber-50 text-amber-700 border-amber-100';
        return 'bg-rose-50 text-rose-700 border-rose-100';
    };

    const kibNames: Record<string, string> = {
        'A': 'Tanah',
        'B': 'Peralatan & Mesin',
        'C': 'Gedung & Bangunan',
        'D': 'Jalan, Irigasi & Jaringan',
        'E': 'Aset Tetap Lainnya',
        'F': 'Konstruksi Pengerjaan'
    };

    const kibColors: Record<string, string> = {
        'A': 'bg-blue-500',
        'B': 'bg-indigo-500',
        'C': 'bg-violet-500',
        'D': 'bg-purple-500',
        'E': 'bg-teal-500',
        'F': 'bg-pink-500',
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Ringkasan data inventaris dan operasional terkini</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto py-6 space-y-8 pb-12">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Stat Card 1: Total Aset */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 transition-transform group-hover:scale-110">
                            <Icons.Aset className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Aset</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-0.5">{statistik.totalAset}</h3>
                        </div>
                    </div>

                    {/* Stat Card 2: Total Nilai Aset */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 transition-transform group-hover:scale-110 flex-shrink-0">
                            <Icons.Wallet className="w-8 h-8" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nilai Aset</p>
                            <h3
                                className="text-xl font-black text-gray-900 mt-0.5 leading-tight"
                                title={formatRupiahFull(statistik.totalNilaiAset)}
                            >
                                {formatRupiah(statistik.totalNilaiAset)}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate" title={formatRupiahFull(statistik.totalNilaiAset)}>
                                {formatRupiahFull(statistik.totalNilaiAset)}
                            </p>
                        </div>
                    </div>

                    {/* Stat Card 3: Peminjaman Aktif */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 transition-transform group-hover:scale-110">
                            <Icons.Peminjaman className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dipinjam</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-0.5">{statistik.peminjamanAktif}</h3>
                        </div>
                    </div>

                    {/* Stat Card 4: Biaya Servis */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className="p-4 bg-rose-50 rounded-2xl text-rose-600 transition-transform group-hover:scale-110 flex-shrink-0">
                            <Icons.Servis className="w-8 h-8" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biaya Servis</p>
                            <h3
                                className="text-xl font-black text-gray-900 mt-0.5 leading-tight"
                                title={formatRupiahFull(statistik.totalBiayaPemeliharaan)}
                            >
                                {formatRupiah(statistik.totalBiayaPemeliharaan)}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate" title={formatRupiahFull(statistik.totalBiayaPemeliharaan)}>
                                {formatRupiahFull(statistik.totalBiayaPemeliharaan)}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Detailed Charts/Lists Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Kondisi Aset Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Icons.Chart className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Sebaran Kondisi</h3>
                            </div>
                        </div>
                        <div className="p-6 flex-1 space-y-4">
                            {statistik.kondisiAset.length > 0 ? (
                                statistik.kondisiAset.map((item, index) => {
                                    const percentage = statistik.totalAset > 0 ? (item.total / statistik.totalAset) * 100 : 0;
                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getKondisiStyle(item.kondisi)}`}>
                                                        {item.kondisi}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-700">{item.total} Unit</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${item.kondisi === 'Baik' ? 'bg-emerald-500' :
                                                        item.kondisi === 'Kurang Baik' ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Icons.List className="w-12 h-12 mb-2 opacity-20" />
                                    <p className="text-sm font-medium">Belum ada data tercatat</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KIB Distribution Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <Icons.List className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Distribusi KIB</h3>
                            </div>
                        </div>
                        <div className="p-6 flex-1 max-h-[400px] overflow-y-auto no-scrollbar space-y-5">
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((type) => {
                                const found = statistik.kibAset.find(k => k.tipe_kib === type);
                                const count = found ? found.total : 0;
                                const percentage = statistik.totalAset > 0 ? (count / statistik.totalAset) * 100 : 0;

                                return (
                                    <div key={type} className="group">
                                        <div className="flex justify-between items-center mb-1.5 px-1">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${kibColors[type]} text-white flex items-center justify-center text-xs font-black`}>
                                                    {type}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800 leading-none">{kibNames[type]}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Kartu Inventaris {type}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-gray-900 block leading-none">{count}</span>
                                                <span className="text-[10px] text-indigo-500 font-bold">{percentage.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${kibColors[type]} transition-all duration-1000`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href={route('kib-b.index')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all text-center space-y-2 group">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mx-auto group-hover:scale-110 transition-transform">
                            <Icons.Aset className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 block">Daftar Peralatan</span>
                    </Link>
                    <Link href={route('peminjaman.index')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-amber-200 hover:shadow-md transition-all text-center space-y-2 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mx-auto group-hover:scale-110 transition-transform">
                            <Icons.Peminjaman className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 block">Cek Peminjaman</span>
                    </Link>
                    <Link href={route('aset-data.index', { scan: 'true' })} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-200 hover:shadow-md transition-all text-center space-y-2 group">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mx-auto group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-gray-600 block">Scan QR Aset</span>
                    </Link>
                    <Link href={route('laporan.index')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-purple-200 hover:shadow-md transition-all text-center space-y-2 group">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mx-auto group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-gray-600 block">Cetak Laporan</span>
                    </Link>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
