<?php

namespace App\Imports;

use App\Models\MasterObjek;
use App\Models\MasterRincianObjek;
use App\Models\MasterKategori;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Exception;

class KategoriImport implements ToModel, WithHeadingRow, WithValidation
{
    public function headingRow(): int
    {
        return 3;
    }

    public function model(array $row)
    {
        // 1. Cari Parent Objek
        $objek = MasterObjek::where('kode_kelompok', $row['kelompok'])
            ->where('kode_jenis', $row['jenis'])
            ->where('kode_objek', $row['kode_objek'])
            ->first();

        if (!$objek) {
            throw new Exception("Parent Objek ({$row['kelompok']}.{$row['jenis']}.{$row['kode_objek']}) tidak ditemukan untuk kategori: {$row['nama_kategori']}");
        }

        // 2. Cari Parent Rincian
        $rincian = MasterRincianObjek::where('master_objek_id', $objek->id)
            ->where('kode_rincian_objek', $row['kode_rincian'])
            ->first();

        if (!$rincian) {
            throw new Exception("Parent Rincian Objek ({$row['kode_rincian']}) tidak ditemukan di bawah Objek {$objek->nama_objek} untuk kategori: {$row['nama_kategori']}");
        }

        // 3. Update or Create Kategori (Level 6)
        // tipe_kib akan otomatis di-set oleh model booted()
        return MasterKategori::updateOrCreate(
            [
                'master_rincian_objek_id' => $rincian->id,
                'kode_sub_rincian_objek'  => $row['kode_kategori'],
            ],
            [
                'nama_kategori'           => strtoupper($row['nama_kategori']),
            ]
        );
    }

    public function rules(): array
    {
        return [
            'kelompok'      => 'required|string',
            'jenis'         => 'required|string',
            'kode_objek'    => 'required|string',
            'kode_rincian'  => 'required|string',
            'kode_kategori' => 'required|string',
            'nama_kategori' => 'required|string',
        ];
    }
}
