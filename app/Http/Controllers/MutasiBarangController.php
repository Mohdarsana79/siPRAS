<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\MasterRuangan;
use App\Models\MutasiBarang;
use Illuminate\Http\Request;
use App\Models\SchoolProfile;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MutasiBarangController extends Controller
{
    public function index()
    {
        $mutasis = MutasiBarang::with(['item', 'dariRuangan', 'keRuangan', 'item.ruangan'])
            ->latest()
            ->get();

        $items = Item::with('ruangan')->orderBy('nama_barang')->get();
        $ruangans = MasterRuangan::all();

        return Inertia::render('Mutasi/Index', [
            'mutasis' => $mutasis,
            'items' => $items,
            'ruangans' => $ruangans
        ]);
    }

    /**
     * Defensive show route.
     */
    public function show()
    {
        return redirect()->route('mutasi.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'jenis_mutasi' => 'required|in:Pindah Ruangan,Penghapusan/Afkir',
            'ke_ruangan_id' => 'required_if:jenis_mutasi,Pindah Ruangan|nullable|exists:master_ruangans,id',
            'tipe_penghapusan' => 'required_if:jenis_mutasi,Penghapusan/Afkir|nullable|string',
            'tanggal_mutasi' => 'required|date',
            'keterangan' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            $item = Item::findOrFail($request->item_id);
            $dariRuangan = $item->ruangan_id;

            MutasiBarang::create([
                'item_id' => $request->item_id,
                'jenis_mutasi' => $request->jenis_mutasi,
                'dari_ruangan_id' => $dariRuangan,
                'ke_ruangan_id' => $request->jenis_mutasi === 'Pindah Ruangan' ? $request->ke_ruangan_id : null,
                'tipe_penghapusan' => $request->jenis_mutasi === 'Penghapusan/Afkir' ? $request->tipe_penghapusan : null,
                'tanggal_mutasi' => $request->tanggal_mutasi,
                'keterangan' => $request->keterangan,
                'user_id' => auth()->id() // jika ada fitur auth aktif
            ]);

            // Update lokasi item jika pindah ruangan
            if ($request->jenis_mutasi === 'Pindah Ruangan') {
                $item->update(['ruangan_id' => $request->ke_ruangan_id]);
            }

            // Jika penghapusan, mungkin ubah status kondisi atau note di keterangan. 
            // Untuk saat ini kita simpan data mutasinya saja, barang tetap ada di database tapi di-track pemusnahannya.

            DB::commit();

            return redirect()->route('mutasi.index')->with('success', 'Data Mutasi berhasil dicatat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mencatat mutasi: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        // Fitur hapus riwayat mutasi dibatasi atau dilarang pada sistem akuntansi, 
        // tapi untuk kebebasan CRUD kita allow dengan catatan tidak me-revert posisi barang.
        $mutasi = MutasiBarang::findOrFail($id);
        $mutasi->delete();
        
        return redirect()->route('mutasi.index')->with('success', 'Riwayat mutasi dihapus (Namun posisi barang tidak dikembalikan otomatis).');
    }

    public function cetak(Request $request)
    {
        $paperSize = $request->query('paper_size', 'a4');
        $fontSize = $request->query('font_size', '10pt');
        $orientation = $request->query('orientation', 'landscape');

        // Special case for Folio (not standard in DomPDF)
        if ($paperSize === 'folio') {
            $paperSize = [0, 0, 612, 936]; // 8.5 x 13 inch in points
        }

        $mutasis = MutasiBarang::with(['item', 'dariRuangan', 'keRuangan'])
            ->orderBy('tanggal_mutasi', 'desc')
            ->get();
        
        $profile = SchoolProfile::first();
        $title = "LAPORAN MUTASI BARANG";
        
        $pdf = Pdf::loadView('laporan.mutasi_pdf', [
            'mutasis' => $mutasis,
            'title' => $title,
            'profile' => $profile,
            'fontSize' => $fontSize
        ]);

        return $pdf->setPaper($paperSize, $orientation)->stream($title . '.pdf');
    }
}
