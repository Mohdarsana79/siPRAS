import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import Modal from '@/Components/Modal';
import FormModal from '@/Components/FormModal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
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
    kode_lokasi_full?: string;
    kode_barang_full?: string;
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

            <div className="min-h-screen bg-gray-50/30 py-6 sm:py-10 px-4 sm:px-8 max-w-[1700px] mx-auto text-[9pt]">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12 animate-in fade-in slide-in-from-top duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <span className="text-[8pt] font-black text-indigo-600 uppercase tracking-[0.2em]">Inventory Management</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
                            DATA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">ASET</span>
                        </h1>
                        <p className="text-[9pt] font-medium text-gray-500 mt-2">Kelola, verifikasi, dan cetak label inventaris aset sekolah Anda secara profesional.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button 
                            onClick={() => setIsScannerOpen(true)}
                            className="flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-[9pt] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:-translate-y-0.5 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7"/></svg>
                            Pindai Label
                        </button>
                        <button 
                            onClick={() => setIsPrintModalOpen(true)}
                            className="flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-2xl text-[9pt] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                            Cetak PDF
                        </button>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-xl shadow-gray-200/50 border border-white mb-8 sm:mb-12 animate-in zoom-in duration-500">
                    <div className="flex flex-col lg:flex-row gap-10 items-end">
                        <div className="flex-1 w-full space-y-5">
                            <label className="flex items-center gap-2 text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Filter Kategori KIB
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                                {kibOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleKibChange(opt.id)}
                                        className={`px-7 py-3 rounded-xl text-[9pt] font-bold transition-all ${
                                            selectedKib === opt.id 
                                            ? `bg-indigo-600 text-white shadow-lg shadow-indigo-100` 
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-[450px] space-y-5">
                            <label className="flex items-center gap-2 text-[9pt] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Pencarian Data
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Cari nama barang atau kode barang..."
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl px-6 py-4 text-[9pt] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
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
            <FormModal
                show={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                title="Pindai Label Aset"
                subtitle="Gunakan kamera untuk memverifikasi data aset secara instan"
                maxWidth="xl"
                accentColor="indigo"
                headerVariant="gradient"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7"/></svg>}
            >
                <div className="space-y-6">
                    <Scanner onScanSuccess={onScanSuccess} active={isScannerOpen} />
                    <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p className="text-[9pt] font-bold text-indigo-700 leading-relaxed uppercase tracking-tight">Pindai kode QR atau Barcode pada stiker aset untuk melakukan verifikasi data inventaris secara real-time.</p>
                    </div>
                </div>
            </FormModal>

            {/* Print Settings Modal */}
            <FormModal
                show={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                title="Cetak Label Aset"
                subtitle="Atur format dan orientasi cetakan stiker"
                maxWidth="lg"
                accentColor="indigo"
                headerVariant="gradient"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>}
                footer={
                    <div className="flex items-center gap-3 w-full">
                        <SecondaryButton onClick={() => setIsPrintModalOpen(false)} className="flex-1 justify-center">Batal</SecondaryButton>
                        <a 
                            href={route('aset-data.cetak-labels', { 
                                kib: selectedKib, 
                                paper: printSettings.paper, 
                                orientation: printSettings.orientation 
                            })} 
                            target="_blank"
                            onClick={() => setIsPrintModalOpen(false)}
                            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 border border-transparent rounded-xl font-black text-[9pt] text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-xl shadow-indigo-100"
                        >
                            Mulai Cetak
                        </a>
                    </div>
                }
            >
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-[9pt] font-black text-gray-400 uppercase tracking-widest ml-1">Ukuran Kertas</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'a4', label: 'A4 Standard' },
                                { id: 'folio', label: 'Folio / F4' },
                                { id: 'letter', label: 'Letter' },
                                { id: 'legal', label: 'Legal' }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPrintSettings({ ...printSettings, paper: p.id })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                        printSettings.paper === p.id 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    <div className="text-[10pt] font-black">{p.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[9pt] font-black text-gray-400 uppercase tracking-widest ml-1">Orientasi Cetak</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'portrait', label: 'Portrait' },
                                { id: 'landscape', label: 'Landscape' }
                            ].map((o) => (
                                <button
                                    key={o.id}
                                    onClick={() => setPrintSettings({ ...printSettings, orientation: o.id })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                        printSettings.orientation === o.id 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    <div className="text-[10pt] font-black">{o.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* Aset Detail Modal */}
            <FormModal
                show={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="Informasi Detail Aset"
                subtitle={scannedItem?.nama_barang}
                maxWidth="3xl"
                accentColor="indigo"
                headerVariant="gradient"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
                bodyClassName="text-[9pt]"
                footer={
                    <SecondaryButton onClick={() => setIsDetailOpen(false)} className="w-full justify-center">Tutup Detail</SecondaryButton>
                }
            >
                {scannedItem && (
                    <div className="space-y-8">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <QuickStat 
                                label="Kondisi" 
                                value={(scannedItem.kondisi === 'B' || scannedItem.kondisi === 'Baik') ? 'BAIK' : 'RUSAK'} 
                                color={(scannedItem.kondisi === 'B' || scannedItem.kondisi === 'Baik') ? 'text-emerald-600' : 'text-rose-600'} 
                            />
                            <QuickStat label="Register" value={scannedItem.nomor_register} />
                            <QuickStat label="Lokasi" value={scannedItem.ruangan?.nama || 'Global'} />
                            <QuickStat label="Tipe KIB" value={`KIB ${scannedItem.kategori?.tipe_kib}`} color="text-indigo-600" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Identitas Aset */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                                    <h4 className="text-[10pt] font-black text-gray-400 uppercase tracking-widest">Identitas Aset</h4>
                                </div>
                                <div className="space-y-1">
                                    <SpecRow label="Nama Barang" value={scannedItem.nama_barang} />
                                    <SpecRow label="Kode Lokasi" value={scannedItem.kode_lokasi_full} mono />
                                    <SpecRow label="Kode Barang" value={scannedItem.kode_barang_full} mono />
                                    <SpecRow label="Merk / Tipe" value={scannedItem.kib_b?.merk_type || scannedItem.kib_c?.konstruksi || '-'} />
                                </div>
                            </div>

                            {/* Nilai & Perolehan */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="w-1 h-3 bg-emerald-400 rounded-full"></div>
                                    <h4 className="text-[10pt] font-black text-gray-400 uppercase tracking-widest">Nilai & Perolehan</h4>
                                </div>
                                <div className="space-y-1">
                                    <SpecRow label="Harga Aset" value={`Rp ${new Intl.NumberFormat('id-ID').format(scannedItem.harga)}`} highlight />
                                    <SpecRow label="Tanggal Perolehan" value={scannedItem.tanggal_perolehan} />
                                    <SpecRow label="Sumber Dana" value={scannedItem.sumber_dana?.nama || '-'} />
                                    <SpecRow label="Bahan Konstruksi" value={scannedItem.kib_b?.bahan || '-'} />
                                </div>
                            </div>
                        </div>

                        {/* Digital Authentication */}
                        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col items-center gap-4">
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <QRCodeCanvas value={scannedItem.id} size={110} level="H" />
                            </div>
                            <div className="text-center">
                                <p className="text-[7pt] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Authentic Digital ID</p>
                                <p className="text-[9pt] font-mono font-bold text-indigo-600 bg-white px-4 py-1.5 rounded-xl border border-indigo-100 shadow-sm">{scannedItem.id}</p>
                            </div>
                        </div>
                    </div>
                )}
            </FormModal>
        </AuthenticatedLayout>
    );
}

function QuickStat({ label, value, color, icon }: any) {
    return (
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
            <span className="text-[7.5pt] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
            <span className={`text-[9pt] font-black truncate w-full ${color || 'text-gray-900'}`}>{value}</span>
        </div>
    );
}

function SpecRow({ label, value, highlight, mono }: any) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0 last:pb-0">
            <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-tight">{label}</span>
            <span className={`text-[9.5pt] font-bold ${highlight ? 'text-indigo-600' : 'text-gray-700'} ${mono ? 'font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100' : ''} text-right truncate max-w-[65%]`}>{value}</span>
        </div>
    );
}

function Scanner({ onScanSuccess, active }: any) {
    const scannerId = "asset-scanner-region";
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<any>(null);

    useEffect(() => {
        if (!active) return;
        
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
                () => {} 
            ).catch(err => {
                console.error("Gagal memulai scanner:", err);
                setError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
            });
        }, 600);

        return () => {
            clearTimeout(timer);
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                }).catch((e: any) => console.error("Scanner stop error:", e));
            }
        };
    }, [active]);

    return (
        <div className="relative min-h-[300px] flex items-center justify-center bg-black rounded-3xl overflow-hidden border border-gray-100">
            <div id={scannerId} className="w-full h-full [&>video]:object-cover"></div>
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-900/90 z-20">
                    <p className="text-white font-bold text-sm mb-2">Akses Kamera Gagal</p>
                    <p className="text-gray-400 text-xs">{error}</p>
                </div>
            )}
        </div>
    );
}

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

    const themeColors: Record<string, string> = {
        'A': 'bg-blue-600',
        'B': 'bg-indigo-600',
        'C': 'bg-emerald-600',
        'D': 'bg-amber-600',
        'E': 'bg-rose-600',
        'F': 'bg-pink-600',
        'default': 'bg-gray-600'
    };

    const kibColor = themeColors[item.kategori?.tipe_kib || 'default'] || themeColors['default'];

    return (
        <div 
            className="group bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-xl text-[8pt] font-black uppercase tracking-widest text-white ${kibColor} shadow-md`}>
                    KIB {item.kategori?.tipe_kib}
                </span>
                <button 
                    onClick={onView}
                    className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
            </div>

            <div className="space-y-4 mb-8">
                <div>
                    <h3 className="text-[12pt] font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {item.nama_barang}
                    </h3>
                    <p className="text-[9pt] font-bold text-gray-400 uppercase tracking-tight mt-1 truncate">{item.kategori?.nama}</p>
                </div>
                
                <div className="flex flex-col gap-1.5">
                    <span className="text-[9pt] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100/50 w-fit leading-none">
                        {item.kode_lokasi_full}
                    </span>
                    <span className="text-[9pt] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100/50 w-fit leading-none">
                        {item.kode_barang_full}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[8pt] font-black text-gray-400 uppercase tracking-widest leading-none">ID Digital</span>
                        <DownloadDropdown onDownload={(fmt: any) => handleDownload('QR', fmt)} label="QR" />
                    </div>
                    <div className="flex justify-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit mx-auto cursor-pointer" onClick={onView}>
                        <QRCodeCanvas ref={qrRef} value={item.id} size={110} level="H" includeMargin={false} />
                    </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[8pt] font-black text-gray-400 uppercase tracking-widest leading-none">Barcode</span>
                        <DownloadDropdown onDownload={(fmt: any) => handleDownload('BARCODE', fmt)} label="Bar" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm w-full flex items-center justify-center overflow-hidden" ref={barcodeRef}>
                        <Barcode value={item.kode_barang || '00000'} width={1.2} height={50} fontSize={10} background="transparent" margin={0} renderer="canvas" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex flex-col gap-1">
                    <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-widest">Lokasi</span>
                    <span className="text-[9.5pt] font-bold text-gray-700">{item.ruangan?.nama || 'GLOBAL'}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[8pt] font-bold text-gray-400 uppercase tracking-widest">Kondisi</span>
                    <span className={`text-[9pt] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                        (item.kondisi === 'B' || item.kondisi === 'Baik') ? 'bg-emerald-50 text-emerald-600' : 
                        (item.kondisi === 'RR' || item.kondisi === 'Kurang Baik' || item.kondisi === 'Rusak Ringan') ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                        {(item.kondisi === 'B' || item.kondisi === 'Baik') ? 'BAIK' : (item.kondisi === 'RR' || item.kondisi === 'Kurang Baik' || item.kondisi === 'Rusak Ringan') ? 'KURANG BAIK' : 'RUSAK'}
                    </span>
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
                className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100 active:scale-90"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden text-left py-1 animate-in fade-in zoom-in duration-200">
                    {['PNG', 'JPEG', 'JPG'].map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => onDownload(fmt.toLowerCase() as any)}
                            className="w-full text-left px-4 py-2 text-[8pt] font-black text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                        >
                            {fmt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
