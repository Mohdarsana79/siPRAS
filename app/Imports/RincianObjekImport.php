<?php

namespace App\Imports;

use App\Models\MasterObjek;
use App\Models\MasterRincianObjek;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Exception;

class RincianObjekImport implements ToModel, WithHeadingRow, WithValidation
{
    public function headingRow(): int
    {
        return 3;
    }

    public function model(array $row)
    {
        $objek = MasterObjek::where('kode_kelompok', $row['kelompok'])
            ->where('kode_jenis', $row['jenis'])
            ->where('kode_objek', $row['kode_objek'])
            ->first();

        if (!$objek) {
            throw new Exception("Parent Objek ({$row['kelompok']}.{$row['jenis']}.{$row['kode_objek']}) tidak ditemukan untuk rincian: {$row['nama_rincian']}");
        }

        return MasterRincianObjek::updateOrCreate(
            [
                'master_objek_id'    => $objek->id,
                'kode_rincian_objek' => $row['kode_rincian'],
            ],
            [
                'nama_rincian_objek' => strtoupper($row['nama_rincian']),
            ]
        );
    }

    public function rules(): array
    {
        return [
            'kelompok'     => 'required|string',
            'jenis'        => 'required|string',
            'kode_objek'   => 'required|string',
            'kode_rincian' => 'required|string',
            'nama_rincian' => 'required|string',
        ];
    }
}
