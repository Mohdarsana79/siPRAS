<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\KibFKonstruksi;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use App\Services\KodeRegistrasiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KibFKonstruksiController extends Controller
{
    public function __construct(private KodeRegistrasiService $kodeService) {}

    public function index(Request $request)
    {
        $query = Item::with(['kibF', 'kategori', 'ruangan', 'sumberDana'])
            ->whereHas('kategori', fn($q) => $q->where('tipe_kib', 'F'))->latest();

        $query->when($request->search, function ($q, $search) {
            $search = strtolower($search);
            $q->where(function ($inner) use ($search) {
                $inner->where(DB::raw('LOWER(nama_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(kode_barang)'), 'like', "%{$search}%")
                      ->orWhere(DB::raw('LOWER(nomor_register)'), 'like', "%{$search}%")
                      ->orWhereHas('kibF', fn($k) => $k->where(DB::raw('LOWER(bangunan)'), 'like', "%{$search}%"));
            });
        });

        $items       = $query->paginate(10)->onEachSide(1)->withQueryString();
        $kategoris   = MasterKategori::where('tipe_kib', 'F')->get();
        $ruangans    = MasterRuangan::all();
        $sumberDanas = MasterSumberDana::all();

        return Inertia::render('KibF/Index', [
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
        return redirect()->route('kib-f.index');
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
            // KIB F spesifik
            'bangunan'              => 'required|string|max:255',
            'konstruksi_bertingkat' => 'required|boolean',
            'konstruksi_beton'      => 'required|boolean',
            'luas'                  => 'required|numeric|min:0',
            'letak_lokasi'          => 'required|string',
            'dokumen_tanggal'       => 'nullable|date',
            'dokumen_nomor'         => 'nullable|string|max:255',
            'tanggal_mulai'         => 'required|date',
            'status_tanah'          => 'required|string|max:255',
        ], [
            'required' => 'data wajib di isi',
        ]);

        DB::beginTransaction();
        try {
            $kodeData = $this->kodeService->generateForNewItem($request->kategori_id, $request->tanggal_perolehan);

            $item = Item::create(array_merge(
                $request->only(['kategori_id', 'ruangan_id', 'sumber_dana_id', 'nama_barang', 'kondisi', 'tanggal_perolehan', 'harga', 'asal_usul', 'keterangan', 'kode_komptabel']),
                $kodeData
            ));

            KibFKonstruksi::create([
                'item_id'               => $item->id,
                'bangunan'              => $request->bangunan,
                'konstruksi_bertingkat' => $request->konstruksi_bertingkat,
                'konstruksi_beton'      => $request->konstruksi_beton,
                'luas'                  => $request->luas,
                'letak_lokasi'          => $request->letak_lokasi,
                'dokumen_tanggal'       => $request->dokumen_tanggal,
                'dokumen_nomor'         => $request->dokumen_nomor,
                'tanggal_mulai'         => $request->tanggal_mulai,
                'status_tanah'          => $request->status_tanah,
            ]);

            DB::commit();
            return redirect()->route('kib-f.index')->with('success', 'Data KIB F berhasil ditambahkan.');
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
            'bangunan'              => 'required|string|max:255',
            'konstruksi_bertingkat' => 'required|boolean',
            'konstruksi_beton'      => 'required|boolean',
            'luas'                  => 'required|numeric|min:0',
            'letak_lokasi'          => 'required|string',
            'dokumen_tanggal'       => 'nullable|date',
            'dokumen_nomor'         => 'nullable|string|max:255',
            'tanggal_mulai'         => 'required|date',
            'status_tanah'          => 'required|string|max:255',
        ], [
            'required' => 'data wajib di isi',
        ]);

        DB::beginTransaction();
        try {
            $item = Item::findOrFail($id);
            $kodeData = $this->kodeService->generateForUpdate($item, $request->kategori_id, $request->tanggal_perolehan);

            $item->update(array_merge(
                $request->only(['kategori_id', 'ruangan_id', 'sumber_dana_id', 'nama_barang', 'kondisi', 'tanggal_perolehan', 'harga', 'asal_usul', 'keterangan', 'kode_komptabel']),
                $kodeData
            ));

            KibFKonstruksi::where('item_id', $id)->firstOrFail()->update([
                'bangunan'              => $request->bangunan,
                'konstruksi_bertingkat' => $request->konstruksi_bertingkat,
                'konstruksi_beton'      => $request->konstruksi_beton,
                'luas'                  => $request->luas,
                'letak_lokasi'          => $request->letak_lokasi,
                'dokumen_tanggal'       => $request->dokumen_tanggal,
                'dokumen_nomor'         => $request->dokumen_nomor,
                'tanggal_mulai'         => $request->tanggal_mulai,
                'status_tanah'          => $request->status_tanah,
            ]);

            DB::commit();
            return redirect()->route('kib-f.index')->with('success', 'Data KIB F berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        Item::findOrFail($id)->delete();
        return redirect()->route('kib-f.index')->with('success', 'Data KIB F berhasil dihapus.');
    }
}
