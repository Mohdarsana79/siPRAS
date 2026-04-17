<?php

namespace App\Imports;

use App\Models\MasterObjek;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ObjekImport implements ToModel, WithHeadingRow, WithValidation
{
    public function headingRow(): int
    {
        return 3;
    }

    public function model(array $row)
    {
        return MasterObjek::updateOrCreate(
            [
                'kode_kelompok' => $row['kelompok'],
                'kode_jenis'    => $row['jenis'],
                'kode_objek'    => $row['kode_objek'],
            ],
            [
                'nama_objek'    => strtoupper($row['nama_objek']),
            ]
        );
    }

    public function rules(): array
    {
        return [
            'kelompok'   => 'required|string',
            'jenis'      => 'required|string',
            'kode_objek' => 'required|string',
            'nama_objek' => 'required|string',
        ];
    }
}
