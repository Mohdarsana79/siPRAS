<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tambah kolom kode lokasi ke school_profiles untuk pembentukan
 * Nomor Register BMD sesuai Permendagri No. 108 Tahun 2016.
 *
 * Format Kode Lokasi (komponen dalam Nomor Register):
 *  {kode_entitas}-{kode_provinsi}-{kode_kab_kota}-{kode_skpd}
 *  Contoh: 12.33.73.101
 *
 * kode_entitas: 12 = Kab/Kota, 11 = Provinsi
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            // Tipe entitas pemerintahan (12 = Kab/Kota, 11 = Provinsi)
            $table->char('kode_entitas', 2)->default('12')->after('tipe_wilayah')
                ->comment('12 = Kab/Kota, 11 = Provinsi');

            // FK ke master_wilayahs untuk provinsi
            $table->foreignId('provinsi_wilayah_id')->nullable()
                ->after('kode_entitas')
                ->constrained('master_wilayahs')
                ->onDelete('set null')
                ->comment('Referensi provinsi dari master_wilayahs');

            // FK ke master_wilayahs untuk kab/kota
            $table->foreignId('kab_kota_wilayah_id')->nullable()
                ->after('provinsi_wilayah_id')
                ->constrained('master_wilayahs')
                ->onDelete('set null')
                ->comment('Referensi kab/kota dari master_wilayahs');

            // Kode SKPD/Unit (nomor unit SKPD dinas pendidikan atau sekolah)
            $table->string('kode_skpd', 6)->nullable()->after('kab_kota_wilayah_id')
                ->comment('Kode unit SKPD (misal: 101 untuk Dinas Pendidikan)');
        });
    }

    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropForeign(['provinsi_wilayah_id']);
            $table->dropForeign(['kab_kota_wilayah_id']);
            $table->dropColumn([
                'kode_entitas',
                'provinsi_wilayah_id',
                'kab_kota_wilayah_id',
                'kode_skpd',
            ]);
        });
    }
};
