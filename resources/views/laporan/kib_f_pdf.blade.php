<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 0; }
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
        @page { margin: 1cm; }
    </style>
</head>
<body style="font-size: {{ $fontSize }};">
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
        <h4 style="margin: 0; text-transform: uppercase;">KARTU INVENTARIS BARANG (KIB) F</h4>
        <h5 style="margin: 0; font-weight: normal;">KONSTRUKSI DALAM PENGERJAAN</h5>
    </div>

    @php
        $p_prov = strtoupper($profile->provinsi ?? '________________');
        $p_kab  = strtoupper($profile->kabupaten_kota ?? '________________');
        $p_kec  = strtoupper($profile->kecamatan ?? '________________');
        $p_skpd = strtoupper($profile->unor_induk ?? '________________');
        $p_inst = strtoupper($profile->nama_sekolah ?? '________________');
    @endphp
    <div style="margin-bottom: 15px;">
        <table style="width: 100%; border: none !important; table-layout: auto !important;">
            <tr>
                <td style="width: 120px; border: none !important; padding: 1px 0; text-align: left;">PROVINSI</td>
                <td style="width: 15px; border: none !important; padding: 1px 0; text-align: center;">:</td>
                <td style="border: none !important; padding: 1px 0; text-align: left;">{{ $p_prov }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0; text-align: left;">KAB / KOTA</td>
                <td style="border: none !important; padding: 1px 0; text-align: center;">:</td>
                <td style="border: none !important; padding: 1px 0; text-align: left;">{{ $p_kab }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0; text-align: left;">KECAMATAN</td>
                <td style="border: none !important; padding: 1px 0; text-align: center;">:</td>
                <td style="border: none !important; padding: 1px 0; text-align: left;">{{ $p_kec }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0; text-align: left;">SKPD</td>
                <td style="border: none !important; padding: 1px 0; text-align: center;">:</td>
                <td style="border: none !important; padding: 1px 0; text-align: left;">{{ $p_skpd }}</td>
            </tr>
            <tr>
                <td style="border: none !important; padding: 1px 0; text-align: left;">INSTANSI</td>
                <td style="border: none !important; padding: 1px 0; text-align: center;">:</td>
                <td style="border: none !important; padding: 1px 0; text-align: left;">{{ $p_inst }}</td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th width="15" rowspan="2">No</th>
                <th width="80" rowspan="2">Nama Barang / Bangunan</th>
                <th colspan="2">Nomor</th>
                <th colspan="2">Konstruksi Bangunan</th>
                <th width="40" rowspan="2">Luas (M2)</th>
                <th width="100" rowspan="2">Letak / Lokasi Alamat</th>
                <th colspan="2">Dokumen Kontrak</th>
                <th width="40" rowspan="2">Tgl Mulai</th>
                <th width="30" rowspan="2">Status Tanah</th>
                <th width="40" rowspan="2">No. Kode Tanah</th>
                <th width="40" rowspan="2">Asal Usul</th>
                <th width="60" rowspan="2">Harga (Rp)</th>
                <th width="40" rowspan="2">Ket</th>
            </tr>
            <tr>
                <th width="60">Kode Barang</th>
                <th width="20">Reg.</th>
                <th width="30">Ting kat</th>
                <th width="30">Beton</th>
                <th width="40">Tgl</th>
                <th width="50">Nomor</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($items as $index => $item)
            @php $total += $item->harga; @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->kibF->bangunan ?? $item->nama_barang }}</td>
                <td class="text-center">{{ $item->kode_barang }}</td>
                <td class="text-center">{{ $item->nomor_register }}</td>
                <td class="text-center">{{ isset($item->kibF) ? ($item->kibF->konstruksi_bertingkat ? 'Ya' : 'Tdk') : '-' }}</td>
                <td class="text-center">{{ isset($item->kibF) ? ($item->kibF->konstruksi_beton ? 'Ya' : 'Tdk') : '-' }}</td>
                <td class="text-center">{{ $item->kibF->luas ?? '-' }}</td>
                <td>{{ $item->kibF->letak_lokasi ?? '-' }}</td>
                <td class="text-center">{{ $item->kibF->dokumen_tanggal ?? '-' }}</td>
                <td>{{ $item->kibF->dokumen_nomor ?? '-' }}</td>
                <td class="text-center">{{ $item->kibF->tanggal_mulai ?? '-' }}</td>
                <td class="text-center">{{ $item->kibF->status_tanah ?? '-' }}</td>
                <td class="text-center">{{ '-' }}</td>
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
