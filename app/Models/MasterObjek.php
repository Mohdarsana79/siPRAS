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
        $kelompok = $this->kode_kelompok ?? '3';
        return "1.{$kelompok}.{$this->kode_jenis}.{$this->kode_objek}";
    }
}
