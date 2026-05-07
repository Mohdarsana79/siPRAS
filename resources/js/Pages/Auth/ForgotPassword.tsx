import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const submitEmail: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => setStep(2),
        });
    };

    const submitOtp: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.verify-otp'), {
            onSuccess: () => setStep(3),
        });
    };

    const submitNewPassword: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store-otp'), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-8 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 animate-bounce">
                    {step === 1 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    )}
                    {step === 2 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    )}
                    {step === 3 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    )}
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {step === 1 && "Lupa Password"}
                    {step === 2 && "Verifikasi OTP"}
                    {step === 3 && "Buat Password Baru"}
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                    {step === 1 && "Masukkan email Anda untuk menerima kode OTP"}
                    {step === 2 && "Masukkan 6 digit kode OTP yang telah dikirim ke email Anda"}
                    {step === 3 && "Silakan buat password baru untuk akun Anda"}
                </p>
            </div>

            {status && (
                <div className="mb-6 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-center">
                    {status}
                </div>
            )}

            {step === 1 && (
                <form onSubmit={submitEmail} className="space-y-5">
                    <div className="relative group">
                        <InputLabel htmlFor="email" value="Alamat Email" className="font-bold text-gray-700 ml-1 mb-1.5 flex items-center gap-2" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
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
                                className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all shadow-sm bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5 ml-1" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center text-base py-4 !rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={processing}>
                            Kirim Kode OTP
                        </PrimaryButton>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={submitOtp} className="space-y-5">
                    <div className="relative group">
                        <InputLabel htmlFor="otp" value="Kode OTP" className="font-bold text-gray-700 ml-1 mb-1.5 flex items-center gap-2" />
                        <div className="relative">
                            <TextInput
                                id="otp"
                                type="text"
                                name="otp"
                                placeholder="Masukkan 6 Digit OTP"
                                value={data.otp}
                                maxLength={6}
                                className="block w-full text-center tracking-[0.5em] font-bold text-lg py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all shadow-sm bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                isFocused={true}
                                onChange={(e) => setData('otp', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.otp} className="mt-1.5 text-center" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center text-base py-4 !rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={processing}>
                            Verifikasi OTP
                        </PrimaryButton>
                    </div>

                    <div className="text-center mt-4">
                        <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition">
                            Kirim ulang ke email lain
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={submitNewPassword} className="space-y-5">
                    <div className="relative group">
                        <InputLabel htmlFor="password" value="Password Baru" className="font-bold text-gray-700 ml-1 mb-1.5 flex items-center gap-2" />
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
                                className="block w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all shadow-sm bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                isFocused={true}
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

                    <div className="relative group">
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="font-bold text-gray-700 ml-1 mb-1.5 flex items-center gap-2" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                name="password_confirmation"
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                className="block w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all shadow-sm bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                                {showPasswordConfirmation ? (
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

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center text-base py-4 !rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02]" disabled={processing}>
                            Simpan Password Baru
                        </PrimaryButton>
                    </div>
                </form>
            )}

            <div className="mt-8 text-center">
                <Link href={route('login')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                    &larr; Kembali ke halaman Login
                </Link>
            </div>
        </GuestLayout>
    );
}
