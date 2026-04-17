<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class KategoriTemplateExport implements WithHeadings, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    public function headings(): array
    {
        return [
            ['TEMPLATE IMPORT MASTER KATEGORI (LEVEL 6)'],
            [''],
            ['kelompok', 'jenis', 'kode_objek', 'kode_rincian', 'kode_kategori', 'nama_kategori'],
            ['3', '1', '01', '01', '01', 'CONTOH NAMA KATEGORI']
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:F1');
        $styleMainTitle = [
            'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
            'alignment' => ['horizontal' => 'center'],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '4F46E5']]
        ];
        $sheet->getStyle('A1:F1')->applyFromArray($styleMainTitle);

        $styleHeader = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '111827']],
            'borders' => [
                'allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => '000000']]
            ],
            'alignment' => ['horizontal' => 'center']
        ];
        $sheet->getStyle('A3:F3')->applyFromArray($styleHeader);

        $styleExample = [
            'font' => ['italic' => true, 'color' => ['rgb' => '9CA3AF']],
            'borders' => [
                'allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'D1D5DB']]
            ]
        ];
        $sheet->getStyle('A4:F4')->applyFromArray($styleExample);

        return [];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_TEXT,
            'E' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
