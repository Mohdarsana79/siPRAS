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
            $table->string('kabupaten_kota')->nullable()->after('npsn');
            $table->string('provinsi')->nullable()->after('kabupaten_kota');
            $table->string('kecamatan')->nullable()->after('provinsi');
            $table->string('unor_induk')->nullable()->after('kecamatan');
            $table->string('email_sekolah')->nullable()->after('alamat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn(['kabupaten_kota', 'provinsi', 'kecamatan', 'unor_induk', 'email_sekolah']);
        });
    }
};
