<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    protected $fillable = [
        'nama_sekolah',
        'npsn',
        'kabupaten_kota',
        'provinsi',
        'kecamatan',
        'unor_induk',
        'alamat',
        'email_sekolah',
        'nama_kepala_sekolah',
        'nip_kepala_sekolah',
        'nama_pengelola_aset',
        'nip_pengelola_aset',
        'logo',
        'logo_daerah',
        'tipe_wilayah',
    ];
}
