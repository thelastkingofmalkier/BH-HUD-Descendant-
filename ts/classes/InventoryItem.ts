namespace bh {
	export class InventoryItem {
		public elementType: ElementType;
		public guid: string;
		public itemType: ItemType;
		public name: string;
		public rarityType: RarityType;

		public constructor(line: string) {
			var values = line.split(/\t/).map(s => s.trim());
			this.guid = values.shift();
			this.name = values.shift();
			this.itemType = ItemType[<GameItemType>values.shift().replace(/ /g, "")];
			this.rarityType = RarityType[<GameRarity>values.shift()];
			this.elementType = ElementType[<GameElement>values.shift()];
		}
	}
}