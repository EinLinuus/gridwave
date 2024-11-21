class GridWave {
    /**
     * @typedef {Object} GridWaveBreakpointConfig
     * @property {Number} columns The amount of columns to display
     * @property {Number} [gap] The gap between the columns
     * @property {Boolean} [sameHeight] Whether the items should have the same height
     *
     * @typedef {Object} GridWaveConfig
     * @property {String} [itemSelector] The selector for the items
     * @property {Number} columns The amount of columns to display
     * @property {Number} [gap] The gap between the columns
     * @property {Boolean} [sameHeight] Whether the items should have the same height
     * @property {Object.<string, GridWaveBreakpointConfig>} [breakpoints] The breakpoints
     *
     * @typedef {Object} GridWaveContainerSize
     * @property {Number} width The width of the container
     */

    /**
     * @param {HTMLElement} container The container element that contains all elements
     * @param {GridWaveConfig} [config] The configuration object
     */
    constructor(container, config) {
        this.container = container;

        if(config) {
            this.init(config);
        }
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

        this.config.__memoryId = Math.random().toString(36).substring(7);
        if(this.config.breakpoints) {
            Object.entries(this.config.breakpoints).forEach(([key, value]) => {
                value.__memoryId = Math.random().toString(36).substring(7);
            });
        }

        this.updateConfigToUse()

        this.renderWithColumns();

        let resizeTimeout = null;
        window.addEventListener("resize", _ => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateConfigToUse();
                this.rerender();
            }, 100);
        });
    }

    updateConfigToUse() {
        console.log("HALLO")
        const breakpoint = Object.entries(this.config.breakpoints)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .find(([breakpoint]) => window.innerWidth <= parseInt(breakpoint));

        const currentConfig = this.currentConfig?.__memoryId;
        if(breakpoint) {
            this.currentConfig = breakpoint[1];
        } else {
            this.currentConfig = this.config;
        }

        if(currentConfig && currentConfig !== this.currentConfig.__memoryId) {
            console.debug("GridWave: Switched to breakpoint", this.currentConfig.__memoryId);
        }
    }

    rerender() {
        this.renderWithColumns(this.currentFilter ?? null)
    }

    destroy() {
        this.container.style.position = "";
        this.container.style.height = "";
        this.getItems().forEach(item => {
            item.style.position = "";
            item.style.width = "";
            item.style.left = "";
            item.style.top = "";
            item.style.transform = "";
            item.style.opacity = "";
            item.removeAttribute("data-gridwave-status");
            item.removeAttribute("aria-hidden");
        });
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
     * @param {Function} [filterCallback]
     */
    renderWithColumns(filterCallback) {
        if(!filterCallback) {
            filterCallback = () => true;
        }

        const columnAmount = this.currentConfig.columns ?? 1;
        const size = this.getContainerSize();
        const items = this.getItems();

        const [gapX, gapY] = Array.isArray(this.currentConfig.gap) ? this.currentConfig.gap : [this.currentConfig.gap, this.currentConfig.gap];

        const usableWidth = size.width - ((columnAmount - 1) * gapX);
        const columnWidth = usableWidth / columnAmount;

        const rowHeights = [];

        let realIndex = -1;

        const indexesInUse = [];

        items.forEach((item, listIndex) => {
            if(filterCallback(item) === false) {
                item.style.transform = "scale(0)";
                item.style.opacity = "0";
                item.setAttribute("data-gridwave-status", "hidden");
                item.setAttribute("aria-hidden", "true");
                return;
            }
            realIndex++;

            item.style.transform = "";
            item.style.opacity = "";
            item.setAttribute("data-gridwave-status", "visible");
            item.removeAttribute("aria-hidden");
            indexesInUse.push(listIndex);

            const rowIndex = Math.floor(realIndex / columnAmount);
            const columnIndex = realIndex % columnAmount;

            item.style.position = "absolute";
            item.style.width = `${columnWidth}px`;
            item.style.left = `${columnIndex * columnWidth + (columnIndex * gapX)}px`;

            const height = item.offsetHeight;
            if(!rowHeights[rowIndex] || rowHeights[rowIndex] < height) {
                rowHeights[rowIndex] = height;
            }
        });

        items
            .filter((_, index) => indexesInUse.includes(index))
            .forEach((item, index) => {
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
     * @param {Function | string} [filter]
     */
    filter(filter) {
        let filterFn = filter;

        if(!filter) {
            filterFn = () => true;
        }

        if(typeof filter === "string") {
            filterFn = (item) => item.matches(filter);
        }

        this.currentFilter = filterFn;

        this.renderWithColumns(filterFn);
    }

}