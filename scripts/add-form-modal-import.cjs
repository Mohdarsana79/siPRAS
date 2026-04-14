/**
 * Script untuk secara otomatis mengganti pola modal lama (gradient header besar)
 * dengan import FormModal pada semua halaman KIB dan Master Data
 * 
 * Ini hanya menambahkan import FormModal — transformasi bentuk modal 
 * sudah dilakukan secara manual pada file-file utama.
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'resources', 'js', 'Pages');

// Files yang sudah diupdate (skip)
const ALREADY_DONE = new Set([
    'KibA/Index.tsx',
    'KibF/Index.tsx',
    'MasterData/Ruangan/Index.tsx',
    'Peminjaman/Index.tsx',
]);

// Files yang perlu diupdate (masih pakai Modal lama)
const FILES_TO_UPDATE = [
    'KibB/Index.tsx',
    'KibC/Index.tsx',
    'KibD/Index.tsx',
    'KibE/Index.tsx',
    'MasterData/SumberDana/Index.tsx',
    'MasterData/Kategori/Index.tsx',
    'Mutasi/Index.tsx',
    'Pemeliharaan/Index.tsx',
];

let updated = 0;
let skipped = 0;

for (const relPath of FILES_TO_UPDATE) {
    const filePath = path.join(PAGES_DIR, relPath);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠ SKIP (not found): ${relPath}`);
        skipped++;
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if FormModal already imported
    if (content.includes("import FormModal")) {
        console.log(`✓ Already has FormModal: ${relPath}`);
        skipped++;
        continue;
    }

    // Add FormModal import after Modal import
    const newContent = content.replace(
        "import Modal from '@/Components/Modal';",
        "import Modal from '@/Components/Modal';\nimport FormModal from '@/Components/FormModal';"
    );

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ Added FormModal import: ${relPath}`);
        updated++;
    } else {
        console.log(`⚠ No Modal import found: ${relPath}`);
        skipped++;
    }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
