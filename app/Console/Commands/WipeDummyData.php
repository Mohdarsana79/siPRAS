<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class WipeDummyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:wipe-dummy-data {--force}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Wipe all dummy data from the database and storage while preserving the main admin.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force') && !$this->confirm('WARNING: This will permanently delete all data from the system. Do you want to continue?')) {
            $this->info('Operation cancelled.');
            return;
        }

        $this->info('Starting system reset...');

        // 1. Disable Foreign Key Checks
        Schema::disableForeignKeyConstraints();

        // 2. Truncate Tables
        $tables = [
            'peminjamen',
            'pemeliharaans',
            'mutasi_barangs',
            'kib_a_tanahs',
            'kib_b_peralatans',
            'kib_c_gedungs',
            'kib_d_jalans',
            'kib_e_aset_lainnyas',
            'kib_f_konstruksis',
            'items',
            'master_kategoris',
            'master_rincian_objeks',
            'master_objeks',
            'master_ruangans',
            'master_sumber_danas',
            'school_profiles',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                $this->comment("Truncating table: {$table}");
                DB::table($table)->truncate();
            }
        }

        // 3. Clean Users (Keep ID 1)
        $this->comment('Cleaning users (preserving primary admin)...');
        User::where('id', '!=', 1)->delete();

        // 4. Re-enable Foreign Key Checks
        Schema::enableForeignKeyConstraints();

        // 5. Cleanup Storage Files
        $this->comment('Cleaning up storage files...');
        
        $directories = [
            'public/logos',
            'public/kib-f',
        ];

        foreach ($directories as $directory) {
            if (Storage::exists($directory)) {
                $files = Storage::files($directory);
                foreach ($files as $file) {
                    // Do not delete .gitignore
                    if (basename($file) !== '.gitignore') {
                        Storage::delete($file);
                    }
                }
                $this->info("Cleared directory: {$directory}");
            }
        }

        $this->info('System reset completed successfully.');
    }
}
