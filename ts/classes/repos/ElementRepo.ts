/// <reference path="Repo.ts"/>
namespace bh {
	export class ElementRepo {
		public static get all() { return [0, 1, 2, 3, 4, 5]; }
		public static toImage(elementType: ElementType, fn = getImg20) {
			return elementType == ElementType.Neutral ? "" : fn("elements", ElementType[elementType]);
		}
		public static toImageSrc(elementType: ElementType) {
			return getSrc("elements", ElementType[elementType]);
		}
		public static isElement(element: string) { return String(element) in ElementType; }
	}
}