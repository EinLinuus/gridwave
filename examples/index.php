<?php
declare(strict_types=1);

if(empty($_GET["file"])) {
    echo "<h1>Examples</h1>";
    echo "<ul>";

    $files = glob(__DIR__ . '/*.php');
    $requestUri = $_SERVER['REQUEST_URI'];
    if(!str_ends_with($requestUri, '/')) {
        $requestUri .= '/';
    }
    foreach ($files as $file) {
        if (basename($file) === 'index.php') {
            continue;
        }

//        echo "<li><a href='" . $requestUri . basename($file) . "'>" . basename($file) . "</a></li>";
        echo "<li><a href='?file=" . basename($file) . "'>" . basename($file) . "</a></li>";
    }

    echo "</ul>";
    return;
}

$file = $_GET["file"];

$filepath = realpath(__DIR__ . '/' . $file);
if($filepath === false || !str_starts_with($filepath, __DIR__)) {
    echo "Invalid file";
    return;
}

if(!file_exists($filepath)) {
    echo "File not found";
    return;
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Example <?= $file ?></title>
    <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
    <script src="../gridwave.js"></script>
</head>
<body>

    <header>
        <a href="?">Back to all examples</a>
        <h1>Example <?= $file ?></h1>
    </header>

    <main>
        <?php
        require $filepath;
        ?>
    </main>

    <footer>
        <pre><?= $filepath ?></pre>
    </footer>

</body>
</html>
