/**
 * GridWave
 *
 * A simple and lightweight library to filter
 * and sort elements, and it's even animated!
 *
 * @version 1.0.1
 * @license MIT
 * @author Linus Benkner
 * @see https://github.com/EinLinuus/gridwave
 */
class GridWave {
    /**
     * @typedef {Object} GridWaveBreakpointConfig
     * @property {Number | "dynamic"} [columns] The amount of columns to display
     * @property {Number} [columnMinWidth] The minimum width of a column if dynamic columns are used
     * @property {Number} [gap] The gap between the columns
     * @property {Boolean} [sameHeight] Whether the items should have the same height
     * @property {Function} [renderer] A custom render function
     * @property {Number | false} [transition] The transition duration in ms or false to disable transitions
     * @property {String} [transitionMethod] The transition timing function
     * @property {Boolean} [masonry] Whether the items should be displayed in a masonry layout
     *
     * @typedef {Object} GridWaveConfig
     * @property {String} [itemSelector] The selector for the items
     * @property {Number | "dynamic"} [columns] The amount of columns to display
     * @property {Number} [columnMinWidth] The minimum width of a column if dynamic columns are used
     * @property {Number} [gap] The gap between the columns
     * @property {Boolean} [sameHeight] Whether the items should have the same height
     * @property {Function} [renderer] A custom render function
     * @property {Number | false} [transition] The transition duration in ms or false to disable transitions
     * @property {String} [transitionMethod] The transition timing function
     * @property {Boolean} [masonry] Whether the items should be displayed in a masonry layout
     * @property {Object.<string, GridWaveBreakpointConfig>} [breakpoints] The breakpoints
     *
     * @typedef {Object} GridWaveContainerSize
     * @property {Number} width The width of the container
     */

    /**
     * @param {HTMLElement | string} container The container element that contains all elements
     * @param {GridWaveConfig} [config] The configuration object
     */
    constructor(container, config) {
        if(!window.gridwaveInstalled) {
            this.injectStyles();
            window.gridwaveInstalled = true;
        }

        if(typeof container === "string") {
            container = document.querySelector(container);
        }
        this.container = container;

        if(config) {
            this.init(config);
        }
    }

    injectStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            [data-gridwave-animations="true"],
            [data-gridwave-animations="true"] > [data-gridwave-status] {
                transition: all var(--gridwave-transition-duration, 500ms) var(--gridwave-transition-timing, ease);
            }
            [data-gridwave-status="hidden"] {
                transform: scale(0);
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * @param {GridWaveConfig} config The configuration object
     */
    init(config) {
        this.config = config;
        console.debug("GridWave initialized with config: ", this.config);

        const isContainerPositioned = window.getComputedStyle(this.container).position !== "static";
        if(!isContainerPositioned) {
            this.container.style.position = "relative";
        }

        this.updateConfig(config);

        let resizeTimeout = null;
        window.addEventListener("resize", _ => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateConfigToUse();
                this.rerender();
            }, 100);
        });
    }

    updateConfig(config) {
        this.config = config;
        this.config.__memoryId = Math.random().toString(36).substring(7);
        if(this.config.breakpoints) {
            Object.entries(this.config.breakpoints).forEach(([key, value]) => {
                value.__memoryId = Math.random().toString(36).substring(7);
            });
        }

        this.updateConfigToUse();
        this.rerender();
    }

    updateConfigToUse() {
        const breakpoint = Object.entries(this.config.breakpoints ?? [])
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .find(([breakpoint]) => window.innerWidth <= parseInt(breakpoint));

        const currentConfig = this.currentConfig?.__memoryId;
        if(breakpoint) {
            this.currentConfig = breakpoint[1];
        } else {
            this.currentConfig = this.config;
        }

        if(currentConfig !== this.currentConfig.__memoryId) {
            console.debug("GridWave: Switched to breakpoint", this.currentConfig.__memoryId);
            this.updateAnimationConfig();
        }
    }

    updateAnimationConfig() {
        if(this.currentConfig.transition === false) {
            this.container.setAttribute("data-gridwave-animations", "false");
            return;
        }
        this.container.setAttribute("data-gridwave-animations", "true");
        if(this.currentConfig.transition) {
            this.container.style.setProperty("--gridwave-transition-duration", `${this.currentConfig.transition}ms`);
        } else {
            this.container.style.removeProperty("--gridwave-transition-duration");
        }

        if(this.currentConfig.transitionMethod) {
            this.container.style.setProperty("--gridwave-transition-timing", this.currentConfig.transitionMethod);
        } else {
            this.container.style.removeProperty("--gridwave-transition-timing");
        }
    }

    rerender() {
        if(!this.currentFilter) {
            this.currentFilter = () => true;
        }

        if(!this.currentSort) {
            this.currentSort = () => 0;
        }

        const items = this.getItems();
        if(this.currentConfig.renderer) {
            this.currentConfig.renderer(items);
            return;
        }

        if(this.currentConfig.columns) {
            if(this.currentConfig.columns === "dynamic") {
                this.renderWithDynamicColumnAmount(items)
                return;
            }

            this.renderWithFixedColumnAmount(items);
            return;
        }

        console.error("GridWave: No render method found. Please make sure you have a valid configuration.");
    }

    destroy() {
        this.container.style.position = "";
        this.container.style.height = "";
        this.getItems().forEach(item => {
            item.style.position = "";
            item.style.width = "";
            item.style.left = "";
            item.style.top = "";
            item.removeAttribute("data-gridwave-status");
            item.removeAttribute("aria-hidden");
        });

        // TODO: Remove event listeners
    }

    /**
     * @returns {GridWaveContainerSize} The size of the container
     */
    getContainerSize() {
        return {
            width: this.container.offsetWidth,
        };
    }

    /**
     * @returns {HTMLElement[]} The items in the container
     */
    getItems() {
        if(!this.config.itemSelector) {
            return [...this.container.children];
        }

        return [...this.container.querySelectorAll(this.config.itemSelector)];
    }

    /**
     * @param {HTMLElement[]} items The items to filter
     * @returns {HTMLElement[]} The items in the container with filters applied
     */
    getItemsWithFiltersApplied(items) {
        return items.filter((item) => {
            if(!this.currentFilter(item)) {
                item.setAttribute("data-gridwave-status", "hidden");
                item.setAttribute("aria-hidden", "true");
                return false;
            }

            item.setAttribute("data-gridwave-status", "visible");
            item.removeAttribute("aria-hidden");
            return true;
        });
    }

    /**
     * @param {HTMLElement[]} items The items to sort
     * @returns {HTMLElement[]} The items in the container with sort applied
     */
    getItemsWithSortApplied(items) {
        return items.sort(this.currentSort);
    }

    /**
     * @param {Function | string} [filter]
     */
    filter(filter) {
        let filterFn = filter;

        if(!filter || filter === true || filter?.length === 0) {
            filter = null;
        }

        if(typeof filter === "string") {
            filterFn = (item) => item.matches(filter);
        }

        this.currentFilter = filterFn;

        this.rerender();
    }

    /**
     * @param {Function} [sortBy]
     */
    sort(sortBy) {
        let sortFn = sortBy;

        if(!sortBy) {
            sortBy = null;
        }

        this.currentSort = sortFn;

        this.rerender();
    }

    /**
     * @param {HTMLElement[]} items
     */
    renderWithFixedColumnAmount(items) {
        items = this.getItemsWithFiltersApplied(items);
        items = this.getItemsWithSortApplied(items);

        const [gapX, gapY] = Array.isArray(this.currentConfig.gap) ? this.currentConfig.gap : [this.currentConfig.gap, this.currentConfig.gap];

        if(this.currentConfig.masonry) {
            this.renderMasonryWithColumns(items, this.currentConfig.columns, gapX, gapY);
            return;
        }
        this.renderWithColumns(items, this.currentConfig.columns, gapX, gapY);
    }

    /**
     * @param {HTMLElement[]} items
     */
    renderWithDynamicColumnAmount(items) {
        items = this.getItemsWithFiltersApplied(items);
        items = this.getItemsWithSortApplied(items);

        const containerSize = this.getContainerSize();

        const [gapX, gapY] = Array.isArray(this.currentConfig.gap) ? this.currentConfig.gap : [this.currentConfig.gap, this.currentConfig.gap];

        const columnMinWidth = Math.min(this.currentConfig.columnMinWidth ?? 0, containerSize.width);

        const twoColumnMinWidth = columnMinWidth * 2 + gapX;
        if(containerSize.width < twoColumnMinWidth) {
            this.renderWithColumns(items, 1, gapX, gapY);
            return;
        }

        const availableWidthWithoutFirstColumn = containerSize.width - columnMinWidth;
        const extensionColumnWidth = columnMinWidth + gapX;
        const columnAmount = Math.floor(availableWidthWithoutFirstColumn / extensionColumnWidth) + 1;

        if(this.currentConfig.masonry) {
            this.renderMasonryWithColumns(items, columnAmount, gapX, gapY);
            return;
        }
        this.renderWithColumns(items, columnAmount, gapX, gapY);
    }

    /**
     * @param {HTMLElement[]} items
     * @param {Number} columnAmount
     * @param {Number} gapX
     * @param {Number} gapY
     */
    renderWithColumns(items, columnAmount, gapX, gapY) {
        const size = this.getContainerSize();

        const usableWidth = size.width - ((columnAmount - 1) * gapX);
        const columnWidth = usableWidth / columnAmount;

        const rowHeights = [];

        items.forEach((item, realIndex) => {
            const rowIndex = Math.floor(realIndex / columnAmount);
            const columnIndex = realIndex % columnAmount;

            item.style.position = "absolute";
            item.style.width = `${columnWidth}px`;
            item.style.left = `${columnIndex * columnWidth + (columnIndex * gapX)}px`;

            item.style.height = "";
            const height = item.offsetHeight;
            if(!rowHeights[rowIndex] || rowHeights[rowIndex] < height) {
                rowHeights[rowIndex] = height;
            }
        });

        items.forEach((item, index) => {
            const rowIndex = Math.floor(index / columnAmount);
            item.style.top = `${rowHeights.slice(0, rowIndex).reduce((acc, curr) => acc + curr, 0) + (rowIndex * gapY)}px`;

            if(this.currentConfig.sameHeight) {
                const currentRowHeight = rowHeights[rowIndex];
                item.style.height = `${currentRowHeight}px`;
            }
        });

        const totalHeight = rowHeights.reduce((acc, curr) => acc + curr, 0) + ((rowHeights.length - 1) * gapY);
        this.container.style.height = `${totalHeight}px`;
    }

    /**
     * @param {HTMLElement[]} items
     * @param {Number} columnAmount
     * @param {Number} gapX
     * @param {Number} gapY
     */
    renderMasonryWithColumns(items, columnAmount, gapX, gapY) {
        items = this.sortItemsForMasonry(items, columnAmount);

        const size = this.getContainerSize();

        const usableWidth = size.width - ((columnAmount - 1) * gapX);
        const columnWidth = usableWidth / columnAmount;

        items.forEach((item, realIndex) => {
            const rowIndex = Math.floor(realIndex / columnAmount);
            const columnIndex = realIndex % columnAmount;

            item.style.position = "absolute";
            item.style.width = `${columnWidth}px`;
            item.style.left = `${columnIndex * columnWidth + (columnIndex * gapX)}px`;

            item.style.height = "";
        });

        let currentTotalHeightsOfColumns = [];

        items.forEach((item, index) => {
            const rowIndex = Math.floor(index / columnAmount);
            const itemHeight = item.offsetHeight;
            const columnIndex = index % columnAmount;
            const heightOffset = currentTotalHeightsOfColumns[columnIndex] ?? 0;

            console.log("Item " + index, columnIndex, itemHeight, heightOffset)

            if(currentTotalHeightsOfColumns[columnIndex] === undefined) {
                currentTotalHeightsOfColumns[columnIndex] = itemHeight + gapY;
            } else {
                currentTotalHeightsOfColumns[columnIndex] += itemHeight + gapY;
            }

            item.style.top = `${heightOffset}px`;
        });

        const totalHeight = Math.max(...currentTotalHeightsOfColumns);
        this.container.style.height = `${totalHeight}px`;
    }

    /**
     * @param {HTMLElement[]} items
     * @param {Number} columnAmount
     * @returns {HTMLElement[]} The items sorted for a masonry layout
     */
    sortItemsForMasonry(items, columnAmount) {
        const columns = Array.from({ length: columnAmount }, () => []);
        items.forEach((item, index) => {
            columns[index % columnAmount].push(item);
        });

        const columnHeights = columns.map(column => column.reduce((acc, curr) => acc + curr.offsetHeight, 0));
        const sortedColumns = columns.sort((a, b) => columnHeights[a] - columnHeights[b]);
        return sortedColumns.flat();
    }

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridWave;
} else {
    window.GridWave = GridWave;
}
