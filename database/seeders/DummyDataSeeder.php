<?php

namespace Database\Seeders;

use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use App\Models\MasterKategori;
use App\Models\Item;
use App\Models\KibATanah;
use App\Models\KibBPeralatan;
use App\Models\KibCGedung;
use App\Models\KibDJalan;
use App\Models\KibEAsetLainnya;
use App\Models\KibFKonstruksi;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Master Data exists
        if (MasterRuangan::count() < 10) {
            MasterRuangan::factory()->count(10)->create();
        }
        
        if (MasterSumberDana::count() < 10) {
            MasterSumberDana::factory()->count(10)->create();
        }

        $kibTypes = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        foreach ($kibTypes as $type) {
            $kategori = MasterKategori::where('tipe_kib', $type)->first();
            
            if (!$kategori) {
                $kategori = MasterKategori::create([
                    'kode_kategori' => 'K' . $type . '01',
                    'nama_kategori' => 'Kategori Dummy ' . $type,
                    'tipe_kib' => $type
                ]);
            }

            // Count existing items for this KIB type
            $currentCount = Item::whereHas('kategori', function($query) use ($type) {
                $query->where('tipe_kib', $type);
            })->count();

            if ($currentCount < 100) {
                $countToCreate = 100 - $currentCount;
                
                for ($i = 0; $i < $countToCreate; $i++) {
                    $item = Item::create([
                        'id' => (string) \Illuminate\Support\Str::uuid(),
                        'kategori_id' => $kategori->id,
                        'ruangan_id' => MasterRuangan::inRandomOrder()->first()->id,
                        'sumber_dana_id' => MasterSumberDana::inRandomOrder()->first()->id,
                        'kode_barang' => $type . '-' . str_pad($currentCount + $i + 1, 3, '0', STR_PAD_LEFT),
                        'nama_barang' => 'Aset Dummy ' . $type . ' ' . ($currentCount + $i + 1),
                        'nomor_register' => str_pad($currentCount + $i + 1, 6, '0', STR_PAD_LEFT),
                        'kondisi' => ['Baik', 'Kurang Baik', 'Rusak Berat'][rand(0, 2)],
                        'tanggal_perolehan' => now()->subDays(rand(1, 1000))->toDateString(),
                        'harga' => rand(100000, 50000000),
                        'asal_usul' => ['Pembelian BOS', 'Hibah', 'APBD', 'APBN'][rand(0, 3)],
                        'keterangan' => 'Dummy data for ' . $type
                    ]);

                    // Create associated KIB entry
                    switch ($type) {
                        case 'A':
                            KibATanah::create([
                                'item_id' => $item->id,
                                'luas' => rand(100, 5000),
                                'letak_alamat' => 'Alamat ' . rand(1, 100),
                                'hak_tanah' => 'Hak Pakai',
                                'tanggal_sertifikat' => now()->subYears(5)->toDateString(),
                                'nomor_sertifikat' => 'CERT-' . rand(1000, 9999),
                                'penggunaan' => 'Sekolah'
                            ]);
                            break;
                        case 'B':
                            KibBPeralatan::create([
                                'item_id' => $item->id,
                                'merk_tipe' => 'Merk ' . rand(1, 10),
                                'bahan' => 'Besi/Plastik',
                                'tahun_pembuatan' => rand(2010, 2024),
                            ]);
                            break;
                        case 'C':
                            KibCGedung::create([
                                'item_id' => $item->id,
                                'kondisi_bangunan' => 'Permanen',
                                'konstruksi_bertingkat' => rand(0, 1),
                                'konstruksi_beton' => 1,
                                'luas_lantai' => rand(50, 500),
                                'letak_alamat' => 'Blok ' . rand(1, 10),
                                'dokumen_tanggal' => now()->subYears(2)->toDateString(),
                                'dokumen_nomor' => 'IMB-' . rand(100, 999),
                                'status_tanah' => 'Milik Sendiri'
                            ]);
                            break;
                        case 'D':
                            KibDJalan::create([
                                'item_id' => $item->id,
                                'konstruksi' => 'Aspal',
                                'panjang' => rand(10, 1000),
                                'lebar' => rand(2, 10),
                                'luas' => rand(20, 10000),
                                'letak_lokasi' => 'Area ' . rand(1, 5),
                                'dokumen_tanggal' => now()->subYears(2)->toDateString(),
                                'dokumen_nomor' => 'DOC-' . rand(100, 999),
                                'status_tanah' => 'Milik Sekolah'
                            ]);
                            break;
                        case 'E':
                            KibEAsetLainnya::create([
                                'item_id' => $item->id,
                                'judul_buku_nama_kesenian' => 'Aset Seni ' . rand(1, 50),
                                'pencipta' => 'Artisan ' . rand(1, 10),
                                'spesifikasi' => 'Std Spesifikasi ' . rand(1, 5),
                                'asal_daerah' => 'Daerah ' . rand(1, 10),
                                'bahan' => 'Kayu/Lainnya'
                            ]);
                            break;
                        case 'F':
                            KibFKonstruksi::create([
                                'item_id' => $item->id,
                                'bangunan' => 'Pembangunan ' . rand(1, 10),
                                'konstruksi_bertingkat' => 0,
                                'konstruksi_beton' => 1,
                                'luas' => rand(20, 500),
                                'letak_lokasi' => 'Titik ' . rand(1, 5),
                                'dokumen_tanggal' => now()->subYears(1)->toDateString(),
                                'dokumen_nomor' => 'SPK-' . rand(100, 999),
                                'tanggal_mulai' => now()->subMonths(6)->toDateString(),
                                'status_tanah' => 'Hak Pakai'
                            ]);
                            break;
                    }
                }
            }
        }
    }
}
