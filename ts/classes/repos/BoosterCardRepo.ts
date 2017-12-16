/// <reference path="Repo.ts"/>
namespace bh {
	export class BoosterCardRepo extends Repo<IDataBoosterCard> {
		public static getXpValue(card: IDataBoosterCard, match = false) {
			var multiplier = match ? 1.5 : 1;
			switch (card.rarityType) {
				case RarityType.Common: return 120 * multiplier;
				case RarityType.Uncommon: return 220 * multiplier;
				case RarityType.Rare: return 350 * multiplier;
				case RarityType.SuperRare: return 700 * multiplier;
				default: return 0;
			}
		}
	}
}