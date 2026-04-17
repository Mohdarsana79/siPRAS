<?php

namespace App\Services;

use App\Models\Item;
use App\Models\MasterKategori;
use App\Models\SchoolProfile;

/**
 * Service untuk generate Nomor Register BMD
 * sesuai Permendagri No. 108 Tahun 2016.
 *
 * Format Nomor Register:
 * {Nomor Urut 6 digit}
 *
 * Contoh: 000001
 *
 * Catatan: Identitas lengkap (Label) menggunakan accessor pada model Item:
 * {Kode Lokasi}.{Kode Barang}.{Nomor Register}
 * Contoh: 12.33.73.101.1.3.1.01.01.01.001.000001
 */
class KodeRegistrasiService
{
    /**
     * Generate nomor register (nomor urut).
     *
     * @param  string  $tipeKib
     * @param  string  $tanggalPerolehan
     * @return string  Nomor urut (6 digit)
     */
    public function generate(string $tipeKib, string $tanggalPerolehan): string
    {
        return $this->getNextNomorUrut($tipeKib);
    }

    /**
     * Ambil kode lokasi dari profil sekolah.
     */
    public function getKodeLokasi(): string
    {
        $profile = SchoolProfile::first();
        return $profile ? $profile->kode_lokasi_bmd : '12.00.00.000';
    }

    /**
     * Generate nomor urut berikutnya per tipe KIB.
     * Tidak lagi di-reset per tahun sesuai standar BMD.
     *
     * @param  string  $tipeKib
     * @return string  Nomor urut 6 digit dengan leading zeros
     */
    public function getNextNomorUrut(string $tipeKib): string
    {
        // Cari nomor urut tertinggi untuk tipe KIB yang sama
        $lastItem = Item::whereHas('kategori', function($q) use ($tipeKib) {
                $q->where('tipe_kib', $tipeKib);
            })
            ->orderByRaw('CAST(nomor_register AS INTEGER) DESC')
            ->first();

        if (!$lastItem) {
            return '000001';
        }

        $lastUrut = (int) $lastItem->nomor_register;
        return str_pad($lastUrut + 1, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate data untuk item baru.
     *
     * @param  int     $kategoriId
     * @param  string  $tanggalPerolehan
     * @return array   ['kode_barang' => ..., 'nomor_register' => ...]
     */
    public function generateForNewItem(int $kategoriId, string $tanggalPerolehan): array
    {
        $kategori   = MasterKategori::findOrFail($kategoriId);
        $baseKode   = $kategori->kode_barang; // 6 Level dari Master
        $tipeKib    = $kategori->tipe_kib;

        // Auto-generate Level 7 (Sub-sub rincian)
        $nextLevel7 = $this->getNextLevel7($tipeKib);
        
        $fullKodeBarang = "{$baseKode}.{$nextLevel7}";
        $nomorRegister  = $this->generate($tipeKib, $tanggalPerolehan);

        return [
            'kode_barang'      => $fullKodeBarang,
            'nomor_register'   => $nomorRegister,
        ];
    }

    /**
     * Re-generate nomor register untuk item yang diperbarui.
     */
    public function generateForUpdate(Item $item, int $kategoriId, string $tanggalPerolehan): array
    {
        $kategori  = MasterKategori::findOrFail($kategoriId);
        $tipeKib   = $kategori->tipe_kib;
        
        // Cek apakah kategori (Level 1-6) berubah
        $baseKode = $kategori->kode_barang;
        $currentParts = explode('.', $item->kode_barang);
        $currentBase = implode('.', array_slice($currentParts, 0, 6));

        // Jika rincian level 6 tidak berubah, pertahankan kode_barang yang ada
        if ($currentBase === $baseKode) {
            return [
                'kode_barang'    => $item->kode_barang,
                'nomor_register' => $item->nomor_register,
            ];
        }

        // Jika kategori berubah total, generate Level 7 baru untuk KIB tersebut
        $nextLevel7 = $this->getNextLevel7($tipeKib);
        $fullKodeBarang = "{$baseKode}.{$nextLevel7}";
        
        $nomorRegister = $this->generate($tipeKib, $tanggalPerolehan);

        return [
            'kode_barang'    => $fullKodeBarang,
            'nomor_register' => $nomorRegister,
        ];
    }

    /**
     * Ambil nomor urut Level 7 berikutnya untuk tipe KIB tertentu.
     * Dimulai dari 001 untuk tiap tipe KIB (A-F).
     */
    private function getNextLevel7(string $tipeKib): string
    {
        // Cari semua item dalam KIB yang sama
        $maxLevel7 = Item::whereHas('kategori', function($q) use ($tipeKib) {
                $q->where('tipe_kib', $tipeKib);
            })
            ->select('kode_barang')
            ->get()
            ->map(function($item) {
                $parts = explode('.', $item->kode_barang);
                // Pastikan ada 7 bagian (level 7 adalah bagian terakhir)
                return count($parts) >= 7 ? (int) end($parts) : 0;
            })
            ->max();

        $next = ($maxLevel7 ?? 0) + 1;
        return str_pad($next, 3, '0', STR_PAD_LEFT);
    }
}
