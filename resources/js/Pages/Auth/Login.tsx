import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200 ">
                    {status}
                </div>
            )}

            <div className="mb-8 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Selamat Datang</h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">Lengkapi detail di bawah untuk masuk ke akun Anda</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="relative group">
                    <InputLabel htmlFor="login" value="Email atau Username" className="font-bold text-gray-700 ml-1 mb-1.5 flex items-center gap-2" />
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <TextInput
                            id="login"
                            type="text"
                            name="login"
                            placeholder="Email atau Username"
                            value={data.login}
                            className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all shadow-sm bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400 "
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('login', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.login} className="mt-1.5 ml-1" />
                </div>

                <div className="relative group">
                    <InputLabel htmlFor="password" value="Password" className="font-bold text-gray-700 ml-1 mb-1.5 flex items-center gap-2" />
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
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
                            className="block w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all shadow-sm bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400 "
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
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
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 group-hover:border-indigo-400 transition"
                            onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                        />
                        <span className="ms-2.5 text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition">
                            Ingat Saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full text-base py-4 !rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={processing}>
                        Masuk Sekarang
                    </PrimaryButton>
                </div>
                
                {canRegister && (
                    <>
                        <div className="relative flex items-center justify-center my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 "></div>
                            </div>
                            <div className="relative px-4 bg-transparent text-xs font-bold text-gray-400 uppercase tracking-widest">Atau</div>
                        </div>

                        <p className="text-center text-sm text-gray-600 ">
                            Belum punya akun? <Link href={route('register')} className="font-bold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 decoration-2">Daftar sekarang</Link>
                        </p>
                    </>
                )}
            </form>
        </GuestLayout>
    );
}
