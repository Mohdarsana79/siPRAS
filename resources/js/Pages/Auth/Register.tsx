import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200', text: 'text-gray-500', width: '0%' };
    
    let conditions = 0;
    if (password.length >= 8) conditions++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) conditions++;
    if (/[0-9]/.test(password)) conditions++;
    if (/[^A-Za-z0-9]/.test(password)) conditions++;

    if (conditions <= 2) return { score: 1, label: 'Lemah', color: 'bg-red-500', text: 'text-red-500', width: '33.33%' };
    if (conditions === 3) return { score: 2, label: 'Sedang', color: 'bg-yellow-400', text: 'text-yellow-600', width: '66.66%' };
    return { score: 3, label: 'Kuat', color: 'bg-emerald-500', text: 'text-emerald-500', width: '100%' };
};

export default function Register({ canRegister = true }: { canRegister?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Cek secara manual agar form tidak di-submit jika password tidak memenuhi standar
        if (getPasswordStrength(data.password).score < 3) return;
        
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const strength = getPasswordStrength(data.password);

    // Fallback: if somehow user reaches this page when registration is closed
    if (!canRegister) {
        return (
            <GuestLayout>
                <Head title="Pendaftaran Ditutup" />
                <div className="text-center py-4">
                    <div className="inline-flex p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Pendaftaran Ditutup</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                        Sistem ini hanya mengizinkan <strong>satu akun</strong> administrator.<br />
                        Pendaftaran akun baru tidak tersedia.
                    </p>
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                        </svg>
                        Kembali ke Halaman Login
                    </Link>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-4 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Buat Akun</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Daftar untuk mulai mengelola inventaris sekolah</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="relative group">
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5 flex items-center gap-2" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={data.name}
                            className="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700/60 focus:border-purple-500 focus:ring-purple-500 transition-all shadow-sm bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1.5 ml-1" />
                </div>

                <div className="relative group">
                    <InputLabel htmlFor="email" value="Alamat Email" className="font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5 flex items-center gap-2" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="nama@email.com"
                            value={data.email}
                            className="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700/60 focus:border-purple-500 focus:ring-purple-500 transition-all shadow-sm bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 ml-1" />
                </div>

                <div className="relative group">
                    <InputLabel htmlFor="password" value="Password" className="font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5 flex items-center gap-2" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={data.password}
                            className="block w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 dark:border-gray-700/60 focus:border-purple-500 focus:ring-purple-500 transition-all shadow-sm bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5 ml-1" />
                    
                    {/* Password Strength UI */}
                    <div className="mt-3 ml-1 mr-1">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Kekuatan Password</span>
                            {data.password && (
                                <span className={`text-xs font-bold ${strength.text}`}>
                                    {strength.label}
                                </span>
                            )}
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden flex">
                            <div 
                                className={`h-full transition-all duration-500 ease-out ${strength.color}`} 
                                style={{ width: strength.width }}
                            ></div>
                        </div>
                        <div className="mt-2.5 grid grid-cols-2 gap-y-1.5 text-[10px] sm:text-xs">
                            <span className={`flex items-center gap-1.5 ${data.password.length >= 8 ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                8+ Karakter
                            </span>
                            <span className={`flex items-center gap-1.5 ${/[A-Z]/.test(data.password) && /[a-z]/.test(data.password) ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Huruf Besar & Kecil
                            </span>
                            <span className={`flex items-center gap-1.5 ${/[0-9]/.test(data.password) ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Minimal 1 Angka
                            </span>
                            <span className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(data.password) ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Karakter Unik (!@#)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5 flex items-center gap-2" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            placeholder="••••••••"
                            value={data.password_confirmation}
                            className="block w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 dark:border-gray-700/60 focus:border-purple-500 focus:ring-purple-500 transition-all shadow-sm bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1.5 ml-1" />
                </div>

                <div className="pt-4">
                    <PrimaryButton 
                        className="w-full text-base py-4 !rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-200 transition-all hover:scale-[1.02]" 
                        disabled={processing || strength.score < 3}
                    >
                        Daftar Akun
                    </PrimaryButton>
                </div>

                <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative px-4 bg-transparent text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sudah punya?</div>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Sudah mendaftar? <Link href={route('login')} className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline decoration-purple-200 dark:decoration-purple-800 underline-offset-4 decoration-2">Masuk di sini</Link>
                </p>
            </form>
        </GuestLayout>
    );
}
