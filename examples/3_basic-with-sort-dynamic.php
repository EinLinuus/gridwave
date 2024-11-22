<?php
declare(strict_types=1);

$keys = ["blue", "red", "green", "orange"];
$items = [];

for($i = 0; $i < 10; $i++) {
    $items[] = [$keys[array_rand($keys)], rand(1, 10)];
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

<hr>

<button type="button" id="add-item">Add item</button>

<div id="grid">
    <?php foreach($items as $entry): ?>
        <?php [$item, $value] = $entry; ?>
        <div class="item <?= $item ?>" style="background: <?= $item ?>" data-sort-value="<?= $value ?>">
            <?php
            echo $item . ": " . $value;
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

    document.getElementById("add-item").addEventListener("click", () => {
        const item = document.createElement("div");
        const color = ["<?= implode('", "', $keys) ?>"][Math.floor(Math.random() * 4)]
        item.classList.add("item");
        item.classList.add(color);
        item.style.background = color;
        item.dataset.sortValue = Math.floor(Math.random() * 10);
        item.innerHTML = item.style.background + ": " + item.dataset.sortValue;
        const linesToShow = Math.floor(Math.random() * 3);
        if(linesToShow > 0) {
            item.innerHTML += "<br>";
            item.innerHTML += "Lorem ipsum".repeat(linesToShow);
        }

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            item.remove();
            gridWave.rerender();
        });

        item.appendChild(removeButton);

        grid.appendChild(item);

        gridWave.rerender();
    });
</script>
