<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibEAsetLainnya;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KibEAsetLainnyaController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['kibE', 'kategori', 'ruangan', 'sumberDana'])
            ->whereHas('kategori', function ($query) {
                $query->where('tipe_kib', 'E');
            })->latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(DB::raw('LOWER(nama_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(kode_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(nomor_register)'), 'like', "%{$search}%")
                      ->orWhereHas('kibE', function ($queryKibE) use ($search) {
                          $queryKibE->where(DB::raw('LOWER(judul_buku_nama_kesenian)'), 'like', "%{$search}%");
                      });
            });
        });

        $items = $query->paginate(10)->onEachSide(1)->withQueryString();

        $kategoris = MasterKategori::where('tipe_kib', 'E')->get();
        $ruangans = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibE/Index', [
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
            
            // Validasi spesifik KIB E
            'judul_buku_nama_kesenian' => 'nullable|string|max:255',
            'pencipta' => 'nullable|string|max:255',
            'spesifikasi' => 'nullable|string|max:255',
            'asal_daerah' => 'nullable|string|max:255',
            'bahan' => 'nullable|string|max:255',
            'jenis_hewan_tumbuhan' => 'nullable|string|max:255',
            'ukuran' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $item = Item::create($request->only([
                'kategori_id', 'ruangan_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]));

            KibEAsetLainnya::create([
                'item_id' => $item->id,
                'judul_buku_nama_kesenian' => $request->judul_buku_nama_kesenian,
                'pencipta' => $request->pencipta,
                'spesifikasi' => $request->spesifikasi,
                'asal_daerah' => $request->asal_daerah,
                'bahan' => $request->bahan,
                'jenis_hewan_tumbuhan' => $request->jenis_hewan_tumbuhan,
                'ukuran' => $request->ukuran,
            ]);

            DB::commit();

            return redirect()->route('kib-e.index')->with('success', 'Data KIB E berhasil ditambahkan.');
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
            
            // Validasi spesifik KIB E
            'judul_buku_nama_kesenian' => 'nullable|string|max:255',
            'pencipta' => 'nullable|string|max:255',
            'spesifikasi' => 'nullable|string|max:255',
            'asal_daerah' => 'nullable|string|max:255',
            'bahan' => 'nullable|string|max:255',
            'jenis_hewan_tumbuhan' => 'nullable|string|max:255',
            'ukuran' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $item = Item::findOrFail($id);
            $item->update($request->only([
                'kategori_id', 'ruangan_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]));

            $kibE = KibEAsetLainnya::where('item_id', $id)->firstOrFail();
            $kibE->update([
                'judul_buku_nama_kesenian' => $request->judul_buku_nama_kesenian,
                'pencipta' => $request->pencipta,
                'spesifikasi' => $request->spesifikasi,
                'asal_daerah' => $request->asal_daerah,
                'bahan' => $request->bahan,
                'jenis_hewan_tumbuhan' => $request->jenis_hewan_tumbuhan,
                'ukuran' => $request->ukuran,
            ]);

            DB::commit();

            return redirect()->route('kib-e.index')->with('success', 'Data KIB E berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete(); 
        
        return redirect()->route('kib-e.index')->with('success', 'Data KIB E berhasil dihapus.');
    }
}
