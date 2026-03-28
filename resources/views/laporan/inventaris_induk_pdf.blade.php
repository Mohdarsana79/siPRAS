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
        .header h1 { margin: 0; padding: 0; font-size: 18px; font-weight: bold; }
        .header h2 { margin: 0; padding: 0; font-size: 16px; font-weight: bold; }
        .header h3 { margin: 0; padding: 0; font-size: 20px; font-weight: bold; }
        .header p { margin: 2px 0; padding: 0; font-size: 10px; }
        .hr-line { border-top: 3px solid black; border-bottom: 1px solid black; height: 2px; margin-top: 5px; margin-bottom: 20px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
        th, td { border: 1px solid black; padding: 4px; word-wrap: break-word; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .footer { margin-top: 30px; }
        .footer table { border: none !important; }
        .footer td { border: none !important; }
        @page { margin: 1cm; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td width="15%" style="text-align: left;">
                    @if($profile && $profile->logo_daerah)
                        <img src="{{ public_path('storage/' . $profile->logo_daerah) }}" style="height: 80px;">
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
                        <img src="{{ public_path('storage/' . $profile->logo) }}" style="height: 80px;">
                    @endif
                </td>
            </tr>
        </table>
        <div class="hr-line"></div>
    </div>

    <!-- Title for the report type -->
    <div style="text-align: center; margin-bottom: 15px;">
        <h4 style="margin: 0; text-decoration: underline; text-transform: uppercase;">REKAPITULASI BUKU INVENTARIS INDUK</h4>
    </div>

    <table>
        <thead>
            <tr>
                <th width="30">No</th>
                <th width="80">Kode Barang</th>
                <th width="150">Nama Barang</th>
                <th width="60">No. Reg</th>
                <th width="60">Kondisi</th>
                <th width="80">Asal Usul</th>
                <th width="70">Tgl Perolehan</th>
                <th width="80">Harga (Rp)</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($items as $index => $item)
            @php $total += $item->harga; @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->kode_barang }}</td>
                <td>{{ $item->nama_barang }}</td>
                <td class="text-center">{{ $item->nomor_register }}</td>
                <td class="text-center">{{ $item->kondisi }}</td>
                <td>{{ $item->asal_usul }}</td>
                <td class="text-center">{{ $item->tanggal_perolehan }}</td>
                <td class="text-right">{{ number_format($item->harga, 0, ',', '.') }}</td>
                <td>{{ $item->keterangan }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="7" class="text-right">TOTAL NILAI ASET</th>
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


