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
            'kode_objek' => [
                'required',
                'string',
                'size:2',
                \Illuminate\Validation\Rule::unique('master_objeks')->where(function ($query) use ($request) {
                    return $query->where('kode_kelompok', $request->kode_kelompok)
                                 ->where('kode_jenis', $request->kode_jenis);
                }),
            ],
            'nama_objek' => [
                'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('master_objeks', 'nama_objek')->where(function ($query) use ($request) {
                    return $query->where('kode_kelompok', $request->kode_kelompok)
                                 ->where('kode_jenis', $request->kode_jenis);
                }),
            ],
        ], [
            'nama_objek.unique' => 'objek sudah ada',
            'kode_objek.unique' => 'Kombinasi kode objek ini sudah ada',
        ]);

        MasterObjek::create($request->all());

        return redirect()->route('master-kategori.index', ['tab' => 'objek'])->with('success', 'Objek berhasil ditambahkan.');
    }

    public function update(Request $request, MasterObjek $master_objek)
    {
        $request->validate([
            'kode_kelompok' => 'required|string|size:1',
            'kode_jenis' => 'required|string|size:1',
            'kode_objek' => [
                'required',
                'string',
                'size:2',
                \Illuminate\Validation\Rule::unique('master_objeks')->where(function ($query) use ($request) {
                    return $query->where('kode_kelompok', $request->kode_kelompok)
                                 ->where('kode_jenis', $request->kode_jenis);
                })->ignore($master_objek->id),
            ],
            'nama_objek' => [
                'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('master_objeks', 'nama_objek')->where(function ($query) use ($request) {
                    return $query->where('kode_kelompok', $request->kode_kelompok)
                                 ->where('kode_jenis', $request->kode_jenis);
                })->ignore($master_objek->id),
            ],
        ], [
            'nama_objek.unique' => 'objek sudah ada',
            'kode_objek.unique' => 'Kombinasi kode objek ini sudah ada',
        ]);

        $master_objek->update($request->all());

        return redirect()->route('master-kategori.index', ['tab' => 'objek'])->with('success', 'Objek berhasil diperbarui.');
    }

    public function destroy(MasterObjek $master_objek)
    {
        if ($master_objek->rincianObjeks()->exists()) {
            return redirect()->route('master-kategori.index', ['tab' => 'objek'])->with('error', 'Tidak dapat menghapus objek yang masih memiliki rincian objek.');
        }

        $master_objek->delete();

        return redirect()->route('master-kategori.index', ['tab' => 'objek'])->with('success', 'Objek berhasil dihapus.');
    }
}
