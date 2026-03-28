<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsetDataController extends Controller
{
    public function index(Request $request)
    {
        $tipeKib = $request->query('kib', 'ALL');
        
        $relations = ['kategori', 'ruangan', 'sumberDana'];
        if ($tipeKib === 'A') $relations[] = 'kibA';
        if ($tipeKib === 'B') $relations[] = 'kibB';
        if ($tipeKib === 'C') $relations[] = 'kibC';
        if ($tipeKib === 'D') $relations[] = 'kibD';
        if ($tipeKib === 'E') $relations[] = 'kibE';
        if ($tipeKib === 'F') $relations[] = 'kibF';

        $query = Item::with($relations);

        if ($tipeKib !== 'ALL') {
            $query->whereHas('kategori', function($q) use ($tipeKib) {
                $q->where('tipe_kib', $tipeKib);
            });
        }

        $items = $query->orderBy('tanggal_perolehan', 'desc')->get();

        return Inertia::render('AsetData/Index', [
            'items' => $items,
            'filters' => [
                'kib' => $tipeKib
            ],
            'profile' => \App\Models\SchoolProfile::first()
        ]);
    }

    public function cetakLabels(Request $request)
    {
        $tipeKib = $request->query('kib', 'ALL');
        $paper = $request->query('paper', 'a4');
        $orientation = $request->query('orientation', 'portrait');
        
        $query = Item::query();
        if ($tipeKib !== 'ALL') {
            $query->whereHas('kategori', function($q) use ($tipeKib) {
                $q->where('tipe_kib', $tipeKib);
            });
        }

        $items = $query->orderBy('kode_barang', 'asc')->get();
        $profile = \App\Models\SchoolProfile::first();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.aset_labels_pdf', [
            'items' => $items,
            'profile' => $profile
        ]);

        // Map Folio to custom size if needed (DomPDF doesn't have native 'folio')
        $paperSize = $paper;
        if ($paper === 'folio') {
            $paperSize = [0, 0, 612.00, 936.00]; // Standard Folio/F4 size in points
        }

        $pdf->setPaper($paperSize, $orientation);
        return $pdf->stream('Label_Aset_' . $tipeKib . '.pdf');
    }

    public function scan(Request $request)
    {
        $code = $request->query('code');
        
        $item = Item::with(['kategori', 'ruangan', 'sumberDana', 'kibA', 'kibB', 'kibC', 'kibD', 'kibE', 'kibF'])
            ->where('id', $code)
            ->orWhere('kode_barang', $code)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Aset tidak ditemukan'], 404);
        }

        return response()->json($item);
    }
}
