const fs = require('fs');
['b', 'c', 'd', 'e', 'f'].forEach(k => {
  try {
      let c = fs.readFileSync('C:/laragon/www/siPRAS/resources/views/laporan/kib_' + k + '_pdf.blade.php', 'utf8');
      let m = c.match(/@foreach\(\$items as \$index => \$item\)[\s\S]*?@endforeach/);
      console.log('\n\n------- KIB ' + k + ' -------');
      console.log(m ? m[0] : 'NOT FOUND');
  } catch(e) { console.log(e); }
});
