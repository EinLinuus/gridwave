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
        <div class="item <?= $item ?>" style="background: <?= $item ?>"><?= $item ?></div>
    <?php endforeach; ?>
</div>

<script>
    const grid = document.getElementById("grid");
    const form = document.getElementById("filter");

    const gridWave = new GridWave(grid, {
        // itemSelector: ".item",
        columns: 4,
        gap: 16,
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
