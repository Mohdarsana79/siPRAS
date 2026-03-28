<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Item extends Model
{
    use HasFactory;
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kategori_id',
        'ruangan_id',
        'sumber_dana_id',
        'kode_barang',
        'nama_barang',
        'nomor_register',
        'kondisi',
        'tanggal_perolehan',
        'harga',
        'asal_usul',
        'keterangan',
        'foto',
    ];

    public function kategori()
    {
        return $this->belongsTo(MasterKategori::class, 'kategori_id');
    }

    public function ruangan()
    {
        return $this->belongsTo(MasterRuangan::class, 'ruangan_id');
    }

    public function ruangans()
    {
        return $this->belongsToMany(MasterRuangan::class, 'item_ruangan', 'item_id', 'ruangan_id')->withTimestamps();
    }

    public function sumberDana()
    {
        return $this->belongsTo(MasterSumberDana::class, 'sumber_dana_id');
    }

    // Relasi Polymorphic Semu / Extend Masing-Masing KIB
    public function kibA() { return $this->hasOne(KibATanah::class, 'item_id'); }
    public function kibB() { return $this->hasOne(KibBPeralatan::class, 'item_id'); }
    public function kibC() { return $this->hasOne(KibCGedung::class, 'item_id'); }
    public function kibD() { return $this->hasOne(KibDJalan::class, 'item_id'); }
    public function kibE() { return $this->hasOne(KibEAsetLainnya::class, 'item_id'); }
    public function kibF() { return $this->hasOne(KibFKonstruksi::class, 'item_id'); }

    public function mutasiBarangs()
    {
        return $this->hasMany(MutasiBarang::class);
    }

    public function peminjamans()
    {
        return $this->hasMany(Peminjaman::class);
    }

    public function pemeliharaans()
    {
        return $this->hasMany(Pemeliharaan::class);
    }
}
