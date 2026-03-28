<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$tables = \Illuminate\Support\Facades\DB::select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
$excluded = ['migrations','users','password_reset_tokens','sessions','cache','cache_locks','jobs','job_batches','failed_jobs','school_profiles'];
$toTrunc = [];
foreach($tables as $t) {
    if(!in_array($t->tablename, $excluded)) $toTrunc[] = '"'.$t->tablename.'"';
}
print_r($toTrunc);
