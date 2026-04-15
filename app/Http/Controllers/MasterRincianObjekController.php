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
            'kode_rincian_objek' => [
                'required',
                'string',
                'size:2',
                \Illuminate\Validation\Rule::unique('master_rincian_objeks')->where(function ($query) use ($request) {
                    return $query->where('master_objek_id', $request->master_objek_id);
                }),
            ],
            'nama_rincian_objek' => [
                'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('master_rincian_objeks', 'nama_rincian_objek')->where(function ($query) use ($request) {
                    return $query->where('master_objek_id', $request->master_objek_id);
                }),
            ],
        ], [
            'nama_rincian_objek.unique' => 'rincian objek sudah ada',
            'kode_rincian_objek.unique' => 'Kode rincian objek ini sudah ada untuk objek tersebut',
        ]);

        MasterRincianObjek::create($request->all());

        return redirect()->route('master-kategori.index', ['tab' => 'rincian'])->with('success', 'Rincian objek berhasil ditambahkan.');
    }

    public function update(Request $request, MasterRincianObjek $master_rincian_objek)
    {
        $request->validate([
            'master_objek_id'    => 'required|exists:master_objeks,id',
            'kode_rincian_objek' => [
                'required',
                'string',
                'size:2',
                \Illuminate\Validation\Rule::unique('master_rincian_objeks')->where(function ($query) use ($request) {
                    return $query->where('master_objek_id', $request->master_objek_id);
                })->ignore($master_rincian_objek->id),
            ],
            'nama_rincian_objek' => [
                'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('master_rincian_objeks', 'nama_rincian_objek')->where(function ($query) use ($request) {
                    return $query->where('master_objek_id', $request->master_objek_id);
                })->ignore($master_rincian_objek->id),
            ],
        ], [
            'nama_rincian_objek.unique' => 'rincian objek sudah ada',
            'kode_rincian_objek.unique' => 'Kode rincian objek ini sudah ada untuk objek tersebut',
        ]);

        $master_rincian_objek->update($request->all());

        return redirect()->route('master-kategori.index', ['tab' => 'rincian'])->with('success', 'Rincian objek berhasil diperbarui.');
    }

    public function destroy(MasterRincianObjek $master_rincian_objek)
    {
        if ($master_rincian_objek->kategoris()->exists()) {
            return redirect()->route('master-kategori.index', ['tab' => 'rincian'])->with('error', 'Tidak dapat menghapus rincian objek yang masih memiliki kategori.');
        }

        $master_rincian_objek->delete();

        return redirect()->route('master-kategori.index', ['tab' => 'rincian'])->with('success', 'Rincian objek berhasil dihapus.');
    }
}
