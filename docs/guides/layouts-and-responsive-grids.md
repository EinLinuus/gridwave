---
title: Layouts and responsive grids
description: Configure fixed, dynamic, equal-height, masonry, and breakpoint-based GridWave layouts.
---

# Layouts and responsive grids

GridWave positions items absolutely inside a relatively positioned container. Choose either a fixed column count or dynamic columns for every active configuration.

## Fixed columns

Set `columns` to a positive number:

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  gap: 16,
});
```

Items fill rows from left to right. Each row is positioned below the tallest item in the preceding rows.

Set `sameHeight` to make every item in a row as tall as that row's tallest item:

```javascript
grid.updateConfig({
  columns: 3,
  gap: 16,
  sameHeight: true,
});
```

## Dynamic columns

Use dynamic columns when the number of columns should follow the available container width:

```javascript
const grid = new GridWave("#grid", {
  columns: "dynamic",
  columnMinWidth: 220,
  gap: 16,
});
```

GridWave calculates the largest whole number of columns whose width is at least `columnMinWidth`. It always renders at least one column, and caps the effective minimum width at the current container width.

## Horizontal and vertical gaps

A number applies the same pixel gap in both directions:

```javascript
{
  columns: 3,
  gap: 16
}
```

An array configures horizontal and vertical gaps independently:

```javascript
{
  columns: 3,
  gap: [24, 12]
}
```

The first value is horizontal (`gapX`), and the second is vertical (`gapY`).

## Masonry

Enable masonry with either fixed or dynamic columns:

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  gap: 16,
  masonry: true,
});
```

Masonry removes row alignment and stacks items independently within columns. It is currently experimental: column balance and item order may not meet every design's expectations. Test it with representative content before relying on it in production.

Do not combine `masonry: true` with `sameHeight`; masonry clears item heights and does not use the equal-height row behavior.

## Responsive breakpoints

GridWave uses desktop-first, max-width breakpoints based on `window.innerWidth`:

```javascript
const shared = {
  gap: 16,
  transition: 300,
};

const grid = new GridWave("#grid", {
  ...shared,
  columns: 4,
  breakpoints: {
    1024: {
      ...shared,
      columns: 3,
    },
    768: {
      ...shared,
      columns: 2,
    },
    480: {
      ...shared,
      columns: 1,
    },
  },
});
```

For a viewport of 700 pixels, the `768` configuration is used. Above the largest matching breakpoint, GridWave uses the base configuration.

Breakpoint objects **do not inherit** base or larger-breakpoint values. Each breakpoint is a complete active layout configuration. Share common values explicitly, as shown above.

On window resize, GridWave waits 100 milliseconds, selects the active configuration, and rerenders.

## Choosing a layout

| Requirement | Configuration |
| --- | --- |
| Exact column count | Numeric `columns` |
| Columns based on available width | `columns: "dynamic"` plus `columnMinWidth` |
| Aligned rows with consistent card heights | `sameHeight: true` |
| Staggered vertical layout | `masonry: true` |
| Viewport-specific layout | `breakpoints` |

See [Configuration](../reference/configuration.md) for accepted option types.
