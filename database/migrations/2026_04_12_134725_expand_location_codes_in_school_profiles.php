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
            $table->string('kode_komptabel', 2)->default('01')->after('kode_entitas');
            $table->string('kode_unit', 5)->default('00001')->after('kode_skpd');
            $table->string('kode_sub_unit', 5)->default('00001')->after('kode_unit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn(['kode_komptabel', 'kode_unit', 'kode_sub_unit']);
        });
    }
};
