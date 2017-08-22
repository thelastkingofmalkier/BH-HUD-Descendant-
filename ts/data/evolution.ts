namespace bh {
	export namespace data {

		export function getMaxEvo(rarityType: RarityType): number {
			return rarityType + 1;
		}
		export function evoMultiplier(fromEvo: number) {
			return [0.80, 0.85, 0.88, 0.90, 1.0][fromEvo];
		}

		export function wildsForEvo(rarityType: RarityType, currentEvoLevel: number) {
			return [[1], [1,2], [1,2,4], [1,2,4,5], [1,2,3,4,5]][rarityType || 0][currentEvoLevel || 0];
		}
		export function getNextWildCardsNeeded(playerCard: PlayerBattleCard) {
			return wildsForEvo(playerCard.rarityType, playerCard.evo);
		}
		export function getMaxWildCardsNeeded(playerCard: PlayerBattleCard) {
			var max = getMaxEvo(playerCard.rarityType),
				needed = 0;
			for (var evo = playerCard.evo; evo < max; evo++) {
				needed += wildsForEvo(playerCard.rarityType, evo);
			}
			return needed;
		}

		export function getBaseGoldNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return [[1000], [3700,11300], [4200,19200,49000], [25000,44000,70000,155000], [45000,90000,180000,360000,540000]][rarityType][currentEvoLevel];
		}
		export function getMinGoldNeeded(rarityType: RarityType, currentEvoLevel: number) {
			var sands = bh.ItemRepo.sandsOfTime;
			return getBaseGoldNeeded(rarityType, currentEvoLevel) + getMinSotNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(sands.itemType, sands.rarityType);
		}
		export function getMaxGoldNeeded(rarityType: RarityType, currentEvoLevel: number) {
			var base = getBaseGoldNeeded(rarityType, currentEvoLevel),
				sands = bh.ItemRepo.sandsOfTime,
				sotCosts = getMaxSotNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(sands.itemType, sands.rarityType),
				matCounts = [0,1,2,3].map(matRarityType => getMaxMatNeeded(rarityType, currentEvoLevel, matRarityType)),
				matCosts = matCounts.map((count, rarityType) => count * bh.ItemRepo.getValue(ItemType.EvoJar, rarityType)),
				matCostsSum = matCosts.reduce((sum, cost) => sum + cost, 0),
				runeCosts = getMaxRunesNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(ItemType.Rune, RarityType.Rare),
				crystalCosts = getMaxCrystalsNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(ItemType.Crystal, RarityType.Uncommon);
			return base + sotCosts + matCostsSum + runeCosts + crystalCosts;
		}
		export function calcMaxGoldNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number {
			var needed = 0,
				rarityType = (BattleCardRepo.find(playerCard.configId) || <IDataBattleCard><any>{}).rarityType || 0,
				evoCap = getMaxEvo(rarityType);
			for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
				needed += getMaxGoldNeeded(rarityType, i);
			}
			return needed;
		}

		export function getMinSotNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return [[0], [2,5], [5,10,20], [10,20,30,40], [20,30,40,60,60]][rarityType || 0][currentEvoLevel || 0];
		}
		export function getMaxSotNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return [[10], [12,15], [15,20,30], [20,30,40,60], [30,40,60,80,100]][rarityType || 0][currentEvoLevel || 0];
		}
		export function calcMaxSotNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number {
			var needed = 0,
				rarityType = (BattleCardRepo.find(playerCard.configId) || <IDataBattleCard><any>{}).rarityType || 0,
				evoCap = getMaxEvo(rarityType);
			for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
				needed += getMaxSotNeeded(rarityType, i);
			}
			return needed;
		}

		export function getMaxMatNeeded(cardRarityType: RarityType, currentEvoLevel: number, matRarityType: RarityType) {
			return ([
				[[12]],
				[[12,2], [12,6,2]],
				[[14,2], [26,10,4], [,14,8,6]],
				[[26,6,2], [40,20,12], [,26,16,8], [,26,20,12]],
				[[40,20,12], [,26,16,8], [,30,24,12], [,36,30,16]]
			][cardRarityType][currentEvoLevel]||[])[matRarityType]||0;
		}

		export function getMinCrystalsNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return rarityType == RarityType.Legendary && currentEvoLevel == 4 ? 30 : 0;
		}
		export function getMaxCrystalsNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return rarityType == RarityType.Legendary && currentEvoLevel == 4 ? 60 : 0;
		}
		export function calcMaxCrystalsNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number {
			var needed = 0,
				rarityType = (BattleCardRepo.find(playerCard.configId) || <IDataBattleCard><any>{}).rarityType || 0,
				evoCap = getMaxEvo(rarityType);
			for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
				needed += data.getMaxCrystalsNeeded(rarityType, i);
			}
			return needed;
		}

		export function getMinRunesNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return rarityType == RarityType.Legendary && currentEvoLevel == 4 ? 30 : 0;
		}
		export function getMaxRunesNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return rarityType == RarityType.Legendary && currentEvoLevel == 4 ? 60 : 0;
		}
		export function calcMaxRunesNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number {
			var needed = 0,
				rarityType = (BattleCardRepo.find(playerCard.configId) || <IDataBattleCard><any>{}).rarityType || 0,
				evoCap = getMaxEvo(rarityType);
			for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
				needed += data.getMaxRunesNeeded(rarityType, i);
			}
			return needed;
		}
	}
}
