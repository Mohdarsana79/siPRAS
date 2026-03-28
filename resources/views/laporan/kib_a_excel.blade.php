<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 10pt; }
        .hr-line { border-top: 3px solid black; border-bottom: 1px solid black; margin: 5px 0 15px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 3px 4px; word-wrap: break-word; font-size: 9pt; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; vertical-align: middle; }
        td { vertical-align: top; }
        .text-center { text-align: center; }
        .text-right  { text-align: right; }
        .footer { margin-top: 20px; }
    </style>
</head>
<body>
    <br>


    <div style="text-align:center; margin-bottom:10px;">
        <strong style="font-size:11pt;">KARTU INVENTARIS BARANG (KIB) A</strong><br>
        <span style="font-size:10pt;">TANAH</span>
    </div>

    <table style="border: none; margin-bottom: 20px;">
        <tr>
            <td style="border: none; width: 100px;">PROVINSI</td>
            <td style="border: none; width: 10px;">:</td>
            <td style="border: none;">{{ strtoupper($profile->provinsi ?? '________________') }}</td>
        </tr>
        <tr>
            <td style="border: none;">KAB / KOTA</td>
            <td style="border: none;">:</td>
            <td style="border: none;">{{ strtoupper($profile->kabupaten_kota ?? '________________') }}</td>
        </tr>
        <tr>
            <td style="border: none;">KECAMATAN</td>
            <td style="border: none;">:</td>
            <td style="border: none;">{{ strtoupper($profile->kecamatan ?? '________________') }}</td>
        </tr>
        <tr>
            <td style="border: none;">SKPD</td>
            <td style="border: none;">:</td>
            <td style="border: none;">{{ strtoupper($profile->unor_induk ?? '________________') }}</td>
        </tr>
        <tr>
            <td style="border: none;">INSTANSI</td>
            <td style="border: none;">:</td>
            <td style="border: none;">{{ strtoupper($profile->nama_sekolah ?? '________________') }}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th rowspan="2" width="25">No</th>
                <th rowspan="2" width="120">Nama/Jenis Barang</th>
                <th colspan="2">Nomor</th>
                <th rowspan="2" width="55">Luas (M2)</th>
                <th rowspan="2" width="55">Tahun Letak</th>
                <th rowspan="2" width="130">Letak / Alamat</th>
                <th colspan="3">Status Tanah</th>
                <th rowspan="2" width="80">Penggunaan</th>
                <th rowspan="2" width="70">Asal Usul</th>
                <th rowspan="2" width="90">Harga (Rp)</th>
                <th rowspan="2" width="60">Ket</th>
            </tr>
            <tr>
                <th width="80">Kode Barang</th>
                <th width="40">Reg.</th>
                <th width="55">Hak</th>
                <th width="70">Tgl Sertifikat</th>
                <th width="80">No. Sertifikat</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($items as $index => $item)
            @php $total += $item->harga; @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->nama_barang }}</td>
                <td>{{ $item->kode_barang }}</td>
                <td class="text-center">{{ $item->nomor_register }}</td>
                <td class="text-center">{{ $item->kibA->luas ?? '-' }}</td>
                <td class="text-center">{{ $item->tanggal_perolehan ? \Carbon\Carbon::parse($item->tanggal_perolehan)->format('Y') : '-' }}</td>
                <td>{{ $item->kibA->letak_alamat ?? '-' }}</td>
                <td>{{ $item->kibA->hak_tanah ?? '-' }}</td>
                <td class="text-center">{{ $item->kibA->tanggal_sertifikat ?? '-' }}</td>
                <td>{{ $item->kibA->nomor_sertifikat ?? '-' }}</td>
                <td>{{ $item->kibA->penggunaan ?? '-' }}</td>
                <td>{{ $item->asal_usul ?? '-' }}</td>
                <td class="text-right">{{ number_format($item->harga, 0, ',', '.') }}</td>
                <td>{{ $item->keterangan ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="12" class="text-right">TOTAL NILAI ASET</th>
                <th class="text-right">{{ number_format($total, 0, ',', '.') }}</th>
                <th></th>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <table style="width:100%; border-collapse:collapse;">
            <tr>
                <td width="50%" style="text-align:center; border:none; padding:5px;">
                    <p>&nbsp;</p>
                    <p>Mengetahui,</p>
                    <p>Kepala Sekolah</p>
                    <br><br><br><br>
                    <p><strong>( {{ $profile->nama_kepala_sekolah ?? '________________________' }} )</strong></p>
                    <p>NIP. {{ $profile->nip_kepala_sekolah ?? '........................................' }}</p>
                </td>
                <td width="50%" style="text-align:center; border:none; padding:5px;">
                    <p>{{ $profile->kabupaten_kota ?? '________________' }}, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
                    <p>Pengelola Aset,</p>
                    <p>&nbsp;</p>
                    <br><br><br><br>
                    <p><strong>( {{ $profile->nama_pengelola_aset ?? '________________________' }} )</strong></p>
                    <p>NIP. {{ $profile->nip_pengelola_aset ?? '........................................' }}</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
