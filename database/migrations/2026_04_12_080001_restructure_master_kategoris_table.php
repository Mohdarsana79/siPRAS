<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Restrukturisasi tabel master_kategoris agar sesuai dengan
 * Permendagri No. 108 Tahun 2016 tentang Penggolongan dan
 * Kodefikasi Barang Milik Daerah.
 *
 * Struktur kode barang 12 digit (6 level, masing-masing 2 digit):
 *  Level 1 - kode_akun          : 01 (Aset Tetap)
 *  Level 2 - kode_kelompok      : 01-06 (Tanah, Peralatan, Gedung, dst.)
 *  Level 3 - kode_jenis         : sub-kelompok barang
 *  Level 4 - kode_objek         : jenis spesifik barang
 *  Level 5 - kode_rincian_objek : rincian barang
 *  Level 6 - kode_sub_rincian   : sub rincian barang
 *
 * Format kode_barang: XX.XX.XX.XX.XX.XX
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('master_kategoris', function (Blueprint $table) {
            // Hapus kolom lama kode_kategori
            if (Schema::hasColumn('master_kategoris', 'kode_kategori')) {
                $table->dropColumn('kode_kategori');
            }

            // Tambah 7 kolom hierarki kode barang (sesuai Permendagri 108/2016)
            $table->char('kode_akun', 1)->default('1')->after('id')
                ->comment('Level 1: Akun (1 = Aset)');
            $table->char('kode_kelompok', 1)->default('3')->after('kode_akun')
                ->comment('Level 2: Kelompok (1=Lancar, 3=Tetap, 5=Lainnya)');
            $table->char('kode_jenis', 1)->after('kode_kelompok')
                ->comment('Level 3: Jenis (1=Tanah, 2=Peralatan, 3=Gedung, 4=Jalan, 5=Aset Tetap Lainnya, 6=KDP)');
            $table->char('kode_objek', 2)->after('kode_jenis')
                ->comment('Level 4: Objek');
            $table->char('kode_rincian_objek', 2)->after('kode_objek')
                ->comment('Level 5: Rincian Objek');
            $table->char('kode_sub_rincian_objek', 2)->after('kode_rincian_objek')
                ->comment('Level 6: Sub Rincian Objek');
            $table->char('kode_sub_sub_rincian_objek', 3)->after('kode_sub_rincian_objek')
                ->comment('Level 7: Sub-Sub Rincian Objek');

            // Kolom kode_barang (1.3.1.01.01.01.001) disimpan untuk kemudahan query/unique
            $table->string('kode_barang', 30)->after('kode_sub_sub_rincian_objek')
                ->comment('Kode barang lengkap: 1.3.x.xx.xx.xx.xxx (otomatis dari 7 level)');

            // Unique constraint pada kode_barang
            $table->unique('kode_barang', 'unique_kode_barang');
        });
    }

    public function down(): void
    {
        Schema::table('master_kategoris', function (Blueprint $table) {
            $table->dropUnique('unique_kode_barang');
            $table->dropColumn([
                'kode_akun',
                'kode_kelompok',
                'kode_jenis',
                'kode_objek',
                'kode_rincian_objek',
                'kode_sub_rincian_objek',
                'kode_sub_sub_rincian_objek',
                'kode_barang',
            ]);
            // Kembalikan kolom lama jika diperlukan
            if (!Schema::hasColumn('master_kategoris', 'kode_kategori')) {
                $table->string('kode_kategori')->unique()->after('id');
            }
        });
    }
};
