<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibATanah;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KibATanahController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['kibA', 'kategori', 'ruangan', 'ruangans', 'sumberDana'])
            ->whereHas('kategori', function ($query) {
            $query->where('tipe_kib', 'A');
        })->latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                    $inner->where(DB::raw('LOWER(nama_barang)'), 'like', "%{$search}%")
                        ->orWhere(DB::raw('LOWER(kode_barang)'), 'like', "%{$search}%")
                        ->orWhere(DB::raw('LOWER(nomor_register)'), 'like', "%{$search}%");
                }
                );
            });

        $items = $query->paginate(10)->onEachSide(1)->withQueryString();

        $kategoris = MasterKategori::where('tipe_kib', 'A')->get();
        $ruangans = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibA/Index', [
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

            // Validasi spesifik KIB A
            'luas' => 'required|numeric|min:0',
            'letak_alamat' => 'required|string',
            'hak_tanah' => 'required|string|max:255',
            'tanggal_sertifikat' => 'required|date',
            'nomor_sertifikat' => 'required|string|max:255',
            'penggunaan' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $itemData = $request->only([
                'kategori_id', 'sumber_dana_id', 'kode_barang',
                'nama_barang', 'nomor_register', 'kondisi', 'tanggal_perolehan',
                'harga', 'asal_usul', 'keterangan'
            ]);
            $itemData['ruangan_id'] = null; // Use pivot table instead
            $item = Item::create($itemData);

            if ($request->has('ruangan_id')) {
                $item->ruangans()->sync($request->ruangan_id ?? []);
            }

            KibATanah::create([
                'item_id' => $item->id,
                'luas' => $request->luas,
                'letak_alamat' => $request->letak_alamat,
                'hak_tanah' => $request->hak_tanah,
                'tanggal_sertifikat' => $request->tanggal_sertifikat,
                'nomor_sertifikat' => $request->nomor_sertifikat,
                'penggunaan' => $request->penggunaan,
            ]);

            DB::commit();

            return redirect()->route('kib-a.index')->with('success', 'Data KIB A berhasil ditambahkan.');
        }
        catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
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

            // Validasi spesifik KIB A
            'luas' => 'required|numeric|min:0',
            'letak_alamat' => 'required|string',
            'hak_tanah' => 'required|string|max:255',
            'tanggal_sertifikat' => 'required|date',
            'nomor_sertifikat' => 'required|string|max:255',
            'penggunaan' => 'required|string|max:255',
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

            $kibA = KibATanah::where('item_id', $id)->firstOrFail();
            $kibA->update([
                'luas' => $request->luas,
                'letak_alamat' => $request->letak_alamat,
                'hak_tanah' => $request->hak_tanah,
                'tanggal_sertifikat' => $request->tanggal_sertifikat,
                'nomor_sertifikat' => $request->nomor_sertifikat,
                'penggunaan' => $request->penggunaan,
            ]);

            DB::commit();

            return redirect()->route('kib-a.index')->with('success', 'Data KIB A berhasil diupdate.');
        }
        catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete(); // Ini otomatis akan menghapus kib_a_tanah juga karena constraint cascade onDelete('cascade') dlm database

        return redirect()->route('kib-a.index')->with('success', 'Data KIB A berhasil dihapus.');
    }
}
