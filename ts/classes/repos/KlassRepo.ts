/// <reference path="Repo.ts"/>
namespace bh {
	export class KlassRepo {
		public static get all() { return [0, 1, 2]; }
		public static toImage(klassType: KlassType, fn = getImg20) {
			return fn("classes", KlassType[klassType]);
		}
		public static toImageSrc(klassType: KlassType) {
			return getSrc("classes", KlassType[klassType]);
		}
	}
}