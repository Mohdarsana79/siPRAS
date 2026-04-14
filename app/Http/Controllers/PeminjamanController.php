<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    public function index()
    {
        $peminjamans = Peminjaman::with('item')->latest()->get();
        // Hanya bisa meminjam barang yang belum dipinjam/sudah dikembalikan
        $items = Item::whereDoesntHave('peminjamans', function($q) {
            $q->where('status', 'Dipinjam')->orWhere('status', 'Terlambat');
        })->orderBy('nama_barang')->get();

        return Inertia::render('Peminjaman/Index', [
            'peminjamans' => $peminjamans,
            'items' => $items
        ]);
    }

    /**
     * Defensive show route.
     */
    public function show()
    {
        return redirect()->route('peminjaman.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'nama_peminjam' => 'required|string|max:255',
            'nip_nik' => 'nullable|string|max:255',
            'tanggal_pinjam' => 'required|date',
            'estimasi_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
            'keterangan' => 'nullable|string'
        ]);

        Peminjaman::create([
            'item_id' => $request->item_id,
            'nama_peminjam' => $request->nama_peminjam,
            'nip_nik' => $request->nip_nik,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'estimasi_kembali' => $request->estimasi_kembali,
            'status' => 'Dipinjam',
            'keterangan' => $request->keterangan
        ]);

        return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil dicatat.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Dipinjam,Dikembalikan,Terlambat',
            'tanggal_kembali' => 'required_if:status,Dikembalikan|nullable|date',
        ]);

        $peminjaman = Peminjaman::findOrFail($id);
        
        $peminjaman->update([
            'status' => $request->status,
            'tanggal_kembali' => $request->status === 'Dikembalikan' ? ($request->tanggal_kembali ?? now()) : null
        ]);

        return redirect()->route('peminjaman.index')->with('success', 'Status peminjaman berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $peminjaman = Peminjaman::findOrFail($id);
        $peminjaman->delete();
        
        return redirect()->route('peminjaman.index')->with('success', 'Riwayat peminjaman dihapus.');
    }
}
