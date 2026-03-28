<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KibEAsetLainnya extends Model
{
    protected $fillable = [
        'item_id',
        'judul_buku_nama_kesenian',
        'pencipta',
        'spesifikasi',
        'asal_daerah',
        'bahan',
        'jenis_hewan_tumbuhan',
        'ukuran',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
