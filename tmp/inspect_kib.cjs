const fs = require('fs');
const files = ['b', 'c', 'd', 'e', 'f'].map(k => `resources/views/laporan/kib_${k}_pdf.blade.php`);

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        let match = content.match(/@foreach\(\$items as \$index => \$item\)[\s\S]*?@endforeach/);
        console.log('\n--- ' + f + ' ---');
        console.log(match ? match[0] : 'NOT FOUND');
    } catch(e) {
        console.log(`Failed to read ${f}: ${e.message}`);
    }
});
