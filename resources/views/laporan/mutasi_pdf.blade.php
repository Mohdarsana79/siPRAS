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
        th, td { border: 1px solid black; padding: 4px 2px; word-wrap: break-word; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 9px; }
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
        <h4 style="margin: 0; text-transform: uppercase;">LAPORAN REKAPITULASI MUTASI BARANG</h4>
        <p style="margin: 5px 0 0 0; font-size: 10px;">Periode: Semua Data</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="25">No</th>
                <th width="80">Tanggal</th>
                <th width="120">Nama/Jenis Barang</th>
                <th width="100">Kode Barang</th>
                <th width="40">Reg.</th>
                <th width="90">Jenis Mutasi</th>
                <th width="100">Dari Ruangan</th>
                <th width="100">Ke Ruangan / Tipe</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($mutasis as $index => $mutasi)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="text-center">{{ \Carbon\Carbon::parse($mutasi->tanggal_mutasi)->format('d/m/Y') }}</td>
                <td>{{ $mutasi->item->nama_barang }}</td>
                <td class="text-center">{{ $mutasi->item->kode_barang }}</td>
                <td class="text-center">{{ $mutasi->item->nomor_register }}</td>
                <td class="text-center">
                    <span style="font-weight: bold; color: {{ $mutasi->jenis_mutasi == 'Penghapusan/Afkir' ? 'red' : 'blue' }}">
                        {{ $mutasi->jenis_mutasi }}
                    </span>
                </td>
                <td class="text-center">{{ $mutasi->dariRuangan->nama_ruangan ?? 'Global/Luar' }}</td>
                <td class="text-center">
                    @if($mutasi->jenis_mutasi == 'Pindah Ruangan')
                        {{ $mutasi->keRuangan->nama_ruangan ?? '-' }}
                    @else
                        {{ $mutasi->tipe_penghapusan ?? '-' }}
                    @endif
                </td>
                <td>{{ $mutasi->keterangan ?? '-' }}</td>
            </tr>
            @endforeach
            @if($mutasis->isEmpty())
            <tr>
                <td colspan="9" class="text-center" style="padding: 20px;">Tidak ada data mutasi barang.</td>
            </tr>
            @endif
        </tbody>
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
