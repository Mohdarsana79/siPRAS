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
        // 1. User Admin
        $user = User::firstOrCreate(
            ['email' => 'admin@sipras.com'],
            [
                'name'     => 'Administrator',
                'password' => Hash::make('password'),
            ]
        );

        // 3. (Optional) Master Sumber Dana - Dikosongkan untuk input manual
        // 4. Master Kategori (Permendagri No. 108 Tahun 2016)
        // Format: Akun.Kelompok.Jenis.Objek.Rincian.Sub.SubSub
        // Akun 1 = Aset
        // Kelompok 3 = Aset Tetap
        // Jenis: 1=Tanah, 2=Peralatan, 3=Gedung, 4=Jalan, 5=Aset Lainnya, 6=KDP
        $kategoris = [

            // ========== KIB A - TANAH (Jenis 1) ==========
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '1',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '001',
                'nama_kategori' => 'Tanah Bangunan Rumah Negara Gol. I',
                'tipe_kib' => 'A',
            ],
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '1',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '005',
                'nama_kategori' => 'Tanah Bangunan Gedung Sekolah',
                'tipe_kib' => 'A',
            ],

            // ========== KIB B - PERALATAN DAN MESIN (Jenis 2) ==========
            // Alat Kantor (2.05)
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '2',
                'kode_objek' => '05', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '002',
                'nama_kategori' => 'Mesin Tik Manual Standard (11-13 inch)',
                'tipe_kib' => 'B',
            ],
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '2',
                'kode_objek' => '05', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '02', 'kode_sub_sub_rincian_objek' => '001',
                'nama_kategori' => 'Meja Kerja Pejabat',
                'tipe_kib' => 'B',
            ],
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '2',
                'kode_objek' => '05', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '02', 'kode_sub_sub_rincian_objek' => '005',
                'nama_kategori' => 'Lemari Besi/Warkat',
                'tipe_kib' => 'B',
            ],
            // Komputer (2.10)
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '2',
                'kode_objek' => '10', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '002',
                'nama_kategori' => 'PC Unit',
                'tipe_kib' => 'B',
            ],
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '2',
                'kode_objek' => '10', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '003',
                'nama_kategori' => 'Laptop',
                'tipe_kib' => 'B',
            ],

            // ========== KIB C - GEDUNG DAN BANGUNAN (Jenis 3) ==========
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '3',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '001',
                'nama_kategori' => 'Bangunan Gedung Kantor Permanen',
                'tipe_kib' => 'C',
            ],
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '3',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '011',
                'nama_kategori' => 'Bangunan Gedung Pendidikan Permanen',
                'tipe_kib' => 'C',
            ],

            // ========== KIB D - JALAN, IRIGASI (Jenis 4) ==========
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '4',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '001',
                'nama_kategori' => 'Jalan Arteri Aspal',
                'tipe_kib' => 'D',
            ],

            // ========== KIB E - ASET LAINNYA (Jenis 5) ==========
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '5',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '001',
                'nama_kategori' => 'Buku Ilmu Pengetahuan Umum',
                'tipe_kib' => 'E',
            ],

            // ========== KIB F - KDP (Jenis 6) ==========
            [
                'kode_akun' => '1', 'kode_kelompok' => '3', 'kode_jenis' => '6',
                'kode_objek' => '01', 'kode_rincian_objek' => '01', 'kode_sub_rincian_objek' => '01', 'kode_sub_sub_rincian_objek' => '001',
                'nama_kategori' => 'KDP Bangunan Gedung Negara',
                'tipe_kib' => 'F',
            ],
        ];

        foreach ($kategoris as $k) {
            MasterKategori::firstOrCreate(
                [
                    'kode_akun'                  => $k['kode_akun'],
                    'kode_kelompok'              => $k['kode_kelompok'],
                    'kode_jenis'                 => $k['kode_jenis'],
                    'kode_objek'                 => $k['kode_objek'],
                    'kode_rincian_objek'         => $k['kode_rincian_objek'],
                    'kode_sub_rincian_objek'     => $k['kode_sub_rincian_objek'],
                    'kode_sub_sub_rincian_objek' => $k['kode_sub_sub_rincian_objek'],
                ],
                $k
            );
        }

        // 5. Jalankan Wilayah Seeder (Dihapus sesuai permintaan)
    }
}
