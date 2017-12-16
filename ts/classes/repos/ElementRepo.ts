/// <reference path="Repo.ts"/>
namespace bh {
	export class ElementRepo {
		public static get allTypes(): ElementType[] {
			return [0, 1, 2, 3, 4, 5];
		}
		public static toImage(elementType: ElementType, fn = getImg20) {
			return elementType == ElementType.Neutral ? "" : fn("elements", ElementType[elementType]);
		}
		public static toImageSrc(elementType: ElementType) {
			return getSrc("elements", ElementType[elementType]);
		}
		public static isElement(element: string) {
			return String(element) in ElementType;
		}
		public static findType(value: string): ElementType {
			var type = this.allTypes.find(elementType => value[0] == ElementType[elementType][0]);
			if (type === null) console.log(value);
			return type;
		}
	}
}