import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import Modal from '@/Components/Modal';
import axios from 'axios';

interface Item {
    id: string;
    nama_barang: string;
    kode_barang: string;
    nomor_register: string;
    kondisi: string;
    tanggal_perolehan: string;
    harga: number;
    kategori?: {
        nama: string;
        tipe_kib: string;
    };
    ruangan?: {
        nama: string;
    };
    sumber_dana?: {
        nama: string;
    };
    [key: string]: any; 
}

interface Props {
    items: Item[];
    filters: {
        kib: string;
    };
    profile: any;
}

export default function Index({ items, filters, profile }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKib, setSelectedKib] = useState(filters.kib || 'ALL');
    
    // Scanner States
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    
    // Print Modal States
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printSettings, setPrintSettings] = useState({ paper: 'a4', orientation: 'portrait' });
    
    // Detail Modal States
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [scannedItem, setScannedItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('scan') === 'true') {
            setIsScannerOpen(true);
        }
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter(item => 
            item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const handleKibChange = (kib: string) => {
        setSelectedKib(kib);
        router.get(route('aset-data.index'), { kib }, { preserveState: true });
    };

    const downloadImage = (
        sourceCanvas: HTMLCanvasElement | null, 
        item: Item, 
        type: 'QR' | 'BARCODE', 
        format: 'png' | 'jpeg' | 'jpg'
    ) => {
        if (!sourceCanvas) return;
        const image = sourceCanvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`, 1.0);
        const link = document.createElement('a');
        link.download = `${type}_${item.kode_barang}.${format}`;
        link.href = image;
        link.click();
    };

    const onScanSuccess = async (decodedText: string) => {
        setIsScannerOpen(false);
        setIsLoading(true);
        try {
            const response = await axios.get(route('aset-data.scan'), { params: { code: decodedText } });
            setScannedItem(response.data);
            setIsDetailOpen(true);
        } catch (error) {
            alert('Aset tidak ditemukan atau barcode tidak valid.');
        } finally {
            setIsLoading(false);
        }
    };

    const kibOptions = [
        { id: 'ALL', label: 'Semua KIB', color: 'from-slate-500 to-slate-600', light: 'bg-slate-50' },
        { id: 'A', label: 'KIB A (Tanah)', color: 'from-blue-500 to-cyan-500', light: 'bg-blue-50' },
        { id: 'B', label: 'KIB B (Peralatan)', color: 'from-indigo-500 to-violet-500', light: 'bg-indigo-50' },
        { id: 'C', label: 'KIB C (Gedung)', color: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50' },
        { id: 'D', label: 'KIB D (Jalan)', color: 'from-amber-500 to-orange-500', light: 'bg-amber-50' },
        { id: 'E', label: 'KIB E (Aset Lain)', color: 'from-teal-500 to-emerald-500', light: 'bg-teal-50' },
        { id: 'F', label: 'KIB F (Konstruksi)', color: 'from-pink-500 to-rose-500', light: 'bg-pink-50' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Data Aset & Labeling" />

            <div className="min-h-screen bg-[#FDFDFF] dark:bg-gray-900 py-4 sm:py-12 px-2 sm:px-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12">
                    <div className="animate-in fade-in slide-in-from-left duration-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 sm:p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l4.58-4.58a2.42 2.42 0 0 0 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
                            </div>
                            <span className="text-[10px] sm:text-sm font-black text-indigo-600 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Smart Inventory</span>
                        </div>
                        <h1 className="text-2xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                            DATA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">ASET</span>
                        </h1>
                        <p className="text-xs sm:text-gray-500 font-medium mt-2 max-w-xl text-gray-400 dark:text-gray-400">Kelola & unduhan label pintar aset sekolah Anda.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-right duration-700">
                        <button 
                            onClick={() => setIsScannerOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-[2rem] text-sm font-black shadow-xl shadow-indigo-200 hover:scale-105 transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7"/></svg>
                            Scan Label Aset
                        </button>
                        <button 
                            onClick={() => setIsPrintModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 px-8 py-4 rounded-[2rem] text-sm font-black transition-all shadow-xl shadow-gray-100/50 hover:-translate-y-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                            Cetak PDF
                        </button>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 mb-8 sm:mb-12 animate-in zoom-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-end">
                        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 ml-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Filter Kategori Aset
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {kibOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleKibChange(opt.id)}
                                            className={`px-6 py-3 rounded-2xl text-[13px] font-black transition-all duration-500 relative overflow-hidden group ${
                                                selectedKib === opt.id 
                                                ? `bg-gradient-to-br ${opt.color} text-white shadow-xl shadow-gray-200 scale-105` 
                                                : 'bg-gray-50 text-gray-500 hover:bg-white dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-indigo-600 hover:shadow-lg'
                                            }`}
                                        >
                                            <span className="relative z-10">{opt.label}</span>
                                            {selectedKib !== opt.id && (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4">
                            <label className="flex items-center gap-2 text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 ml-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Cari Nama / Kode
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Ketik kata kunci pencarian..."
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 dark:text-white border-none rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-gray-300 dark:placeholder:text-gray-500 shadow-inner dark:shadow-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filteredItems.map((item, idx) => (
                        <AssetCard 
                            key={item.id} 
                            item={item} 
                            index={idx} 
                            onDownload={downloadImage} 
                            onView={() => { setScannedItem(item); setIsDetailOpen(true); }}
                        />
                    ))}
                </div>
            </div>

            {/* Scanner Modal */}
            <Modal show={isScannerOpen} onClose={() => setIsScannerOpen(false)} maxWidth="xl">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Scan Aset</h2>
                        <button onClick={() => setIsScannerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <div className="overflow-hidden rounded-[2.5rem] border-4 border-indigo-100 shadow-2xl">
                        <Scanner onScanSuccess={onScanSuccess} active={isScannerOpen} />
                    </div>
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <p className="text-xs font-bold text-indigo-700 leading-relaxed">Pindai kode QR atau Barcode pada stiker aset untuk memverifikasi data inventaris secara instan.</p>
                    </div>
                </div>
            </Modal>

            {/* Print Settings Modal */}
            <Modal show={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} maxWidth="lg">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Pengaturan Cetak</h2>
                            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mt-2 ml-0.5">Label Aset Inventaris</p>
                        </div>
                        <button onClick={() => setIsPrintModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 ml-1">Ukuran Kertas</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'a4', label: 'A4 (Standar)', desc: '210 x 297 mm' },
                                    { id: 'folio', label: 'Folio / F4', desc: '215 x 330 mm' },
                                    { id: 'letter', label: 'Letter', desc: '215 x 279 mm' },
                                    { id: 'legal', label: 'Legal', desc: '215 x 355 mm' }
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPrintSettings({ ...printSettings, paper: p.id })}
                                        className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                                            printSettings.paper === p.id 
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' 
                                            : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-300'
                                        }`}
                                    >
                                        <div className={`text-sm font-black mb-1 ${printSettings.paper === p.id ? 'text-indigo-700' : 'text-gray-700 dark:text-gray-200'}`}>{p.label}</div>
                                        <div className="text-[10px] font-bold text-gray-400">{p.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 ml-1">Orientasi</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'portrait', label: 'Potrait', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2"/></svg> },
                                    { id: 'landscape', label: 'Landscape', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/></svg> }
                                ].map((o) => (
                                    <button
                                        key={o.id}
                                        onClick={() => setPrintSettings({ ...printSettings, orientation: o.id })}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                            printSettings.orientation === o.id 
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100 text-indigo-700' 
                                            : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                                        }`}
                                    >
                                        {o.icon}
                                        <span className="text-sm font-black">{o.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <a 
                                href={route('aset-data.cetak-labels', { 
                                    kib: selectedKib, 
                                    paper: printSettings.paper, 
                                    orientation: printSettings.orientation 
                                })} 
                                target="_blank"
                                onClick={() => setIsPrintModalOpen(true)} // Keep open or close? Let's keep it open for now or close on click? User usually closes after clicking print.
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-5 rounded-[2rem] text-base font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-98"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                                Proses Cetak Label
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Premium Asset Detail Modal */}
            <Modal show={isDetailOpen} onClose={() => setIsDetailOpen(false)} maxWidth="2xl">
                {scannedItem && (
                    <div className="max-h-[90vh] overflow-y-auto no-scrollbar relative bg-[#F8FAFC] dark:bg-gray-800">
                        {/* Header Banner - Responsive Height */}
                        <div className={`h-32 sm:h-40 bg-gradient-to-br ${
                                scannedItem.kategori?.tipe_kib === 'A' ? 'from-blue-600 to-cyan-500' :
                                scannedItem.kategori?.tipe_kib === 'B' ? 'from-indigo-600 to-violet-600' :
                                scannedItem.kategori?.tipe_kib === 'C' ? 'from-emerald-600 to-teal-500' :
                                scannedItem.kategori?.tipe_kib === 'D' ? 'from-amber-600 to-orange-500' :
                                scannedItem.kategori?.tipe_kib === 'E' ? 'from-teal-600 to-emerald-500' :
                                'from-pink-600 to-rose-600'
                        } relative overflow-hidden`}>
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                            
                            {/* Close Button Floating */}
                            <button 
                                onClick={() => setIsDetailOpen(false)} 
                                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all z-20 group"
                            >
                                <svg className="group-hover:rotate-90 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>

                            <div className="absolute bottom-6 left-8 sm:left-10 text-white animate-in slide-in-from-bottom duration-500">
                                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                                    Kategori KIB {scannedItem.kategori?.tipe_kib}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black leading-none drop-shadow-md">{scannedItem.nama_barang}</h2>
                            </div>
                        </div>

                        <div className="p-6 sm:p-10 -mt-6 bg-[#F8FAFC] dark:bg-gray-800 rounded-t-[3rem] relative z-10 shadow-inner">
                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                <QuickStat label="Status" value={(scannedItem.kondisi === 'B' || scannedItem.kondisi === 'Baik') ? 'NORMAL' : 'RUSAK'} color={(scannedItem.kondisi === 'B' || scannedItem.kondisi === 'Baik') ? 'text-emerald-500' : 'text-rose-500'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
                                <QuickStat label="Register" value={scannedItem.nomor_register} icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>} />
                                <QuickStat label="Lokasi" value={scannedItem.ruangan?.nama || 'Global'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>} />
                                <QuickStat label="Dana" value={scannedItem.sumber_dana?.nama?.substring(0, 10) || '-'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>} />
                            </div>

                            {/* Main Information Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                {/* Technical Details Card */}
                                <div className="bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 dark:shadow-none border border-white dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1-2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">Spesifikasi Teknis</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <SpecRow label="Nomor Kode" value={scannedItem.kode_barang} />
                                        <SpecRow label="Merk / Tipe" value={scannedItem.kib_b?.merk_type || scannedItem.kib_c?.konstruksi || scannedItem.kib_d?.konstruksi || '-'} />
                                        <SpecRow label="Ukuran / Spek" value={scannedItem.kib_b?.ukuran_cc || scannedItem.kib_c?.luas_lantai || '-'} />
                                        <SpecRow label="Bahan / Material" value={scannedItem.kib_b?.bahan || '-'} />
                                    </div>
                                </div>

                                {/* Procurement Details Card */}
                                <div className="bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 dark:shadow-none border border-white dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">Perolehan Aset</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <SpecRow label="Harga Barang" value={`Rp ${new Intl.NumberFormat('id-ID').format(scannedItem.harga)}`} highlight />
                                        <SpecRow label="Tanggal Beli" value={scannedItem.tanggal_perolehan} />
                                        <SpecRow label="Kondisi Fisik" value={(scannedItem.kondisi === 'B' || scannedItem.kondisi === 'Baik') ? 'BAIK' : (scannedItem.kondisi === 'RR' || scannedItem.kondisi === 'Kurang Baik' || scannedItem.kondisi === 'Rusak Ringan') ? 'KURANG BAIK' : 'RUSAK BERAT'} />
                                        <SpecRow label="Asal Usul" value={scannedItem.asal_usul || '-'} />
                                    </div>
                                </div>
                            </div>

                            {/* QR Floating Section */}
                            <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 mt-4 border border-white relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
                                <div className="p-4 bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 flex items-center justify-center">
                                    <QRCodeCanvas value={scannedItem.id} size={120} level="H" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase mb-1">ID Ter-otentikasi</p>
                                    <p className="text-xs font-black text-indigo-500 dark:text-indigo-400 font-mono tracking-wider">{scannedItem.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}

function QuickStat({ label, value, color, icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-[1.8rem] p-4 shadow-sm border border-gray-100/50 dark:border-gray-700 flex flex-col items-center text-center animate-in zoom-in duration-500">
            <div className={`w-8 h-8 rounded-lg ${color?.replace('text-', 'bg-').replace('500', '50') || 'bg-gray-50'} ${color || 'text-gray-400'} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{label}</span>
            <span className={`text-[11px] font-black leading-none truncate w-full ${color || 'text-gray-900 dark:text-gray-100'}`}>{value}</span>
        </div>
    );
}

function SpecRow({ label, value, highlight }: any) {
    return (
        <div className="flex justify-between items-end border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-black ${highlight ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-200'} text-right truncate max-w-[60%]`}>{value}</span>
        </div>
    );
}

function Scanner({ onScanSuccess, active }: any) {
    const scannerId = "asset-scanner-region";
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<any>(null);

    useEffect(() => {
        if (!active) return;
        
        // Small delay to ensure modal transition has finished
        const timer = setTimeout(() => {
            const html5QrCode = new Html5Qrcode(scannerId);
            scannerRef.current = html5QrCode;
            
            const config = { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            html5QrCode.start(
                { facingMode: "environment" }, 
                config, 
                onScanSuccess,
                () => {} // Silent on scan failure
            ).catch(err => {
                console.error("Gagal memulai scanner:", err);
                if (err.includes("NotAllowedError") || err.includes("Permission")) {
                    setError("Izin Kamera Ditolak. Harap izinkan akses kamera pada pengaturan browser Anda.");
                } else if (err.includes("NotFoundError")) {
                    setError("Kamera tidak ditemukan pada perangkat ini.");
                } else {
                    setError("Gagal mengakses kamera. Pastikan Anda menggunakan HTTPS atau localhost.");
                }
            });
        }, 600);

        return () => {
            clearTimeout(timer);
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                }).catch((e: any) => console.error("Gagal menghentikan scanner:", e));
            }
        };
    }, [active]);

    return (
        <div className="relative min-h-[300px] flex items-center justify-center bg-gray-900 overflow-hidden">
            <div id={scannerId} className="w-full h-full [&>video]:object-cover"></div>
            
            {/* Overlay Scanner Animation */}
            {active && !error && (
                <div className="absolute inset-0 pointer-events-none border-[2px] border-indigo-500/30">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-indigo-500 rounded-3xl">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-lg"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan-line"></div>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-gray-950/90 z-20">
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-white font-black text-sm mb-2">Akses Kamera Gagal</p>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-[240px] mx-auto">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Add CSS keyframe for scan line animation
const scanLineStyle = document.createElement('style');
scanLineStyle.innerHTML = `
    @keyframes scan-line {
        0% { top: 0; opacity: 0; }
        50% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
    .animate-scan-line {
        animation: scan-line 2s infinite ease-in-out;
        position: absolute;
    }
`;
document.head.appendChild(scanLineStyle);

function AssetCard({ item, index, onDownload, onView }: any) {
    const qrRef = useRef<HTMLCanvasElement>(null);
    const barcodeRef = useRef<HTMLDivElement>(null);

    const handleDownload = (type: 'QR' | 'BARCODE', format: 'png' | 'jpeg' | 'jpg') => {
        if (type === 'QR') {
            onDownload(qrRef.current, item, 'QR', format);
        } else {
            const canvas = barcodeRef.current?.querySelector('canvas');
            if (canvas) {
                onDownload(canvas, item, 'BARCODE', format);
            }
        }
    };

    const themeMap: Record<string, string> = {
        'A': 'from-blue-600 to-cyan-500',
        'B': 'from-indigo-600 to-violet-600',
        'C': 'from-emerald-600 to-teal-500',
        'D': 'from-amber-600 to-orange-500',
        'E': 'from-teal-600 to-emerald-500',
        'F': 'from-pink-600 to-rose-600',
        'default': 'from-slate-600 to-slate-500'
    };

    const kibTheme = themeMap[item.kategori?.tipe_kib || 'default'] || themeMap['default'];

    return (
        <div 
            className="group relative bg-white dark:bg-gray-800 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 transition-all duration-700 overflow-hidden animate-in fade-in slide-in-from-bottom duration-1000"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kibTheme} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-[6rem] transition-all duration-700`}></div>
            
            <div className="relative">
                <div className="flex justify-between items-center mb-6">
                    <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-gradient-to-br ${kibTheme} shadow-lg shadow-gray-200`}>
                        KIB {item.kategori?.tipe_kib}
                    </span>
                    <button 
                        onClick={onView}
                        className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-500 leading-tight">
                    {item.nama_barang}
                </h3>
                <div className="flex items-center gap-2 mt-2 mb-8">
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{item.kategori?.nama}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                    <span className="text-[11px] font-black text-indigo-400 tracking-widest leading-none">{item.kode_barang}</span>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8 group/codes">
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-[2.5rem] p-6 border-2 border-transparent group-hover/codes:bg-white dark:group-hover/codes:bg-gray-700/80 group-hover/codes:border-indigo-100/50 dark:group-hover/codes:border-indigo-500/30 transition-all duration-500 flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-4 px-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ID Digital (QR)</span>
                            <DownloadDropdown onDownload={(fmt: any) => handleDownload('QR', fmt)} label="QR" />
                        </div>
                        <div className="p-5 bg-white rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none group-hover:scale-105 transition-transform duration-700 border border-gray-50 dark:border-transparent select-none cursor-pointer" onClick={onView}>
                            <QRCodeCanvas ref={qrRef} value={item.id} size={120} level="H" includeMargin={false} />
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-[2.5rem] p-6 border-2 border-transparent group-hover/codes:bg-white dark:group-hover/codes:bg-gray-700/80 group-hover/codes:border-violet-100/50 dark:group-hover/codes:border-violet-500/30 transition-all duration-500 flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-4 px-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Barcode Barang</span>
                            <DownloadDropdown onDownload={(fmt: any) => handleDownload('BARCODE', fmt)} label="Bar" />
                        </div>
                        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700 border border-gray-50 dark:border-transparent select-none" ref={barcodeRef}>
                            <Barcode value={item.kode_barang || '00000'} width={1.2} height={60} fontSize={10} background="transparent" margin={0} renderer="canvas" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Lokasi</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">{item.ruangan?.nama || 'Global'}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Status Fisik</span>
                        <div className={`text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${
                            (item.kondisi === 'B' || item.kondisi === 'Baik') ? 'bg-emerald-50 text-emerald-600' : 
                            (item.kondisi === 'RR' || item.kondisi === 'Kurang Baik' || item.kondisi === 'Rusak Ringan') ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                            {(item.kondisi === 'B' || item.kondisi === 'Baik') ? 'BAIK' : (item.kondisi === 'RR' || item.kondisi === 'Kurang Baik' || item.kondisi === 'Rusak Ringan') ? 'KURANG BAIK' : 'RUSAK BERAT'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DownloadDropdown({ onDownload, label }: any) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-gray-100 hover:shadow-lg active:scale-90"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                    {['PNG', 'JPEG', 'JPG'].map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => onDownload(fmt.toLowerCase() as any)}
                            className="w-full text-left px-5 py-3 text-[11px] font-black text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors uppercase tracking-widest border-b border-gray-50 last:border-0"
                        >
                            Unduh {fmt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
