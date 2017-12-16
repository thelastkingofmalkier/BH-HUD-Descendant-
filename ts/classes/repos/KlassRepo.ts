/// <reference path="Repo.ts"/>
namespace bh {
	export class KlassRepo {
		public static get allTypes(): KlassType[] {
			return [0, 1, 2];
		}
		public static toImage(klassType: KlassType, fn = getImg20) {
			return fn("classes", KlassType[klassType]);
		}
		public static toImageSrc(klassType: KlassType) {
			return getSrc("classes", KlassType[klassType]);
		}
		public static findType(value: string): KlassType {
			return this.allTypes.find(klassType => value.slice(0, 2) == KlassType[klassType].slice(0, 2));
		}
	}
}