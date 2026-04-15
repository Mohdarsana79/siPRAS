import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import Toast from '@/Components/Toast';
import Modal from '@/Components/Modal';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash, errors, hasSchoolProfile } = usePage().props as any;
    const user = auth.user;
    const [showingSidebar, setShowingSidebar] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const isDashboard = route().current('dashboard');
    const isSchoolProfile = route().current('school-profile.index') || route().current('school-profile.update');
    const isBackupRestore = route().current('backup-restore.index');
    const showProfileWarning = typeof route === 'function' ? (!hasSchoolProfile && !isDashboard && !isSchoolProfile && !isBackupRestore) : false;

    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
        } else if (errors && errors.error) {
            setToast({ message: errors.error, type: 'error' });
        }
    }, [flash, errors]);

    // Auto reload on idle (1 hour) to prevent CSRF error 419
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                window.location.reload();
            }, 3600000); // 1 Jam (3600000 ms)
        };

        // Setup activity events
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Start initial timer
        resetTimer();

        return () => {
            clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Sidebar show={showingSidebar} setShow={setShowingSidebar} />

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* Topbar */}
                <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile sidebar toggle */}
                        <button
                            onClick={() => setShowingSidebar(true)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            aria-label="Buka Sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page title */}
                        {header && (
                            <div className="text-base font-semibold text-gray-800 line-clamp-1">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white text-sm font-semibold flex-shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:flex flex-col text-left">
                                        <span className="text-sm font-semibold text-gray-800 leading-none">{user.name}</span>
                                        <span className="text-[11px] text-gray-400 mt-0.5">{user.email}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-xs text-gray-500">Masuk sebagai</p>
                                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Pengaturan Profil
                                    </div>
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    <div className="flex items-center gap-2 text-red-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </div>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="px-4 sm:px-6 py-6 max-w-[1700px] mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="px-6 py-2.5 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0">
                    <p className="text-[11px] text-gray-400">
                        &copy; {new Date().getFullYear()} siPRAS &mdash; Semua hak dilindungi
                    </p>
                    <p className="text-[11px] text-gray-400 hidden sm:block">
                        Dibuat oleh <span className="font-semibold text-indigo-500">Moh Gian Darsana, S.Pd.,Gr</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[11px] text-gray-400">v2.0.4</span>
                    </div>
                </footer>
            </div>

            {/* School Profile Warning Modal */}
            <Modal show={showProfileWarning && !showingSidebar} maxWidth="sm" closeable={false} onClose={() => {}}>
                <div className="p-6 text-center">
                    <div className="flex items-center justify-center w-14 h-14 mx-auto bg-amber-50 rounded-2xl mb-4">
                        <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Profil Sekolah Belum Diisi</h3>
                    <p className="text-sm text-gray-500 mb-5">
                        Lengkapi profil instansi/sekolah terlebih dahulu untuk mengakses fitur sistem.
                    </p>
                    <Link
                        href={route('school-profile.index')}
                        className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Isi Profil Sekarang
                    </Link>
                </div>
            </Modal>
        </div>
    );
}
