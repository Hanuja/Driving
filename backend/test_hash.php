<?php
$hash1 = '$2y$10$fDS1l6mJtCr2M2MnRhptd.wv5f7glpQoyaQelznRc1xyzRojkD.r.';
$hash2 = '$2y$10$8UfkIYS6Z.HGfuV7eQpmE.RrauGWxGLuUjck9kbi8nu/7MQ.bf4d2';
echo "Hash 1 matches password123? " . (password_verify('password123', $hash1) ? 'Yes' : 'No') . "\n";
echo "Hash 2 matches password123? " . (password_verify('password123', $hash2) ? 'Yes' : 'No') . "\n";
