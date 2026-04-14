<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Pemeliharaan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemeliharaanController extends Controller
{
    public function index()
    {
        $pemeliharaans = Pemeliharaan::with('item')->latest()->get();
        $items = Item::orderBy('nama_barang')->get();

        return Inertia::render('Pemeliharaan/Index', [
            'pemeliharaans' => $pemeliharaans,
            'items' => $items
        ]);
    }

    /**
     * Defensive show route.
     */
    public function show()
    {
        return redirect()->route('pemeliharaan.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'tanggal_pemeliharaan' => 'required|date',
            'jenis_pemeliharaan' => 'required|string|max:255',
            'biaya' => 'required|numeric|min:0',
            'penyedia_jasa' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string'
        ]);

        Pemeliharaan::create([
            'item_id' => $request->item_id,
            'tanggal_pemeliharaan' => $request->tanggal_pemeliharaan,
            'jenis_pemeliharaan' => $request->jenis_pemeliharaan,
            'biaya' => $request->biaya,
            'penyedia_jasa' => $request->penyedia_jasa,
            'keterangan' => $request->keterangan
        ]);

        return redirect()->route('pemeliharaan.index')->with('success', 'Riwayat pemeliharaan berhasil dicatat.');
    }

    public function destroy($id)
    {
        $pemeliharaan = Pemeliharaan::findOrFail($id);
        $pemeliharaan->delete();
        
        return redirect()->route('pemeliharaan.index')->with('success', 'Data pemeliharaan dihapus.');
    }
}
