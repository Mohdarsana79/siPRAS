<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BackupRestoreController extends Controller
{
    public function index()
    {
        return Inertia::render('Backup/Index');
    }

    public function download()
    {
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD', '');
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '5432');

        $fileName = 'backup_' . $database . '_' . date('Y-m-d_H-i-s') . '.rsv';
        
        if (!Storage::exists('backups')) {
            Storage::makeDirectory('backups');
        }
        
        $filePath = Storage::path('backups/' . $fileName);

        $pgDumpPath = 'pg_dump';
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $laragonPath = 'C:\\laragon\\bin\\postgresql\\pgsql\\bin\\pg_dump.exe';
            if (file_exists($laragonPath)) {
                $pgDumpPath = '"' . $laragonPath . '"';
            }
        }

        putenv("PGPASSWORD=" . $password);
        
        // Use custom format (-F c) for reliable restore, dump to file
        $command = "$pgDumpPath -h $host -p $port -U $username -F c -d $database -f \"$filePath\" 2>&1";
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            Log::error("Backup failed: " . implode("\n", $output));
            return redirect()->back()->with('error', 'Gagal membuat file backup. Cek log untuk detail.');
        }

        return response()->download($filePath, $fileName, [
            'Content-Type' => 'application/octet-stream'
        ])->deleteFileAfterSend(true);
    }

    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file',
        ]);

        $file = $request->file('backup_file');
        
        $extension = $file->getClientOriginalExtension();
        if ($extension !== 'rsv') {
            return redirect()->back()->with('error', 'Format tidak didukung. File backup harus berekstensi .rsv');
        }

        $path = $file->storeAs('backups', 'restore_temp.rsv');
        $fullPath = Storage::path($path);

        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD', '');
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '5432');

        $pgRestorePath = 'pg_restore';
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $laragonPath = 'C:\\laragon\\bin\\postgresql\\pgsql\\bin\\pg_restore.exe';
            if (file_exists($laragonPath)) {
                $pgRestorePath = '"' . $laragonPath . '"';
            }
        }

        putenv("PGPASSWORD=" . $password);
        
        // -c drops objects before recreating, --if-exists avoids errors dropping what doesn't exist
        // --no-owner --no-privileges added for compatibility across different environments
        $command = "$pgRestorePath -h $host -p $port -U $username -d $database --clean --if-exists --no-owner --no-privileges \"$fullPath\" 2>&1";
        exec($command, $output, $returnVar);

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }

        // pg_restore return codes: 0 = success, 1 = warnings, 2+ = failure
        if ($returnVar > 1) {
            Log::error("Restore failed (Return Var: $returnVar): " . implode("\n", $output));
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal melakukan restore database.'], 500);
            }
            return redirect()->back()->with('error', 'Gagal melakukan restore database. Terjadi kesalahan sistem.');
        }

        if ($returnVar === 1) {
            Log::warning("Restore completed with warnings: " . implode("\n", $output));
            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'warning' => 'Database di-restore dengan beberapa peringatan.']);
            }
            return redirect()->back()->with('success', 'Database di-restore dengan beberapa peringatan (Data inti seharusnya tetap masuk).');
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Database berhasil di-restore.']);
        }

        return redirect()->back()->with('success', 'Database berhasil di-restore dengan sempurna.');
    }

    public function reset(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $tables = DB::select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        $tablesToTruncate = [];

        $excludedTables = [
            'migrations',
            'users',
            'password_reset_tokens',
            'sessions',
            'cache',
            'cache_locks',
            'jobs',
            'job_batches',
            'failed_jobs',
            'school_profiles'
        ];

        foreach ($tables as $table) {
            $tableName = $table->tablename;
            if (!in_array($tableName, $excludedTables)) {
                $tablesToTruncate[] = '"' . $tableName . '"';
            }
        }

        if (count($tablesToTruncate) > 0) {
            $tableList = implode(', ', $tablesToTruncate);
            try {
                DB::statement("SET session_replication_role = 'replica';"); // Disable foreign key checks
                DB::statement("TRUNCATE TABLE {$tableList} RESTART IDENTITY CASCADE;");
                DB::statement("SET session_replication_role = 'origin';"); // Enable foreign key checks
            } catch (\Exception $e) {
                Log::error("Reset database failed: " . $e->getMessage());
                DB::statement("SET session_replication_role = 'origin';");
                return redirect()->back()->with('error', 'Gagal memformat database: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Database berhasil dikosongkan (kecuali tabel user & profil).');
    }
}
