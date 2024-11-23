<?php
declare(strict_types=1);

$keys = ["blue", "red", "green", "orange"];
$items = [];

for($i = 0; $i < 50; $i++) {
    $items[] = [$keys[array_rand($keys)], rand(1, 30)];
}

?>
<style>
.item {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}
</style>

<form id="filter">
    <?php foreach($keys as $item): ?>
        <label>
            <input type="checkbox" name="color" value="<?= $item ?>">
            <span><?= $item ?></span>
        </label>
    <?php endforeach; ?>
    <button type="submit">Filter</button>
</form>

<button type="button" data-sort="none">Reset sort</button>
<button type="button" data-sort="asc">Sort asc</button>
<button type="button" data-sort="desc">Sort desc</button>

<div id="grid">
    <?php foreach($items as $entry): ?>
        <?php [$item, $value] = $entry; ?>
        <div class="item <?= $item ?>" style="background: <?= $item ?>" data-sort-value="<?= $value ?>">
            <?php
            echo $item . ": " . $value;
            $linesToShow = rand(1, 9) - 2;
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
        masonry: true,
        breakpoints: {
            450: {
                columns: 1,
                gap: 16,
                masonry: true,
            },
            768: {
                columns: 2,
                gap: 12,
                masonry: true,
            },
            1024: {
                columns: 3,
                gap: 8,
                masonry: true,
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

    document.querySelectorAll("button[data-sort]").forEach((button) => {
        button.addEventListener("click", () => {
            let sortFn = null;
            switch(button.dataset.sort) {
                case "asc":
                    sortFn = (a, b) => a.dataset.sortValue - b.dataset.sortValue;
                    break;
                case "desc":
                    sortFn = (a, b) => b.dataset.sortValue - a.dataset.sortValue;
                    break;
            }

            gridWave.sort(sortFn);
        });
    });
</script>
