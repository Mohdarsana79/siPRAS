import FormModal from '@/Components/FormModal';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
                    <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                    HAPUS AKUN
                </h2>

                <p className="mt-2 text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Sebelum menghapus akun, harap unduh data atau informasi apa pun yang ingin Anda pertahankan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="!rounded-xl !px-6 !py-3 !font-black !text-[10px] !tracking-widest shadow-xl shadow-rose-100">
                HAPUS AKUN SAYA
            </DangerButton>

            <FormModal
                show={confirmingUserDeletion}
                onClose={closeModal}
                title="Konfirmasi Hapus Akun"
                subtitle="Tindakan ini permanen dan tidak dapat dibatalkan"
                maxWidth="md"
                accentColor="rose"
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                onSubmit={deleteUser}
                submitLabel="Ya, Hapus Akun Saya"
                processing={processing}
            >
                <div className="space-y-6">
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        Apakah Anda yakin ingin menghapus akun Anda? Masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="Kata Sandi Konfirmasi" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-gray-50/50 font-bold"
                            placeholder="Masukkan kata sandi untuk menghapus"
                            isFocused
                        />
                        <InputError message={errors.password} />
                    </div>
                </div>
            </FormModal>
        </section>
    );
}
