import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {

    const [dark, setDark] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored !== null) return stored === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <>
            <Head title="Welcome to siPRAS" />

            <div className={`min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
                {/* Navbar */}
                <header className="absolute top-0 w-full z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4 sm:py-6">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">siPRAS</span>
                            </div>
                            <nav className="flex items-center gap-2 sm:gap-4">
                                {/* Dark Mode Toggle */}
                                <button
                                    id="dark-mode-toggle"
                                    onClick={() => setDark(d => !d)}
                                    aria-label={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0 shadow-inner ${dark ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`absolute top-[4px] left-[4px] w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${dark ? 'translate-x-6 bg-gray-900' : 'translate-x-0 bg-white'}`}
                                    >
                                        {dark ? (
                                            // Moon icon
                                            <svg className="w-3 h-3 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010 9.79h-.01z" />
                                            </svg>
                                        ) : (
                                            // Sun icon
                                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 4.354a.75.75 0 000-1.5V2a.75.75 0 000 1.5V4.354zM12 22a.75.75 0 000-1.5v1.146a.75.75 0 000 .354zM4.929 6.343a.75.75 0 00-1.06-1.06l-.707.707a.75.75 0 001.06 1.06l.707-.707zM19.778 18.364a.75.75 0 00-1.06-1.06l-.707.707a.75.75 0 001.06 1.06l.707-.707zM2 12.75a.75.75 0 000-1.5H.854a.75.75 0 000 1.5H2zM22 12.75a.75.75 0 000-1.5h-1.146a.75.75 0 000 1.5H22zM6.343 19.071a.75.75 0 00-1.06-1.06l-.708.707a.75.75 0 001.061 1.061l.707-.708zM18.364 6.343a.75.75 0 00-1.06-1.061l-.707.708a.75.75 0 001.06 1.06l.707-.707zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                                            </svg>
                                        )}
                                    </span>
                                </button>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className={`font-bold text-xs sm:text-base transition tracking-wide px-2 sm:px-4 py-2 ${dark ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}
                                    >
                                        Beranda
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className={`font-bold text-xs sm:text-base transition tracking-wide px-2 sm:px-4 py-2 ${dark ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="font-bold text-[10px] sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 rounded-full px-3 sm:px-6 py-1.5 sm:py-2 transition transform hover:-translate-y-0.5"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-grow flex flex-col justify-center relative overflow-hidden pb-20 pt-32 lg:pt-40">
                    <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full ${dark ? 'bg-purple-900' : 'bg-purple-300'} mix-blend-multiply filter blur-[100px] opacity-70 animate-blob`}></div>
                    <div className={`absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full ${dark ? 'bg-yellow-900' : 'bg-yellow-300'} mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000`}></div>
                    <div className={`absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full ${dark ? 'bg-pink-900' : 'bg-pink-300'} mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000`}></div>

                    <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
                        <span className={`inline-block py-1 px-3 rounded-full border text-[10px] sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm ${dark ? 'bg-indigo-950 border-indigo-800 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                            ✨ Sistem Inventaris Modern
                        </span>
                        <h1 className={`text-3xl sm:text-7xl font-black tracking-tight mb-4 sm:mb-6 drop-shadow-sm leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                            Manajemen Aset <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                                Lebih Akurat
                            </span>
                        </h1>
                        <p className={`mt-2 sm:mt-4 max-w-lg text-sm sm:text-xl mb-8 sm:mb-10 leading-relaxed px-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                            siPRAS mendigitalisasi Kartu Inventaris Barang (KIB) secara canggih &amp; akurat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-[240px] sm:max-w-none">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg font-black rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-1 text-center"
                                >
                                    Buka Dashboard &rarr;
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg font-black rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-1 text-center"
                                    >
                                        Log in Sekarang
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className={`px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-lg font-black rounded-full transition transform hover:-translate-y-1 text-center border-2 ${dark ? 'text-gray-200 bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-700 shadow-lg shadow-black/30' : 'text-gray-700 bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 shadow-lg shadow-gray-200/50'}`}
                                    >
                                        Daftar Akun
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            <div className={`backdrop-blur-lg rounded-3xl p-8 shadow-xl border hover:-translate-y-2 transition duration-300 ${dark ? 'bg-gray-900/80 border-gray-800/60 shadow-black/30' : 'bg-white/80 border-white/40 shadow-gray-200/50'}`}>
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Pendataan Komprehensif</h3>
                                <p className={`leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Mendukung format standar pemerintah (KIB A-F) mulai dari Tanah, Peralatan, Gedung, Jalan hingga Konstruksi.</p>
                            </div>

                            <div className={`backdrop-blur-lg rounded-3xl p-8 shadow-xl border hover:-translate-y-2 transition duration-300 ${dark ? 'bg-gray-900/80 border-gray-800/60 shadow-black/30' : 'bg-white/80 border-white/40 shadow-gray-200/50'}`}>
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Sistem Operasional Aktif</h3>
                                <p className={`leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Pantau mutasi barang antar ruangan, riwayat peminjaman siswa/guru, serta log anggaran pemeliharaan aset.</p>
                            </div>

                            <div className={`backdrop-blur-lg rounded-3xl p-8 shadow-xl border hover:-translate-y-2 transition duration-300 ${dark ? 'bg-gray-900/80 border-gray-800/60 shadow-black/30' : 'bg-white/80 border-white/40 shadow-gray-200/50'}`}>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Laporan &amp; Statistik</h3>
                                <p className={`leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Cetak Buku Inventaris dalam PDF secara instan, lengkap dengan dashboard persentase penyusutan barang dan kondisi.</p>
                            </div>

                        </div>
                    </div>
                </main>

                <footer className={`w-full border-t py-6 sm:py-8 relative z-10 transition-colors duration-300 ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-sm font-bold text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <p>&copy; {new Date().getFullYear()} Aplikasi siPRAS. Untuk Kemajuan Sekolah.</p>
                        <div className="mt-2 md:mt-0 space-x-2">
                            <span>Vite Build</span>
                            <span>•</span>
                            <span>PHP v{phpVersion}</span>
                        </div>
                    </div>
                </footer>
            </div>
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
