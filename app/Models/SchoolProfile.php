<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    protected $fillable = [
        'nama_sekolah',
        'npsn',
        'tipe_wilayah',
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
        // Kode lokasi BMD (Permendagri 108/2016)
        'kode_entitas',
        'provinsi_wilayah_id',
        'kab_kota_wilayah_id',
        'kode_provinsi',
        'kode_kab_kota',
        'kode_skpd',
        'kode_unit',
        'kode_sub_unit',
    ];

    /**
     * Relasi ke master_wilayahs untuk provinsi
     */
    public function provinsiWilayah()
    {
        return $this->belongsTo(MasterWilayah::class, 'provinsi_wilayah_id');
    }

    /**
     * Relasi ke master_wilayahs untuk kab/kota
     */
    public function kabKotaWilayah()
    {
        return $this->belongsTo(MasterWilayah::class, 'kab_kota_wilayah_id');
    }

    /**
     * Generate kode lokasi lengkap untuk nomor register BMD (7 Segmen)
     * Format: {kepemilikan}.{komp}.{prov}.{kab}.{pengguna}.{kuasa}.{sub_kuasa}
     * Contoh: 12.01.33.73.010101.00001.00001
     */
    public function getKodeLokasiBmdAttribute(): string
    {
        $kepemilikan = str_pad($this->kode_entitas ?? '12', 2, '0', STR_PAD_LEFT);
        $komptabel   = 'XX'; // Sekarang dinamis per item
        $prov        = str_pad($this->kode_provinsi ?? '00', 2, '0', STR_PAD_LEFT);
        $kab         = str_pad($this->kode_kab_kota ?? '00', 2, '0', STR_PAD_LEFT);
        $pengguna    = str_pad($this->kode_skpd ?? '000000', 6, '0', STR_PAD_LEFT);
        $kuasa       = str_pad($this->kode_unit ?? '00001', 5, '0', STR_PAD_LEFT);
        $subKuasa    = str_pad($this->kode_sub_unit ?? '00001', 5, '0', STR_PAD_LEFT);

        return "{$kepemilikan}.{$komptabel}.{$prov}.{$kab}.{$pengguna}.{$kuasa}.{$subKuasa}";
    }

    /**
     * Cek apakah kode lokasi BMD sudah lengkap dikonfigurasi
     */
    public function getIsKodeLokasiKomplitAttribute(): bool
    {
        return !empty($this->kode_provinsi) && 
               !empty($this->kode_kab_kota) && 
               !empty($this->kode_skpd) && 
               !empty($this->kode_unit);
    }
}
