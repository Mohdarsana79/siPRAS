<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterSumberDana extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode',
        'nama_sumber'
    ];

    public function items()
    {
        return $this->hasMany(Item::class, 'sumber_dana_id');
    }
}
