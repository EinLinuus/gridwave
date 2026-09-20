---
title: Getting started
description: Install GridWave and create a responsive animated grid with minimal HTML and JavaScript.
---

# Getting started

## Install GridWave

Install from npm:

```bash
npm install gridwave
```

Then import the class:

```javascript
import GridWave from "gridwave";
```

Alternatively, load GridWave from a CDN:

```html
<script src="https://unpkg.com/gridwave@1.0.x"></script>
```

Or download `gridwave.js` from the [releases page](https://github.com/EinLinuus/gridwave/releases) and include it locally:

```html
<script src="/path/to/gridwave.js"></script>
```

## Add the grid markup

Place the items directly inside a container:

```html
<div id="grid">
  <article class="card">First item</article>
  <article class="card">Second item</article>
  <article class="card">Third item</article>
  <article class="card">Fourth item</article>
</div>
```

By default, every direct child is a grid item. Use `itemSelector` if the container has other children or if items are nested.

GridWave assigns inline `position`, `width`, `left`, `top`, and sometimes `height` styles. Avoid setting conflicting inline layout styles on managed items.

## Initialize the grid

Pass either a CSS selector or the container element to the constructor:

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  gap: 16,
  breakpoints: {
    768: {
      columns: 2,
      gap: 12,
    },
    480: {
      columns: 1,
      gap: 8,
    },
  },
});
```

Supplying configuration to the constructor initializes and renders the grid immediately. You can initialize separately instead:

```javascript
const container = document.querySelector("#grid");
const grid = new GridWave(container);

grid.init({
  columns: 3,
  gap: 16,
});
```

At least one layout strategy must be configured through `columns`. See [Layouts and responsive grids](guides/layouts-and-responsive-grids.md) for fixed, dynamic, and masonry layouts.

## Style the items

GridWave handles layout, not visual design:

```css
.card {
  box-sizing: border-box;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
```

Using `box-sizing: border-box` keeps padding and borders inside GridWave's calculated item width.

## Add a filter

GridWave accepts any valid selector that can be used with `Element.matches()`:

```html
<button type="button" data-filter="">All</button>
<button type="button" data-filter=".featured">Featured</button>
```

```javascript
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    grid.filter(button.dataset.filter);
  });
});
```

An empty filter shows all items. Continue with [Filtering and sorting](guides/filtering-and-sorting.md) for callback filters and comparators.

## Troubleshooting

- **Nothing is laid out:** Ensure `columns` is a positive number or `"dynamic"`.
- **Dynamic columns collapse unexpectedly:** Set a positive `columnMinWidth`.
- **Items overlap after content changes:** Call `grid.rerender()` after the content has reached its final dimensions.
- **A breakpoint loses options:** Breakpoint configurations do not inherit from the base configuration; include every required option in each breakpoint.
- **An item is not managed:** Check whether `itemSelector` includes it.

See the complete [configuration reference](reference/configuration.md) and [API reference](reference/api.md).
