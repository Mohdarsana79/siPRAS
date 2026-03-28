<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemeliharaan extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id', 'tanggal_pemeliharaan', 'jenis_pemeliharaan', 
        'biaya', 'penyedia_jasa', 'bukti_nota', 'keterangan'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
