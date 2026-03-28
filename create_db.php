<?php
try {
    $pdo = new PDO("pgsql:host=127.0.0.1;port=5432;dbname=postgres", "postgres", "postgres");
    $pdo->exec("CREATE DATABASE sipras_db");
    echo "Database created successfully\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
