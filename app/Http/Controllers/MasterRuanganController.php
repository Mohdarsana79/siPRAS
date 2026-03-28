<?php

namespace App\Http\Controllers;

use App\Models\MasterRuangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterRuanganController extends Controller
{
    public function index(Request $request)
    {
        $query = MasterRuangan::latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(\Illuminate\Support\Facades\DB::raw('LOWER(nama_ruangan)'), 'like', "%{$search}%")
                      ->orWhere(\Illuminate\Support\Facades\DB::raw('LOWER(kode_ruangan)'), 'like', "%{$search}%")
                      ->orWhere(\Illuminate\Support\Facades\DB::raw('LOWER(penanggung_jawab)'), 'like', "%{$search}%");
            });
        });

        $ruangans = $query->paginate(10)->onEachSide(1)->withQueryString();

        return Inertia::render('MasterData/Ruangan/Index', [
            'ruangans' => $ruangans,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_ruangan' => 'required|string|max:255|unique:master_ruangans,kode_ruangan',
            'nama_ruangan' => 'required|string|max:255',
            'penanggung_jawab' => 'nullable|string|max:255',
        ]);

        MasterRuangan::create($request->all());

        return redirect()->route('master-ruangan.index')->with('success', 'Ruangan berhasil ditambahkan.');
    }

    public function update(Request $request, MasterRuangan $master_ruangan)
    {
        $request->validate([
            'kode_ruangan' => 'required|string|max:255|unique:master_ruangans,kode_ruangan,' . $master_ruangan->id,
            'nama_ruangan' => 'required|string|max:255',
            'penanggung_jawab' => 'nullable|string|max:255',
        ]);

        $master_ruangan->update($request->all());

        return redirect()->route('master-ruangan.index')->with('success', 'Ruangan berhasil diupdate.');
    }

    public function destroy(MasterRuangan $master_ruangan)
    {
        $master_ruangan->delete();
        return redirect()->route('master-ruangan.index')->with('success', 'Ruangan berhasil dihapus.');
    }
}
