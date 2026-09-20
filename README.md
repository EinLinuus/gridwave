<picture>
  <source media="(prefers-color-scheme: dark)" srcset="logo-light.svg">
  <source media="(prefers-color-scheme: light)" srcset="logo.svg">
  <img alt="GridWave logo" src="logo.svg">
</picture>

---

# Lightweight, animated JavaScript grids

GridWave is a small, dependency-free library for responsive DOM layouts with filtering, sorting, animation, equal-height rows, and experimental masonry.

> GridWave is in early development and might not be suitable for production use. Please [open an issue](https://github.com/EinLinuus/gridwave/issues) if you encounter a problem.

See the [complete documentation](docs/index.md) or try the [CodePen demo](https://codepen.io/EinLinuus/pen/qBeevBE).

## Installation

```bash
npm install gridwave
```

```javascript
import GridWave from "gridwave";
```

You can also load GridWave from a CDN:

```html
<script src="https://unpkg.com/gridwave@1.0.x"></script>
```

## Quick start

```html
<button type="button" data-filter="">All</button>
<button type="button" data-filter=".featured">Featured</button>

<div id="grid">
  <article class="card featured">First item</article>
  <article class="card">Second item</article>
  <article class="card featured">Third item</article>
</div>

<script>
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

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      grid.filter(button.dataset.filter);
    });
  });
</script>
```

## Documentation

- [Getting started](docs/getting-started.md)
- [Layouts and responsive grids](docs/guides/layouts-and-responsive-grids.md)
- [Filtering and sorting](docs/guides/filtering-and-sorting.md)
- [Dynamic content and animation](docs/guides/dynamic-content-and-animation.md)
- [Configuration reference](docs/reference/configuration.md)
- [API reference](docs/reference/api.md)
- [Architecture](docs/project/architecture.md)
- [Contributing](docs/project/contributing.md)

## Examples

Clone the repository and run:

```bash
php -S localhost:8000
```

Then open [http://localhost:8000/examples/](http://localhost:8000/examples/).

## License

GridWave is available under the [MIT License](LICENSE).

## Contact

Reach Linus Benkner on X at [@linusbenkner](https://x.com/linusbenkner) or by email at [linus.benkner@hey.com](mailto:linus.benkner@hey.com).
