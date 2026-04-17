<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 20px; }
        .text { mso-number-format:"\@"; }
    </style>
</head>
<body>
    <div class="header">
        DATA MASTER OBJEK (LEVEL 4)<br>
        PERMENDAGRI NO. 108 TAHUN 2016
    </div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kelompok</th>
                <th>Jenis</th>
                <th>Kode Objek</th>
                <th>Nama Objek</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td class="text">{{ $item->kode_kelompok }}</td>
                <td class="text">{{ $item->kode_jenis }}</td>
                <td class="text">{{ $item->kode_objek }}</td>
                <td>{{ $item->nama_objek }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
