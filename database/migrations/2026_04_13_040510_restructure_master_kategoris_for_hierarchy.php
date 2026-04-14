<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('master_kategoris', function (Blueprint $table) {
            // Hapus data lama karena kita akan mereset struktur
            DB::table('master_kategoris')->truncate();

            // Tambahkan relasi ke Level 5
            $table->foreignId('master_rincian_objek_id')->after('id')->nullable()->constrained('master_rincian_objeks')->onDelete('cascade');

            // Hapus segment kode yang sekarang diambil dari relasi
            $table->dropColumn([
                'kode_akun',
                'kode_kelompok',
                'kode_jenis',
                'kode_objek',
                'kode_rincian_objek',
                'kode_sub_sub_rincian_objek',
                'kode_barang' // Akan di-generate via accessor di model atau disave ulang
            ]);
            
            // Pastikan kode_sub_rincian_objek unik per parent
            $table->unique(['master_rincian_objek_id', 'kode_sub_rincian_objek'], 'unique_kategori_code');
        });
    }

    public function down(): void
    {
        Schema::table('master_kategoris', function (Blueprint $table) {
            $table->dropForeign(['master_rincian_objek_id']);
            $table->dropColumn('master_rincian_objek_id');
            
            $table->string('kode_akun', 1)->nullable();
            $table->string('kode_kelompok', 1)->nullable();
            $table->string('kode_jenis', 1)->nullable();
            $table->string('kode_objek', 2)->nullable();
            $table->string('kode_rincian_objek', 2)->nullable();
            $table->string('kode_sub_sub_rincian_objek', 3)->nullable();
            $table->string('kode_barang')->nullable();
            
            $table->dropUnique('unique_kategori_code');
        });
    }
};
