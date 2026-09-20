---
title: Dynamic content and animation
description: Rerender GridWave after content changes, update configuration, control transitions, and clean up an instance.
---

# Dynamic content and animation

## Rerender after content changes

GridWave reads managed items each time it renders. After adding, removing, or resizing content, call:

```javascript
grid.rerender();
```

The current filter and sort remain active:

```javascript
const item = document.createElement("article");
item.className = "card featured";
item.textContent = "New item";

document.querySelector("#grid").append(item);
grid.rerender();
```

Call `rerender()` only after dimensions are stable. For example, wait until an image has loaded if its intrinsic size changes the card height:

```javascript
image.addEventListener("load", () => {
  grid.rerender();
});
```

GridWave automatically rerenders after its 100-millisecond window resize debounce. It does not observe arbitrary DOM or element-size changes.

## Update configuration

Replace the configuration and immediately rerender with:

```javascript
grid.updateConfig({
  columns: "dynamic",
  columnMinWidth: 240,
  gap: 20,
  transition: 250,
});
```

`updateConfig()` replaces rather than merges the previous object. Include all options that should remain active.

## Configure transitions

GridWave enables a 500-millisecond `ease` transition unless `transition` is `false`.

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  transition: 300,
  transitionMethod: "ease-in-out",
});
```

- `transition` is a duration in milliseconds.
- `transitionMethod` accepts a valid CSS transition timing function.

Disable animations:

```javascript
grid.updateConfig({
  columns: 3,
  transition: false,
});
```

Transition settings can differ by breakpoint, but each breakpoint must contain all configuration it needs:

```javascript
const grid = new GridWave("#grid", {
  columns: 3,
  transition: 300,
  breakpoints: {
    480: {
      columns: 1,
      transition: false,
    },
  },
});
```

## Override transition variables

GridWave stores transition settings on the container:

```css
#grid {
  --gridwave-transition-duration: 300ms;
  --gridwave-transition-timing: ease-in-out;
}
```

Configuration values set through GridWave become inline custom properties and take precedence over stylesheet declarations. The variable name is `--gridwave-transition-timing`.

The injected transition applies to all animatable properties on the container and items with `data-gridwave-status`.

## Destroy an instance

Call `destroy()` to clear most GridWave layout styles and item state:

```javascript
grid.destroy();
```

The current implementation clears container `position` and `height`; clears item `position`, `width`, `left`, and `top`; and removes GridWave status and accessibility attributes.

`destroy()` does not clear item heights set by `sameHeight`, animation state, the window resize listener, or the globally injected stylesheet. Avoid repeatedly initializing and destroying instances in long-lived views. See [Current limitations](../project/architecture.md#current-limitations).
