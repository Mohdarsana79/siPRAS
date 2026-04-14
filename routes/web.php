<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Master Data
    Route::resource('master-ruangan', \App\Http\Controllers\MasterRuanganController::class)->except(['create', 'edit']);
    Route::resource('master-sumber-dana', \App\Http\Controllers\MasterSumberDanaController::class)->except(['create', 'edit']);
    
    // Hirarki Kategori Aset
    Route::resource('master-kategori', \App\Http\Controllers\MasterKategoriController::class)->except(['create', 'edit']);
    Route::resource('master-objek', \App\Http\Controllers\MasterObjekController::class)->only(['store', 'update', 'destroy']);
    Route::resource('master-rincian-objek', \App\Http\Controllers\MasterRincianObjekController::class)->only(['store', 'update', 'destroy']);

    // KIB (Kartu Inventaris Barang)
    Route::resource('kib-a', \App\Http\Controllers\KibATanahController::class)->except(['create', 'edit']);
    Route::resource('kib-b', \App\Http\Controllers\KibBPeralatanController::class)->except(['create', 'edit']);
    Route::resource('kib-c', \App\Http\Controllers\KibCGedungController::class)->except(['create', 'edit']);
    Route::resource('kib-d', \App\Http\Controllers\KibDJalanController::class)->except(['create', 'edit']);
    Route::resource('kib-e', \App\Http\Controllers\KibEAsetLainnyaController::class)->except(['create', 'edit']);
    Route::resource('kib-f', \App\Http\Controllers\KibFKonstruksiController::class)->except(['create', 'edit']);

    // Operasional
    Route::get('mutasi/cetak', [\App\Http\Controllers\MutasiBarangController::class, 'cetak'])->name('mutasi.cetak');
    Route::resource('mutasi', \App\Http\Controllers\MutasiBarangController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::resource('peminjaman', \App\Http\Controllers\PeminjamanController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
    Route::resource('pemeliharaan', \App\Http\Controllers\PemeliharaanController::class)->only(['index', 'store', 'show', 'destroy']);
    
    Route::get('aset-data', [\App\Http\Controllers\AsetDataController::class, 'index'])->name('aset-data.index');
    Route::get('aset-data/cetak-labels', [\App\Http\Controllers\AsetDataController::class, 'cetakLabels'])->name('aset-data.cetak-labels');
    Route::get('aset-data/scan', [\App\Http\Controllers\AsetDataController::class, 'scan'])->name('aset-data.scan');

    Route::get('laporan', [\App\Http\Controllers\LaporanController::class, 'index'])->name('laporan.index');
    Route::get('laporan/cetak', [\App\Http\Controllers\LaporanController::class, 'cetak'])->name('laporan.cetak');
    Route::get('laporan/excel', [\App\Http\Controllers\LaporanController::class, 'cetakExcel'])->name('laporan.excel');

    Route::get('school-profile', [\App\Http\Controllers\SchoolProfileController::class, 'index'])->name('school-profile.index');
    Route::post('school-profile', [\App\Http\Controllers\SchoolProfileController::class, 'update'])->name('school-profile.update');

    // API Wilayah (untuk SearchableSelect pada SchoolProfile)
    Route::get('api/wilayah/kab-kota', [\App\Http\Controllers\SchoolProfileController::class, 'getKabKota'])->name('api.wilayah.kab-kota');

    // Backup & Restore Database
    Route::get('backup-restore', [\App\Http\Controllers\BackupRestoreController::class, 'index'])->name('backup-restore.index');
    Route::get('backup-restore/download', [\App\Http\Controllers\BackupRestoreController::class, 'download'])->name('backup-restore.download');
    Route::post('backup-restore/restore', [\App\Http\Controllers\BackupRestoreController::class, 'restore'])->name('backup-restore.restore');
    Route::post('backup-restore/reset', [\App\Http\Controllers\BackupRestoreController::class, 'reset'])->name('backup-restore.reset');
});

require __DIR__.'/auth.php';
