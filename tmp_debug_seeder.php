<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Database\Seeders\DummyDataSeeder;

try {
    $seeder = new DummyDataSeeder();
    $seeder->run();
    echo "Success!";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
    echo $e->getTraceAsString();
}
