<?php
declare(strict_types=1);

$items = [
    "blue",
    "red",
    "red",
    "green",
    "blue",
    "green",
    "blue",
    "red",
    "green",
    "green",
    "red",
    "blue",
    "green",
    "blue",
    "red",
    "blue",
];

?>
<style>
#grid {
    transition: all 500ms ease;
}
.item {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    transition: all 500ms ease;
}
</style>

<form id="filter">
    <?php foreach(array_unique($items) as $item): ?>
        <label>
            <input type="checkbox" name="color" value="<?= $item ?>">
            <span><?= $item ?></span>
        </label>
    <?php endforeach; ?>
    <button type="submit">Filter</button>
</form>

<div id="grid">
    <?php foreach($items as $item): ?>
        <div class="item <?= $item ?>" style="background: <?= $item ?>">
            <?php
            echo $item;
            $linesToShow = rand(1, 5) - 2;
            if($linesToShow > 0) {
                echo "<br>";
                echo str_repeat("Lorem ipsum", $linesToShow);
            }
            ?>
        </div>
    <?php endforeach; ?>
</div>

<script>
    const grid = document.getElementById("grid");
    const form = document.getElementById("filter");

    const gridWave = new GridWave(grid, {
        // itemSelector: ".item",
        columns: 4,
        gap: 16,
        sameHeight: true,
        breakpoints: {
            450: {
                columns: 1,
                gap: 16,
            },
            768: {
                columns: 2,
                gap: 12,
                sameHeight: true,
            },
            1024: {
                columns: 3,
                gap: 8,
                sameHeight: true,
            },
        },
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const colors = formData.getAll("color");

        if(colors.length === 0) {
            gridWave.filter();
        } else {
            gridWave.filter("." + colors.join(", ."));
        }
    });
</script>
