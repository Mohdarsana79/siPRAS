<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibDJalan;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KibDJalanController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['kibD', 'kategori', 'ruangan', 'sumberDana'])
            ->whereHas('kategori', function ($query) {
                $query->where('tipe_kib', 'D');
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

        $kategoris = MasterKategori::where('tipe_kib', 'D')->get();
        $ruangans = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibD/Index', [
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
            
            // Validasi spesifik KIB D
            'konstruksi' => 'required|string|max:255',
            'panjang' => 'required|numeric|min:0',
            'lebar' => 'required|numeric|min:0',
            'luas' => 'required|numeric|min:0',
            'letak_lokasi' => 'required|string',
            'dokumen_tanggal' => 'required|date',
            'dokumen_nomor' => 'required|string|max:255',
            'status_tanah' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $item = Item::create($request->only([
                'kategori_id', 'ruangan_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]));

            KibDJalan::create([
                'item_id' => $item->id,
                'konstruksi' => $request->konstruksi,
                'panjang' => $request->panjang,
                'lebar' => $request->lebar,
                'luas' => $request->luas,
                'letak_lokasi' => $request->letak_lokasi,
                'dokumen_tanggal' => $request->dokumen_tanggal,
                'dokumen_nomor' => $request->dokumen_nomor,
                'status_tanah' => $request->status_tanah,
            ]);

            DB::commit();

            return redirect()->route('kib-d.index')->with('success', 'Data KIB D berhasil ditambahkan.');
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
            
            // Validasi spesifik KIB D
            'konstruksi' => 'required|string|max:255',
            'panjang' => 'required|numeric|min:0',
            'lebar' => 'required|numeric|min:0',
            'luas' => 'required|numeric|min:0',
            'letak_lokasi' => 'required|string',
            'dokumen_tanggal' => 'required|date',
            'dokumen_nomor' => 'required|string|max:255',
            'status_tanah' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $item = Item::findOrFail($id);
            $item->update($request->only([
                'kategori_id', 'ruangan_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]));

            $kibD = KibDJalan::where('item_id', $id)->firstOrFail();
            $kibD->update([
                'konstruksi' => $request->konstruksi,
                'panjang' => $request->panjang,
                'lebar' => $request->lebar,
                'luas' => $request->luas,
                'letak_lokasi' => $request->letak_lokasi,
                'dokumen_tanggal' => $request->dokumen_tanggal,
                'dokumen_nomor' => $request->dokumen_nomor,
                'status_tanah' => $request->status_tanah,
            ]);

            DB::commit();

            return redirect()->route('kib-d.index')->with('success', 'Data KIB D berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete(); 
        
        return redirect()->route('kib-d.index')->with('success', 'Data KIB D berhasil dihapus.');
    }
}
