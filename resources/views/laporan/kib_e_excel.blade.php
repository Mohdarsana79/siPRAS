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
        <strong style="font-size:11pt;">KARTU INVENTARIS BARANG (KIB) E</strong><br>
        <span style="font-size:10pt;">ASET TETAP LAINNYA</span>
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
                <th colspan="2">Buku / Perpustakaan</th>
                <th colspan="3">Barang Bercorak Kesenian / Kebudayaan</th>
                <th colspan="2">Hewan / Ternak dan Tumbuhan</th>
                <th rowspan="2" width="40">Jumlah</th>
                <th rowspan="2" width="45">Tahun Cetak</th>
                <th rowspan="2" width="55">Asal Usul</th>
                <th rowspan="2" width="90">Harga (Rp)</th>
                <th rowspan="2" width="55">Ket</th>
            </tr>
            <tr>
                <th width="70">Kode Barang</th>
                <th width="30">Reg.</th>
                <th width="80">Judul / Pencipta</th>
                <th width="70">Spesifikasi</th>
                <th width="60">Asal Daerah</th>
                <th width="60">Pencipta</th>
                <th width="50">Bahan</th>
                <th width="55">Jenis</th>
                <th width="50">Ukuran</th>
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
                <td>{{ $item->kibE->judul_pencipta ?? ($item->kibE->judul_buku_nama_kesenian ?? '-') }}</td>
                <td>{{ $item->kibE->spesifikasi ?? '-' }}</td>
                <td>{{ $item->kibE->kesenian_asal_daerah ?? ($item->kibE->asal_daerah ?? '-') }}</td>
                <td>{{ $item->kibE->kesenian_pencipta ?? ($item->kibE->pencipta ?? '-') }}</td>
                <td>{{ $item->kibE->kesenian_bahan ?? ($item->kibE->bahan ?? '-') }}</td>
                <td>{{ $item->kibE->hewan_tumbuhan_jenis ?? ($item->kibE->jenis_hewan_tumbuhan ?? '-') }}</td>
                <td>{{ $item->kibE->hewan_tumbuhan_ukuran ?? ($item->kibE->ukuran ?? '-') }}</td>
                <td class="text-center">1</td>
                <td class="text-center">{{ $item->tanggal_perolehan ? \Carbon\Carbon::parse($item->tanggal_perolehan)->format('Y') : '-' }}</td>
                <td class="text-center">{{ $item->asal_usul }}</td>
                <td class="text-right">{{ number_format($item->harga, 0, ',', '.') }}</td>
                <td>{{ $item->keterangan }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="14" class="text-right">TOTAL NILAI ASET</th>
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
