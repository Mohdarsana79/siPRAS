<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\MasterRuangan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Carbon;

class LaporanController extends Controller
{
    public function index()
    {
        $ruangans = MasterRuangan::orderBy('nama_ruangan')->get(['id', 'kode_ruangan', 'nama_ruangan']);
        return Inertia::render('Laporan/Index', compact('ruangans'));
    }

    public function cetak(Request $request)
    {
        $tipeKib    = $request->query('kib', 'ALL');
        $paperSize  = $request->query('paper_size', 'a4');
        $fontSize   = $request->query('font_size', '10pt');
        $orientation = $request->query('orientation', 'landscape');
        $ruanganId  = $request->query('ruangan_id');

        // Special case for Folio (not standard in DomPDF)
        if ($paperSize === 'folio') {
            $paperSize = [0, 0, 612, 936]; // 8.5 x 13 inch in points
        }

        // Load relations based on KIB type to optimize
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
            $title = "LAPORAN KIB " . $tipeKib;
            $view  = 'laporan.kib_' . strtolower($tipeKib) . '_pdf';
        } else {
            $title = "LAPORAN INVENTARIS INDUK";
            $view  = 'laporan.inventaris_induk_pdf';
        }

        // Optional room filter (supported for KIB B & E)
        $ruangan = null;
        if ($ruanganId && in_array($tipeKib, ['B', 'E'])) {
            $query->where('ruangan_id', $ruanganId);
            $ruangan = MasterRuangan::find($ruanganId);
            if ($ruangan) {
                $title .= " - " . $ruangan->nama_ruangan;
            }
        }

        // Build a safe filename (no /, \, or other problematic chars)
        $filename = str_replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], '_', $title);

        $items   = $query->orderBy('tanggal_perolehan', 'asc')->get();
        $profile = \App\Models\SchoolProfile::first();

        $pdf = Pdf::loadView($view, [
            'items'   => $items,
            'title'   => $title,
            'tipeKib' => $tipeKib,
            'fontSize' => $fontSize,
            'profile' => $profile,
            'ruangan' => $ruangan,
        ]);

        // Set paper size & orientation
        $pdf->setPaper($paperSize, $orientation);

        return $pdf->stream($filename . '.pdf');
    }

    public function cetakExcel(Request $request)
    {
        $tipeKib   = $request->query('kib', 'A');
        $ruanganId = $request->query('ruangan_id');

        // Only individual KIB types (A–F) are supported for Excel
        $allowedKib = ['A', 'B', 'C', 'D', 'E', 'F'];
        if (!in_array($tipeKib, $allowedKib)) {
            return Response::make('KIB type not supported for Excel export.', 400);
        }

        $relations = ['kategori', 'ruangan', 'sumberDana'];
        $relations[] = 'kib' . $tipeKib;

        $query = Item::with($relations)
            ->whereHas('kategori', function ($q) use ($tipeKib) {
                $q->where('tipe_kib', $tipeKib);
            });

        // Optional room filter (supported for KIB B & E)
        $ruangan = null;
        if ($ruanganId && in_array($tipeKib, ['B', 'E'])) {
            $query->where('ruangan_id', $ruanganId);
            $ruangan = MasterRuangan::find($ruanganId);
        }

        $items   = $query->orderBy('tanggal_perolehan', 'asc')->get();
        $profile = \App\Models\SchoolProfile::first();
        $suffix  = $ruangan ? '_' . str_replace(' ', '_', $ruangan->nama_ruangan) : '';
        $title   = 'KIB_' . $tipeKib . $suffix . '_' . Carbon::now()->format('Ymd');
        $view    = 'laporan.kib_' . strtolower($tipeKib) . '_excel';

        $html = View::make($view, [
            'items'   => $items,
            'title'   => $title,
            'profile' => $profile,
            'ruangan' => $ruangan,
        ])->render();

        return Response::make($html)
            ->header('Content-Type', 'application/vnd.ms-excel')
            ->header('Content-Disposition', 'attachment; filename="' . $title . '.xls"');
    }
}
