<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibBPeralatan;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KibBPeralatanController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['kibB', 'kategori', 'ruangan', 'sumberDana'])
            ->whereHas('kategori', function ($query) {
                $query->where('tipe_kib', 'B');
            })->latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(DB::raw('LOWER(nama_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(kode_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(nomor_register)'), 'like', "%{$search}%");
            });
        });

        $items = $query->paginate(10)->onEachSide(1)->withQueryString();

        $kategoris = MasterKategori::where('tipe_kib', 'B')->get();
        $ruangans = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibB/Index', [
            'items' => $items,
            'kategoris' => $kategoris,
            'ruangans' => $ruangans,
            'sumberDanas' => $sumberDanas,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            // Validasi Item
            'kategori_id' => 'required|exists:master_kategoris,id',
            'ruangan_id' => 'nullable|exists:master_ruangans,id',
            'sumber_dana_id' => 'required|exists:master_sumber_danas,id',
            'kode_barang' => 'required|string|max:255',
            'nama_barang' => 'required|string|max:255',
            'nomor_register' => 'required|string|max:255',
            'kondisi' => 'required|in:Baik,Kurang Baik,Rusak Berat',
            'tanggal_perolehan' => 'required|date',
            'harga' => 'required|numeric|min:0',
            'asal_usul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            
            // Validasi spesifik KIB B
            'merk_tipe' => 'required|string|max:255',
            'ukuran_cc' => 'nullable|string|max:255',
            'bahan' => 'required|string|max:255',
            'tahun_pembuatan' => 'required|digits:4|integer|min:1900|max:' . (date('Y') + 1),
            'nomor_pabrik' => 'nullable|string|max:255',
            'nomor_rangka' => 'nullable|string|max:255',
            'nomor_mesin' => 'nullable|string|max:255',
            'nomor_polisi' => 'nullable|string|max:255',
            'nomor_bpkb' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $item = Item::create($request->only([
                'kategori_id', 'ruangan_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]));

            KibBPeralatan::create([
                'item_id' => $item->id,
                'merk_tipe' => $request->merk_tipe,
                'ukuran_cc' => $request->ukuran_cc,
                'bahan' => $request->bahan,
                'tahun_pembuatan' => $request->tahun_pembuatan,
                'nomor_pabrik' => $request->nomor_pabrik,
                'nomor_rangka' => $request->nomor_rangka,
                'nomor_mesin' => $request->nomor_mesin,
                'nomor_polisi' => $request->nomor_polisi,
                'nomor_bpkb' => $request->nomor_bpkb,
            ]);

            DB::commit();

            return redirect()->route('kib-b.index')->with('success', 'Data KIB B berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            // Validasi Item
            'kategori_id' => 'required|exists:master_kategoris,id',
            'ruangan_id' => 'nullable|exists:master_ruangans,id',
            'sumber_dana_id' => 'required|exists:master_sumber_danas,id',
            'kode_barang' => 'required|string|max:255',
            'nama_barang' => 'required|string|max:255',
            'nomor_register' => 'required|string|max:255',
            'kondisi' => 'required|in:Baik,Kurang Baik,Rusak Berat',
            'tanggal_perolehan' => 'required|date',
            'harga' => 'required|numeric|min:0',
            'asal_usul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            
            // Validasi spesifik KIB B
            'merk_tipe' => 'required|string|max:255',
            'ukuran_cc' => 'nullable|string|max:255',
            'bahan' => 'required|string|max:255',
            'tahun_pembuatan' => 'required|digits:4|integer|min:1900|max:' . (date('Y') + 1),
            'nomor_pabrik' => 'nullable|string|max:255',
            'nomor_rangka' => 'nullable|string|max:255',
            'nomor_mesin' => 'nullable|string|max:255',
            'nomor_polisi' => 'nullable|string|max:255',
            'nomor_bpkb' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $item = Item::findOrFail($id);
            $item->update($request->only([
                'kategori_id', 'ruangan_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]));

            $kibB = KibBPeralatan::where('item_id', $id)->firstOrFail();
            $kibB->update([
                'merk_tipe' => $request->merk_tipe,
                'ukuran_cc' => $request->ukuran_cc,
                'bahan' => $request->bahan,
                'tahun_pembuatan' => $request->tahun_pembuatan,
                'nomor_pabrik' => $request->nomor_pabrik,
                'nomor_rangka' => $request->nomor_rangka,
                'nomor_mesin' => $request->nomor_mesin,
                'nomor_polisi' => $request->nomor_polisi,
                'nomor_bpkb' => $request->nomor_bpkb,
            ]);

            DB::commit();

            return redirect()->route('kib-b.index')->with('success', 'Data KIB B berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete(); 
        
        return redirect()->route('kib-b.index')->with('success', 'Data KIB B berhasil dihapus.');
    }
}
