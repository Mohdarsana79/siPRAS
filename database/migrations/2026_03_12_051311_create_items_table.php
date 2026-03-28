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
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('kategori_id')->constrained('master_kategoris')->onDelete('restrict');
            $table->foreignId('ruangan_id')->nullable()->constrained('master_ruangans')->onDelete('set null');
            $table->foreignId('sumber_dana_id')->constrained('master_sumber_danas')->onDelete('restrict');
            $table->string('kode_barang');
            $table->string('nama_barang');
            $table->string('nomor_register');
            $table->enum('kondisi', ['Baik', 'Kurang Baik', 'Rusak Berat']);
            $table->date('tanggal_perolehan');
            $table->decimal('harga', 15, 2);
            $table->string('asal_usul');
            $table->text('keterangan')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
