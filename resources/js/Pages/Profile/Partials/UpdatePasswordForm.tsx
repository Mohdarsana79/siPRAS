import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const PasswordToggle = ({ show, setShow }: { show: boolean, setShow: (val: boolean) => void }) => (
        <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
        >
            {show ? (
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
    );

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Perbarui Kata Sandi
                    </h2>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                    Pastikan akun Anda menggunakan kata sandi yang kuat dan acak untuk menjaga keamanan data.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" className="text-gray-700 font-bold mb-1.5 ml-1" />

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type={showCurrent ? 'text' : 'password'}
                            className="block w-full pl-11 pr-12 py-3 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                            autoComplete="current-password"
                        />
                        <PasswordToggle show={showCurrent} setShow={setShowCurrent} />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-gray-700 font-bold mb-1.5 ml-1" />

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V7m0 2a2 2 0 012 2m0-2a2 2 0 00-2 2m2-2v2m0 0a2 2 0 012 2m0-2a2 2 0 00-2 2m2-2v2" />
                            </svg>
                        </div>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showNew ? 'text' : 'password'}
                            className="block w-full pl-11 pr-12 py-3 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                            autoComplete="new-password"
                        />
                        <PasswordToggle show={showNew} setShow={setShowNew} />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" className="text-gray-700 font-bold mb-1.5 ml-1" />

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type={showConfirm ? 'text' : 'password'}
                            className="block w-full pl-11 pr-12 py-3 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                            autoComplete="new-password"
                        />
                        <PasswordToggle show={showConfirm} setShow={setShowConfirm} />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        Perbarui Sandi
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Sandi diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
