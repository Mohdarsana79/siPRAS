<?php

namespace Database\Seeders;

use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use App\Models\MasterObjek;
use App\Models\MasterRincianObjek;
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
        // 1. Users (100)
        if (User::count() < 100) {
            User::factory()->count(100)->create();
        }

        // 2. MasterRuangan (100)
        if (MasterRuangan::count() < 100) {
            MasterRuangan::factory()->count(100)->create();
        }
        
        // 3. MasterSumberDana (100)
        if (MasterSumberDana::count() < 100) {
            MasterSumberDana::factory()->count(100)->create();
        }

        // 4. Category Hierarchy (100 total for Level 6)
        if (MasterKategori::count() < 100) {
            // Create some Level 4 (Objek)
            $objeks = MasterObjek::factory()->count(10)->create();
            
            // Create some Level 5 (Rincian)
            $rincians = collect();
            foreach ($objeks as $objek) {
                $rincians = $rincians->merge(
                    MasterRincianObjek::factory()->count(3)->create([
                        'master_objek_id' => $objek->id
                    ])
                );
            }

            // Create 100 Level 6 (Kategori)
            $count = MasterKategori::count();
            while ($count < 100) {
                foreach ($rincians as $rincian) {
                    if ($count >= 100) break;
                    
                    $existingCodes = MasterKategori::where('master_rincian_objek_id', $rincian->id)
                        ->pluck('kode_sub_rincian_objek')->toArray();
                    
                    $newCode = str_pad((string) rand(1, 99), 2, '0', STR_PAD_LEFT);
                    $attempts = 0;
                    while (in_array($newCode, $existingCodes) && $attempts < 100) {
                        $newCode = str_pad((string) rand(1, 99), 2, '0', STR_PAD_LEFT);
                        $attempts++;
                    }

                    if ($attempts < 100) {
                        MasterKategori::create([
                            'master_rincian_objek_id' => $rincian->id,
                            'kode_sub_rincian_objek' => $newCode,
                            'nama_kategori' => strtoupper('KATEGORI DUMMY ' . ($count + 1)),
                            'tipe_kib' => MasterKategori::JENIS_TO_KIB[$rincian->objek->kode_jenis] ?? 'B'
                        ]);
                        $count++;
                    }
                }
            }
        }

        // 5. Items (100 total)
        if (Item::count() < 100) {
            $kategoris = MasterKategori::all();
            $ruangans = MasterRuangan::all();
            $sources = MasterSumberDana::all();

            for ($i = 0; $i < 100; $i++) {
                $kategori = $kategoris->random();
                $type = $kategori->tipe_kib;
                
                $item = Item::create([
                    'id' => (string) Str::uuid(),
                    'kategori_id' => $kategori->id,
                    'ruangan_id' => $ruangans->random()->id,
                    'sumber_dana_id' => $sources->random()->id,
                    'kode_barang' => $kategori->kode_barang,
                    'nama_barang' => 'Aset Dummy ' . $type . ' ' . ($i + 1),
                    'nomor_register' => str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                    'kondisi' => ['Baik', 'Kurang Baik', 'Rusak Berat'][rand(0, 2)],
                    'tanggal_perolehan' => Carbon::now()->subDays(rand(1, 1000))->toDateString(),
                    'harga' => rand(100000, 50000000),
                    'asal_usul' => ['Pembelian BOS', 'Hibah', 'APBD', 'APBN'][rand(0, 3)],
                    'keterangan' => 'Dummy data for ' . $type
                ]);

                // Create Detail KIB
                switch ($type) {
                    case 'A':
                        KibATanah::create([
                            'item_id' => $item->id, 
                            'luas' => rand(100, 5000), 
                            'letak_alamat' => 'Alamat ' . rand(1, 100), 
                            'hak_tanah' => 'Hak Pakai', 
                            'penggunaan' => 'Sekolah',
                            'tanggal_sertifikat' => Carbon::now()->subYears(5)->toDateString(),
                            'nomor_sertifikat' => 'CERT-' . rand(1000, 9999)
                        ]);
                        break;
                    case 'B':
                        KibBPeralatan::create([
                            'item_id' => $item->id, 
                            'merk_tipe' => 'Merk ' . rand(1, 10), 
                            'bahan' => 'Besi/Plastik', 
                            'tahun_pembuatan' => (string) rand(2010, 2024)
                        ]);
                        break;
                    case 'C':
                        KibCGedung::create([
                            'item_id' => $item->id, 
                            'kondisi_bangunan' => 'Permanen', 
                            'luas_lantai' => rand(50, 500), 
                            'letak_alamat' => 'Blok ' . rand(1, 10), 
                            'status_tanah' => 'Milik Sendiri',
                            'konstruksi_bertingkat' => rand(0, 1),
                            'konstruksi_beton' => 1,
                            'dokumen_tanggal' => Carbon::now()->subYears(2)->toDateString(),
                            'dokumen_nomor' => 'IMB-' . rand(100, 999)
                        ]);
                        break;
                    case 'D':
                        $panjang = rand(10, 1000);
                        $lebar = rand(2, 10);
                        KibDJalan::create([
                            'item_id' => $item->id, 
                            'konstruksi' => 'Aspal', 
                            'panjang' => $panjang, 
                            'lebar' => $lebar, 
                            'luas' => $panjang * $lebar,
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
                            'bahan' => 'Kayu/Lainnya',
                            'spesifikasi' => 'Std Spesifikasi ' . rand(1, 5),
                            'asal_daerah' => 'Daerah ' . rand(1, 10)
                        ]);
                        break;
                    case 'F':
                        KibFKonstruksi::create([
                            'item_id' => $item->id, 
                            'bangunan' => 'Pembangunan ' . rand(1, 10), 
                            'luas' => rand(20, 500), 
                            'letak_lokasi' => 'Titik ' . rand(1, 5), 
                            'tanggal_mulai' => Carbon::now()->subMonths(6)->toDateString(),
                            'status_tanah' => 'Hak Pakai',
                            'konstruksi_bertingkat' => 0,
                            'konstruksi_beton' => 1,
                            'dokumen_tanggal' => Carbon::now()->subYears(1)->toDateString(),
                            'dokumen_nomor' => 'SPK-' . rand(100, 999)
                        ]);
                        break;
                }
            }
        }

        // 6. Transactions (100 each)
        if (MutasiBarang::count() < 100) {
            $items = Item::all();
            $ruangans = MasterRuangan::all();
            $users = User::all();
            for ($i = 0; $i < 100; $i++) {
                $item = $items->random();
                MutasiBarang::create([
                    'item_id' => $item->id,
                    'jenis_mutasi' => 'Pindah Ruangan',
                    'dari_ruangan_id' => $item->ruangan_id,
                    'ke_ruangan_id' => $ruangans->random()->id,
                    'tanggal_mutasi' => Carbon::now()->subDays(rand(1, 100))->toDateString(),
                    'user_id' => $users->random()->id
                ]);
            }
        }

        if (Pemeliharaan::count() < 100) {
            $items = Item::all();
            for ($i = 0; $i < 100; $i++) {
                Pemeliharaan::create([
                    'item_id' => $items->random()->id,
                    'tanggal_pemeliharaan' => Carbon::now()->subDays(rand(1, 300))->toDateString(),
                    'jenis_pemeliharaan' => 'Service Rutin',
                    'biaya' => rand(50000, 2000000),
                    'penyedia_jasa' => 'Penyedia ' . rand(1, 10)
                ]);
            }
        }

        if (Peminjaman::count() < 100) {
            $items = Item::all();
            for ($i = 0; $i < 100; $i++) {
                Peminjaman::create([
                    'item_id' => $items->random()->id,
                    'nama_peminjam' => 'Peminjam ' . rand(1, 50),
                    'nip_nik' => rand(10000000, 99999999),
                    'tanggal_pinjam' => Carbon::now()->subDays(rand(5, 20))->toDateString(),
                    'estimasi_kembali' => Carbon::now()->addDays(rand(1, 5))->toDateString(),
                    'status' => 'Dipinjam'
                ]);
            }
        }
    }
}
