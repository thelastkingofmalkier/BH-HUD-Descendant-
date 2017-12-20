namespace bh {
	export class Dungeon extends Cacheable {
		public constructor(public data: IDataDungeon) { super(); }

		public get act() { return this.data.act; }
		public get boosterElementTypes() { return this.data.boosterElementTypes; }
		public get boosterRarities() { return this.data.boosterRarities; }
		public get crystals(): IDropRate[] { return this.fromCache("crystals", () => { return this.data.crystals.map(toDropRate); }); }
		public get dungeon() { return this.data.dungeon; }
		public get difficulty() { return this.data.difficulty; }
		public get elementTypes() { return this.data.elementTypes; }
		public get fame() { return this.data.fame; }
		public get guid() { return this.data.guid; }
		public get gold() { return this.data.gold; }
		public get keys() { return this.data.keys; }
		public get lower() { return this.data.lower; }
		public get mats(): IDropRate[] { return this.fromCache("mats", () => { return this.data.mats.map(toDropRate); }); }
		public get name() { return this.data.name; }
		public get randomMats() { return this.data.randomMats; }
		public get runes(): IDropRate[] { return this.fromCache("runes", () => { return this.data.runes.map(toDropRate); }); }

		public findDrop(value: string): IDungeonDropRate {
			var drop = this.crystals.find(dr => dr.name == value.split(" ")[0])
				|| this.runes.find(dr => dr.name == value.split("'")[0])
				|| this.mats.find(dr => dr.name == value);
			return drop && { dungeon:this, dropRate:drop } || null;
		}
	}
	export interface IDungeonDropRate {
		dungeon: Dungeon;
		dropRate: IDropRate;
	}
	export interface IDropRate {
		name: string;
		percent: string;
		percentMultiplier: number;
		min: number;
		max: number;
		averagePerKey: number;
	}
	function toDropRate(value: string): IDropRate {
		var parts = value.split("|"),
			percentMultiplier = +parts[1].match(/(\d+)/)[1] / 100,
			minMax = parts[2].split("-"),
			min = +minMax[0],
			max = +minMax[1] || min,
			averagePerKey = (min + max) / 2 * percentMultiplier;
		return { name:parts[0], percent:parts[1], percentMultiplier:percentMultiplier, min:min, max:max, averagePerKey:averagePerKey };
	}
}