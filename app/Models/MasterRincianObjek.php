<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterRincianObjek extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_objek_id',
        'kode_rincian_objek',
        'nama_rincian_objek',
    ];

    public function objek()
    {
        return $this->belongsTo(MasterObjek::class, 'master_objek_id');
    }

    public function kategoris()
    {
        return $this->hasMany(MasterKategori::class, 'master_rincian_objek_id');
    }

    public function getFullCodeByJenisAttribute()
    {
        $objekCode = $this->objek->kode_objek ?? '00';
        $jenisCode = $this->objek->kode_jenis ?? '0';
        $kelompok  = $this->objek->kode_kelompok ?? '3';
        return "1.{$kelompok}.{$jenisCode}.{$objekCode}.{$this->kode_rincian_objek}";
    }
}
