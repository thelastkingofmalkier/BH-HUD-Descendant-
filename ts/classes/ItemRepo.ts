/// <reference path="Repo.ts"/>
namespace bh {
	export class ItemRepo extends Repo<IDataInventoryItem> {
		constructor() {
			super(879699541);
		}
		public get evoJars() {
			return this.data.filter(item => item.itemType === ItemType.EvoJar);
		}
		public get crystals() {
			return this.data.filter(item => item.itemType === ItemType.Crystal);
		}
		public get runes() {
			return this.data.filter(item => item.itemType === ItemType.Rune);
		}

		public static getValue(itemType: ItemType, rarityType: RarityType) {
			if (itemType == ItemType.Crystal) return 1000;
			if (itemType == ItemType.Rune) return 2000;
			return [300, 800, 1500, 3000][rarityType];
		}
		public static get sandsOfTime() { return data.ItemRepo.find("Sands of Time"); }
	}
}