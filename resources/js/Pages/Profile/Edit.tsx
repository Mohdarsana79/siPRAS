import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">Profil Pengguna</h2>
                </div>
            }
        >
            <Head title="Profil" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Overview Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                            <div className="px-6 pb-8 text-center -mt-16">
                                <div className="inline-block relative">
                                    <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl">
                                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                                            <span className="text-4xl font-black uppercase">{user.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h3>
                                <p className="text-gray-500 font-medium">{user.email}</p>
                                
                                <div className="mt-8 pt-8 border-t border-gray-50 flex justify-center gap-8">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</p>
                                        <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Aktif</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</p>
                                        <p className="mt-1 text-sm font-bold text-gray-700">Administrator</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                Catatan Keamanan
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Pastikan email Anda selalu valid untuk keperluan pemulihan akun. Jangan bagikan password Anda kepada siapapun.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Info Form */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                            <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                            <div className="p-6 sm:p-10">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>
                        </div>

                        {/* Password Form */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                            <div className="p-1 bg-gradient-to-r from-orange-400 to-rose-500"></div>
                            <div className="p-6 sm:p-10">
                                <UpdatePasswordForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
