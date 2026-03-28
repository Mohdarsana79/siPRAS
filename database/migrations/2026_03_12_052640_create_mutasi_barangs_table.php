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
        Schema::create('mutasi_barangs', function (Blueprint $table) {
            $table->id();
            $table->uuid('item_id');
            $table->enum('jenis_mutasi', ['Pindah Ruangan', 'Penghapusan/Afkir']);
            $table->foreignId('dari_ruangan_id')->nullable()->constrained('master_ruangans')->nullOnDelete();
            $table->foreignId('ke_ruangan_id')->nullable()->constrained('master_ruangans')->nullOnDelete();
            $table->string('tipe_penghapusan')->nullable();
            $table->date('tanggal_mutasi');
            $table->text('keterangan')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutasi_barangs');
    }
};
