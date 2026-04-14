<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model MasterWilayah
 * Referensi wilayah dengan kode BPS/Kemendagri resmi
 * Digunakan untuk membentuk Kode Lokasi dalam Nomor Register BMD
 * sesuai Permendagri No. 108 Tahun 2016.
 */
class MasterWilayah extends Model
{
    protected $fillable = [
        'kode_bps',
        'kode_kemendagri',
        'nama_wilayah',
        'tipe',
        'kode_provinsi',
        'parent_id',
    ];

    /**
     * Relasi ke provinsi (parent)
     */
    public function provinsi()
    {
        return $this->belongsTo(MasterWilayah::class, 'parent_id');
    }

    /**
     * Relasi ke kab/kota (children)
     */
    public function kabupatenKota()
    {
        return $this->hasMany(MasterWilayah::class, 'parent_id');
    }

    /**
     * Scope untuk query hanya provinsi
     */
    public function scopeProvinsi($query)
    {
        return $query->where('tipe', 'provinsi');
    }

    /**
     * Scope untuk query kab/kota dalam provinsi tertentu
     */
    public function scopeKabupatenKotaOf($query, $provinsiId)
    {
        return $query->whereIn('tipe', ['kabupaten', 'kota'])
                     ->where('parent_id', $provinsiId);
    }

    /**
     * Accessor: kode_bps 2 digit untuk level provinsi
     */
    public function getKodeProvinsi2DigitAttribute(): string
    {
        if ($this->tipe === 'provinsi') {
            return $this->kode_bps ?? '00';
        }
        return $this->kode_provinsi ?? substr($this->kode_bps ?? '00', 0, 2);
    }

    /**
     * Accessor: kode 2 digit kab/kota dalam provinsinya
     */
    public function getKodeKabKota2DigitAttribute(): string
    {
        if (in_array($this->tipe, ['kabupaten', 'kota'])) {
            return substr($this->kode_bps ?? '0000', 2, 2);
        }
        return '00';
    }

    /**
     * Accessor: label lengkap (tipe + nama)
     */
    public function getLabelLengkapAttribute(): string
    {
        $prefix = match ($this->tipe) {
            'kabupaten' => 'Kab.',
            'kota'      => 'Kota',
            default     => 'Prov.',
        };
        return "{$prefix} {$this->nama_wilayah}";
    }
}
