/// <reference path="./Cacheable.ts" />

namespace bh {

	export interface IRecipeEvo {
		evoFrom: number;
		evoTo: number;
		items: IRecipeItem[];
	}
	export interface IRecipeItem {
		item: IDataInventoryItem;
		min: number;
		max: number;
	}

	export class Recipe extends Cacheable {

		public evos: IRecipeEvo[] = [];
		public get lower() { return this.card.lower; }
		public get name() { return this.card.name; }
		public get rarityType() { return this.card.rarityType; }

		private addItem(evoFrom: number, min: number, max: number, itemName: string) {
			var evo = this.evos[evoFrom] || (this.evos[evoFrom] = { evoFrom:evoFrom, evoTo:evoFrom+1, items:[] }),
				evoItem = { item:data.ItemRepo.find(itemName), min:min, max:max };
			evo.items.push(evoItem);
		}

		public constructor(public card: IDataBattleCard | PlayerBattleCard) {
			super();
			var matItems = (card.mats||"").split(",")
				.map(mat => data.ItemRepo.find(mat.trim())).filter(item => !!item)
				.sort(utils.sort.byRarity);
			[0,1,2,3,4].slice(0, card.rarityType + 1).forEach(evoFrom => {
				var sands = bh.ItemRepo.sandsOfTime;
				this.addItem(evoFrom, bh.data.getMinSotNeeded(card.rarityType, evoFrom), data.getMaxSotNeeded(card.rarityType, evoFrom), sands.name);
				matItems.forEach(item => {
					this.addItem(evoFrom, 0, bh.data.getMaxMatNeeded(card.rarityType, evoFrom, item.rarityType), item.name);
				});
			});
		}

		public get common(): IDataInventoryItem {
			return this.fromCache("common", () => {
				var recipeItem = this.all.find(item => item.item.rarityType == RarityType.Common);
				return recipeItem && recipeItem.item;
			});
		}
		public get uncommon(): IDataInventoryItem {
			return this.fromCache("uncommon", () => {
				var recipeItem = this.all.find(item => item.item.rarityType == RarityType.Uncommon && item.item.name != "Sands of Time");
				return recipeItem && recipeItem.item;
			});
		}
		public get rare(): IDataInventoryItem {
			return this.fromCache("rare", () => {
				var recipeItem = this.all.find(item => item.item.rarityType == RarityType.Rare);
				return recipeItem && recipeItem.item;
			});
		}
		public get superRare(): IDataInventoryItem {
			return this.fromCache("superRare", () => {
				var recipeItem = this.all.find(item => item.item.rarityType == RarityType.SuperRare);
				return recipeItem && recipeItem.item;
			});
		}
		public get inventoryItems() {
			return [this.common, this.uncommon, this.rare, this.superRare];
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

		public getItem(item: IDataInventoryItem | PlayerInventoryItem) {
			return this.all.find(recipeItem => recipeItem.item.name == item.name);
		}

		public getMaxNeeded(item: IDataInventoryItem | PlayerInventoryItem) {
			var recipeItem = this.getItem(item),
				max = recipeItem && recipeItem.max,
				multiplier = this.card instanceof PlayerBattleCard ? (<PlayerBattleCard>this.card).count : 1;
			return max * multiplier;
		}

		public createPartial(card: PlayerBattleCard) {
			var recipe = new Recipe(card);
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