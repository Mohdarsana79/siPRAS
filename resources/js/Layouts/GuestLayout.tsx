import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-6 sm:pt-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden text-gray-900">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-300 opacity-20 blur-[100px] mix-blend-overlay"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-yellow-300 opacity-20 blur-3xl mix-blend-overlay animate-pulse"></div>
            </div>

            <div className="z-10 relative mb-8 flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center group">
                    <div className="bg-white p-3 rounded-2xl shadow-lg shadow-purple-900/20 transform transition duration-300 group-hover:scale-110">
                        <ApplicationLogo className="h-16 w-16 fill-current text-indigo-600" />
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-white tracking-tight drop-shadow-md">siPRAS</h1>
                    <p className="text-purple-100 font-medium tracking-wide">Sarana & Prasarana Sekolah</p>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-2 px-8 py-8 bg-white/90 backdrop-blur-xl shadow-2xl sm:rounded-3xl border border-white/40 z-10 relative transform transition-all">
                {children}
            </div>

            <div className="mt-8 z-10 relative flex flex-col items-center gap-1">
                <p className="text-white/60 text-xs font-medium">
                    &copy; {new Date().getFullYear()} siPRAS &mdash; Hak Cipta Dilindungi
                </p>
                <p className="text-white/50 text-[11px] flex items-center gap-1.5">
                    Dikembangkan
                    oleh <span className="font-bold text-white/80">Moh Gian Darsana, S.Pd.,Gr</span>
                </p>
            </div>
        </div>
    );
}
