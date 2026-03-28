<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Determine whether registration is still allowed (0 users exist).
     */
    private function registrationAllowed(): bool
    {
        return User::count() === 0;
    }

    /**
     * Display the registration view.
     * Redirects to login if a user already exists.
     */
    public function create(): Response|RedirectResponse
    {
        if (!$this->registrationAllowed()) {
            return redirect()->route('login')
                ->with('status', 'Pendaftaran ditutup. Sistem hanya mengizinkan satu akun.');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Double-check at the POST level — cannot be bypassed
        if (!$this->registrationAllowed()) {
            abort(403, 'Pendaftaran ditutup. Sistem hanya mengizinkan satu akun.');
        }

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
