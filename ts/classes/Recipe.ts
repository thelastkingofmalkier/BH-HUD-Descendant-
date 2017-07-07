/// <reference path="./Cacheable.ts" />

namespace bh {

	export interface IRecipeEvo {
		evoFrom: number;
		evoTo: number;
		items: IRecipeItem[];
	}
	export interface IRecipeItem {
		item: InventoryItem;
		min: number;
		max: number;
	}

	export class Recipe extends Cacheable {

		public card: IDataBattleCard | PlayerBattleCard;
		public evos: IRecipeEvo[] = [];
		public lower: string;
		public name: string;
		public rarityType: RarityType;

		public constructor(public guid: string, name: string, rarityType: RarityType) {
			super();
			this.card = bh.data.cards.battle.find(guid);
			this.name = this.card && this.card.name || name;
			this.lower = this.name.toLowerCase();
			this.rarityType = rarityType;
			if (!this.card) console.log(`${name} (${RarityType[rarityType][0]})`);
		}

		public addItem(evoFrom: number, min: number, max: number, itemName: string) {
			if (typeof(min) !== "number" || typeof(max) !== "number" || !itemName) { return; }
			var evo = this.evos[evoFrom] || (this.evos[evoFrom] = { evoFrom:evoFrom, evoTo:evoFrom+1, items:[] }),
				evoItem = { item:data.ItemRepo.find(itemName), min:min, max:max };
			evo.items.push(evoItem);
		}

		public get all(): IRecipeItem[] {
			return this.fromCache("recipeItems", () => {
				var items: IRecipeItem[] = [];
				this.evos.forEach(evo => {
					evo.items.forEach(recipeItem => {
						var item = items.find(item => item.item == recipeItem.item);
						if (!item) {
							items.push(item = { item:recipeItem.item, min:0, max:0 });
						}
						item.min += recipeItem.min;
						item.max += recipeItem.max;
					});
				});
				return items;
			});
		}

		public getItem(item: InventoryItem | PlayerInventoryItem) {
			return this.all.find(recipeItem => recipeItem.item.name == item.name);
		}

		public getMaxNeeded(item: InventoryItem | PlayerInventoryItem) {
			var recipeItem = this.getItem(item),
				max = recipeItem && recipeItem.max,
				multiplier = this.card instanceof PlayerBattleCard ? (<PlayerBattleCard>this.card).count : 1;
			return max * multiplier;
		}

		public createPartial(card: PlayerBattleCard) {
			var recipe = new Recipe(this.guid, this.name, this.rarityType);
			recipe.card = card;
			this.evos.slice(card.evo).forEach(evo =>
				evo.items.forEach(item =>
					recipe.addItem(evo.evoFrom, item.min, item.max, item.item.name)
				)
			);
			return recipe;
		}
	}
}