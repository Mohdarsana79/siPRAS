<?php

namespace App\Http\Controllers;

use App\Models\MasterKategori;
use App\Models\MasterObjek;
use App\Models\MasterRincianObjek;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MasterKategoriController extends Controller
{
    public function index(Request $request)
    {
        $search = strtolower($request->search);
        $tab = $request->input('tab', 'kategori');

        // Data Level 4 (Objek)
        $objeks = MasterObjek::when($search, function ($q, $search) {
                        $q->where(DB::raw('LOWER(nama_objek)'), 'like', "%{$search}%")
                          ->orWhere(DB::raw('LOWER(kode_objek)'), 'like', "%{$search}%");
                    })->latest()->paginate(10)->withQueryString();

        // Data Level 5 (Rincian Objek)
        $rincianObjeks = MasterRincianObjek::with('objek')
                        ->when($search, function ($q, $search) {
                            $q->where(DB::raw('LOWER(nama_rincian_objek)'), 'like', "%{$search}%")
                              ->orWhere(DB::raw('LOWER(kode_rincian_objek)'), 'like', "%{$search}%")
                              ->orWhereHas('objek', function($sq) use ($search) {
                                  $sq->where(DB::raw('LOWER(nama_objek)'), 'like', "%{$search}%");
                              });
                        })->latest()->paginate(10)->withQueryString();

        // Data Level 6 (Kategori)
        $kategoris = MasterKategori::with(['rincianObjek.objek'])
                        ->when($search, function ($q, $search) {
                            $q->where(DB::raw('LOWER(nama_kategori)'), 'like', "%{$search}%")
                              ->orWhere(DB::raw('LOWER(kode_sub_rincian_objek)'), 'like', "%{$search}%")
                              ->orWhereHas('rincianObjek', function($sq) use ($search) {
                                  $sq->where(DB::raw('LOWER(nama_rincian_objek)'), 'like', "%{$search}%");
                              });
                        })->latest()->paginate(10)->withQueryString();

        return Inertia::render('MasterData/Kategori/Index', [
            'objeks'        => $objeks,
            'rincianObjeks' => $rincianObjeks,
            'kategoris'     => $kategoris,
            'filters'       => [
                'search' => $request->search,
                'tab'    => $tab
            ],
            'kelompokMap'   => MasterKategori::KELOMPOK_NAMA,
            'jenisMap'      => MasterKategori::JENIS_NAMA,
            'jenisToKib'    => MasterKategori::JENIS_TO_KIB,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'master_rincian_objek_id' => 'required|exists:master_rincian_objeks,id',
            'kode_sub_rincian_objek'  => 'required|string|size:2',
            'nama_kategori'           => 'required|string|max:255|unique:master_kategoris,nama_kategori',
        ], [
            'nama_kategori.unique' => 'Kategori sudah ada',
        ]);

        MasterKategori::create($request->all());

        return redirect()->route('master-kategori.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, MasterKategori $master_kategori)
    {
        $request->validate([
            'master_rincian_objek_id' => 'required|exists:master_rincian_objeks,id',
            'kode_sub_rincian_objek'  => 'required|string|size:2',
            'nama_kategori'           => 'required|string|max:255|unique:master_kategoris,nama_kategori,' . $master_kategori->id,
        ], [
            'nama_kategori.unique' => 'Kategori sudah ada',
        ]);

        $master_kategori->update($request->all());

        return redirect()->route('master-kategori.index')->with('success', 'Kategori berhasil diupdate.');
    }

    public function destroy(MasterKategori $master_kategori)
    {
        if ($master_kategori->items()->exists()) {
            $usedBy = $master_kategori->items()->limit(3)->pluck('nama_barang')->join(', ');
            return redirect()->back()->with('error', "used:{$usedBy}");
        }

        $master_kategori->delete();
        return redirect()->route('master-kategori.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
