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
        Schema::create('kib_d_jalans', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade')->unique();
            $table->string('konstruksi');
            $table->decimal('panjang', 10, 2);
            $table->decimal('lebar', 10, 2);
            $table->decimal('luas', 10, 2);
            $table->text('letak_lokasi');
            $table->date('dokumen_tanggal');
            $table->string('dokumen_nomor');
            $table->string('status_tanah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kib_d_jalans');
    }
};
