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
use App\Models\MutasiBarang;
use App\Models\Pemeliharaan;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure 100 Users (besides admin)
        $userCount = User::count();
        if ($userCount < 100) {
            User::factory()->count(100 - $userCount)->create();
        }

        // 2. Ensure 100 Master Ruangan
        $ruanganCount = MasterRuangan::count();
        if ($ruanganCount < 100) {
            MasterRuangan::factory()->count(100 - $ruanganCount)->create();
        }
        
        // 3. Ensure 100 Master Sumber Dana
        $sumberDanaCount = MasterSumberDana::count();
        if ($sumberDanaCount < 100) {
            MasterSumberDana::factory()->count(100 - $sumberDanaCount)->create();
        }

        // 4. Ensure 100 Master Kategori (distribute among KIB types)
        $kibTypes = ['A', 'B', 'C', 'D', 'E', 'F'];
        $kategoriCount = MasterKategori::count();
        if ($kategoriCount < 100) {
            for ($i = $kategoriCount; $i < 100; $i++) {
                $type = $kibTypes[$i % count($kibTypes)];
                MasterKategori::create([
                    'kode_kategori' => 'KAT-' . $type . '-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                    'nama_kategori' => 'Kategori Dummy ' . $type . ' ' . ($i + 1),
                    'tipe_kib' => $type
                ]);
            }
        }

        // 5. Ensure 100 items for EACH KIB type (600 total)
        foreach ($kibTypes as $type) {
            $currentCount = Item::whereHas('kategori', function($query) use ($type) {
                $query->where('tipe_kib', $type);
            })->count();

            if ($currentCount < 100) {
                $countToCreate = 100 - $currentCount;
                $kategori = MasterKategori::where('tipe_kib', $type)->first();
                
                for ($i = 0; $i < $countToCreate; $i++) {
                    $item = Item::create([
                        'id' => (string) Str::uuid(),
                        'kategori_id' => $kategori->id,
                        'ruangan_id' => MasterRuangan::inRandomOrder()->first()->id,
                        'sumber_dana_id' => MasterSumberDana::inRandomOrder()->first()->id,
                        'kode_barang' => $type . '-' . str_pad($currentCount + $i + 1, 4, '0', STR_PAD_LEFT),
                        'nama_barang' => 'Aset Dummy ' . $type . ' ' . ($currentCount + $i + 1),
                        'nomor_register' => str_pad($currentCount + $i + 1, 6, '0', STR_PAD_LEFT),
                        'kondisi' => ['Baik', 'Kurang Baik', 'Rusak Berat'][rand(0, 2)],
                        'tanggal_perolehan' => Carbon::now()->subDays(rand(1, 1000))->toDateString(),
                        'harga' => rand(100000, 50000000),
                        'asal_usul' => ['Pembelian BOS', 'Hibah', 'APBD', 'APBN'][rand(0, 3)],
                        'keterangan' => 'Dummy data for ' . $type
                    ]);

                    switch ($type) {
                        case 'A':
                            KibATanah::create([
                                'item_id' => $item->id,
                                'luas' => rand(100, 5000),
                                'letak_alamat' => 'Alamat ' . rand(1, 100),
                                'hak_tanah' => 'Hak Pakai',
                                'tanggal_sertifikat' => Carbon::now()->subYears(5)->toDateString(),
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
                                'dokumen_tanggal' => Carbon::now()->subYears(2)->toDateString(),
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
                                'dokumen_tanggal' => Carbon::now()->subYears(2)->toDateString(),
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
                                'dokumen_tanggal' => Carbon::now()->subYears(1)->toDateString(),
                                'dokumen_nomor' => 'SPK-' . rand(100, 999),
                                'tanggal_mulai' => Carbon::now()->subMonths(6)->toDateString(),
                                'status_tanah' => 'Hak Pakai'
                            ]);
                            break;
                    }
                }
            }
        }

        // 6. Ensure 100 Mutasi Barang
        $mutasiCount = MutasiBarang::count();
        if ($mutasiCount < 100) {
            $items = Item::inRandomOrder()->limit(100)->get();
            $ruangans = MasterRuangan::all();
            $users = User::all();
            
            for ($i = $mutasiCount; $i < 100; $i++) {
                $item = $items->random();
                MutasiBarang::create([
                    'item_id' => $item->id,
                    'jenis_mutasi' => ['Pindah Ruangan', 'Penghapusan/Afkir'][rand(0, 1)],
                    'dari_ruangan_id' => $item->ruangan_id,
                    'ke_ruangan_id' => $ruangans->random()->id,
                    'tanggal_mutasi' => Carbon::now()->subDays(rand(1, 100))->toDateString(),
                    'keterangan' => 'Mutasi Dummy ' . ($i + 1),
                    'user_id' => $users->random()->id
                ]);
            }
        }

        // 7. Ensure 100 Pemeliharaan
        $pemeliharaanCount = Pemeliharaan::count();
        if ($pemeliharaanCount < 100) {
            $items = Item::inRandomOrder()->limit(100)->get();
            for ($i = $pemeliharaanCount; $i < 100; $i++) {
                Pemeliharaan::create([
                    'item_id' => $items->random()->id,
                    'tanggal_pemeliharaan' => Carbon::now()->subDays(rand(1, 300))->toDateString(),
                    'jenis_pemeliharaan' => ['Service Rutin', 'Ganti Part', 'Perbaikan'][rand(0, 2)],
                    'biaya' => rand(50000, 2000000),
                    'penyedia_jasa' => 'Penyedia ' . rand(1, 10),
                    'keterangan' => 'Pemeliharaan Dummy ' . ($i + 1)
                ]);
            }
        }

        // 8. Ensure 100 Peminjaman
        $peminjamanCount = Peminjaman::count();
        if ($peminjamanCount < 100) {
            $items = Item::inRandomOrder()->limit(100)->get();
            for ($i = $peminjamanCount; $i < 100; $i++) {
                $status = ['Dipinjam', 'Dikembalikan', 'Terlambat'][rand(0, 2)];
                Peminjaman::create([
                    'item_id' => $items->random()->id,
                    'nama_peminjam' => 'Peminjam ' . rand(1, 50),
                    'nip_nik' => rand(10000000, 99999999),
                    'tanggal_pinjam' => Carbon::now()->subDays(rand(5, 20))->toDateString(),
                    'estimasi_kembali' => Carbon::now()->addDays(rand(1, 5))->toDateString(),
                    'tanggal_kembali' => $status === 'Dikembalikan' ? Carbon::now()->toDateString() : null,
                    'status' => $status,
                    'keterangan' => 'Peminjaman Dummy ' . ($i + 1)
                ]);
            }
        }
    }
}
