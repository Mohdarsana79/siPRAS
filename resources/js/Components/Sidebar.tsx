import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ApplicationLogo from './ApplicationLogo';

// Inline SVG Icons
const Icons = {
    Dashboard: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Warehouse: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 21V10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
    ),
    Coins: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18.06" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg>
    ),
    ClipboardList: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6" /><path d="M9 16h6" /><path d="M9 8h6" /></svg>
    ),
    Map: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
    ),
    Box: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
    ),
    Building2: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
    ),
    Truck: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
    ),
    Trees: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 12 5 2V9l-5-2-5 2v5l5-2Z" /><path d="M12 12v10" /><path d="m8 14 3 2" /><path d="m16 14-3 2" /></svg>
    ),
    Construction: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m15 3-6 18" /><path d="m3 15 18-6" /></svg>
    ),
    ArrowRightLeft: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></svg>
    ),
    Handshake: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m11 17 2 2 6-6" /><path d="m8 14 2 2 6-6" /><path d="m5 11 2 2 6-6" /><path d="M3 10v4a2 2 0 0 0 2 2h3.8" /><path d="M21 10v4a2 2 0 0 1-2 2h-3.8" /></svg>
    ),
    Wrench: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
    FilePieChart: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="8" cy="18" r="4" /><path d="M8 14v4h4" /></svg>
    ),
    ChevronDown: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>
    ),
    X: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    School: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
    ),
    Tags: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l4.58-4.58a2.42 2.42 0 0 0 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
    ),
    Database: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
    ),
    ChevronLeft: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
    ),
};

// Color map for each nav item
const itemColors: Record<string, { bg: string; text: string; activeBg: string }> = {
    dashboard:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  activeBg: 'bg-indigo-600' },
    ruangan:    { bg: 'bg-amber-50',   text: 'text-amber-600',   activeBg: 'bg-amber-500'  },
    dana:       { bg: 'bg-emerald-50', text: 'text-emerald-600', activeBg: 'bg-emerald-600'},
    kategori:   { bg: 'bg-rose-50',    text: 'text-rose-600',    activeBg: 'bg-rose-500'   },
    kibA:       { bg: 'bg-blue-50',    text: 'text-blue-600',    activeBg: 'bg-blue-600'   },
    kibB:       { bg: 'bg-indigo-50',  text: 'text-indigo-600',  activeBg: 'bg-indigo-600' },
    kibC:       { bg: 'bg-violet-50',  text: 'text-violet-600',  activeBg: 'bg-violet-600' },
    kibD:       { bg: 'bg-purple-50',  text: 'text-purple-600',  activeBg: 'bg-purple-600' },
    kibE:       { bg: 'bg-teal-50',    text: 'text-teal-600',    activeBg: 'bg-teal-600'   },
    kibF:       { bg: 'bg-pink-50',    text: 'text-pink-600',    activeBg: 'bg-pink-600'   },
    mutasi:     { bg: 'bg-orange-50',  text: 'text-orange-600',  activeBg: 'bg-orange-500' },
    peminjaman: { bg: 'bg-cyan-50',    text: 'text-cyan-600',    activeBg: 'bg-cyan-600'   },
    pemeliharaan:{ bg: 'bg-red-50',   text: 'text-red-600',     activeBg: 'bg-red-500'    },
    aset:       { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', activeBg: 'bg-fuchsia-600'},
    laporan:    { bg: 'bg-yellow-50',  text: 'text-yellow-600',  activeBg: 'bg-yellow-500' },
    school:     { bg: 'bg-indigo-50',  text: 'text-indigo-600',  activeBg: 'bg-indigo-600' },
    backup:     { bg: 'bg-sky-50',     text: 'text-sky-600',     activeBg: 'bg-sky-600'    },
};

interface NavItemProps {
    href: string;
    active: boolean;
    icon: any;
    label: string;
    colorKey: keyof typeof itemColors;
    onClick?: () => void;
    isCollapsed?: boolean;
}

const NavItem = ({ href, active, icon: Icon, label, colorKey, onClick, isCollapsed = false }: NavItemProps) => {
    const color = itemColors[colorKey] ?? itemColors.dashboard;
    return (
        <Link
            href={href}
            onClick={onClick}
            title={isCollapsed ? label : ''}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                    ? `${color.activeBg} text-white shadow-sm`
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${isCollapsed ? 'justify-center px-0 mx-2' : ''}`}
        >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-200 ${
                active
                    ? 'bg-white/20'
                    : `${color.bg} ${color.text} group-hover:scale-105`
            }`}>
                <Icon className="w-4 h-4" />
            </div>
            {!isCollapsed && <span className="truncate">{label}</span>}
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
        return <div className="space-y-0.5 mb-4 pb-4 border-b border-gray-100 last:border-0">{children}</div>;
    }

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 mb-1 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-500 transition-colors"
            >
                <span>{label}</span>
                <Icons.ChevronDown className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-0.5 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

export default function Sidebar({ show, setShow }: { show: boolean, setShow: (show: boolean) => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url } = usePage();
    const currentRoute = (name: string) => route().current(name);

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

    const sidebarWidth = isCollapsed ? 'lg:w-[72px]' : 'w-[260px] lg:w-[260px]';

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShow(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-[70] flex flex-col bg-white border-r border-gray-100 shadow-lg transition-all duration-300 lg:translate-x-0 lg:static lg:shadow-none ${sidebarWidth} ${show ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Collapse toggle for desktop */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
                    className="absolute hidden lg:flex items-center justify-center w-6 h-12 bg-white border border-gray-200 text-gray-400 rounded-r-lg -right-6 top-16 z-[100] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
                >
                    <Icons.ChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Header */}
                <div className={`flex items-center h-16 border-b border-gray-100 px-4 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                            <ApplicationLogo className="w-5 h-5 fill-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col leading-none">
                                <span className="text-base font-bold text-gray-900">siPRAS</span>
                                <span className="text-[10px] text-indigo-500 font-medium">v2.0 Pro</span>
                            </div>
                        )}
                    </Link>
                    {/* Mobile close */}
                    <button
                        onClick={() => setShow(false)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    >
                        <Icons.X />
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden space-y-0">
                    <NavItem href={route('dashboard')} active={!!currentRoute('dashboard')} icon={Icons.Dashboard} label="Dashboard" colorKey="dashboard" onClick={() => setShow(false)} isCollapsed={isCollapsed} />

                    <div className="my-3 border-t border-gray-100" />

                    <NavGroup label="Master Data" isCollapsed={isCollapsed}>
                        <NavItem href={route('master-ruangan.index')} active={!!currentRoute('master-ruangan.*')} icon={Icons.Warehouse} label="Data Ruangan" colorKey="ruangan" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('master-sumber-dana.index')} active={!!currentRoute('master-sumber-dana.*')} icon={Icons.Coins} label="Sumber Dana" colorKey="dana" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('master-kategori.index')} active={!!currentRoute('master-kategori.*')} icon={Icons.ClipboardList} label="Kategori Aset" colorKey="kategori" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                    </NavGroup>

                    <NavGroup label="Inventaris (KIB)" isCollapsed={isCollapsed}>
                        <NavItem href={route('kib-a.index')} active={!!currentRoute('kib-a.*')} icon={Icons.Map} label="KIB A — Tanah" colorKey="kibA" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('kib-b.index')} active={!!currentRoute('kib-b.*')} icon={Icons.Box} label="KIB B — Peralatan" colorKey="kibB" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('kib-c.index')} active={!!currentRoute('kib-c.*')} icon={Icons.Building2} label="KIB C — Gedung" colorKey="kibC" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('kib-d.index')} active={!!currentRoute('kib-d.*')} icon={Icons.Truck} label="KIB D — Jalan" colorKey="kibD" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('kib-e.index')} active={!!currentRoute('kib-e.*')} icon={Icons.Trees} label="KIB E — Aset Lain" colorKey="kibE" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('kib-f.index')} active={!!currentRoute('kib-f.*')} icon={Icons.Construction} label="KIB F — Konstruksi" colorKey="kibF" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                    </NavGroup>

                    <NavGroup label="Operasional" isCollapsed={isCollapsed}>
                        <NavItem href={route('mutasi.index')} active={!!currentRoute('mutasi.*')} icon={Icons.ArrowRightLeft} label="Mutasi Barang" colorKey="mutasi" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('peminjaman.index')} active={!!currentRoute('peminjaman.*')} icon={Icons.Handshake} label="Peminjaman" colorKey="peminjaman" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('pemeliharaan.index')} active={!!currentRoute('pemeliharaan.*')} icon={Icons.Wrench} label="Pemeliharaan" colorKey="pemeliharaan" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('aset-data.index')} active={!!currentRoute('aset-data.*')} icon={Icons.Tags} label="Semua Aset" colorKey="aset" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('laporan.index')} active={!!currentRoute('laporan.*')} icon={Icons.FilePieChart} label="Laporan & PDF" colorKey="laporan" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                    </NavGroup>

                    <NavGroup label="Pengaturan" isCollapsed={isCollapsed}>
                        <NavItem href={route('school-profile.index')} active={!!currentRoute('school-profile.*')} icon={Icons.School} label="Profil Sekolah" colorKey="school" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                        <NavItem href={route('backup-restore.index')} active={!!currentRoute('backup-restore.*')} icon={Icons.Database} label="Backup & Restore" colorKey="backup" onClick={() => setShow(false)} isCollapsed={isCollapsed} />
                    </NavGroup>
                </div>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span className="text-[11px] text-gray-400 font-medium">Sistem aktif & terhubung</span>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
