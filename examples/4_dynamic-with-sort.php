<?php
declare(strict_types=1);

$keys = ["blue", "red", "green", "orange"];
$items = [];

for($i = 0; $i < 50; $i++) {
    $items[] = [$keys[array_rand($keys)], rand(1, 30)];
}

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
            echo $item . "<br>" . $value;
            ?>
        </div>
    <?php endforeach; ?>
</div>

<script>
    const grid = document.getElementById("grid");
    const form = document.getElementById("filter");

    const gridWave = new GridWave(grid, {
        // itemSelector: ".item",
        columns: "dynamic",
        columnMinWidth: 100,
        gap: 16,
        sameHeight: true,
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
