<?php

namespace App\Http\Controllers;

use App\Models\MasterKategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterKategoriController extends Controller
{
    public function index(Request $request)
    {
        $query = MasterKategori::latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(\Illuminate\Support\Facades\DB::raw('LOWER(nama_kategori)'), 'like', "%{$search}%")
                      ->orWhere(\Illuminate\Support\Facades\DB::raw('LOWER(kode_kategori)'), 'like', "%{$search}%")
                      ->orWhere(\Illuminate\Support\Facades\DB::raw('LOWER(tipe_kib)'), 'like', "%{$search}%");
            });
        });

        $kategoris = $query->paginate(10)->onEachSide(1)->withQueryString();

        return Inertia::render('MasterData/Kategori/Index', [
            'kategoris' => $kategoris,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_kategori' => 'required|string|max:255|unique:master_kategoris,kode_kategori',
            'nama_kategori' => 'required|string|max:255',
            'tipe_kib' => 'required|in:A,B,C,D,E,F',
        ]);
        MasterKategori::create($request->all());
        return redirect()->route('master-kategori.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, MasterKategori $master_kategori)
    {
        $request->validate([
            'kode_kategori' => 'required|string|max:255|unique:master_kategoris,kode_kategori,' . $master_kategori->id,
            'nama_kategori' => 'required|string|max:255',
            'tipe_kib' => 'required|in:A,B,C,D,E,F',
        ]);
        $master_kategori->update($request->all());
        return redirect()->route('master-kategori.index')->with('success', 'Kategori berhasil diupdate.');
    }

    public function destroy(MasterKategori $master_kategori)
    {
        $master_kategori->delete();
        return redirect()->route('master-kategori.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
