<?php

namespace Database\Seeders;

use App\Models\User;
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
use App\Models\Peminjaman;
use App\Models\Pemeliharaan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. User
        $user = User::firstOrCreate(
            ['email' => 'admin@sipras.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Master Ruangan
        $ruangans = [
            ['kode_ruangan' => 'R001', 'nama_ruangan' => 'Ruang Kepala Sekolah', 'penanggung_jawab' => 'Bpk. Ahmad'],
            ['kode_ruangan' => 'R002', 'nama_ruangan' => 'Laboratorium Komputer', 'penanggung_jawab' => 'Ibu Sita'],
            ['kode_ruangan' => 'R003', 'nama_ruangan' => 'Perpustakaan', 'penanggung_jawab' => 'Bpk. Budi'],
            ['kode_ruangan' => 'R004', 'nama_ruangan' => 'Ruang Guru', 'penanggung_jawab' => 'Ibu Ratna'],
            ['kode_ruangan' => 'R005', 'nama_ruangan' => 'Kelas X MIPA 1', 'penanggung_jawab' => 'Bpk. Rizal'],
        ];

        foreach ($ruangans as $r) {
            MasterRuangan::firstOrCreate(['kode_ruangan' => $r['kode_ruangan']], $r);
        }

        // 3. Master Sumber Dana
        $sumberDanas = [
            ['kode' => 'BKR', 'nama_sumber' => 'BOS Reguler'],
            ['kode' => 'BKD', 'nama_sumber' => 'BOS Daerah'],
            ['kode' => 'APBN', 'nama_sumber' => 'Bantuan Pemerintah Pusat'],
            ['kode' => 'YYS', 'nama_sumber' => 'Yayasan'],
            ['kode' => 'HBH', 'nama_sumber' => 'Hibah / Sumbangan'],
        ];

        foreach ($sumberDanas as $s) {
            MasterSumberDana::firstOrCreate(['kode' => $s['kode']], $s);
        }

        // 4. Master Kategori
        $kategoris = [
            ['kode_kategori' => 'K01', 'nama_kategori' => 'Tanah Bangunan Sekolah', 'tipe_kib' => 'A'],
            ['kode_kategori' => 'K02', 'nama_kategori' => 'Komputer & Laptop', 'tipe_kib' => 'B'],
            ['kode_kategori' => 'K03', 'nama_kategori' => 'Kendaraan Dinas', 'tipe_kib' => 'B'],
            ['kode_kategori' => 'K04', 'nama_kategori' => 'Bangunan Ruang Kelas', 'tipe_kib' => 'C'],
            ['kode_kategori' => 'K05', 'nama_kategori' => 'Jalan Setapak Sekolah', 'tipe_kib' => 'D'],
            ['kode_kategori' => 'K06', 'nama_kategori' => 'Buku Referensi Pustaka', 'tipe_kib' => 'E'],
            ['kode_kategori' => 'K07', 'nama_kategori' => 'Proyek Gedung Serbaguna', 'tipe_kib' => 'F'],
            ['kode_kategori' => 'K08', 'nama_kategori' => 'Meja & Kursi Siswa', 'tipe_kib' => 'B'],
        ];

        foreach ($kategoris as $k) {
            MasterKategori::firstOrCreate(['kode_kategori' => $k['kode_kategori']], $k);
        }

        $rLab = MasterRuangan::where('kode_ruangan', 'R002')->first();
        $rPerpus = MasterRuangan::where('kode_ruangan', 'R003')->first();
        $sGuru = MasterRuangan::where('kode_ruangan', 'R004')->first();
        $sdBos = MasterSumberDana::where('kode', 'BKR')->first();
        $sdApbn = MasterSumberDana::where('kode', 'APBN')->first();
        $sdHibah = MasterSumberDana::where('kode', 'HBH')->first();

        // 5. Insert Items (Dummy Data)

        // KIB A - Tanah
        $katA = MasterKategori::where('kode_kategori', 'K01')->first();
        if ($katA && Item::where('kode_barang', 'A-001')->count() == 0) {
            $itemA = Item::create([
                'kategori_id' => $katA->id,
                'sumber_dana_id' => $sdApbn->id,
                'kode_barang' => 'A-001',
                'nama_barang' => 'Tanah Lokasi Sekolah Utama',
                'nomor_register' => '000001',
                'kondisi' => 'Baik',
                'tanggal_perolehan' => '2010-01-15',
                'harga' => 1500000000,
                'asal_usul' => 'Pembelian APBD',
                'keterangan' => 'Tanah tersertifikasi atas nama Pemda'
            ]);
            KibATanah::create([
                'item_id' => $itemA->id,
                'luas' => 5000,
                'letak_alamat' => 'Jl. Pendidikan No 123',
                'hak_tanah' => 'Hak Pakai',
                'tanggal_sertifikat' => '2010-02-10',
                'nomor_sertifikat' => 'HM-09213',
                'penggunaan' => 'Bangunan Sekolah'
            ]);
        }

        // KIB B - Peralatan Komputer
        $katB1 = MasterKategori::where('kode_kategori', 'K02')->first();
        if ($katB1 && Item::where('kode_barang', 'B-101')->count() == 0) {
            for($i=1; $i<=5; $i++) {
                $itemB = Item::create([
                    'kategori_id' => $katB1->id,
                    'ruangan_id' => $rLab->id,
                    'sumber_dana_id' => $sdBos->id,
                    'kode_barang' => 'B-10' . $i,
                    'nama_barang' => 'PC All-in-One Lenovo AIO 3',
                    'nomor_register' => '00010' . $i,
                    'kondisi' => $i === 5 ? 'Kurang Baik' : 'Baik',
                    'tanggal_perolehan' => '2023-05-20',
                    'harga' => 8500000,
                    'asal_usul' => 'Pembelian BOS',
                    'keterangan' => 'Untuk ujian lab komputer'
                ]);
                KibBPeralatan::create([
                    'item_id' => $itemB->id,
                    'merk_tipe' => 'Lenovo / AIO 3',
                    'bahan' => 'Plastik/Metal',
                    'tahun_pembuatan' => 2023,
                ]);

                // Tambahkan Riwayat Pemeliharaan pada PC 5
                if ($i === 5) {
                    Pemeliharaan::create([
                        'item_id' => $itemB->id,
                        'tanggal_pemeliharaan' => '2025-01-10',
                        'jenis_pemeliharaan' => 'Ganti RAM 8GB',
                        'biaya' => 450000,
                        'penyedia_jasa' => 'Toko Komputer Maju',
                        'keterangan' => 'RAM rusak, diganti baru'
                    ]);
                }
            }
        }

        // KIB B - Kendaraan
        $katB2 = MasterKategori::where('kode_kategori', 'K03')->first();
        if ($katB2 && Item::where('kode_barang', 'B-201')->count() == 0) {
            $itemKendaraan = Item::create([
                'kategori_id' => $katB2->id,
                'sumber_dana_id' => $sdApbn->id,
                'kode_barang' => 'B-201',
                'nama_barang' => 'Mobil Operasional Sekolah',
                'nomor_register' => '000201',
                'kondisi' => 'Baik',
                'tanggal_perolehan' => '2021-08-10',
                'harga' => 250000000,
                'asal_usul' => 'Bantuan Kemdikbud',
                'keterangan' => 'Mini Bus Sekolah'
            ]);
            KibBPeralatan::create([
                'item_id' => $itemKendaraan->id,
                'merk_tipe' => 'Toyota / Hiace',
                'ukuran_cc' => '2500cc',
                'bahan' => 'Besi',
                'tahun_pembuatan' => 2021,
                'nomor_polisi' => 'B 1234 CD',
                'nomor_bpkb' => '19273612'
            ]);

            // Simulasi Kendaraan Dipinjam 
            Peminjaman::create([
                'item_id' => $itemKendaraan->id,
                'nama_peminjam' => 'Bpk. Ahmad (Kepsek)',
                'tanggal_pinjam' => Carbon::now()->subDays(2),
                'estimasi_kembali' => Carbon::now()->addDays(1),
                'status' => 'Dipinjam',
                'keterangan' => 'Perjalanan Dinas'
            ]);
        }

        // KIB C - Gedung
        $katC = MasterKategori::where('kode_kategori', 'K04')->first();
        if ($katC && Item::where('kode_barang', 'C-001')->count() == 0) {
            $itemC = Item::create([
                'kategori_id' => $katC->id,
                'sumber_dana_id' => $sdApbn->id,
                'kode_barang' => 'C-001',
                'nama_barang' => 'Gedung Laboratorium Terpadu',
                'nomor_register' => '000301',
                'kondisi' => 'Baik',
                'tanggal_perolehan' => '2015-10-10',
                'harga' => 800000000,
                'asal_usul' => 'Pembelian APBD',
                'keterangan' => 'Gedung berlantai 2'
            ]);
            KibCGedung::create([
                'item_id' => $itemC->id,
                'kondisi_bangunan' => 'Permanen',
                'konstruksi_bertingkat' => true,
                'konstruksi_beton' => true,
                'luas_lantai' => 450,
                'letak_alamat' => 'Jl. Pendidikan No 123 Blok B',
                'dokumen_tanggal' => '2015-11-01',
                'dokumen_nomor' => 'IMB-2015-998',
                'status_tanah' => 'Hak Pakai'
            ]);
        }

        // KIB E - Buku
        $katE = MasterKategori::where('kode_kategori', 'K06')->first();
        if ($katE && Item::where('kode_barang', 'E-001')->count() == 0) {
            $itemE = Item::create([
                'kategori_id' => $katE->id,
                'ruangan_id' => $rPerpus->id,
                'sumber_dana_id' => $sdBos->id,
                'kode_barang' => 'E-001',
                'nama_barang' => 'Ensiklopedia Sains Modern Vol 1-10',
                'nomor_register' => '000501',
                'kondisi' => 'Baik',
                'tanggal_perolehan' => '2024-02-15',
                'harga' => 3500000,
                'asal_usul' => 'Pembelian BOSDa',
                'keterangan' => 'Referensi bahan ajar'
            ]);
            KibEAsetLainnya::create([
                'item_id' => $itemE->id,
                'judul_buku_nama_kesenian' => 'Ensiklopedia Sains Modern',
                'pencipta' => 'Gramedia',
                'spesifikasi' => 'Cetak Berwarna 10 Seri',
                'asal_daerah' => 'Jakarta (Pusat Penerbitan)',
                'bahan' => 'Kertas'
            ]);
        }

        // KIB F - Konstruksi
        $katF = MasterKategori::where('kode_kategori', 'K07')->first();
        if ($katF && Item::where('kode_barang', 'F-001')->count() == 0) {
            $itemF = Item::create([
                'kategori_id' => $katF->id,
                'sumber_dana_id' => $sdHibah->id,
                'kode_barang' => 'F-001',
                'nama_barang' => 'Pembangunan Aula Olahraga',
                'nomor_register' => '000601',
                'kondisi' => 'Baik',
                'tanggal_perolehan' => '2026-01-10',
                'harga' => 450000000, // Biaya yang sudah keluar
                'asal_usul' => 'Sumbangan Alumni',
                'keterangan' => 'Proyek sedang berjalan tahap 2'
            ]);
            KibFKonstruksi::create([
                'item_id' => $itemF->id,
                'bangunan' => 'Aula Terbuka',
                'konstruksi_bertingkat' => false,
                'konstruksi_beton' => true,
                'luas' => 800,
                'letak_lokasi' => 'Sebelah Timur Lapangan Upacara',
                'dokumen_tanggal' => '2026-01-05',
                'dokumen_nomor' => 'SPK-2026/01/05',
                'tanggal_mulai' => '2026-01-15',
                'status_tanah' => 'Hak Pakai'
            ]);
        }

        // 6. Dummy Data for Pagination Testing
        $this->call(DummyDataSeeder::class);
    }
}
