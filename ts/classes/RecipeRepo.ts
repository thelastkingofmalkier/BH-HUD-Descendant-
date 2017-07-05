/// <reference path="Repo.ts"/>
namespace bh {

	export interface IRecipeMaterial {
		material: string;
		min: number;
		max: number;
	}
	export interface IRecipeEvo {
		materials: IRecipeMaterial[];
	}

	function cleanMatName(mat: string) {
		if (mat == "Gunpowder") return "Ore Particles";
		if (mat == "Dehydrated Water") return "Water Vapour";
		if (mat == "Dragons Breath") return "Dragon's Breath";
		if (mat == "Snapweed") return "SnapWeed";
		if (mat.endsWith("Rune")) {
			mat = mat
				.replace("Fire Mage", "Monty's Fire")
				.replace("Fire Berserker", "Fergus' Fire")
				.replace("Fire Rogue", "Red's Fire")
				.replace("Earth Witch", "Trix's Earth")
				.replace("Earth Warrior", "Thrudd's Earth")
				.replace("Earth Elf", "Bree's Earth")
				.replace("Air Paladin", "Brom's Air")
				.replace("Air Ranger", "Hawkeye's Air")
				.replace("Spirit Sorcerer", "Krell's Spirit")
				.replace("Spirit Thief", "Jinx's Spirit")
				.replace("Water Monk", "Logan's Water")
				.replace("Water Valkyrie", "Gilda's Water")
				.replace("Water Pirate", "Peg's Water")
			switch (mat) {
				case "Fire Mage Rune": return "";
			}
		}
		if (!data.ItemRepo.find(mat)) console.warn(mat);
		return mat;
	}

	export class RecipeRepo extends Repo<Recipe> {
		constructor() {
			super("1bL9SkXb7pjw6ucy9BE5JehFWhlGmrJaiaw4xpPb6eQQ", 0);
		}
		protected parseTsv(tsv: string) {
			return new Promise<Recipe[]>((resolvefn: (recipes: Recipe[]) => void) => {
				var recipes: { [key: string]: Recipe; } = { };
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
						recipe = recipes[guid] || (recipes[guid] = new Recipe(guid, name, RarityType[<GameRarity>rarity])),
						mat: IRecipeMaterial;
					while (parts.length) {
						mat = { min:+parts.shift(), max:+parts.shift(), material:cleanMatName(parts.shift()) };
						recipe.addMat(evoNumber, mat);
						// if (!AllMats.includes(mat.material)) AllMats.push(mat.material);
					}
				});
				this.data = Object.keys(recipes).map(key => recipes[key]);
				resolvefn(this.data);
			});
		}

		public findByMaterial(value: string) {
			return this.data.filter(recipe => {
				return recipe.evos.find(evo => {
					return evo.materials.find(mat => value == mat.material) != null;
				}) != null;
			});
		}

		public findByBattleCard(card: IDataBattleCard | PlayerBattleCard) {
			return this.data.find(r => r.name == card.name && r.rarityType === card.rarityType);
		}
	}
	export class Recipe {
		public evos: IRecipeEvo[] = [];
		public lower: string;
		public constructor(public guid: string, public name: string, public rarityType: RarityType) {
			this.lower = name.toLowerCase();
		}
		public addMat(evoNumber: number, mat: IRecipeMaterial) {
			if (typeof(mat.min) !== "number" || typeof(mat.max) !== "number" || !mat.material) return;
			var evo = this.evos[evoNumber] || (this.evos[evoNumber] = { materials:[] });
			evo.materials.push(mat);
		}
		public get items() {
			var items: IRecipeItem[] = [];
			this.evos.forEach(evo => {
				evo.materials.forEach(mat => {
					var item = items.find(item => item.item.name == mat.material);
					if (!item) {
						items.push(item = { item:data.ItemRepo.find(mat.material), min:0, max:0 });
					}
					item.min += mat.min;
					item.max += mat.max;
				});
			});
			return items;
		}
		public getItemByName(name: string) {
			return this.items.find(item => item.item.name == name);
		}
	}
	export interface IRecipeItem { item: InventoryItem; min: number; max: number; }
}