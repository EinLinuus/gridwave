---
title: Filtering and sorting
description: Filter GridWave items with selectors or callbacks and reorder them with comparator functions.
---

# Filtering and sorting

Filtering controls which managed items are visible. Sorting controls their visual layout order without moving the DOM nodes.

## Filter with a selector

Pass a CSS selector:

```javascript
grid.filter(".featured");
```

GridWave calls `Element.matches()` for each item. Combine selectors to match multiple categories:

```javascript
grid.filter(".featured, .on-sale");
```

Only pass trusted, valid selectors. An invalid selector causes the browser's selector API to throw.

## Filter with a callback

Use a predicate for state or data that is not convenient to express as a selector:

```javascript
grid.filter((item) => {
  return Number(item.dataset.price) <= 100;
});
```

The callback receives each managed `HTMLElement` and should return a truthy value to show it.

## Clear a filter

Call `filter()` with no argument to show every item:

```javascript
grid.filter();
```

The values `true` and an empty string also clear the filter, but omitting the argument communicates the intent most clearly.

## Accessibility behavior

GridWave marks filtered items with:

```html
data-gridwave-status="hidden" aria-hidden="true"
```

Visible items receive `data-gridwave-status="visible"` and have `aria-hidden` removed. The injected stylesheet scales hidden items to zero and makes them transparent.

Filtering does not set `display: none` and does not manage focus. If an item contains interactive controls, disable or otherwise remove those controls from keyboard navigation while their item is filtered.

## Sort with a comparator

Pass an `Array.prototype.sort()`-compatible comparator:

```javascript
grid.sort((a, b) => {
  return Number(a.dataset.rank) - Number(b.dataset.rank);
});
```

For text:

```javascript
grid.sort((a, b) => {
  return a.textContent.localeCompare(b.textContent);
});
```

Sorting changes the order used to calculate positions. It does not reorder elements in the DOM.

## Reset sorting

Call `sort()` with no argument:

```javascript
grid.sort();
```

This restores layout according to the managed items' DOM order.

## Combine controls

Filters and sorting persist independently. Changing one rerenders the grid while preserving the other:

```javascript
const state = {
  category: "",
  direction: "ascending",
};

function applyFilter() {
  grid.filter(state.category);
}

function applySort() {
  const direction = state.direction === "ascending" ? 1 : -1;

  grid.sort((a, b) => {
    return direction * (
      Number(a.dataset.rank) - Number(b.dataset.rank)
    );
  });
}
```

When content changes, call [`rerender()`](dynamic-content-and-animation.md#rerender-after-content-changes) to apply the current filter and sort to the latest items.
