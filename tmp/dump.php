<?php
$files = ['b','c','d','e','f'];
foreach($files as $k) {
  $c = file_get_contents('C:/laragon/www/siPRAS/resources/views/laporan/kib_'.$k.'_pdf.blade.php');
  preg_match('/@foreach\(\$items as \$index => \$item\)[\s\S]*?@endforeach/', $c, $m);
  echo "\n\n=== KIB $k ===\n";
  echo $m[0] ?? 'NO MATCH';
}
