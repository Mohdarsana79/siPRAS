<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 20px; }
        .kode { font-family: monospace; mso-number-format:"\@"; }
        .text { mso-number-format:"\@"; }
    </style>
</head>
<body>
    <div class="header">
        DATA MASTER KATEGORI (LEVEL 6)<br>
        PERMENDAGRI NO. 108 TAHUN 2016
    </div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kelompok</th>
                <th>Jenis</th>
                <th>Kode Objek</th>
                <th>Kode Rincian</th>
                <th>Kode Kategori</th>
                <th>Nama Kategori</th>
                <th>Kode Barang (Full)</th>
                <th>KIB</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td class="text">{{ $item->rincianObjek?->objek?->kode_kelompok }}</td>
                <td class="text">{{ $item->rincianObjek?->objek?->kode_jenis }}</td>
                <td class="text">{{ $item->rincianObjek?->objek?->kode_objek }}</td>
                <td class="text">{{ $item->rincianObjek?->kode_rincian_objek }}</td>
                <td class="text">{{ $item->kode_sub_rincian_objek }}</td>
                <td>{{ $item->nama_kategori }}</td>
                <td class="kode">{{ $item->kode_barang }}</td>
                <td>KIB {{ $item->tipe_kib }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
