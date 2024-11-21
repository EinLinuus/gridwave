class GridWave {
    /**
     * @typedef {Object} GridWaveConfig
     * @property {String} [itemSelector] The selector for the items
     * @property {Number} columns The amount of columns to display
     * @property {Number} [gap] The gap between the columns
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

        this.renderWithColumns();
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
    renderWithColumns(filterCallback = () => true) {
        const columnAmount = this.config.columns;
        const size = this.getContainerSize();
        const items = this.getItems();

        const [gapX, gapY] = Array.isArray(this.config.gap) ? this.config.gap : [this.config.gap, this.config.gap];

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

        this.renderWithColumns(filterFn);
    }

}