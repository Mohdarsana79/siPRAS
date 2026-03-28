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
        Schema::create('pemeliharaans', function (Blueprint $table) {
            $table->id();
            $table->uuid('item_id');
            $table->date('tanggal_pemeliharaan');
            $table->string('jenis_pemeliharaan');
            $table->decimal('biaya', 15, 2)->default(0);
            $table->string('penyedia_jasa')->nullable();
            $table->string('bukti_nota')->nullable();
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
        Schema::dropIfExists('pemeliharaans');
    }
};
