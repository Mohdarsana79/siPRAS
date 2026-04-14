<?php

namespace App\Http\Controllers;

use App\Models\MasterObjek;
use Illuminate\Http\Request;

class MasterObjekController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'kode_kelompok' => 'required|string|size:1',
            'kode_jenis' => 'required|string|size:1',
            'kode_objek' => 'required|string|size:2',
            'nama_objek' => 'required|string|max:255',
        ]);

        MasterObjek::create($request->all());

        return back()->with('success', 'Objek berhasil ditambahkan.');
    }

    public function update(Request $request, MasterObjek $master_objek)
    {
        $request->validate([
            'kode_kelompok' => 'required|string|size:1',
            'kode_jenis' => 'required|string|size:1',
            'kode_objek' => 'required|string|size:2',
            'nama_objek' => 'required|string|max:255',
        ]);

        $master_objek->update($request->all());

        return back()->with('success', 'Objek berhasil diperbarui.');
    }

    public function destroy(MasterObjek $master_objek)
    {
        if ($master_objek->rincianObjeks()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus objek yang masih memiliki rincian objek.');
        }

        $master_objek->delete();

        return back()->with('success', 'Objek berhasil dihapus.');
    }
}
