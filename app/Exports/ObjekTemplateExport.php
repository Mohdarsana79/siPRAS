<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ObjekTemplateExport implements WithHeadings, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    public function headings(): array
    {
        return [
            ['TEMPLATE IMPORT MASTER OBJEK (LEVEL 4)'],
            [''], // Baris kosong
            ['kelompok', 'jenis', 'kode_objek', 'nama_objek'], // Header tabel
            ['3', '1', '01', 'CONTOH NAMA OBJEK'] // Contoh baris data
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Judul Utama
        $sheet->mergeCells('A1:D1');
        $styleMainTitle = [
            'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
            'alignment' => ['horizontal' => 'center'],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '4F46E5']] // Indigo 600
        ];
        $sheet->getStyle('A1:D1')->applyFromArray($styleMainTitle);

        // Header Tabel (Baris ke-3)
        $styleHeader = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '111827']], // Gray 900
            'borders' => [
                'allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => '000000']]
            ],
            'alignment' => ['horizontal' => 'center']
        ];
        $sheet->getStyle('A3:D3')->applyFromArray($styleHeader);

        // Contoh Data (Baris ke-4)
        $styleExample = [
            'font' => ['italic' => true, 'color' => ['rgb' => '9CA3AF']],
            'borders' => [
                'allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'D1D5DB']]
            ]
        ];
        $sheet->getStyle('A4:D4')->applyFromArray($styleExample);

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
        ];
    }
}
