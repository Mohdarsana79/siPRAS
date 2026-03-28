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
        Schema::create('kib_f_konstruksis', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade')->unique();
            $table->string('bangunan');
            $table->boolean('konstruksi_bertingkat')->default(false);
            $table->boolean('konstruksi_beton')->default(false);
            $table->decimal('luas', 10, 2);
            $table->text('letak_lokasi');
            $table->date('dokumen_tanggal');
            $table->string('dokumen_nomor');
            $table->date('tanggal_mulai');
            $table->string('status_tanah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kib_f_konstruksis');
    }
};
