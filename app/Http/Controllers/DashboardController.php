<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\MutasiBarang;
use App\Models\Pemeliharaan;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ringkasan Aset
        $totalAset = Item::count();
        $totalNilaiAset = Item::sum('harga');
        
        // 2. Aset Berdasarkan Kondisi
        $kondisiAset = Item::select('kondisi', DB::raw('count(*) as total'))
            ->groupBy('kondisi')
            ->get();

        // 3. Aset Berdasarkan Kategori KIB
        $kibAset = Item::join('master_kategoris', 'items.kategori_id', '=', 'master_kategoris.id')
            ->select('master_kategoris.tipe_kib', DB::raw('count(*) as total'))
            ->groupBy('master_kategoris.tipe_kib')
            ->orderBy('master_kategoris.tipe_kib')
            ->get();

        // 4. Aktivitas Terkini (Mutasi, Peminjaman, Pemeliharaan)
        $peminjamanAktif = Peminjaman::whereIn('status', ['Dipinjam', 'Terlambat'])->count();
        $totalBiayaPemeliharaan = Pemeliharaan::sum('biaya');

        return Inertia::render('Dashboard', [
            'statistik' => [
                'totalAset' => $totalAset,
                'totalNilaiAset' => $totalNilaiAset,
                'kondisiAset' => $kondisiAset,
                'kibAset' => $kibAset,
                'peminjamanAktif' => $peminjamanAktif,
                'totalBiayaPemeliharaan' => $totalBiayaPemeliharaan
            ]
        ]);
    }
}
