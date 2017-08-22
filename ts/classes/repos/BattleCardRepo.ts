/// <reference path="Repo.ts"/>
namespace bh {
	export class BattleCardRepo extends Repo<IDataBattleCard> {
		constructor() {
			super(1325382981, false);
		}

		public static calculateValue(playerCard: IPlayer.PlayerCard, typeIndex = 0): number {
			var card = data.BattleCardRepo.find(playerCard.configId);
			if (!card) return 0;
			var min = card.minValues[typeIndex][playerCard.evolutionLevel],
				deltaMin = card.minValues[typeIndex].slice().pop(),
				deltaMax = card.maxValues[typeIndex],
				delta = (deltaMax - deltaMin) / (bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1);
			return Math.floor(min + delta * playerCard.level);
		}
		public static getLevelsForRarity(rarityType: RarityType) {
			return [10,20,35,50,50][rarityType];
		}
		public static isMaxLevel(rarity: GameRarity, level: number): boolean {
			return level == BattleCardRepo.getLevelsForRarity(RarityType[<GameRarity>(rarity||"").replace(/ /, "")]);
		}
		public static getXpDeltaFromLevel(level: number) {
			return level ? (level - 1) * 36 + 100 : 0;
		}
		public static getXpForLevel(level: number) {
			var xp = 0;
			for (var i = 1; i < level; i++) xp += BattleCardRepo.getXpDeltaFromLevel(i);
			return xp;
		}
		public static getXpValue(card: IDataBoosterCard) {
			switch (card.rarityType) {
				case RarityType.Common: return 400;
				case RarityType.Uncommon: return 700;
				case RarityType.Rare: return 1200;
				case RarityType.SuperRare: return 0;
				case RarityType.Legendary: return 0;
				default: return 0;
			}
		}
	}
}