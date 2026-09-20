---
title: GridWave documentation
description: Learn how to build animated, filterable, sortable, and responsive JavaScript grids with GridWave.
---

# GridWave documentation

GridWave is a small, dependency-free JavaScript library for arranging DOM elements in animated grids. It supports fixed or dynamic columns, filtering, sorting, responsive layouts, equal-height rows, and an experimental masonry mode.

> GridWave is in early development. Review its [current limitations](project/architecture.md#current-limitations) before using it in production.

## Start here

- [Getting started](getting-started.md) — install GridWave and create a responsive grid.
- [Layouts and responsive grids](guides/layouts-and-responsive-grids.md) — choose a layout mode and configure breakpoints.
- [Filtering and sorting](guides/filtering-and-sorting.md) — add interactive controls to a grid.
- [Dynamic content and animation](guides/dynamic-content-and-animation.md) — update content, configuration, and transitions.

## Reference

- [Configuration](reference/configuration.md) — all supported options and accepted values.
- [API](reference/api.md) — constructor and public method reference.

## Project documentation

- [Architecture](project/architecture.md) — implementation model, DOM effects, and constraints.
- [Contributing](project/contributing.md) — repository workflow and change checklist.

## Common use cases

GridWave is a good fit for browser interfaces that need:

- filterable portfolios, galleries, or catalog cards;
- sortable result grids;
- responsive columns without a framework dependency;
- animated rearrangement after filtering, sorting, or adding content; or
- a custom layout renderer built on GridWave's filtering and sorting pipeline.

GridWave directly controls inline positioning and dimensions on the container and its items. It is not a virtualized list, data-fetching layer, or CSS Grid wrapper.

## Package

```bash
npm install gridwave
```

```javascript
import GridWave from "gridwave";
```

GridWave is licensed under the [MIT License](https://github.com/EinLinuus/gridwave/blob/main/LICENSE).
