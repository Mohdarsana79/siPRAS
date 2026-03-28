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
        Schema::create('peminjamans', function (Blueprint $table) {
            $table->id();
            $table->uuid('item_id');
            $table->string('nama_peminjam');
            $table->string('nip_nik')->nullable();
            $table->date('tanggal_pinjam');
            $table->date('estimasi_kembali');
            $table->date('tanggal_kembali')->nullable();
            $table->enum('status', ['Dipinjam', 'Dikembalikan', 'Terlambat'])->default('Dipinjam');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamans');
    }
};
