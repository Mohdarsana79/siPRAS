<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KibFKonstruksi extends Model
{
    protected $fillable = [
        'item_id',
        'bangunan',
        'konstruksi_bertingkat',
        'konstruksi_beton',
        'luas',
        'letak_lokasi',
        'dokumen_tanggal',
        'dokumen_nomor',
        'tanggal_mulai',
        'status_tanah',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
