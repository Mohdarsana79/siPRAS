<?php

namespace App\Http\Controllers;

use App\Imports\ObjekImport;
use App\Imports\RincianObjekImport;
use App\Imports\KategoriImport;
use App\Exports\ObjekTemplateExport;
use App\Exports\RincianObjekTemplateExport;
use App\Exports\KategoriTemplateExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Response;

class MasterDataImportController extends Controller
{
    public function importObjek(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv']);
        
        try {
            Excel::import(new ObjekImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data Objek berhasil di-import.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal import: ' . $e->getMessage());
        }
    }

    public function importRincianObjek(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv']);
        
        try {
            Excel::import(new RincianObjekImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data Rincian Objek berhasil di-import.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal import: ' . $e->getMessage());
        }
    }

    public function importKategori(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv']);
        
        try {
            Excel::import(new KategoriImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data Kategori berhasil di-import.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal import: ' . $e->getMessage());
        }
    }

    public function downloadTemplate($level)
    {
        switch ($level) {
            case 'objek':
                return Excel::download(new ObjekTemplateExport, 'template_import_objek.xlsx');
            case 'rincian':
                return Excel::download(new RincianObjekTemplateExport, 'template_import_rincian.xlsx');
            case 'kategori':
                return Excel::download(new KategoriTemplateExport, 'template_import_kategori.xlsx');
            default:
                abort(404);
        }
    }
}
