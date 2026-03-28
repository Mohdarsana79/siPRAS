<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SchoolProfileController extends Controller
{
    public function index()
    {
        $profile = SchoolProfile::first();
        return Inertia::render('SchoolProfile/Index', [
            'profile' => $profile
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'npsn' => 'nullable|string|max:255',
            'kabupaten_kota' => 'nullable|string|max:255',
            'provinsi' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'unor_induk' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'email_sekolah' => 'nullable|email|max:255',
            'nama_kepala_sekolah' => 'nullable|string|max:255',
            'nip_kepala_sekolah' => 'nullable|string|max:255',
            'nama_pengelola_aset' => 'nullable|string|max:255',
            'nip_pengelola_aset' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'logo_daerah' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tipe_wilayah' => 'required|in:kabupaten,kota',
        ]);

        $profile = SchoolProfile::first();
        if (!$profile) {
            $profile = new SchoolProfile();
        }

        $data = $request->except(['logo', 'logo_daerah']);

        if ($request->hasFile('logo')) {
            if ($profile->logo) {
                Storage::disk('public')->delete($profile->logo);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $data['logo'] = $path;
        }

        if ($request->hasFile('logo_daerah')) {
            if ($profile->logo_daerah) {
                Storage::disk('public')->delete($profile->logo_daerah);
            }
            $path = $request->file('logo_daerah')->store('logos', 'public');
            $data['logo_daerah'] = $path;
        }

        $profile->fill($data);
        $profile->save();

        return \redirect()->back()->with('success', 'Profil sekolah berhasil diperbarui.');
    }
}
