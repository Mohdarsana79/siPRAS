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
        Schema::table('kib_f_konstruksis', function (Blueprint $table) {
            $table->date('dokumen_tanggal')->nullable()->change();
            $table->string('dokumen_nomor')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kib_f_konstruksis', function (Blueprint $table) {
            $table->date('dokumen_tanggal')->nullable(false)->change();
            $table->string('dokumen_nomor')->nullable(false)->change();
        });
    }
};
