namespace bh {
	var root: string;
	function getRoot() {
		if (!root) {
			root = String(location.href).toLowerCase().includes("battlehand-hud/") ? "." : host;
		}
		return root;
	}
	function img(src: string, css?: string, style?: string) {
		var onerror = "",
			klass = css ? `class="${css}"` : "",
			style = style ? `style="${style}"` : "";
		if (src.includes("glyphicons-82-refresh")) {
			onerror = `onerror="bh.$(this).replaceWith('&#8634;')"`;
		}
		return `<img src="${src}" ${klass} ${style} ${onerror}/>`;
	}
	export function getImg(...parts: string[]): string { return img(getSrc(...parts)); }
	export function getImg12(...parts: string[]): string {return img(getSrc(...parts), "icon-12"); }
	export function getImg20(...parts: string[]): string {return img(getSrc(...parts), "icon-20"); }
	export function getImgG(...parts: string[]): string { return img(getSrc(...parts), "grayscale"); }
	export function getSrc(...parts: string[]): string { return `${getRoot()}/images/${parts.join("/")}.png`; }
}