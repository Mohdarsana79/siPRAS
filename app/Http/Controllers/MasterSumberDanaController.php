<?php

namespace App\Http\Controllers;

use App\Models\MasterSumberDana;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterSumberDanaController extends Controller
{
    public function index(Request $request)
    {
        $query = MasterSumberDana::latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(\Illuminate\Support\Facades\DB::raw('LOWER(nama_sumber)'), 'like', "%{$search}%")
                      ->orWhere(\Illuminate\Support\Facades\DB::raw('LOWER(kode)'), 'like', "%{$search}%");
            });
        });

        $sumberDanas = $query->paginate(10)->onEachSide(1)->withQueryString();

        return Inertia::render('MasterData/SumberDana/Index', [
            'sumberDanas' => $sumberDanas,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode' => 'required|string|max:255|unique:master_sumber_danas,kode',
            'nama_sumber' => 'required|string|max:255',
        ]);
        MasterSumberDana::create($request->all());
        return redirect()->route('master-sumber-dana.index')->with('success', 'Sumber Dana berhasil ditambahkan.');
    }

    public function update(Request $request, MasterSumberDana $master_sumber_dana)
    {
        $request->validate([
            'kode' => 'required|string|max:255|unique:master_sumber_danas,kode,' . $master_sumber_dana->id,
            'nama_sumber' => 'required|string|max:255',
        ]);
        $master_sumber_dana->update($request->all());
        return redirect()->route('master-sumber-dana.index')->with('success', 'Sumber Dana berhasil diupdate.');
    }

    public function destroy(MasterSumberDana $master_sumber_dana)
    {
        $master_sumber_dana->delete();
        return redirect()->route('master-sumber-dana.index')->with('success', 'Sumber Dana berhasil dihapus.');
    }
}
