import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Informasi Profil
                    </h2>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                    Perbarui informasi profil akun dan alamat email Anda untuk memastikan data tetap akurat.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700 font-bold mb-1.5 ml-1" />

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <TextInput
                            id="name"
                            className="block w-full pl-11 pr-4 py-3 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-gray-700 font-bold mb-1.5 ml-1" />

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full pl-11 pr-4 py-3 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-800 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Alamat email Anda belum terverifikasi.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-2 text-sm font-bold text-amber-700 hover:text-amber-900 underline underline-offset-4"
                        >
                            Klik di sini untuk mengirim ulang email verifikasi.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-3 text-sm font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                Link verifikasi baru telah dikirimkan ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        Simpan Perubahan
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
                            Berhasil disimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
