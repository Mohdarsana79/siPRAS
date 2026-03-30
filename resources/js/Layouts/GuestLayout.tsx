import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-6 sm:pt-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 relative overflow-hidden transition-colors duration-500 text-gray-900 dark:text-gray-100">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white dark:bg-purple-900 opacity-10 blur-3xl mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-300 dark:bg-indigo-900 opacity-20 dark:opacity-30 blur-[100px] mix-blend-overlay"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-yellow-300 dark:bg-pink-900 opacity-20 dark:opacity-30 blur-3xl mix-blend-overlay animate-pulse"></div>
            </div>

            <div className="z-10 relative mb-8 flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center group">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg shadow-purple-900/20 dark:shadow-black/40 transform transition duration-300 group-hover:scale-110">
                        <ApplicationLogo className="h-16 w-16 fill-current text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-white tracking-tight drop-shadow-md">siPRAS</h1>
                    <p className="text-purple-100 font-medium tracking-wide">Sarana & Prasarana Sekolah</p>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-2 px-8 py-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl dark:shadow-black/60 sm:rounded-3xl border border-white/40 dark:border-gray-700/50 z-10 relative transform transition-all">
                {children}
            </div>

            <div className="mt-8 z-10 relative flex flex-col items-center gap-1">
                <p className="text-white/60 dark:text-gray-400 text-xs font-medium">
                    &copy; {new Date().getFullYear()} siPRAS &mdash; Hak Cipta Dilindungi
                </p>
                <p className="text-white/50 dark:text-gray-500 text-[11px] flex items-center gap-1.5">
                    Dikembangkan
                    oleh <span className="font-bold text-white/80 dark:text-gray-300">Moh Gian Darsana, S.Pd.,Gr</span>
                </p>
            </div>
        </div>
    );
}
