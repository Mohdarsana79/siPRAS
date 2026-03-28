<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h2, .header h3 {
            margin: 3px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th, td {
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            text-align: center;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        @media print {
            body { font-size: 10pt; }
            .no-print { display: none; }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="no-print" style="margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">Cetak Laporan / Simpan PDF</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer;">Tutup</button>
    </div>

    <div class="header">
        <h2>PEMERINTAH DAERAH / YAYASAN PENDIDIKAN</h2>
        <h3>Aplikasi Pendataan Sarana & Prasarana Sekolah (siPRAS)</h3>
        <h2>{{ $title }}</h2>
        <p>Tanggal Cetak: {{ date('d-m-Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="3%">No</th>
                <th width="10%">Kode Barang</th>
                <th width="20%">Nama/Jenis Barang</th>
                <th width="10%">No. Register</th>
                <th width="10%">Kondisi</th>
                <th width="10%">Ruangan</th>
                <th width="10%">Tgl Perolehan</th>
                <th width="12%">Asal Usul</th>
                <th width="15%">Harga (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @php $totalHarga = 0; @endphp
            @if(count($items) > 0)
                @foreach ($items as $item)
                    @php $totalHarga += $item->harga; @endphp
                    <tr>
                        <td class="text-center">{{ $loop->iteration }}</td>
                        <td>{{ $item->kode_barang }}</td>
                        <td>{{ $item->nama_barang }}</td>
                        <td>{{ $item->nomor_register }}</td>
                        <td class="text-center">{{ $item->kondisi }}</td>
                        <td>{{ $item->ruangan ? $item->ruangan->nama_ruangan : '-' }}</td>
                        <td class="text-center">{{ $item->tanggal_perolehan }}</td>
                        <td>{{ $item->asal_usul }}</td>
                        <td class="text-right">{{ number_format($item->harga, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="9" class="text-center">Tidak ada data aset untuk laporan ini.</td>
                </tr>
            @endif
        </tbody>
        <tfoot>
            <tr>
                <th colspan="8" class="text-right">TOTAL NILAI ASET:</th>
                <th class="text-right">Rp {{ number_format($totalHarga, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>

    <div style="float: right; width: 300px; text-align: center; margin-top: 50px;">
        <p>Mengetahui,</p>
        <p>Kepala Sekolah / Penanggung Jawab,</p>
        <br><br><br><br>
        <p><strong>( ________________________ )</strong></p>
        <p>NIP. </p>
    </div>
</body>
</html>

