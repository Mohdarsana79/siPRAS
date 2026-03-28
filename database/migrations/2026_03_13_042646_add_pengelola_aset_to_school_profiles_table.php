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
            $table->string('nama_pengelola_aset')->nullable()->after('nip_kepala_sekolah');
            $table->string('nip_pengelola_aset')->nullable()->after('nama_pengelola_aset');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn(['nama_pengelola_aset', 'nip_pengelola_aset']);
        });
    }
};
