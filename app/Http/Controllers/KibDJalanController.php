<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibDJalan;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use App\Services\KodeRegistrasiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KibDJalanController extends Controller
{
    public function __construct(private KodeRegistrasiService $kodeService) {}

    public function index(Request $request)
    {
        $query = Item::with(['kibD', 'kategori', 'ruangan', 'sumberDana'])
            ->whereHas('kategori', fn($q) => $q->where('tipe_kib', 'D'))->latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(DB::raw('LOWER(nama_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(kode_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(nomor_register)'), 'like', "%{$search}%");
            });
        });

        $items       = $query->paginate(10)->onEachSide(1)->withQueryString();
        $kategoris   = MasterKategori::where('tipe_kib', 'D')->get();
        $ruangans    = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibD/Index', [
            'items'       => $items,
            'kategoris'   => $kategoris,
            'ruangans'    => $ruangans,
            'sumberDanas' => $sumberDanas,
            'filters'     => $request->only(['search']),
        ]);
    }

    /**
     * Defensive show route.
     */
    public function show()
    {
        return redirect()->route('kib-d.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id'      => 'required|exists:master_kategoris,id',
            'ruangan_id'       => 'nullable|exists:master_ruangans,id',
            'sumber_dana_id'   => 'required|exists:master_sumber_danas,id',
            'nama_barang'      => 'required|string|max:255',
            'kondisi'          => 'required|in:Baik,Kurang Baik,Rusak Berat',
            'tanggal_perolehan'=> 'required|date',
            'harga'            => 'required|numeric|min:0',
            'asal_usul'        => 'required|string|max:255',
            'keterangan'       => 'nullable|string',
            'kode_komptabel'   => 'required|in:01,02',
            // KIB D spesifik
            'konstruksi'       => 'required|string|max:255',
            'panjang'          => 'required|numeric|min:0',
            'lebar'            => 'required|numeric|min:0',
            'luas'             => 'required|numeric|min:0',
            'letak_lokasi'     => 'required|string',
            'dokumen_tanggal'  => 'nullable|date',
            'dokumen_nomor'    => 'nullable|string|max:255',
            'status_tanah'     => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $kodeData = $this->kodeService->generateForNewItem($request->kategori_id, $request->tanggal_perolehan);

            $item = Item::create(array_merge(
                $request->only(['kategori_id', 'ruangan_id', 'sumber_dana_id', 'nama_barang', 'kondisi', 'tanggal_perolehan', 'harga', 'asal_usul', 'keterangan', 'kode_komptabel']),
                $kodeData
            ));

            KibDJalan::create([
                'item_id'        => $item->id,
                'konstruksi'     => $request->konstruksi,
                'panjang'        => $request->panjang,
                'lebar'          => $request->lebar,
                'luas'           => $request->luas,
                'letak_lokasi'   => $request->letak_lokasi,
                'dokumen_tanggal'=> $request->dokumen_tanggal,
                'dokumen_nomor'  => $request->dokumen_nomor,
                'status_tanah'   => $request->status_tanah,
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
            'kategori_id'      => 'required|exists:master_kategoris,id',
            'ruangan_id'       => 'nullable|exists:master_ruangans,id',
            'sumber_dana_id'   => 'required|exists:master_sumber_danas,id',
            'nama_barang'      => 'required|string|max:255',
            'kondisi'          => 'required|in:Baik,Kurang Baik,Rusak Berat',
            'tanggal_perolehan'=> 'required|date',
            'harga'            => 'required|numeric|min:0',
            'asal_usul'        => 'required|string|max:255',
            'keterangan'       => 'nullable|string',
            'kode_komptabel'   => 'required|in:01,02',
            'konstruksi'       => 'required|string|max:255',
            'panjang'          => 'required|numeric|min:0',
            'lebar'            => 'required|numeric|min:0',
            'luas'             => 'required|numeric|min:0',
            'letak_lokasi'     => 'required|string',
            'dokumen_tanggal'  => 'nullable|date',
            'dokumen_nomor'    => 'nullable|string|max:255',
            'status_tanah'     => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $item = Item::findOrFail($id);
            $kodeData = $this->kodeService->generateForUpdate($item, $request->kategori_id, $request->tanggal_perolehan);

            $item->update(array_merge(
                $request->only(['kategori_id', 'ruangan_id', 'sumber_dana_id', 'nama_barang', 'kondisi', 'tanggal_perolehan', 'harga', 'asal_usul', 'keterangan', 'kode_komptabel']),
                $kodeData
            ));

            KibDJalan::where('item_id', $id)->firstOrFail()->update([
                'konstruksi'     => $request->konstruksi,
                'panjang'        => $request->panjang,
                'lebar'          => $request->lebar,
                'luas'           => $request->luas,
                'letak_lokasi'   => $request->letak_lokasi,
                'dokumen_tanggal'=> $request->dokumen_tanggal,
                'dokumen_nomor'  => $request->dokumen_nomor,
                'status_tanah'   => $request->status_tanah,
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
        Item::findOrFail($id)->delete();
        return redirect()->route('kib-d.index')->with('success', 'Data KIB D berhasil dihapus.');
    }
}
