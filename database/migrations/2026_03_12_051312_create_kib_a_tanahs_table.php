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
        Schema::create('kib_a_tanahs', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade')->unique();
            $table->decimal('luas', 10, 2);
            $table->text('letak_alamat');
            $table->string('hak_tanah');
            $table->date('tanggal_sertifikat');
            $table->string('nomor_sertifikat');
            $table->string('penggunaan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kib_a_tanahs');
    }
};
