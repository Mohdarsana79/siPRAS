<?php

namespace App\Http\Controllers;

use App\Models\MasterRincianObjek;
use Illuminate\Http\Request;

class MasterRincianObjekController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'master_objek_id'    => 'required|exists:master_objeks,id',
            'kode_rincian_objek' => 'required|string|size:2',
            'nama_rincian_objek' => 'required|string|max:255|unique:master_rincian_objeks,nama_rincian_objek',
        ], [
            'nama_rincian_objek.unique' => 'rincian objek sudah ada',
        ]);

        MasterRincianObjek::create($request->all());

        return back()->with('success', 'Rincian objek berhasil ditambahkan.');
    }

    public function update(Request $request, MasterRincianObjek $master_rincian_objek)
    {
        $request->validate([
            'master_objek_id'    => 'required|exists:master_objeks,id',
            'kode_rincian_objek' => 'required|string|size:2',
            'nama_rincian_objek' => 'required|string|max:255|unique:master_rincian_objeks,nama_rincian_objek,' . $master_rincian_objek->id,
        ], [
            'nama_rincian_objek.unique' => 'rincian objek sudah ada',
        ]);

        $master_rincian_objek->update($request->all());

        return back()->with('success', 'Rincian objek berhasil diperbarui.');
    }

    public function destroy(MasterRincianObjek $master_rincian_objek)
    {
        if ($master_rincian_objek->kategoris()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus rincian objek yang masih memiliki kategori.');
        }

        $master_rincian_objek->delete();

        return back()->with('success', 'Rincian objek berhasil dihapus.');
    }
}
