import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SearchableSelect from '@/Components/SearchableSelect';

interface Ruangan {
    id: number;
    kode_ruangan: string;
    nama_ruangan: string;
}

interface Props {
    ruangans: Ruangan[];
}

export default function LaporanIndex({ ruangans }: Props) {
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [selectedKib, setSelectedKib] = useState<any>(null);
    const [selectedRuanganId, setSelectedRuanganId] = useState<string>('');
    
    // Print Settings State
    const [printSettings, setPrintSettings] = useState({
        paper_size: 'a4',
        font_size: '10pt',
        orientation: 'landscape'
    });

    // KIBs that support room-based filtering
    const kibsWithRoomFilter = ['B', 'E'];

    const menus = [
        { 
            title: 'Inventaris Induk', 
            subtitle: 'Rekapitulasi Seluruh Aset',
            kib: 'ALL', 
            color: 'from-slate-700 to-slate-900',
            defaultOrientation: 'portrait',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        { 
            title: 'KIB A: Tanah', 
            subtitle: 'Laporan Aset Tanah',
            kib: 'A', 
            color: 'from-blue-600 to-indigo-700',
            defaultOrientation: 'landscape',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        { 
            title: 'KIB B: Peralatan', 
            subtitle: 'Mesin & Alat Angkutan',
            kib: 'B', 
            color: 'from-amber-500 to-orange-700',
            defaultOrientation: 'landscape',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            )
        },
        { 
            title: 'KIB C: Gedung', 
            subtitle: 'Bangunan & Konstruksi Tetap',
            kib: 'C', 
            color: 'from-violet-600 to-purple-800',
            defaultOrientation: 'landscape',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        { 
            title: 'KIB D: Jaringan', 
            subtitle: 'Jalan, Irigasi & Instalasi',
            kib: 'D', 
            color: 'from-emerald-500 to-teal-700',
            defaultOrientation: 'landscape',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        { 
            title: 'KIB E: Aset Lain', 
            subtitle: 'Buku, Seni & Hewan',
            kib: 'E', 
            color: 'from-pink-500 to-rose-700',
            defaultOrientation: 'landscape',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        { 
            title: 'KIB F: Konstruksi', 
            subtitle: 'Pekerjaan Dalam Pengerjaan',
            kib: 'F', 
            color: 'from-sky-500 to-cyan-700',
            defaultOrientation: 'landscape',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
    ];

    const openPrintModal = (menu: any) => {
        setSelectedKib(menu);
        setSelectedRuanganId(''); // reset room selection each time
        setPrintSettings(prev => ({
            ...prev,
            orientation: menu.defaultOrientation
        }));
        setIsPrintModalOpen(true);
    };

    const buildQueryParams = () => {
        const params: Record<string, string> = {
            kib: selectedKib.kib,
            paper_size: printSettings.paper_size,
            font_size: printSettings.font_size,
            orientation: printSettings.orientation,
        };
        if (selectedRuanganId && kibsWithRoomFilter.includes(selectedKib?.kib)) {
            params.ruangan_id = selectedRuanganId;
        }
        return new URLSearchParams(params).toString();
    };

    const handlePrint = () => {
        window.open(`${route('laporan.cetak')}?${buildQueryParams()}`, '_blank');
        setIsPrintModalOpen(false);
    };

    const handleExcel = () => {
        const params: Record<string, string> = { kib: selectedKib.kib };
        if (selectedRuanganId && kibsWithRoomFilter.includes(selectedKib?.kib)) {
            params.ruangan_id = selectedRuanganId;
        }
        window.open(`${route('laporan.excel')}?${new URLSearchParams(params).toString()}`, '_blank');
        setIsPrintModalOpen(false);
    };

    const showRoomFilter = selectedKib && kibsWithRoomFilter.includes(selectedKib.kib);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white tracking-tight">Pusat Laporan Inventaris</h2>}
        >
            <Head title="Cetak Laporan" />

            <div className="py-12 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen transition-colors duration-300">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Pilih Format Laporan</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Klik pada salah satu kategori di bawah untuk mengatur format cetakan dan mengunduh PDF atau Excel.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menus.map((menu, index) => (
                            <div 
                                key={index}
                                onClick={() => openPrintModal(menu)}
                                className={`group relative block overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-95 cursor-pointer`}
                            >
                                <div className={`h-2 w-full bg-gradient-to-r ${menu.color}`} />
                                <div className="p-8">
                                    <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${menu.color} text-white shadow-lg shadow-gray-200 transition-transform duration-500 group-hover:rotate-12`}>
                                        {menu.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{menu.title}</h4>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6">{menu.subtitle}</p>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                            PDF
                                        </div>
                                        {menu.kib !== 'ALL' && (
                                            <>
                                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    Excel
                                                </div>
                                            </>
                                        )}
                                        {kibsWithRoomFilter.includes(menu.kib) && (
                                            <>
                                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                                <div className="flex items-center gap-1.5 text-violet-600 font-bold text-sm">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                    Per Ruangan
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gray-50 dark:bg-gray-700/30 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Print Settings Modal */}
            <Modal show={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} maxWidth="2xl">
                <div className="p-8 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedKib?.color} text-white shadow-lg`}>
                            {selectedKib?.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Pengaturan Cetak</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{selectedKib?.title}</p>
                        </div>
                    </div>

                    <div className="space-y-6">

                        {/* Room Filter — only for KIB B & E */}
                        {showRoomFilter && (
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                                    Filter Ruangan
                                    <span className="ml-2 normal-case font-normal text-gray-400 dark:text-gray-500">(opsional — kosong = semua ruangan)</span>
                                </label>
                                <SearchableSelect
                                    value={selectedRuanganId}
                                    onChange={(val: any) => setSelectedRuanganId(val ?? '')}
                                    options={[
                                        { value: '', label: '— Semua Ruangan —' },
                                        ...ruangans.map((r) => ({
                                            value: String(r.id),
                                            label: r.kode_ruangan
                                                ? `[${r.kode_ruangan}] ${r.nama_ruangan}`
                                                : r.nama_ruangan,
                                        }))
                                    ]}
                                    placeholder="Cari ruangan..."
                                    isClearable
                                />
                                {selectedRuanganId && (
                                    <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Data yang dicetak hanya untuk ruangan yang dipilih.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Paper Size */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Ukuran Kertas</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['a4', 'folio', 'letter', 'legal'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setPrintSettings({ ...printSettings, paper_size: size })}
                                        className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                            printSettings.paper_size === size
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-sm'
                                                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        {size.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Ukuran Font</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['8pt', '9pt', '10pt', '11pt', '12pt'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setPrintSettings({ ...printSettings, font_size: size })}
                                        className={`py-2 rounded-lg border-2 font-bold text-xs transition-all ${
                                            printSettings.font_size === size
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orientation */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Orientasi</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'portrait', label: 'Portrait', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                                    { id: 'landscape', label: 'Landscape', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPrintSettings({ ...printSettings, orientation: opt.id })}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                            printSettings.orientation === opt.id
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-sm'
                                                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={opt.icon} />
                                        </svg>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-3">
                        <SecondaryButton className="flex-1 !rounded-2xl justify-center py-4 text-sm font-bold tracking-widest uppercase" onClick={() => setIsPrintModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="flex-1 !rounded-2xl justify-center py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-indigo-100" onClick={handlePrint}>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            PDF
                        </PrimaryButton>
                        {selectedKib?.kib !== 'ALL' && (
                            <button
                                onClick={handleExcel}
                                className="flex-1 inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-emerald-100 transition-all"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Excel
                            </button>
                        )}
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
