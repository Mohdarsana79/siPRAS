<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterObjek extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_kelompok',
        'kode_jenis',
        'kode_objek',
        'nama_objek',
    ];

    public function rincianObjeks()
    {
        return $this->hasMany(MasterRincianObjek::class, 'master_objek_id');
    }

    public function getFullCodeByJenisAttribute()
    {
        return "1.3.{$this->kode_jenis}.{$this->kode_objek}";
    }
}
