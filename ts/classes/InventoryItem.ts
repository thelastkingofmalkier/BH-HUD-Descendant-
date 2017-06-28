namespace bh {
	export class InventoryItem {
		public element: "Air" | "Earth" | "Fire" | "Water" | "Spirit" | "Neutral";
		public guid: string;
		public name: string;
		public rarity: "Common" | "Uncommon" | "Rare" | "Super Rare" | "Legendary";
		public type: "Evo Jar" | "Crystal" | "Rune";

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