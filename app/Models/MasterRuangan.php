<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterRuangan extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_ruangan',
        'nama_ruangan',
        'penanggung_jawab'
    ];

    /**
     * Relasi ke items (One-to-Many)
     */
    public function itemsDirect()
    {
        return $this->hasMany(Item::class, 'ruangan_id');
    }

    /**
     * Relasi ke items (Many-to-Many)
     */
    public function itemsLinked()
    {
        return $this->belongsToMany(Item::class, 'item_ruangan', 'ruangan_id', 'item_id');
    }
}
