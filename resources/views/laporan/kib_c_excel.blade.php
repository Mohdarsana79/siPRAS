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
        <strong style="font-size:11pt;">KARTU INVENTARIS BARANG (KIB) C</strong><br>
        <span style="font-size:10pt;">GEDUNG DAN BANGUNAN</span>
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
                <th rowspan="2" width="20">No</th>
                <th rowspan="2" width="110">Nama/Jenis Barang</th>
                <th colspan="2">Nomor</th>
                <th rowspan="2" width="50">Kondisi</th>
                <th colspan="2">Konstruksi</th>
                <th rowspan="2" width="55">Luas Lantai (M2)</th>
                <th rowspan="2" width="120">Letak / Lokasi</th>
                <th colspan="2">Dokumen Gedung</th>
                <th rowspan="2" width="50">Luas Tanah (M2)</th>
                <th rowspan="2" width="55">Status Tanah</th>
                <th rowspan="2" width="65">No. Kode Tanah</th>
                <th rowspan="2" width="55">Asal Usul</th>
                <th rowspan="2" width="90">Harga (Rp)</th>
                <th rowspan="2" width="55">Ket</th>
            </tr>
            <tr>
                <th width="75">Kode Barang</th>
                <th width="30">Reg.</th>
                <th width="40">Tingkat</th>
                <th width="40">Beton</th>
                <th width="55">Tgl</th>
                <th width="70">Nomor</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($items as $index => $item)
            @php $total += $item->harga; @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->nama_barang }}</td>
                <td class="text-center">{{ $item->kode_barang }}</td>
                <td class="text-center">{{ $item->nomor_register }}</td>
                <td class="text-center">{{ $item->kibC->kondisi_bangunan ?? '-' }}</td>
                <td class="text-center">{{ isset($item->kibC) ? ($item->kibC->konstruksi_bertingkat ? 'Ya' : 'Tdk') : '-' }}</td>
                <td class="text-center">{{ isset($item->kibC) ? ($item->kibC->konstruksi_beton ? 'Ya' : 'Tdk') : '-' }}</td>
                <td class="text-center">{{ $item->kibC->luas_lantai ?? '-' }}</td>
                <td>{{ $item->kibC->letak_alamat ?? '-' }}</td>
                <td class="text-center">{{ $item->kibC->dokumen_tanggal ?? '-' }}</td>
                <td>{{ $item->kibC->dokumen_nomor ?? '-' }}</td>
                <td class="text-center">{{ '-' }}</td>
                <td class="text-center">{{ $item->kibC->status_tanah ?? '-' }}</td>
                <td class="text-center">{{ $item->kibC->kode_tanah ?? '-' }}</td>
                <td class="text-center">{{ $item->asal_usul }}</td>
                <td class="text-right">{{ number_format($item->harga, 0, ',', '.') }}</td>
                <td>{{ $item->keterangan }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="15" class="text-right">TOTAL NILAI ASET</th>
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
