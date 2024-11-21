![gridwave logo](logo.svg)

---

# gridwave: Lightweight and animated JS filterable grid

> Notice: gridwave is still in early development and might not be suitable for production use. Use at your own risk.
> If you *do* use gridwave in a project and run into any issues, please let me know by opening an issue. Thank you! 💚

- [Introduction](#introduction)
- [HTML Structure](#html-structure)
- [Initialization](#initialization)
- [Filtering](#filtering)
- [Animations](#animations)
- [Complete Example](#complete-example)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Installation

For now, there are no official CDN links or packages. To use gridwave, simply download the [`gridwave.js`](https://raw.githubusercontent.com/EinLinuus/gridwave/refs/heads/main/gridwave.js) file from this repository and include it in your project:

```html
<script src="path/to/gridwave.js"></script>
```

We plan to add CDN links and package managers in the future.

## HTML Structure

gridwave requires a container element with the items inside. No classes or special styling is required, but keep in mind that gridwave will modify the style properties of the grid items.

```html
<div id="grid">
    <div class="grid-item category1">Item 1</div>
    <div class="grid-item category2">Item 2</div>
    <div class="grid-item category1">Item 3</div>
    <div class="grid-item category3">Item 4</div>
    <div class="grid-item category2">Item 5</div>
    <div class="grid-item category3">Item 6</div>
</div>
```

## Initialization

To initialize gridwave, create a new instance of the `GridWave` class and call the `init` method with the desired options:

```javascript
const grid = new GridWave("#grid"); // you can also pass a DOM element
grid.init({
    columns: 3,
    gap: 16,
});
```

If, for some reason, you don't want gridwave to manage all child elements of the grid container, you can pass a selector to the `init` method:

```javascript
grid.init({
    itemSelector: ".grid-item",
    columns: 3,
    gap: 16,
});
```

## Filtering

To filter the grid items, call the `filter` method with a CSS selector:

```javascript
grid.filter(".category1");
```

To show all items, don't pass any arguments to the `filter` method:

```javascript
grid.filter();
```

You can also pass a callback function to the `filter` method. This function will be called for each item to determine if it should be shown or hidden:

```javascript
grid.filter((item) => { // `item` is a DOM element
    return item.textContent.includes("1");
});
```

## Animations

gridwave modifies style properties of the grid items. To animate these changes, you can use CSS transitions. Example:

```css
.grid-item {
    transition: all 500ms ease;
}
```

If you want to also animate the height of the grid container, simply add the transition property to the grid container as well:

```css
#grid, .grid-item {
    transition: all 500ms ease;
}
```

## Responsive Grid

To make sure your grids look awesome on all screen sizes, you can pass different configs for different breakpoints:

```javascript
grid.init({
    columns: 3,
    gap: 16,
    breakpoints: {
        768: {
            columns: 2,
            gap: 8,
        },
        480: {
            columns: 1,
            gap: 4,
        },
    },
});
```

The keys of the `breakpoints` object are the screen widths in pixels. gridwave uses a desktop-first approach, so the default config is used for all screen sizes larger than the largest breakpoint.

Breakpoints do *not* inherit values from larger breakpoints. If you want to set some values for all breakpoints, I'd recommend using a separate object and merging it with the breakpoint object:

```javascript
const defaultConfig = {
    columns: 3,
    gap: 16,
};

grid.init({
    ...defaultConfig,
    breakpoints: {
        // only override columns for smaller screen sizes,
        // gap will be inherited from the default config
        768: {
            ...defaultConfig,
            columns: 2,
        },
        480: {
            ...defaultConfig,
            columns: 1,
        },
    },
});
```

## Complete Example

The following example demonstrates how to create a filterable grid with gridwave:

```html
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
        breakpoints: {
            768: {
                columns: 2,
                gap: 8,
            },
            480: {
                columns: 1,
                gap: 4,
            },
        },
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            grid.filter(button.dataset.filter);
        });
    });
</script>
```

## License

gridwave is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

If you want to contribute to gridwave, feel free to open an issue or a pull request.

Please keep in mind that gridwave is still in early development and I might change things around quite a bit.

## Contact

You can reach me on X [@linusbenkner](https://x.com/linusbenkner) or via email at [linus.benkner@hey.com](mailto:linus.benkner@hey.com).
