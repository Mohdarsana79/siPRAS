import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ApplicationLogo from './ApplicationLogo';

// Inline SVG Icons for zero-dependency
const Icons = {
    Dashboard: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Warehouse: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 21V10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
    ),
    Coins: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18.06" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg>
    ),
    ClipboardList: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6" /><path d="M9 16h6" /><path d="M9 8h6" /></svg>
    ),
    Map: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
    ),
    Box: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
    ),
    Building2: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
    ),
    Truck: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
    ),
    Trees: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 12 5 2V9l-5-2-5 2v5l5-2Z" /><path d="M12 12v10" /><path d="m8 14 3 2" /><path d="m16 14-3 2" /></svg>
    ),
    Construction: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m15 3-6 18" /><path d="m3 15 18-6" /></svg>
    ),
    ArrowRightLeft: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></svg>
    ),
    Handshake: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m11 17 2 2 6-6" /><path d="m8 14 2 2 6-6" /><path d="m5 11 2 2 6-6" /><path d="M3 10v4a2 2 0 0 0 2 2h3.8" /><path d="M21 10v4a2 2 0 0 1-2 2h-3.8" /></svg>
    ),
    Wrench: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
    FilePieChart: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="8" cy="18" r="4" /><path d="M8 14v4h4" /></svg>
    ),
    ChevronDown: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>
    ),
    X: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    School: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
    ),
    Tags: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l4.58-4.58a2.42 2.42 0 0 0 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
    ),
    Database: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
    ),
    ChevronLeft: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
    ),
    Menu: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    )
};

interface NavItemProps {
    href: string;
    active: boolean;
    icon: any;
    label: string;
    onClick?: () => void;
    color?: string;
    isCollapsed?: boolean;
}

const NavItem = ({ href, active, icon: Icon, label, onClick, color = 'text-gray-400', isCollapsed = false }: NavItemProps) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            title={isCollapsed ? label : ''}
            className={`group flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-2xl mb-1.5 ${active
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/50'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-gray-900/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                } ${isCollapsed ? 'justify-center px-0 mx-2' : ''}`}
        >
            <div className={`relative flex items-center justify-center ${isCollapsed ? 'w-10 h-10' : ''}`}>
                <Icon className={`h-5 w-5 shrink-0 transition-all duration-300 group-hover:scale-110 ${isCollapsed ? '' : 'mr-3'
                    } ${active ? 'text-white' : `${color} group-hover:text-indigo-600 dark:group-hover:text-indigo-400`
                    }`} />
                {active && isCollapsed && (
                    <div className="absolute -left-2 w-1 h-6 bg-white rounded-full animate-in fade-in duration-500" />
                )}
            </div>
            {!isCollapsed && <span className="truncate font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-500">{label}</span>}
        </Link>
    );
};

interface NavGroupProps {
    label: string;
    children: React.ReactNode;
    isOpenByDefault?: boolean;
    isCollapsed?: boolean;
}

const NavGroup = ({ label, children, isOpenByDefault = true, isCollapsed = false }: NavGroupProps) => {
    const [isOpen, setIsOpen] = useState(isOpenByDefault);

    if (isCollapsed) {
        return <div className="space-y-1 mb-6 border-b border-gray-50 dark:border-gray-800 pb-4 last:border-0">{children}</div>;
    }

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 mb-3 text-[10px] font-black tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase transition-all hover:text-indigo-500 dark:hover:text-indigo-400 group"
            >
                <span className="truncate">{label}</span>
                <Icons.ChevronDown className={`w-3 h-3 transition-all duration-300 shrink-0 ${isOpen ? '' : '-rotate-90 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 dark:group-hover:text-indigo-500'}`} />
            </button>
            <div className={`space-y-1 transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
                {children}
            </div>
        </div>
    );
};

export default function Sidebar({ show, setShow }: { show: boolean, setShow: (show: boolean) => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url } = usePage();
    const currentRoute = (name: string) => route().current(name);

    // Auto-collapse logic for tablets and reset for mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(false);
            } else if (window.innerWidth >= 1024 && window.innerWidth <= 1280) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sidebar width classes - added base width for mobile
    const sidebarWidth = isCollapsed ? 'lg:w-[88px]' : 'w-[280px] sm:w-72 lg:w-[300px] xl:w-[320px]';

    return (
        <>
            {/* Mobile/Tablet Backdrop - Premium blur */}
            <div
                className={`fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-md lg:hidden transition-all duration-500 ease-in-out ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setShow(false)}
            />

            {/* Premium Dynamic Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-[70] bg-white dark:bg-gray-900 border-r border-gray-100/80 dark:border-gray-800 shadow-2xl shadow-indigo-100/20 dark:shadow-gray-900/50 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0 ${sidebarWidth} ${show ? 'translate-x-0 rounded-r-[2.5rem] lg:rounded-none' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full bg-gradient-to-b from-white via-white to-slate-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/10 relative">
                    
                    {/* PC Collapse Toggle Button - Refined Design */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCollapsed(!isCollapsed);
                        }}
                        className="absolute hidden lg:flex items-center justify-center w-8 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300 rounded-r-xl -right-8 top-20 shadow-[10px_0_20px_rgba(0,0,0,0.02)] z-[100] hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all duration-300 group ring-1 ring-black/5 dark:ring-white/5"
                    >
                        <Icons.ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Header - Premium Branding */}
                    <div className={`flex items-center h-24 border-b border-gray-50/50 dark:border-gray-800 transition-all duration-500 ${isCollapsed ? 'px-4 justify-center' : 'px-8 justify-between'}`}>
                        <Link href="/" className="flex items-center gap-4 group shrink-0">
                            <div className="relative p-2.5 rounded-[1.25rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 shadow-xl shadow-indigo-200 dark:shadow-indigo-900 transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shrink-0">
                                <ApplicationLogo className="w-8 h-8 fill-white" />
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-[1.25rem] transition-opacity duration-500" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
                                    <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                                        siPRAS
                                    </span>
                                    <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 tracking-[0.3em] uppercase mt-1">
                                        v2.0 Premium
                                    </span>
                                </div>
                            )}
                        </Link>
                        
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setShow(false)}
                            className="p-3 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-2xl lg:hidden hover:bg-rose-50 dark:hover:bg-rose-900 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-300"
                        >
                            <Icons.X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Areas - Premium Scrolling */}
                    <div className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar overflow-x-hidden">
                        
                        {/* Summary for Tablet/Mobile if needed */}
                        {!isCollapsed && (
                            <div className="mb-8 px-4 py-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20 hidden lg:block">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Status Sistem</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Online & Sinkron</span>
                                </div>
                            </div>
                        )}

                        <NavItem
                            href={route('dashboard')}
                            active={!!currentRoute('dashboard')}
                            icon={Icons.Dashboard}
                            label="Dashboard Utama"
                            onClick={() => setShow(false)}
                            color="text-indigo-500"
                            isCollapsed={isCollapsed}
                        />

                        <div className={`my-8 border-t border-gray-50/80 dark:border-gray-800 mx-4 transition-all ${isCollapsed ? 'mx-2 opacity-50' : ''}`} />

                        <NavGroup label="Manajemen Inti" isCollapsed={isCollapsed}>
                            <NavItem
                                href={route('master-ruangan.index')}
                                active={!!currentRoute('master-ruangan.*')}
                                icon={Icons.Warehouse}
                                label="Data Ruangan"
                                onClick={() => setShow(false)}
                                color="text-amber-500"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('master-sumber-dana.index')}
                                active={!!currentRoute('master-sumber-dana.*')}
                                icon={Icons.Coins}
                                label="Sumber Dana"
                                onClick={() => setShow(false)}
                                color="text-emerald-500"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('master-kategori.index')}
                                active={!!currentRoute('master-kategori.*')}
                                icon={Icons.ClipboardList}
                                label="Kategori Aset"
                                onClick={() => setShow(false)}
                                color="text-rose-500"
                                isCollapsed={isCollapsed}
                            />
                        </NavGroup>

                        <NavGroup label="Inventaris (KIB)" isCollapsed={isCollapsed}>
                            {[
                                { route: 'kib-a.*', icon: Icons.Map, label: 'KIB A (Tanah)', color: 'text-blue-500' },
                                { route: 'kib-b.*', icon: Icons.Box, label: 'KIB B (Peralatan)', color: 'text-indigo-500' },
                                { route: 'kib-c.*', icon: Icons.Building2, label: 'KIB C (Gedung)', color: 'text-violet-500' },
                                { route: 'kib-d.*', icon: Icons.Truck, label: 'KIB D (Jalan/Irig)', color: 'text-purple-500' },
                                { route: 'kib-e.*', icon: Icons.Trees, label: 'KIB E (Aset Lain)', color: 'text-teal-500' },
                                { route: 'kib-f.*', icon: Icons.Construction, label: 'KIB F (Konstruksi)', color: 'text-pink-500' },
                            ].map((item, idx) => (
                                <NavItem
                                    key={idx}
                                    href={route(item.route.replace('.*', '.index'))}
                                    active={!!currentRoute(item.route)}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => setShow(false)}
                                    color={item.color}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </NavGroup>

                        <NavGroup label="Aktifitas & Operasi" isCollapsed={isCollapsed}>
                            <NavItem
                                href={route('mutasi.index')}
                                active={!!currentRoute('mutasi.*')}
                                icon={Icons.ArrowRightLeft}
                                label="Mutasi Barang"
                                onClick={() => setShow(false)}
                                color="text-orange-500"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('peminjaman.index')}
                                active={!!currentRoute('peminjaman.*')}
                                icon={Icons.Handshake}
                                label="Peminjaman"
                                onClick={() => setShow(false)}
                                color="text-cyan-500"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('pemeliharaan.index')}
                                active={!!currentRoute('pemeliharaan.*')}
                                icon={Icons.Wrench}
                                label="Pemeliharaan"
                                onClick={() => setShow(false)}
                                color="text-red-500"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('aset-data.index')}
                                active={!!currentRoute('aset-data.*')}
                                icon={Icons.Tags}
                                label="Semua Data Aset"
                                onClick={() => setShow(false)}
                                color="text-fuchsia-500"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('laporan.index')}
                                active={!!currentRoute('laporan.*')}
                                icon={Icons.FilePieChart}
                                label="Laporan & PDF"
                                onClick={() => setShow(false)}
                                color="text-yellow-600"
                                isCollapsed={isCollapsed}
                            />
                        </NavGroup>

                        <NavGroup label="Pengaturan & Backup" isCollapsed={isCollapsed}>
                            <NavItem
                                href={route('school-profile.index')}
                                active={!!currentRoute('school-profile.*')}
                                icon={Icons.School}
                                label="Identitas Sekolah"
                                onClick={() => setShow(false)}
                                color="text-indigo-600"
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                href={route('backup-restore.index')}
                                active={!!currentRoute('backup-restore.*')}
                                icon={Icons.Database}
                                label="Data Keamanan"
                                onClick={() => setShow(false)}
                                color="text-cyan-600"
                                isCollapsed={isCollapsed}
                            />
                        </NavGroup>
                    </div>

                    {/* Premium Sidebar Footer */}
                    <div className={`p-8 border-t border-gray-100 dark:border-gray-800 transition-all duration-500 ${isCollapsed ? 'p-4 items-center' : ''}`}>
                        {!isCollapsed ? (
                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                    <Icons.Menu className="w-5 h-5 pointer-events-none" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Build Edition</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">Sipras Pro v2.0.4</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
                                <span className="text-[10px] font-black">PRO</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
