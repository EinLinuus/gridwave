<style>
    #grid, .grid-item {
        transition: all 500ms ease;
    }
</style>

<button data-filter="">All</button>
<button data-filter=".category1">Category 1</button>
<button data-filter=".category2">Category 2</button>
<button data-filter=".category3">Category 3</button>

<div id="grid">
    <div class="grid-item category1">Item 1</div>
    <div class="grid-item category2">Item 2</div>
    <div class="grid-item category1">Item 3</div>
    <div class="grid-item category3">Item 4</div>
    <div class="grid-item category2">Item 5</div>
    <div class="grid-item category3">Item 6</div>
</div>

<script>
    const grid = new GridWave("#grid");
    grid.init({
        columns: 3,
        gap: 16,
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            grid.filter(button.dataset.filter);
        });
    });
</script>
