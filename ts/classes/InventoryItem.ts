namespace bh {
	export class InventoryItem {
		public element: GameElement;
		public guid: string;
		public name: string;
		public rarity: GameRarity;
		public type: GameItemType;

		public constructor(line: string) {
			var values = line.split(/\t/).map(s => s.trim());
			this.guid = values.shift();
			this.name = values.shift();
			this.type = <any>values.shift();
			this.rarity = <any>values.shift();
			this.element = <any>values.shift();
		}
	}
}