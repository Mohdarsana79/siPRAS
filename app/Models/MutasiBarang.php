<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutasiBarang extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id', 'jenis_mutasi', 'dari_ruangan_id', 'ke_ruangan_id', 
        'tipe_penghapusan', 'tanggal_mutasi', 'keterangan', 'user_id'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function dariRuangan()
    {
        return $this->belongsTo(MasterRuangan::class, 'dari_ruangan_id');
    }

    public function keRuangan()
    {
        return $this->belongsTo(MasterRuangan::class, 'ke_ruangan_id');
    }
}
