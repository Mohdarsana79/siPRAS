<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KibBPeralatan extends Model
{
    protected $fillable = [
        'item_id',
        'merk_tipe',
        'ukuran_cc',
        'bahan',
        'tahun_pembuatan',
        'nomor_pabrik',
        'nomor_rangka',
        'nomor_mesin',
        'nomor_polisi',
        'nomor_bpkb',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
