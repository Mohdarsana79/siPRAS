<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;
    
    // override table name due to laravel pluralization logic
    protected $table = 'peminjamans';

    protected $fillable = [
        'item_id', 'nama_peminjam', 'nip_nik', 'tanggal_pinjam', 
        'estimasi_kembali', 'tanggal_kembali', 'status', 'keterangan'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
