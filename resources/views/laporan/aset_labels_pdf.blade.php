<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Stiker Label Aset Premium</title>
    <style>
        @page { 
            margin: 0.5cm;
        }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            margin: 0; 
            padding: 0;
            background-color: #ffffff;
        }
        .grid-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 12px;
        }
        .label-card {
            width: 9.3cm;
            height: 5.4cm;
            border: 1.5px solid #334155;
            border-radius: 8px;
            overflow: hidden;
            background-color: #ffffff;
            position: relative;
        }
        
        /* Warna Aksen per KIB (Left Border + Top Badge) */
        .accent-border { 
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 8px;
        }
        .bg-A { background-color: #1e40af; } /* Blue */
        .bg-B { background-color: #4338ca; } /* Indigo */
        .bg-C { background-color: #047857; } /* Green */
        .bg-D { background-color: #b45309; } /* Amber */
        .bg-E { background-color: #0f766e; } /* Teal */
        .bg-F { background-color: #be123c; } /* Rose */
        .bg-default { background-color: #475569; }

        .card-content {
            margin-left: 12px;
            padding: 10px 12px;
            height: 100%;
        }

        .header {
            border-bottom: 1.5px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 8px;
            position: relative;
        }

        .school-name {
            font-size: 9pt;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .region-info {
            font-size: 6.5pt;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-top: 1px;
        }

        .kib-tag {
            position: absolute;
            right: 0;
            top: 0;
            padding: 2px 8px;
            border-radius: 4px;
            color: #ffffff;
            font-size: 7pt;
            font-weight: 900;
            text-transform: uppercase;
        }

        .asset-name {
            font-size: 11pt;
            font-weight: 900;
            color: #1e293b;
            margin: 6px 0;
            height: 32px;
            line-height: 1.2;
            overflow: hidden;
            text-transform: uppercase;
        }

        .meta-grid {
            width: 100%;
            margin-top: 5px;
        }

        .label-text {
            font-size: 6pt;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 1px;
        }

        .value-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 8pt;
            font-weight: 900;
            color: #0f172a;
            background: #f8fafc;
            padding: 2px 4px;
            border-radius: 3px;
            display: inline-block;
            letter-spacing: 0.5px;
        }

        .value-text {
            font-size: 8.5pt;
            font-weight: 700;
            color: #334155;
            white-space: nowrap;
            overflow: hidden;
        }

        .qr-column {
            width: 75px;
            text-align: right;
            vertical-align: bottom;
            padding-bottom: 5px;
        }

        .qr-wrapper {
            background: #ffffff;
            padding: 4px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            display: inline-block;
        }

        .footer-id {
            margin-top: 4px;
            font-size: 5.5pt;
            color: #94a3b8;
            font-weight: 800;
            text-align: center;
        }

        .barcode-strip {
             margin-top: 8px;
             border-top: 1px dashed #e2e8f0;
             padding-top: 5px;
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
                        if ($tipe === 'B' && $item->kibB) $merk = $item->kibB->merk_tipe ?? '-';
                        if ($tipe === 'C' && $item->kibC) $merk = $item->kibC->konstruksi ?? '-';
                        if ($tipe === 'D' && $item->kibD) $merk = $item->kibD->konstruksi ?? '-';
                    @endphp
                    <td>
                        <div class="label-card">
                            <div class="accent-border {{ $bgClass }}"></div>
                            
                            <div class="card-content">
                                <div class="header">
                                    <div class="school-name">{{ $profile->nama_sekolah ?? 'DINAS PENDIDIKAN' }}</div>
                                    <div class="region-info">
                                        {{ $profile->tipe_wilayah ?? 'KAB' }} {{ $profile->kabupaten_kota ?? 'ASSET' }} • UNIT: {{ $profile->kode_unit ?? '00000' }}
                                    </div>
                                    <div class="kib-tag {{ $bgClass }}">KIB {{ $tipe }}</div>
                                </div>

                                <div class="asset-name">{{ Str::limit($item->nama_barang, 40) }}</div>

                                <table style="width: 100%; border: none;">
                                    <tr>
                                        <td style="vertical-align: top;">
                                            <div style="margin-bottom: 6px;">
                                                <div class="label-text">KODE LOKASI (BARIS 1)</div>
                                                <div class="value-code">{{ $item->kode_lokasi_full }}</div>
                                            </div>
                                            <div style="margin-bottom: 6px;">
                                                <div class="label-text">KODE BARANG (BARIS 2)</div>
                                                <div class="value-code" style="color: #1d4ed8;">{{ $item->kode_barang_full }}</div>
                                            </div>
                                            
                                            <table style="width: 100%; border: none; margin-top: 4px;">
                                                <tr>
                                                    <td width="55%">
                                                        <div class="label-text">MERK / SPESIFIKASI</div>
                                                        <div class="value-text">{{ Str::limit($merk, 25) }}</div>
                                                    </td>
                                                    <td>
                                                        <div class="label-text">RUANGAN</div>
                                                        <div class="value-text">{{ $item->ruangan->nama_ruangan?? '-' }}</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td class="qr-column">
                                            <div class="qr-wrapper">
                                                @php
                                                    $qrcode = \SimpleSoftwareIO\QrCode\Facades\QrCode::size(120)->margin(0)->generate($item->id);
                                                @endphp
                                                <img src="data:image/svg+xml;base64,{{ base64_encode($qrcode) }}" style="width: 70px; height: 70px;">
                                            </div>
                                            <div class="footer-id">ID: {{ strtoupper(substr($item->id, 0, 8)) }}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </td>
                @endforeach
                
                @if(count($row) < 2)
                    <td style="width: 9.3cm;"></td>
                @endif
            </tr>
        @endforeach
    </table>
</body>
</html>
