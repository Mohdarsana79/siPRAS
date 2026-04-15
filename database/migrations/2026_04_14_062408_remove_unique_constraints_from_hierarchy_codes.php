<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('master_objeks', function (Blueprint $table) {
            $table->dropUnique('unique_objek_code');
            $table->unique(['kode_kelompok', 'kode_jenis', 'kode_objek'], 'unique_objek_code');
        });

        Schema::table('master_rincian_objeks', function (Blueprint $table) {
            $table->dropUnique('unique_rincian_code');
            $table->unique(['master_objek_id', 'kode_rincian_objek'], 'unique_rincian_code');
        });

        Schema::table('master_kategoris', function (Blueprint $table) {
            $table->dropUnique('unique_kategori_code');
            $table->unique(['master_rincian_objek_id', 'kode_sub_rincian_objek'], 'unique_kategori_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_objeks', function (Blueprint $table) {
            $table->dropUnique('unique_objek_code');
            $table->unique(['kode_jenis', 'kode_objek'], 'unique_objek_code');
        });

        Schema::table('master_rincian_objeks', function (Blueprint $table) {
            $table->dropUnique('unique_rincian_code');
            $table->unique(['master_objek_id', 'kode_rincian_objek'], 'unique_rincian_code');
        });

        Schema::table('master_kategoris', function (Blueprint $table) {
            $table->unique(['master_rincian_objek_id', 'kode_sub_rincian_objek'], 'unique_kategori_code');
        });
    }
};
