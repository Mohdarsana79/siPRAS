<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:' . User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:administrator,kepala sekolah,guru / Staf,siswa,user',
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return Redirect::route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:administrator,kepala sekolah,guru / Staf,siswa,user',
        ]);

        $user->update([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return Redirect::route('users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if (auth()->id() === $user->id) {
            return Redirect::back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return Redirect::route('users.index')->with('success', 'User berhasil dihapus.');
    }
}
