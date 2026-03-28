<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibCGedung;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KibCGedungController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['kibC', 'kategori', 'ruangan', 'ruangans', 'sumberDana'])
            ->whereHas('kategori', function ($query) {
                $query->where('tipe_kib', 'C');
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

        $kategoris = MasterKategori::where('tipe_kib', 'C')->get();
        $ruangans = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibC/Index', [
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
            'ruangan_id' => 'nullable|array',
            'ruangan_id.*' => 'exists:master_ruangans,id',
            'sumber_dana_id' => 'required|exists:master_sumber_danas,id',
            'kode_barang' => 'required|string|max:255',
            'nama_barang' => 'required|string|max:255',
            'nomor_register' => 'required|string|max:255',
            'kondisi' => 'required|in:Baik,Kurang Baik,Rusak Berat',
            'tanggal_perolehan' => 'required|date',
            'harga' => 'required|numeric|min:0',
            'asal_usul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            
            // Validasi spesifik KIB C
            'kondisi_bangunan' => 'required|string|max:255',
            'konstruksi_bertingkat' => 'required|boolean',
            'konstruksi_beton' => 'required|boolean',
            'luas_lantai' => 'required|numeric|min:0',
            'letak_alamat' => 'required|string',
            'dokumen_tanggal' => 'required|date',
            'dokumen_nomor' => 'required|string|max:255',
            'status_tanah' => 'required|string|max:255',
            'kode_tanah' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $itemData = $request->only([
                'kategori_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]);
            $itemData['ruangan_id'] = null;
            $item = Item::create($itemData);

            if ($request->has('ruangan_id')) {
                $item->ruangans()->sync($request->ruangan_id ?? []);
            }

            KibCGedung::create([
                'item_id' => $item->id,
                'kondisi_bangunan' => $request->kondisi_bangunan,
                'konstruksi_bertingkat' => $request->konstruksi_bertingkat,
                'konstruksi_beton' => $request->konstruksi_beton,
                'luas_lantai' => $request->luas_lantai,
                'letak_alamat' => $request->letak_alamat,
                'dokumen_tanggal' => $request->dokumen_tanggal,
                'dokumen_nomor' => $request->dokumen_nomor,
                'status_tanah' => $request->status_tanah,
                'kode_tanah' => $request->kode_tanah,
            ]);

            DB::commit();

            return redirect()->route('kib-c.index')->with('success', 'Data KIB C berhasil ditambahkan.');
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
            'ruangan_id' => 'nullable|array',
            'ruangan_id.*' => 'exists:master_ruangans,id',
            'sumber_dana_id' => 'required|exists:master_sumber_danas,id',
            'kode_barang' => 'required|string|max:255',
            'nama_barang' => 'required|string|max:255',
            'nomor_register' => 'required|string|max:255',
            'kondisi' => 'required|in:Baik,Kurang Baik,Rusak Berat',
            'tanggal_perolehan' => 'required|date',
            'harga' => 'required|numeric|min:0',
            'asal_usul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            
            // Validasi spesifik KIB C
            'kondisi_bangunan' => 'required|string|max:255',
            'konstruksi_bertingkat' => 'required|boolean',
            'konstruksi_beton' => 'required|boolean',
            'luas_lantai' => 'required|numeric|min:0',
            'letak_alamat' => 'required|string',
            'dokumen_tanggal' => 'required|date',
            'dokumen_nomor' => 'required|string|max:255',
            'status_tanah' => 'required|string|max:255',
            'kode_tanah' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $itemData = $request->only([
                'kategori_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]);
            $itemData['ruangan_id'] = null;

            $item = Item::findOrFail($id);
            $item->update($itemData);

            if ($request->has('ruangan_id')) {
                $item->ruangans()->sync($request->ruangan_id ?? []);
            }

            $kibC = KibCGedung::where('item_id', $id)->firstOrFail();
            $kibC->update([
                'kondisi_bangunan' => $request->kondisi_bangunan,
                'konstruksi_bertingkat' => $request->konstruksi_bertingkat,
                'konstruksi_beton' => $request->konstruksi_beton,
                'luas_lantai' => $request->luas_lantai,
                'letak_alamat' => $request->letak_alamat,
                'dokumen_tanggal' => $request->dokumen_tanggal,
                'dokumen_nomor' => $request->dokumen_nomor,
                'status_tanah' => $request->status_tanah,
                'kode_tanah' => $request->kode_tanah,
            ]);

            DB::commit();

            return redirect()->route('kib-c.index')->with('success', 'Data KIB C berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete(); 
        
        return redirect()->route('kib-c.index')->with('success', 'Data KIB C berhasil dihapus.');
    }
}
