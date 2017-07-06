/// <reference path="Repo.ts"/>
namespace bh {

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
						rarityType = RarityType[<GameRarity>parts.shift().replace(/ /g, "")],
						evoNumber = +parts.shift()[0],
						recipe = recipes[guid] || (recipes[guid] = new Recipe(guid, name, rarityType));
					while (parts.length) {
						recipe.addItem(evoNumber, +parts.shift().trim(), +parts.shift().trim(), cleanMatName(parts.shift().trim()));
					}
				});
				this.data = Object.keys(recipes).map(key => recipes[key]);
				resolvefn(this.data);
			});
		}

		public findByItem(item: InventoryItem | PlayerInventoryItem | string) {
			var name = item && (<InventoryItem | PlayerInventoryItem>item).name || <string>item;
			return this.data.filter(recipe => {
				return recipe.evos.find(evo => {
					return evo.items.find(recipeItem => name == recipeItem.item.name) != null;
				}) != null;
			});
		}

		public findByBattleCard(card: IDataBattleCard | PlayerBattleCard) {
			return this.data.find(r => r.lower == card.lower && r.rarityType === card.rarityType)
				|| console.log(card.name + ": " + card.rarityType);
		}

		public createPartialRecipe(card: PlayerBattleCard) {
			var recipe = this.findByBattleCard(card);
			return recipe && recipe.createPartial(card) || null;
		}
	}
}