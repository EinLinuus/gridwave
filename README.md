<picture>
  <source media="(prefers-color-scheme: dark)" srcset="logo-light.svg">
  <source media="(prefers-color-scheme: light)" srcset="logo.svg">
  <img alt="gridwave Logo" src="logo.svg">
</picture>

---

# Lightweight and animated JS filterable grid

> Notice: gridwave is still in early development and might not be suitable for production use. Use at your own risk.
> If you *do* use gridwave in a project and run into any issues, please let me know by opening an issue. Thank you! 💚

- [Introduction](#introduction)
- [HTML Structure](#html-structure)
- [Initialization](#initialization)
- [Grid Options](#grid-options)
    - [Fixed Columns](#fixed-columns)
    - [Dynamic Columns](#dynamic-columns)
    - [Masonry](#masonry)
- [Filtering](#filtering)
- [Sorting](#sorting)
- [Animations](#animations)
- [Responsive Grid](#responsive-grid)
- [Complete Example](#complete-example)
- [Dynamic Content](#dynamic-content)
- [More Examples](#more-examples)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Installation

### Package Manager

You can use a package manager like npm to install gridwave:

```bash
npm install gridwave
```

```javascript
import GridWave from "gridwave";
```

### CDN

You can also include gridwave directly from a CDN:

```html
<script src="https://www.unpkg.com/gridwave@1.0.x"></script>
```

### Local Copy

Or you can download the latest version from the [releases page](https://github.com/EinLinuus/gridwave/releases) and include it in your HTML file:

```html
<script src="path/to/gridwave.js"></script>
```

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

## Grid Options

Note: If you are using [responsive grids](#responsive-grid), you can use the same options inside each breakpoint object.

### Fixed Columns

You can set a fixed number of columns for the grid:

```javascript
grid.init({
    columns: 3,
});
```

To add a gap between the grid items, use the `gap` option:

```javascript
grid.init({
    columns: 3,
    gap: 16, // use a number in pixels
    gap: [16, 8], // you can also pass an array with two values for horizontal and vertical gap
});
```

### Dynamic Columns

Instead of setting a fixed number of columns, you can also specify a minimum column widht and the grid will automatically adjust the number of columns based on the container width:

```javascript
grid.init({
    columns: "dynamic",
    columnMinWidth: 200, // use a number in pixels
});
```

You can use the same gap options as with fixed columns (see above).

### Masonry

To create a masonry layout, set the `masonry` option to `true`:

```javascript
grid.init({
    columns: 3,
    gap: 16,
    masonry: true,
});
```

Masonry layouts can be used with both fixed and dynamic columns and also support responsive grids.

> ⚠️ Note: Masonry layouts are *very* experimental. The columns may be very uneven and the layout might not look as expected. If you run into any issues, please let me know by opening an issue.

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

## Sorting

To sort the grid items, call the `sort` method with a callback function. This function will be called for each item to determine the sort order:

```javascript
grid.sort((a, b) => {
    return a.textContent.localeCompare(b.textContent);
});
```

To reset the sort order, call the `sort` method without any arguments:

```javascript
grid.sort();
```

## Animations

By default, gridwave uses a 500ms ease transition. You can change the duration and timing function like this:

```javascript
grid.init({
    transition: 300, // use a number in milliseconds
    transitionMethod: "ease-in-out", // use a valid CSS timing function
});
```

To disable animations, set the `transition` option to `false`:

```javascript
grid.init({
    transition: false,
});
```

The transition options can also be set for each breakpoint individually:

```javascript
grid.init({
    transition: 300,
    transitionMethod: "ease-in-out",
    breakpoints: {
        768: {
            transition: false, // disable animations for smaller screens
        },
    },
});
```

Since gridwave uses CSS variables for the transition, you can also override the default values in your CSS:

```css
:root {
    --gridwave-transition-duration: 300ms;
    --gridwave-transition-timing-function: ease-in-out;
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

## Dynamic Content

If you modified the grid items or added new items, you can call the `rerender` method to update the grid:

```javascript
grid.rerender();
```

This is especially useful when you're fetching new items from an API or adding items dynamically.

## More Examples

For more examples, check out the [examples](examples) directory.

For the best experience, I recommend cloning the repository and running a PHP server in the root directory:

```bash
php -S localhost:8000
```

Then you can access the examples at [http://localhost:8000/examples](http://localhost:8000/examples).

## License

gridwave is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

If you want to contribute to gridwave, feel free to open an issue or a pull request.

Please keep in mind that gridwave is still in early development and I might change things around quite a bit.

## Contact

You can reach me on X [@linusbenkner](https://x.com/linusbenkner) or via email at [linus.benkner@hey.com](mailto:linus.benkner@hey.com).
