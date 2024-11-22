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

<hr>

<form id="transition-config">
    <label>
        <span>Duration</span>
        <input type="number" name="duration" value="500">
    </label>
    <label>
        <span>Timing function</span>
        <select name="timingFunction">
            <option value="ease" selected>ease</option>
            <option value="linear">linear</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
        </select>
    </label>
    <button type="submit">Apply</button>
</form>

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
    const gridWave = new GridWave("#grid");
    gridWave.init(buildConfig());

    const form = document.getElementById("filter");

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

    document.getElementById("transition-config").addEventListener("submit", (event) => {
        event.preventDefault();
        gridWave.updateConfig(buildConfig());
    });

    function buildConfig() {
        const form = document.getElementById("transition-config");
        const formData = new FormData(form);
        const duration = parseInt(formData.get("duration"));
        const timingFunction = formData.get("timingFunction");

        const defaultConfig = {
            transition: duration,
            transitionMethod: timingFunction,
        }

        return {
            ...defaultConfig,
            columns: 3,
            gap: 16,
            breakpoints: {
                768: {
                    ...defaultConfig,
                    columns: 2,
                    gap: 8,
                },
                480: {
                    ...defaultConfig,
                    columns: 1,
                    gap: 4,
                },
            },
        }
    }
</script>
