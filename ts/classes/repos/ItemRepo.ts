/// <reference path="Repo.ts"/>
namespace bh {
	export class ItemRepo extends Repo<IDataInventoryItem> {
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
		public static get sandsOfTime() {
			return data.ItemRepo.find("Sands of Time");
		}
		public static toImage(item: IDataInventoryItem, fn = getImg20) {
			var folder = ItemType[item.itemType].toLowerCase() + "s",
				name = item.itemType == ItemType.EvoJar ? item.name.replace(/\W/g, "")
					: item.itemType == ItemType.Crystal ? item.name.split(/ /)[0]
					: data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name.replace(/\W/g, "");
			return fn(folder, name);
		}
		public static toImageSrc(item: IDataInventoryItem) {
			var folder = ItemType[item.itemType].toLowerCase() + "s",
				name = item.itemType == ItemType.EvoJar ? item.name.replace(/\W/g, "")
					: item.itemType == ItemType.Crystal ? item.name.split(/ /)[0]
					: data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name.replace(/\W/g, "");
			return getSrc(folder, name);
		}
		public static get allTypes(): ItemType[] {
			return [0, 1, 2];
		}
		public static findType(value: string): ItemType {
			return this.allTypes.find(itemType => value[0] == ItemType[itemType][0]);
		}
	}
}