<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model MasterKategori - Level 6 (Sub Rincian Objek)
 * Sesuai Permendagri No. 108 Tahun 2016
 */
class MasterKategori extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_rincian_objek_id',
        'kode_sub_rincian_objek',
        'nama_kategori',
        'tipe_kib',
    ];

    protected $appends = ['kode_barang'];

    /**
     * Nama akun berdasarkan kode akun
     */
    const AKUN_NAMA = [
        '1' => 'Aset',
    ];

    /**
     * Nama kelompok berdasarkan kode kelompok
     */
    const KELOMPOK_NAMA = [
        '1' => 'Aset Lancar',
        '3' => 'Aset Tetap',
        '5' => 'Aset Lainnya',
    ];

    /**
     * Nama jenis (untuk Akun 1, Kelompok 3 - Aset Tetap)
     */
    const JENIS_NAMA = [
        '1' => 'Tanah',
        '2' => 'Peralatan dan Mesin',
        '3' => 'Gedung dan Bangunan',
        '4' => 'Jalan, Irigasi, dan Jaringan',
        '5' => 'Aset Tetap Lainnya',
        '6' => 'Konstruksi Dalam Pengerjaan',
    ];

    /**
     * Pemetaan Jenis ke Kartu Inventaris Barang (KIB)
     */
    const JENIS_TO_KIB = [
        '1' => 'A',
        '2' => 'B',
        '3' => 'C',
        '4' => 'D',
        '5' => 'E',
        '6' => 'F',
    ];

    const KIB_TO_JENIS = [
        'A' => '1',
        'B' => '2',
        'C' => '3',
        'D' => '4',
        'E' => '5',
        'F' => '6',
    ];

    public function rincianObjek()
    {
        return $this->belongsTo(MasterRincianObjek::class, 'master_rincian_objek_id');
    }

    /**
     * Accessor: Kode Barang Lengkap (6 Level)
     */
    public function getKodeBarangAttribute(): string
    {
        if (!$this->rincianObjek || !$this->rincianObjek->objek) {
            return "0.0.0.00.00.{$this->kode_sub_rincian_objek}";
        }

        $objek    = $this->rincianObjek->objek;
        $rincian  = $this->rincianObjek;
        
        $akun     = '1'; // Default Aset
        $kelompok = $objek->kode_kelompok ?? '3'; 
        $jenis    = $objek->kode_jenis;
        $k_objek  = str_pad($objek->kode_objek, 2, '0', STR_PAD_LEFT);
        $k_rincian= str_pad($rincian->kode_rincian_objek, 2, '0', STR_PAD_LEFT);
        $k_sub    = str_pad($this->kode_sub_rincian_objek, 2, '0', STR_PAD_LEFT);

        return "{$akun}.{$kelompok}.{$jenis}.{$k_objek}.{$k_rincian}.{$k_sub}";
    }

    /**
     * Relasi ke tabel items
     */
    public function items()
    {
        return $this->hasMany(Item::class, 'kategori_id');
    }

    /**
     * Auto-set tipe_kib dari parent saat saving
     */
    protected static function booted(): void
    {
        static::saving(function (MasterKategori $kategori) {
            if ($kategori->rincianObjek && $kategori->rincianObjek->objek) {
                $jenis = $kategori->rincianObjek->objek->kode_jenis;
                if (!$kategori->tipe_kib && isset(self::JENIS_TO_KIB[$jenis])) {
                    $kategori->tipe_kib = self::JENIS_TO_KIB[$jenis];
                }
            }
        });
    }
}
