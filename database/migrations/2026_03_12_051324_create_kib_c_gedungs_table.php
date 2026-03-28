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
        Schema::create('kib_c_gedungs', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade')->unique();
            $table->string('kondisi_bangunan');
            $table->boolean('konstruksi_bertingkat')->default(false);
            $table->boolean('konstruksi_beton')->default(false);
            $table->decimal('luas_lantai', 10, 2);
            $table->text('letak_alamat');
            $table->date('dokumen_tanggal');
            $table->string('dokumen_nomor');
            $table->string('status_tanah');
            $table->string('kode_tanah')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kib_c_gedungs');
    }
};
