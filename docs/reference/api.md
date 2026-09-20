---
title: API reference
description: Reference for the GridWave constructor and public lifecycle, filtering, sorting, and rendering methods.
---

# API reference

## Constructor

```javascript
new GridWave(container, config?)
```

Creates a GridWave instance.

| Parameter | Type | Description |
| --- | --- | --- |
| `container` | `HTMLElement \| string` | Container element or a selector resolved with `document.querySelector()`. |
| `config` | `GridWaveConfig` | Optional configuration. When present, the constructor calls `init(config)`. |

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  gap: 16,
});
```

The selector must resolve to an element before initialization.

The first GridWave instance injects the shared animation stylesheet into `document.head` and marks `window.gridwaveInstalled`.

## `init`

```javascript
grid.init(config)
```

Initializes the instance, ensures the container is positioned, installs the debounced window resize handler, applies the configuration, and renders.

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | `GridWaveConfig` | Complete initial configuration. |

Call `init()` once per instance. Subsequent configuration changes should use `updateConfig()` so that additional resize listeners are not installed.

## `updateConfig`

```javascript
grid.updateConfig(config)
```

Replaces the complete configuration, selects the active breakpoint, updates animation state, and rerenders.

```javascript
grid.updateConfig({
  columns: "dynamic",
  columnMinWidth: 240,
  gap: 20,
});
```

This method does not merge with the previous configuration. The supplied base and breakpoint objects must be mutable because GridWave adds internal identifiers to them.

## `filter`

```javascript
grid.filter(filter?)
```

Sets the active filter and rerenders.

| Parameter | Type | Description |
| --- | --- | --- |
| `filter` | `string \| (item: HTMLElement) => boolean` | Selector or predicate used to include items. Omit it to clear filtering. |

```javascript
grid.filter(".featured");

grid.filter((item) => {
  return Number(item.dataset.price) < 100;
});

grid.filter();
```

Selector filters use `Element.matches()`. Hidden items receive `data-gridwave-status="hidden"` and `aria-hidden="true"`.

## `sort`

```javascript
grid.sort(comparator?)
```

Sets the active comparator and rerenders.

| Parameter | Type | Description |
| --- | --- | --- |
| `comparator` | `(a: HTMLElement, b: HTMLElement) => number` | Sort comparator. Omit it to restore DOM order. |

```javascript
grid.sort((a, b) => {
  return Number(a.dataset.rank) - Number(b.dataset.rank);
});

grid.sort();
```

Sorting affects calculated positions, not DOM node order.

## `rerender`

```javascript
grid.rerender()
```

Reads the currently managed items and lays them out with the active configuration, filter, and comparator.

Call this after adding, removing, or resizing items. It is also called by initialization, configuration updates, filtering, sorting, and the resize handler.

If the active configuration has a custom `renderer`, `rerender()` passes it the managed items and skips the built-in filter, sort, and layout path.

## `destroy`

```javascript
grid.destroy()
```

Clears the container's `position` and `height`, clears item `position`, `width`, `left`, and `top`, and removes item status and `aria-hidden` attributes.

The current implementation does not clear item heights set by `sameHeight`, animation attributes or custom properties, its window resize listener, or the shared stylesheet. It also clears the container's `position` style rather than restoring a previous inline value. See [Architecture: current limitations](../project/architecture.md#current-limitations).

## Methods intended for internal use

Methods such as `getItems()`, `updateConfigToUse()`, `renderWithColumns()`, and `renderMasonryWithColumns()` are implementation details. They are not a stable extension API; prefer the public methods and the `renderer` configuration hook.
