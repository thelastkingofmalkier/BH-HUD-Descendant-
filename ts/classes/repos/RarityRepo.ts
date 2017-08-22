/// <reference path="Repo.ts"/>
namespace bh {
	export class RarityRepo {
		public static get all() { return [0, 1, 2, 3, 4]; }
		public static isRarity(rarity: string) { return String(rarity).replace(/ /g, "") in RarityType; }
	}
}