---
title: Configuration reference
description: Reference for every GridWave configuration option, its accepted values, and its behavior.
---

# Configuration reference

Pass configuration to the constructor, [`init()`](api.md#init), or [`updateConfig()`](api.md#updateconfig).

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  gap: 16,
});
```

Configuration objects must be mutable. GridWave adds internal identifiers to the base object and each breakpoint object.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `itemSelector` | `string` | Direct children | CSS selector used to find managed items inside the container. |
| `columns` | Positive `number` or `"dynamic"` | None | Selects fixed or dynamic column layout. Required unless `renderer` is provided. |
| `columnMinWidth` | Positive `number` | None | Minimum column width in pixels for dynamic columns. |
| `gap` | `number` or `[number, number]` | None | Pixel gap. An array sets horizontal and vertical gaps respectively. |
| `sameHeight` | `boolean` | `false` | Makes items in each non-masonry row equal to that row's tallest item. |
| `renderer` | `(items: HTMLElement[]) => void` | Built-in renderer | Replaces the built-in filtering, sorting, and layout path. |
| `transition` | `number` or `false` | `500` | Transition duration in milliseconds, or `false` to disable animation. |
| `transitionMethod` | `string` | `"ease"` | Valid CSS transition timing function. |
| `masonry` | `boolean` | `false` | Uses the experimental masonry renderer. |
| `breakpoints` | `Record<string, BreakpointConfig>` | None | Complete configurations selected by maximum viewport width. |

Use explicit `gap` values with built-in layouts. An omitted gap participates in layout arithmetic and can produce invalid positions.

## `itemSelector`

Without a selector, GridWave manages all direct children:

```javascript
{
  columns: 3,
  gap: 16
}
```

Use a selector to manage matching descendants:

```javascript
{
  itemSelector: ".grid-item",
  columns: 3,
  gap: 16
}
```

The selector is evaluated with `container.querySelectorAll()`.

## `columns`

Use a number for a fixed count:

```javascript
{
  columns: 4,
  gap: 16
}
```

Use `"dynamic"` with `columnMinWidth`:

```javascript
{
  columns: "dynamic",
  columnMinWidth: 220,
  gap: 16
}
```

## `gap`

Use one value for both axes:

```javascript
{
  columns: 3,
  gap: 16
}
```

Use `[horizontal, vertical]` values for separate axes:

```javascript
{
  columns: 3,
  gap: [24, 12]
}
```

## `sameHeight`

`sameHeight: true` sets every item in a row to the height of that row's tallest item:

```javascript
{
  columns: 3,
  gap: 16,
  sameHeight: true
}
```

This option applies to the row-based renderer, not masonry.

## `renderer`

A custom renderer receives the current managed items:

```javascript
{
  renderer(items) {
    // Position the items and size the container.
  }
}
```

When `renderer` is present, GridWave returns before its built-in filter, sort, fixed-column, dynamic-column, or masonry logic. The custom renderer is responsible for any equivalent behavior it needs.

## `transition` and `transitionMethod`

```javascript
{
  columns: 3,
  gap: 16,
  transition: 250,
  transitionMethod: "cubic-bezier(0.4, 0, 0.2, 1)"
}
```

Set `transition: false` to set `data-gridwave-animations="false"` on the container.

## `masonry`

```javascript
{
  columns: "dynamic",
  columnMinWidth: 220,
  gap: 16,
  masonry: true
}
```

Masonry is experimental. See [Layouts and responsive grids](../guides/layouts-and-responsive-grids.md#masonry).

## `breakpoints`

Breakpoint keys are maximum viewport widths in pixels:

```javascript
const shared = {
  gap: 16,
  transition: 300,
};

const config = {
  ...shared,
  columns: 4,
  breakpoints: {
    768: {
      ...shared,
      columns: 2,
    },
    480: {
      ...shared,
      columns: 1,
    },
  },
};
```

GridWave sorts breakpoint keys numerically and uses the smallest breakpoint whose value is greater than or equal to `window.innerWidth`.

Breakpoint configurations do not inherit from the base configuration. They support the layout and animation options in this reference, but not nested `breakpoints` or a separate `itemSelector`; item discovery always uses the base configuration's `itemSelector`.
