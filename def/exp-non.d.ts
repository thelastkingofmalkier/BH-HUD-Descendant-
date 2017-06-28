interface HTMLElement {

	/**
	 * Scrolls the element's parents until it is visible, only if it isn't visible.
	 */
	scrollIntoViewIfNeeded(): void;
	scrollIntoViewIfNeeded(opt_center: boolean): void;
}