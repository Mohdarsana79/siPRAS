<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request (Generate OTP).
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Kami tidak dapat menemukan pengguna dengan alamat email tersebut.'],
            ]);
        }

        // Generate 6 digit OTP
        $otp = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Save to cache for 15 minutes
        Cache::put('otp_' . $request->email, $otp, now()->addMinutes(15));

        // Send Email
        Mail::to($request->email)->send(new OtpMail($otp));

        return back()->with('status', 'Kode OTP telah dikirim ke email Anda.');
    }

    /**
     * Verify OTP.
     * 
     * @throws ValidationException
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $cachedOtp = Cache::get('otp_' . $request->email);

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        return back()->with('status', 'Kode OTP valid. Silakan masukkan password baru Anda.');
    }
}
