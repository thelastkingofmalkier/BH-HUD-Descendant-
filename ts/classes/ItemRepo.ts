/// <reference path="Repo.ts"/>
namespace bh {
	export class ItemRepo extends Repo<InventoryItem> {
		constructor() {
			super(879699541);
		}
		protected parseTsv(tsv: string) {
			return new Promise<InventoryItem[]>((resolvefn: (items: InventoryItem[]) => void) => {
				this.data = tsv.trim().split(/\n/).slice(1).map(line => new InventoryItem(line));
				resolvefn(this.data);
			});
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
	}
}