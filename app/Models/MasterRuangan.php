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
}
