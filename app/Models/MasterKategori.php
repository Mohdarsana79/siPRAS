<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterKategori extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_kategori',
        'nama_kategori',
        'tipe_kib'
    ];
}
