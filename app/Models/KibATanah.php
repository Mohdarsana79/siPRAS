<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KibATanah extends Model
{
    protected $fillable = [
        'item_id',
        'luas',
        'letak_alamat',
        'hak_tanah',
        'tanggal_sertifikat',
        'nomor_sertifikat',
        'penggunaan',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
