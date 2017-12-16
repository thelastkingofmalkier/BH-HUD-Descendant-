/// <reference path="Repo.ts"/>
namespace bh {
	export class RarityRepo {
		public static get allTypes(): RarityType[] {
			return [0, 1, 2, 3, 4];
		}
		public static isRarity(rarity: string) {
			return String(rarity).replace(/ /g, "") in RarityType;
		}
		public static findType(value: string): RarityType {
			return this.allTypes.find(rarityType => value[0] == RarityType[rarityType][0]);
		}
	}
}