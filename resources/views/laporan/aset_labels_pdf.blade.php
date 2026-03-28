<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Stiker Label Aset</title>
    <style>
        @page { 
            margin: 1cm;
        }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            margin: 0; 
            padding: 0; 
        }
        .grid-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px;
        }
        .label-card {
            width: 9.5cm;
            height: 5.2cm;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            background-color: #ffffff;
            position: relative;
        }
        
        /* Warna Aksen per KIB */
        .header-strip { height: 10px; width: 100%; }
        .bg-A { background-color: #2563eb; }
        .bg-B { background-color: #4f46e5; }
        .bg-C { background-color: #10b981; }
        .bg-D { background-color: #f59e0b; }
        .bg-E { background-color: #0d9488; }
        .bg-F { background-color: #e11d48; }
        .bg-default { background-color: #64748b; }

        .card-body {
            padding: 12px 15px;
        }

        .school-info {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            color: #1e293b;
            margin-bottom: 2px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 5px;
        }

        .asset-name {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 10px;
            margin-bottom: 15px;
            display: block;
            height: 20px;
            overflow: hidden;
        }

        .info-table {
            width: 100%;
            border: none;
        }
        .info-table td {
            border: none;
            padding: 2px 0;
            vertical-align: top;
        }

        .label-text {
            font-size: 8px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
        }

        .value-text {
            font-size: 10px;
            font-weight: 600;
            color: #334155;
        }

        .qr-section {
            width: 80px;
            text-align: right;
        }
        .qr-box {
            padding: 5px;
            background: #fff;
            border: 1px solid #f1f5f9;
            border-radius: 10px;
            display: inline-block;
        }

        .kib-badge {
            position: absolute;
            bottom: 15px;
            right: 15px;
            font-size: 8px;
            font-weight: 900;
            padding: 3px 10px;
            border-radius: 20px;
            color: #fff;
        }
        
        .footer-text {
            position: absolute;
            bottom: 12px;
            left: 15px;
            font-size: 7px;
            color: #cbd5e1;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <table class="grid-table">
        @php $itemsChunked = $items->chunk(2); @endphp
        @foreach($itemsChunked as $row)
            <tr>
                @foreach($row as $item)
                    @php
                        $tipe = $item->kategori->tipe_kib ?? 'default';
                        $bgClass = 'bg-' . $tipe;
                        
                        $merk = '-';
                        if ($tipe === 'B') $merk = $item->kibB->merk_type ?? '-';
                        if ($tipe === 'C') $merk = $item->kibC->konstruksi ?? '-';
                        if ($tipe === 'D') $merk = $item->kibD->konstruksi ?? '-';
                    @endphp
                    <td>
                        <div class="label-card">
                            <div class="header-strip {{ $bgClass }}"></div>
                            
                            <div class="card-body">
                                <div class="school-info">
                                    {{ $profile->nama_sekolah ?? 'NAMA SEKOLAH' }}
                                    <div style="font-size: 7px; color: #94a3b8; font-weight: normal; margin-top: 1px;">
                                        PEMERINTAH {{ strtoupper($profile->tipe_wilayah ?? 'KABUPATEN') }} {{ strtoupper($profile->kabupaten_kota ?? 'DAERAH') }}
                                    </div>
                                    
                                    <!-- PINDAHKAN BADGE KE ATAS KANAN AGAR TIDAK MENUTUPI QR -->
                                    <div class="kib-badge {{ $bgClass }}" style="position: absolute; top: 15px; right: 15px; bottom: auto;">
                                        KIB {{ $tipe }}
                                    </div>
                                </div>

                                <div class="asset-name">{{ $item->nama_barang }}</div>

                                <table class="info-table">
                                    <tr>
                                        <td>
                                            <div class="info-box">
                                                <div class="label-text">KODE BARANG</div>
                                                <div class="value-text">{{ $item->kode_barang }}</div>
                                            </div>
                                            <div style="margin-top: 8px;">
                                                <div class="label-text">MERK / SPEK</div>
                                                <div class="value-text">{{ $merk }}</div>
                                            </div>
                                            <div style="margin-top: 8px;">
                                                <div class="label-text">LOKASI / ASAL</div>
                                                <div class="value-text">{{ $item->ruangan->nama ?? '-' }} • {{ $item->asal_usul ?? '-' }}</div>
                                            </div>
                                        </td>
                                        <td class="qr-section">
                                            <div class="qr-box">
                                                @php
                                                    $qrcode = \SimpleSoftwareIO\QrCode\Facades\QrCode::size(120)->margin(0)->generate($item->id);
                                                @endphp
                                                <img src="data:image/svg+xml;base64,{{ base64_encode($qrcode) }}" style="width: 70px; height: 70px;">
                                            </div>
                                            <div style="font-size: 6px; color: #94a3b8; font-weight: bold; margin-top: 5px; text-align: center;">ASSET ID: {{ substr($item->id, 0, 8) }}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </td>
                @endforeach
                
                @if(count($row) < 2)
                    <td></td>
                @endif
            </tr>
        @endforeach
    </table>
</body>
</html>
