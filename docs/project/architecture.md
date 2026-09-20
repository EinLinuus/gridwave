---
title: Architecture
description: Understand GridWave's source layout, rendering pipeline, DOM mutations, responsive behavior, and current constraints.
---

# Architecture

This page is a source map for maintainers and coding agents. Public consumers should rely on the [API reference](../reference/api.md), not internal methods.

## Repository map

| Path | Purpose |
| --- | --- |
| `gridwave.js` | Entire library source and published package entry point. |
| `package.json` | npm metadata; only `gridwave.js` is included in the package. |
| `examples/` | PHP-served manual demos for core behaviors. |
| `.github/workflows/publish-npm.yml` | Publishes to npm when a GitHub release is created. |
| `docs/` | Canonical user, API, and maintainer documentation. |

There is no compilation step, generated distribution, external runtime dependency, or automated test suite.

## Runtime and exports

`gridwave.js` defines one `GridWave` class. At the end of the file it exports through CommonJS when `module.exports` is available; otherwise, it assigns `GridWave` to `window`.

The first constructed instance injects a shared `<style>` element into `document.head` and sets `window.gridwaveInstalled` to avoid injecting it again.

## Instance lifecycle

1. The constructor resolves a selector or stores the supplied element.
2. If configuration was provided, the constructor calls `init()`.
3. `init()` stores the configuration, ensures the container is positioned, calls `updateConfig()`, and installs a debounced window resize listener.
4. `updateConfig()` marks configuration objects with internal IDs, selects the active configuration, updates animation properties, and renders.
5. Filtering, sorting, configuration updates, explicit rerenders, and window resizes all run the rendering path.
6. `destroy()` clears selected layout styles and item status, subject to the limitations below.

Call `init()` only once for an instance. It does not guard against duplicate resize listeners.

## Configuration selection

The base configuration owns `itemSelector` and `breakpoints`. The active rendering configuration is either:

- the breakpoint with the smallest numeric key for which `window.innerWidth <= key`; or
- the base configuration when no breakpoint matches.

Breakpoint objects replace the active base layout configuration rather than inheriting from it. GridWave adds a private `__memoryId` property to the base and breakpoint objects to detect configuration changes.

## Rendering pipeline

For built-in layouts, the effective data flow is:

```text
container
  -> discover items
  -> mark/filter items
  -> sort visible items
  -> calculate dimensions and positions
  -> set container height
```

`getItems()` returns either all direct children or all descendants matching the base `itemSelector`.

Filtering updates `data-gridwave-status` and `aria-hidden`. Sorting mutates the temporary items array, not DOM order.

If the active configuration supplies `renderer`, `rerender()` invokes it immediately with all discovered items. The custom renderer bypasses the built-in filter, sort, and layout stages.

## Layout strategies

### Fixed columns

`renderWithColumns()` calculates a shared column width from container width and horizontal gaps. It measures item heights, tracks the tallest item in each row, positions rows, optionally applies equal heights, and sets the container height.

### Dynamic columns

`renderWithDynamicColumnAmount()` derives a whole column count from container width, `columnMinWidth`, and horizontal gap, then delegates to the normal or masonry renderer.

### Masonry

`renderMasonryWithColumns()` assigns items to columns, positions each item below the previous item in its column, and sizes the container from the tallest accumulated column height. Masonry is experimental and should be changed only with representative visual checks.

## DOM and CSS effects

GridWave may change:

- container inline `position`, `height`, and transition custom properties;
- item inline `position`, `width`, `left`, `top`, and `height`;
- container `data-gridwave-animations`;
- item `data-gridwave-status` and `aria-hidden`; and
- `document.head` by adding the shared transition stylesheet.

The animation variables implemented by the source are:

- `--gridwave-transition-duration`
- `--gridwave-transition-timing`

## Current limitations

- `destroy()` does not remove the resize listener.
- `destroy()` clears container positioning instead of restoring its previous inline value.
- `destroy()` leaves item heights from `sameHeight` and leaves container animation state in place.
- The globally injected stylesheet is not removed.
- GridWave listens to window resize but does not use `ResizeObserver` or `MutationObserver`.
- Masonry is experimental and may produce uneven or unexpected ordering.
- Invalid container or selector input is not validated with a GridWave-specific error.
- Configuration objects are mutated and therefore cannot be frozen.
- No automated tests or declared browser support matrix currently protect behavior.

Treat these as compatibility facts when modifying the source. A fix that changes observable behavior should include documentation updates and, ideally, automated coverage.
