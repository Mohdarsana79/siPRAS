import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import Toast from '@/Components/Toast';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash, errors } = usePage().props as any;
    const user = auth.user;
    const [showingSidebar, setShowingSidebar] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
        } else if (errors && errors.error) {
            setToast({ message: errors.error, type: 'error' });
        }
    }, [flash, errors]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Sidebar Component - Premium Logic */}
            <Sidebar show={showingSidebar} setShow={setShowingSidebar} />

            {/* Main Content Area - Smooth Transitions */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">

                {/* Top Navigation / Header - Premium Aesthetic */}
                <header className="z-40 flex items-center justify-between h-20 sm:h-24 px-4 sm:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-6">
                        {/* Mobile/Tablet toggle - Refined Button */}
                        <button
                            onClick={() => setShowingSidebar(true)}
                            className="flex items-center justify-center p-3 -ml-2 text-indigo-600 dark:text-indigo-400 lg:hidden hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 active:scale-95 shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                            aria-label="Toggle Sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page Header Title - Premium Typography */}
                        <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                            {header ? (
                                <div className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white line-clamp-1">
                                    {header}
                                </div>
                            ) : (
                                <div className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                    Dashboard Utama
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-1 hidden sm:flex">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status: Sesi Aktif</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Notification/Search placeholder if needed can go here */}

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? (
                                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* User Profile Dropdown - Refined Design */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 p-1 transition-all duration-300 rounded-2xl group hover:bg-gray-50/80 dark:hover:bg-gray-800/80 active:scale-95">
                                        <div className="hidden text-right lg:flex flex-col">
                                            <div className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{user.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{user.email}</div>
                                        </div>
                                        <div className="relative shrink-0">
                                            <div className="flex items-center justify-center w-11 h-11 text-lg font-black text-white rounded-[1.25rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-xl shadow-indigo-100 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 border-2 border-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-5 py-4 border-b border-gray-50 bg-indigo-50/30">
                                        <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Akun Anda</div>
                                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                        <div className="text-[11px] font-medium text-gray-500">{user.email}</div>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <div className="flex items-center gap-3 py-1">
                                            <div className="p-1.5 rounded-lg bg-gray-50 text-gray-500">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-gray-700">Pengaturan Profil</span>
                                        </div>
                                    </Dropdown.Link>
                                    <div className="px-2 pb-2 mt-2">
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post" as="button"
                                            className="w-full !bg-rose-50 !hover:bg-rose-100 !text-rose-600 rounded-xl transition-all"
                                        >
                                            <div className="flex items-center gap-3 py-1">
                                                <div className="p-1.5 rounded-lg bg-white/50 text-rose-500">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <span className="font-black text-[11px] uppercase tracking-widest">Keluar Sistem</span>
                                            </div>
                                        </Dropdown.Link>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content - Enhanced Viewport */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="py-6 sm:py-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <div className="px-4 sm:px-8 lg:px-10 mx-auto max-w-[1700px]">
                            {children}
                        </div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none"></div>
                </main>

                {/* Optional Footer - Refined Design */}
                <footer className="px-8 py-4 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 text-center flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors duration-300">
                    <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} siPRAS &mdash; Hak Cipta Dilindungi
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5">
                        Dikembangkan
                        oleh <span className="font-black text-indigo-400 tracking-wide">Moh Gian Darsana, S.Pd.,Gr</span>
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">v2.0.4 Online</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
