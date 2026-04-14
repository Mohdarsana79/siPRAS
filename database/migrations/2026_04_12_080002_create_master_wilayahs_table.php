<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel referensi wilayah dengan kode BPS resmi
 * (Badan Pusat Statistik / Kemendagri)
 * Digunakan untuk membentuk Kode Lokasi dalam Nomor Register BMD
 * sesuai Permendagri No. 108 Tahun 2016.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_wilayahs', function (Blueprint $table) {
            $table->id();
            $table->string('kode_bps', 4)
                ->comment('Kode BPS: 2 digit untuk provinsi, 4 digit untuk kab/kota (prov+kab)');
            $table->string('kode_kemendagri', 10)->nullable()
                ->comment('Kode resmi Kemendagri jika berbeda dari BPS');
            $table->string('nama_wilayah', 150);
            $table->enum('tipe', ['provinsi', 'kabupaten', 'kota'])
                ->comment('Tipe wilayah');
            $table->string('kode_provinsi', 2)->nullable()
                ->comment('2 digit kode provinsi (untuk level kab/kota)');
            $table->foreignId('parent_id')->nullable()
                ->constrained('master_wilayahs')
                ->onDelete('cascade')
                ->comment('FK ke provinsi (untuk level kab/kota)');
            $table->timestamps();

            $table->index(['kode_bps', 'tipe']);
            $table->index('parent_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_wilayahs');
    }
};
