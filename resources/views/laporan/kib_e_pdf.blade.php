<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: sans-serif; font-size: {{ $fontSize }}; margin: 0; padding: 0; }
        .header { text-align: center; margin-bottom: 10px; }
        .header table { border: none !important; margin-bottom: 0; }
        .header td { border: none !important; padding: 0; vertical-align: middle; }
        .header h1 { margin: 0; padding: 0; font-size: 16px; font-weight: bold; }
        .header h2 { margin: 0; padding: 0; font-size: 14px; font-weight: bold; }
        .header h3 { margin: 0; padding: 0; font-size: 18px; font-weight: bold; }
        .header p { margin: 2px 0; padding: 0; font-size: 9px; }
        .hr-line { border-top: 3px solid black; border-bottom: 1px solid black; height: 2px; margin-top: 5px; margin-bottom: 15px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; }
        th, td { border: 1px solid black; padding: 2px; word-wrap: break-word; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .footer { margin-top: 20px; }
        .footer table { border: none !important; }
        .footer td { border: none !important; }
        @page { size: landscape; margin: 1cm; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td width="15%" style="text-align: left;">
                    @if($profile && $profile->logo_daerah)
                        <img src="{{ public_path('storage/' . $profile->logo_daerah) }}" style="height: 70px;">
                    @endif
                </td>
                <td width="70%" style="text-align: center;">
                    <h1>PEMERINTAH {{ strtoupper($profile->tipe_wilayah ?? 'KABUPATEN') }} {{ strtoupper($profile->kabupaten_kota ?? '________________') }}</h1>
                    <h1>{{ strtoupper($profile->unor_induk ?? 'DINAS PENDIDIKAN DAN KEBUDAYAAN') }}</h1>
                    <h3>{{ strtoupper($profile->nama_sekolah ?? 'NAMA SEKOLAH BELUM DISET') }}</h3>
                    <p>Alamat : {{ $profile->alamat ?? '' }}</p>
                    <p>Email : <span style="color: blue;">{{ $profile->email_sekolah ?? '' }}</span></p>
                </td>
                <td width="15%" style="text-align: right;">
                    @if($profile && $profile->logo)
                        <img src="{{ public_path('storage/' . $profile->logo) }}" style="height: 70px;">
                    @endif
                </td>
            </tr>
        </table>
        <div class="hr-line"></div>
    </div>

    <div style="text-align: center; margin-bottom: 15px;">
        <h4 style="margin: 0; text-transform: uppercase;">KARTU INVENTARIS BARANG (KIB) E</h4>
        <h5 style="margin: 0; font-weight: normal;">ASET TETAP LAINNYA</h5>
    </div>

    <div style="margin-bottom: 15px;">
        <table style="width: 100%; border: none !important;">
            <tr>
                <td width="120" style="border: none !important; padding: 1px 0;">PROVINSI</td>
                <td width="10" style="border: none !important; padding: 1px 0;">:</td>
                <td style="border: none !important; padding: 1px 0;">{{ strtoupper($profile->provinsi ?? '________________') }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0;">KAB / KOTA</td>
                <td style="border: none !important; padding: 1px 0;">:</td>
                <td style="border: none !important; padding: 1px 0;">{{ strtoupper($profile->kabupaten_kota ?? '________________') }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0;">KECAMATAN</td>
                <td style="border: none !important; padding: 1px 0;">:</td>
                <td style="border: none !important; padding: 1px 0;">{{ strtoupper($profile->kecamatan ?? '________________') }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0;">SKPD</td>
                <td style="border: none !important; padding: 1px 0;">:</td>
                <td style="border: none !important; padding: 1px 0;">{{ strtoupper($profile->unor_induk ?? '________________') }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0;">INSTANSI</td>
                <td style="border: none !important; padding: 1px 0;">:</td>
                <td style="border: none !important; padding: 1px 0;">{{ strtoupper($profile->nama_sekolah ?? '________________') }}</td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th width="15" rowspan="2">No</th>
                <th width="80" rowspan="2">Nama/Jenis Barang</th>
                <th colspan="2">Nomor</th>
                <th colspan="2">Buku / Perpustakaan</th>
                <th colspan="3">Barang Bercorak Kesenian / Kebudayaan</th>
                <th colspan="2">Hewan / Ternak dan Tumbuhan</th>
                <th width="30" rowspan="2">Jumlah</th>
                <th width="30" rowspan="2">Tahun Cetak</th>
                <th width="40" rowspan="2">Asal Usul</th>
                <th width="60" rowspan="2">Harga (Rp)</th>
                <th width="40" rowspan="2">Ket</th>
            </tr>
            <tr>
                <th width="50">Kode Barang</th>
                <th width="20">Reg.</th>
                <th width="60">Judul / Pencipta</th>
                <th width="50">Spesifikasi</th>
                <th width="40">Asal Daerah</th>
                <th width="40">Pencipta</th>
                <th width="30">Bahan</th>
                <th width="40">Jenis</th>
                <th width="30">Ukuran</th>
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
        <table style="width: 100%; border: none !important;">
            <tr>
                <td width="50%" class="text-center" style="border: none !important;">
                    <p>&nbsp;</p>
                    <p>Mengetahui,</p>
                    <p>Kepala Sekolah</p>
                    <br><br><br><br>
                    <p><strong>( {{ $profile->nama_kepala_sekolah ?? '________________________' }} )</strong></p>
                    <p>NIP. {{ $profile->nip_kepala_sekolah ?? '........................................' }}</p>
                </td>
                <td width="50%" class="text-center" style="border: none !important;">
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
