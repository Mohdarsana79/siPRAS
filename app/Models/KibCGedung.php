<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KibCGedung extends Model
{
    protected $fillable = [
        'item_id',
        'kondisi_bangunan',
        'konstruksi_bertingkat',
        'konstruksi_beton',
        'luas_lantai',
        'letak_alamat',
        'dokumen_tanggal',
        'dokumen_nomor',
        'status_tanah',
        'kode_tanah',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
