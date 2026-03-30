<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use App\Models\MasterKategori;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
    }
}
