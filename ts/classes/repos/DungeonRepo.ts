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
				.sort((a, b) => a.dropRate.averagePerKey < b.dropRate.averagePerKey ? -1 : a.dropRate.averagePerKey == b.dropRate.averagePerKey ? 0 : 1)
				.reverse();
		}
	}
}