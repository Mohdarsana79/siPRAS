<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KibDJalan extends Model
{
    protected $fillable = [
        'item_id',
        'konstruksi',
        'panjang',
        'lebar',
        'luas',
        'letak_lokasi',
        'dokumen_tanggal',
        'dokumen_nomor',
        'status_tanah',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
