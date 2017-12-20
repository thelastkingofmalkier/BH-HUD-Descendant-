/// <reference path="Repo.ts"/>
namespace bh {
	export class DungeonRepo extends Repo<Dungeon> {
		protected parseTsv(tsv: string): Dungeon[] {
			var data = Repo.mapTsv<IDataDungeon>(tsv);
			data.forEach(dungeon => {
				dungeon.guid = dungeon.lower.replace(/\W/g, "-");
				if (!Array.isArray(dungeon.crystals)) {
					dungeon.crystals = String(dungeon.crystals).split(",").filter(c => !!c);
				}
				if (!Array.isArray(dungeon.mats)) {
					dungeon.mats = String(dungeon.mats).split(",").filter(m => !!m);
				}
				if (!Array.isArray(dungeon.runes)) {
					dungeon.runes = String(dungeon.runes).split(",").filter(r => !!r);
				}
			});
			return this.data = data.map(d => new Dungeon(d));
		}
		public findDungeonFor(value: string): Dungeon[] {
			return this.all.filter(dungeon => !!dungeon.findDrop(value));
		}
		public getDropRates(value: string): IDungeonDropRate[] {
			return this.all
				.map(dungeon => dungeon.findDrop(value))
				.filter(drop => !!drop)
				.sort(sortDropRates)
				.reverse();
		}
	}
	function sortDropRates(a: IDungeonDropRate, b: IDungeonDropRate): number {
		var aPerKey = a.dropRate.averagePerKey,
			bPerKey = b.dropRate.averagePerKey;
		if (aPerKey != bPerKey) return aPerKey < bPerKey ? -1 : 1;
		var aKeys = a.dungeon.keys,
			bKeys = b.dungeon.keys;
		if (aKeys != bKeys) return aKeys < bKeys ? 1 : -1;
		var aDiff = a.dungeon.difficulty == "Normal" ? 0 : a.dungeon.difficulty == "Elite" ? 1 : 2,
			bDiff = b.dungeon.difficulty == "Normal" ? 0 : b.dungeon.difficulty == "Elite" ? 1 : 2;
		if (aDiff != bDiff) return aDiff < bDiff ? 1 : -1;
		return 0;
	}
}