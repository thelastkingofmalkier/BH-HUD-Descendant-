namespace bh {
	export namespace data {
		export function wildsForEvo(rarityType: RarityType, currentEvoLevel: number) {
			return [[1], [1,2], [1,2,4], [1,2,4,5], [1,2,3,4,5]][rarityType][currentEvoLevel];
		}
		export function getMinGoldNeeded(rarityType: RarityType, currentEvoLevel: number): number {
			return [[1000], [5300,15300], [8200,27200,65000], [33000,60000,94000,187000], [61000,114000,21200,408000]][rarityType][currentEvoLevel];
			/*
				C1:  base (1k) + sot_count * u_value (800) + c_count * c_value (300) >> 1000 - 12600
			*/
		}
		export function getMinSotNeeded(rarityType: RarityType, currentEvoLevel: number): number {
			return [[0], [2,5], [5,10,20], [10,20,30,40], [20,30,40,60,60]][rarityType][currentEvoLevel];
			// return [0, 2, 5, 10, 20, 30, 40, 60, 60].slice(rarityType, rarityType + 1)[currentEvoLevel];
		}
		export function getMinCrystalsNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return rarityType == RarityType.Legendary && currentEvoLevel == 4 ? 30 : 0;
		}
		export function getMinRunesNeeded(rarityType: RarityType, currentEvoLevel: number) {
			return rarityType == RarityType.Legendary && currentEvoLevel == 4 ? 30 : 0;
		}
		export function getNextWildCardsNeeded(playerCard: PlayerBattleCard) {
			return wildsForEvo(playerCard.rarityType, playerCard.evo);
		}
		export function getMaxWildCardsNeeded(playerCard: PlayerBattleCard) {
			var max = cards.battle.getMaxEvo(playerCard.rarityType),
				needed = 0;
			for (var evo = playerCard.evo; evo < max; evo++) {
				needed += wildsForEvo(playerCard.rarityType, evo);
			}
			return needed;
		}
		export function getMaxGoldNeeded(rarityType: RarityType, currentEvoLevel: number): number;
		export function getMaxGoldNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxGoldNeeded(playerCardOrRarityType: IPlayer.PlayerCard | RarityType, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarityType).configId),
					rarityType = card ? card.rarityType : <RarityType>playerCardOrRarityType,
					evoCap = bh.data.cards.battle.getMaxEvo(rarityType);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxGoldNeeded(rarityType, i);
				}
				return sotNeeded;
			}else {
				return [[12600], [18500,34700], [22000,57000,114200], [56600,114000,170800,289800], [115000,190800,32400,545800,800000]][<RarityType>playerCardOrRarityType][evoInfo];
			}
		}
		export function getMaxSotNeeded(rarityType: RarityType, currentEvoLevel: number): number;
		export function getMaxSotNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxSotNeeded(playerCardOrRarityType: IPlayer.PlayerCard | RarityType, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarityType).configId),
					rarityType = card ? card.rarityType : <RarityType>playerCardOrRarityType,
					evoCap = bh.data.cards.battle.getMaxEvo(rarityType);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxSotNeeded(rarityType, i);
				}
				return sotNeeded;
			}else {
				return [[10], [12,15], [15,20,30], [20,30,40,60], [30,40,60,80,100]][<RarityType>playerCardOrRarityType][evoInfo];
				// return [10, 12, 15, 20, 30, 40, 60, 80, 100].slice(<RarityType>playerCardOrRarityType, <RarityType>playerCardOrRarityType + 1)[evoInfo];
			}
		}
		export function getMaxCrystalsNeeded(rarityType: RarityType, currentEvoLevel: number): number;
		export function getMaxCrystalsNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxCrystalsNeeded(playerCardOrRarityType: IPlayer.PlayerCard | RarityType, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarityType).configId),
					rarityType = card ? card.rarityType : <RarityType>playerCardOrRarityType,
					evoCap = bh.data.cards.battle.getMaxEvo(rarityType);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxCrystalsNeeded(rarityType, i);
				}
				return sotNeeded;
			}else {
				return playerCardOrRarityType == RarityType.Legendary && evoInfo == 4 ? 60 : 0;
			}
		}
		export function getMaxRunesNeeded(rarityType: RarityType, currentEvoLevel: number): number;
		export function getMaxRunesNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxRunesNeeded(playerCardOrRarityType: IPlayer.PlayerCard | RarityType, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarityType).configId),
					rarityType = card ? card.rarityType : <RarityType>playerCardOrRarityType,
					evoCap = bh.data.cards.battle.getMaxEvo(rarityType);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxCrystalsNeeded(rarityType, i);
				}
				return sotNeeded;
			}else {
				return playerCardOrRarityType == RarityType.Legendary && evoInfo == 4 ? 60 : 0;
			}
		}
	}
}
