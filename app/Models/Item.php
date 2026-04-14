<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Item extends Model
{
    use HasFactory;
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $appends = ['label_bmd', 'identitas_barang', 'kode_lokasi_full', 'kode_barang_full'];

    protected $fillable = [
        'kategori_id',
        'ruangan_id',
        'sumber_dana_id',
        'kode_barang',
        'kode_komptabel',
        'nama_barang',
        'nomor_register',
        'kondisi',
        'tanggal_perolehan',
        'harga',
        'asal_usul',
        'keterangan',
        'foto',
    ];

    public function kategori()
    {
        return $this->belongsTo(MasterKategori::class, 'kategori_id');
    }

    public function ruangan()
    {
        return $this->belongsTo(MasterRuangan::class, 'ruangan_id');
    }

    public function ruangans()
    {
        return $this->belongsToMany(MasterRuangan::class, 'item_ruangan', 'item_id', 'ruangan_id')->withTimestamps();
    }

    public function sumberDana()
    {
        return $this->belongsTo(MasterSumberDana::class, 'sumber_dana_id');
    }

    // Relasi Polymorphic Semu / Extend Masing-Masing KIB
    public function kibA() { return $this->hasOne(KibATanah::class, 'item_id'); }
    public function kibB() { return $this->hasOne(KibBPeralatan::class, 'item_id'); }
    public function kibC() { return $this->hasOne(KibCGedung::class, 'item_id'); }
    public function kibD() { return $this->hasOne(KibDJalan::class, 'item_id'); }
    public function kibE() { return $this->hasOne(KibEAsetLainnya::class, 'item_id'); }
    public function kibF() { return $this->hasOne(KibFKonstruksi::class, 'item_id'); }

    public function mutasiBarangs()
    {
        return $this->hasMany(MutasiBarang::class);
    }

    public function peminjamans()
    {
        return $this->hasMany(Peminjaman::class);
    }

    public function pemeliharaans()
    {
        return $this->hasMany(Pemeliharaan::class);
    }

    /**
     * Accessor: Kode Lokasi Lengkap untuk Baris 1 Label
     * Format: {lokasi} . {tahun}
     */
    public function getKodeLokasiFullAttribute(): string
    {
        $profile = SchoolProfile::first();
        if (!$profile) return "00.00.00.00.000000.00000.00000";

        // Segment Lokasi 1: Kepemilikan (12)
        $kepemilikan = str_pad($profile->kode_entitas ?? '12', 2, '0', STR_PAD_LEFT);
        
        // Segment Lokasi 2: Komptabel (Ambil dari ITEM, bukan Profile)
        $komptabel   = str_pad($this->kode_komptabel ?? '01', 2, '0', STR_PAD_LEFT);
        
        // Segmen sisanya dari Profile
        $prov        = str_pad($profile->kode_provinsi ?? '00', 2, '0', STR_PAD_LEFT);
        $kab         = str_pad($profile->kode_kab_kota ?? '00', 2, '0', STR_PAD_LEFT);
        $pengguna    = str_pad($profile->kode_skpd ?? '000000', 6, '0', STR_PAD_LEFT);
        $kuasa       = str_pad($profile->kode_unit ?? '00001', 5, '0', STR_PAD_LEFT);
        $subKuasa    = str_pad($profile->kode_sub_unit ?? '00001', 5, '0', STR_PAD_LEFT);

        $kodeLokasi = "{$kepemilikan}.{$komptabel}.{$prov}.{$kab}.{$pengguna}.{$kuasa}.{$subKuasa}";
        $tahun = $this->tanggal_perolehan ? date('Y', strtotime($this->tanggal_perolehan)) : '0000';

        return "{$kodeLokasi}.{$tahun}";
    }

    /**
     * Accessor: Kode Barang Lengkap untuk Baris 2 Label
     * Format: {kode_barang} . {nomor_register}
     */
    public function getKodeBarangFullAttribute(): string
    {
        $noRegister = str_pad($this->nomor_register, 6, '0', STR_PAD_LEFT);
        return "{$this->kode_barang} . {$noRegister}";
    }

    /**
     * Accessor: Label BMD Lengkap (Gabungan 2 Baris)
     */
    public function getLabelBmdAttribute(): string
    {
        return $this->kode_lokasi_full . " / " . $this->kode_barang_full;
    }

    /**
     * Accessor: Identitas Barang Terformat (Human Readable)
     */
    public function getIdentitasBarangAttribute(): string
    {
        return $this->nama_barang ?? '-';
    }
}
