namespace bh {
	export namespace data {
		interface IRecipeMaterial {
			material: string;
			min: number;
			max: number;
		}
		interface IRecipeEvo {
			materials: IRecipeMaterial[];
		}
		interface IRecipe {
			guid: string;
			name: string;
			rarity: string;
			evos: IRecipeEvo[];
		}
		export var Recipes: { [key: string]: IRecipe; } = { };
		export var AllMats: string[] = [];
		export function updateRecipes() {
			bh.$().get("https://docs.google.com/spreadsheets/d/1bL9SkXb7pjw6ucy9BE5JehFWhlGmrJaiaw4xpPb6eQQ/pub?output=tsv").then((tsv: string) => {
				var lastLine: string;
				var parsed = tsv.split(/\n/).slice(1).map(line => {
					if (lastLine == line) return;
					lastLine = line;
					var parts = line.trim().split(/\t/),
						guid = parts.shift(),
						name = parts.shift(),
						rarity = parts.shift(),
						evo = parts.shift(),
						evoNumber = +evo[0],
						recipe = Recipes[guid] || (Recipes[guid] = { guid:guid, name:name, rarity:rarity, evos:[] }),
						evos = recipe.evos[evoNumber] || (recipe.evos[evoNumber] = { materials:[] }),
						mat: IRecipeMaterial;
					while (parts.length) {
						mat = { min:+parts.shift(), max:+parts.shift(), material:cleanMatName(parts.shift()) };
						if (!AllMats.includes(mat.material)) AllMats.push(mat.material);
					}
				});
				console.log("Done");
			});
			function cleanMatName(mat: string) {
				if (mat == "Gunpowder") return "Ore Particles";
				if (mat == "Dehydrated Water") return "Water Vapour";
				if (mat == "Dragons Breath") return "Dragon's Breath";
				if (mat == "Snapweed") return "SnapWeed";
				return mat;
			}
		}
		export function listEvoRecipes(rarity: string) {
			var battleCards=cards.battle.getAll().filter(c=>c.rarity==rarity).sort(utils.sort.byName),
				lines=battleCards.map(c=>`${c.name}\t${c.klass}\t${ElementType[c.elementType]}\t${c.rarity}\t${Recipes[c.guid].evos[0].materials[0]&&Recipes[c.guid].evos[0].materials[0].material||""}`);
				console.log(Recipes[battleCards[1].guid])
			$("textarea").val(lines.join("\n"))
		}
		export function wildsForEvo(rarity: string, currentEvoLevel: number) {
			switch (rarity) {
				case "Common":     return [1][currentEvoLevel];
				case "Uncommon":   return [1,2][currentEvoLevel];
				case "Rare":       return [1,2,4][currentEvoLevel];
				case "Super Rare": return [1,2,4,5][currentEvoLevel];
				case "Legendary":  return [1,2,3,4,5][currentEvoLevel];
			}
		}
		export function getMinGoldNeeded(rarity: string, currentEvoLevel: number): number {
			/*
				C1:  base (1k) + sot_count * u_value (800) + c_count * c_value (300) >> 1000 - 12600
			*/
			switch (rarity) {
				case "Common":     return [1000][currentEvoLevel];
				case "Uncommon":   return [5300,15300][currentEvoLevel];
				case "Rare":       return [8200,27200,65000][currentEvoLevel];
				case "Super Rare": return [33000,60000,94000,187000][currentEvoLevel];
				case "Legendary":  return [-1,114000][currentEvoLevel];
			}
		}
		export function getMinSotNeeded(rarity: string, currentEvoLevel: number): number {
			switch (rarity) {
				case "Common":     return [0][currentEvoLevel];
				case "Uncommon":   return [2,5][currentEvoLevel];
				case "Rare":       return [5,10,20][currentEvoLevel];
				case "Super Rare": return [10,20,30,40][currentEvoLevel];
				case "Legendary":  return [20,30,40,60,60][currentEvoLevel];
			}
		}
		export function getMinCrystalsNeeded(rarity: string, currentEvoLevel: number) {
			return rarity == "Legendary" && currentEvoLevel == 4 ? 30 : 0;
		}
		export function getMinRunesNeeded(rarity: string, currentEvoLevel: number) {
			return rarity == "Legendary" && currentEvoLevel == 4 ? 30 : 0;
		}
		export function getNextWildCardsNeeded(playerCard: PlayerBattleCard) {
			return wildsForEvo(playerCard.rarity, playerCard.evo);
		}
		export function getMaxWildCardsNeeded(playerCard: PlayerBattleCard) {
			var rarity = playerCard.rarity,
				max = cards.battle.getMaxEvo(rarity),
				needed = 0;
			for (var evo = playerCard.evo; evo < max; evo++) {
				needed += wildsForEvo(rarity, evo);
			}
			return needed;
		}
		export function getMaxGoldNeeded(rarity: string, currentEvoLevel: number): number;
		export function getMaxGoldNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxGoldNeeded(playerCardOrRarity: IPlayer.PlayerCard | string, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarity).configId),
					rarity = card && card.rarity || String(playerCardOrRarity),
					evoCap = bh.data.cards.battle.getMaxEvo(<any>rarity);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxGoldNeeded(rarity, i);
				}
				return sotNeeded;
			}else {
				var currentEvoLevel = evoInfo;
				switch (<string>playerCardOrRarity) {
					case "Common":     return [12600][currentEvoLevel];
					case "Uncommon":   return [18500,34700][currentEvoLevel];
					case "Rare":       return [22000,57000,114200][currentEvoLevel];
					case "Super Rare": return [56600,114000,170800,289800][currentEvoLevel];
					case "Legendary":  return [-1,190800][currentEvoLevel];
				}
			}
		}
		export function getMaxSotNeeded(rarity: string, currentEvoLevel: number): number;
		export function getMaxSotNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxSotNeeded(playerCardOrRarity: IPlayer.PlayerCard | string, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarity).configId),
					rarity = card && card.rarity || String(playerCardOrRarity),
					evoCap = bh.data.cards.battle.getMaxEvo(<any>rarity);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxSotNeeded(rarity, i);
				}
				return sotNeeded;
			}else {
				var currentEvoLevel = evoInfo;
				switch (<string>playerCardOrRarity) {
					case "Common":     return [10][currentEvoLevel];
					case "Uncommon":   return [12,15][currentEvoLevel];
					case "Rare":       return [15,20,30][currentEvoLevel];
					case "Super Rare": return [20,30,40,60][currentEvoLevel];
					case "Legendary":  return [30,40,60,80,100][currentEvoLevel];
				}
			}
		}
		export function getMaxCrystalsNeeded(rarity: string, currentEvoLevel: number): number;
		export function getMaxCrystalsNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxCrystalsNeeded(playerCardOrRarity: IPlayer.PlayerCard | string, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarity).configId),
					rarity = card && card.rarity || <string>playerCardOrRarity,
					evoCap = bh.data.cards.battle.getMaxEvo(<any>rarity);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxCrystalsNeeded(rarity, i);
				}
				return sotNeeded;
			}else {
				return playerCardOrRarity == "Legendary" && evoInfo == 4 ? 60 : 0;
			}
		}
		export function getMaxRunesNeeded(rarity: string, currentEvoLevel: number): number;
		export function getMaxRunesNeeded(playerCard: IPlayer.PlayerCard, evoAndLevel: string): number;
		export function getMaxRunesNeeded(playerCardOrRarity: IPlayer.PlayerCard | string, evoInfo: number | string): number {
			if (typeof evoInfo == "string") {
				var sotNeeded = 0,
					evoParts = evoInfo.split(/\./),
					evo = +evoParts[0],
					level = +evoParts[1],
					card = cards.battle.find((<IPlayer.PlayerCard>playerCardOrRarity).configId),
					rarity = card && card.rarity || <string>playerCardOrRarity,
					evoCap = bh.data.cards.battle.getMaxEvo(<any>rarity);
				for (var i = evo; i < evoCap; i++) {
					sotNeeded += data.getMaxCrystalsNeeded(rarity, i);
				}
				return sotNeeded;
			}else {
				return playerCardOrRarity == "Legendary" && evoInfo == 4 ? 60 : 0;
			}
		}
	}
}
