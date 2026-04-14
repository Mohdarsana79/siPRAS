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
        Schema::table('school_profiles', function (Blueprint $table) {
            // Tambahkan kolom manual untuk kode-kode BMD
            $table->char('kode_provinsi', 2)->nullable()->after('provinsi_wilayah_id');
            $table->char('kode_kab_kota', 2)->nullable()->after('kab_kota_wilayah_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn(['kode_provinsi', 'kode_kab_kota']);
        });
    }
};
