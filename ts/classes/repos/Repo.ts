namespace bh {
	export var TSV: { [key: string]: string; };
	export class Repo<T extends IHasGuidAndName> {
		protected data: T[];

		constructor(private id = "", private gid = 0, private cacheable = false) {
			Repo.AllRepos.push(this);
		}

		private _init: Promise<T[]>;
		public init() {
			if (!this._init) {
				this._init = new Promise<T[]>((resolvefn: (data: T[]) => void) => {
					var tsv = (TSV||{})[String(this.gid||this.id)];
					if (!tsv && this.cacheable) {
						try {
							var cache: { tsv:string, date:number } = JSON.parse(utils.getFromStorage(`${this.id}-${this.gid}`) || null);
							if (cache && cache.date && (new Date().getTime() < cache.date + 1000 * 60 * 60 * 24)) {
								tsv = cache.tsv || null;
							}
						}catch(ex) { }
					}
					if (tsv) {
						this.resolveTsv(tsv, resolvefn);
					}else if (typeof(this.gid) == "number") {
						Repo.fetchTsv(this.id, this.gid).then(tsv => this.resolveTsv(tsv, resolvefn), () => this.unresolveTsv());
					}else {
						resolvefn(this.data = []);
					}
				});
			}
			return this._init;
		}
		private resolveTsv(tsv: string, resolvefn: (data: T[]) => void) {
			if (this.cacheable) {
				try {
					utils.setToStorage(`${this.id}-${this.gid}`, JSON.stringify({ tsv:tsv, date:new Date().getTime() }));
				}catch(ex) { }
			}
			var parsed = this.parseTsv(tsv);
			if (parsed instanceof Promise) {
				parsed.then(data => resolvefn(data), () => this.unresolveTsv());
			}else {
				resolvefn(parsed);
			}
		}
		private unresolveTsv() {
			this.data = [];
		}
		protected parseTsv(tsv: string): T[] | Promise<T[]> {
			return this.data = Repo.mapTsv<T>(tsv);
		}

		public get all(): T[] {
			return this.data.slice();
		}
		private sortedByName: T[];
		public get allSortedByName(): T[] {
			if (!this.sortedByName) {
				this.sortedByName = this.all.sort(utils.sort.byName);
			}
			return this.sortedByName;
		}
		public get length(): number {
			return this.data.length;
		}
		public find(value: string): T {
			var lower = value.toLowerCase();
			return this.data.find(t => t.guid == value || t.name == value || t.lower == lower);
		}
		public put(value: T) {
			var index = this.data.findIndex(t => t.guid == value.guid);
			if (-1 < index) {
				this.data[index] = value;
			}else {
				this.data.push(value);
			}
		}

		public static fetchTsv(idOrGid: string|number, gidOrUndefined: number) {
			var id = typeof(gidOrUndefined) == "number" ? <string>idOrGid : null,
				gid = typeof(gidOrUndefined) == "number" ? gidOrUndefined : <number>idOrGid;
			if ((TSV||{})[String(gid)]) { return Promise.resolve(TSV[String(gid)]); }
			return XmlHttpRequest.get(`${host}/tsv.php?gid=${gid}${id?`&id=${id}`:``}`);
		}
		public static mapTsv<T>(raw: string): T[] {
			var lines = raw.split(/\n/),
				keys = lines.shift().split(/\t/).map(s => s.trim());
			return lines
				.filter(line => !!line.trim().length)
				.map(line => {
					var values = line.split(/\t/).map(s => s.trim()),
						object: any = { };
					keys.forEach((key, index) => {
						var value = values[index];
						switch(key) {
							case "elementTypes":
							case "crystalElementTypes":
							case "boosterElementTypes":
								object[key] = value.split(",").filter(s => !!s).map(s => ElementRepo.findType(s));
								break;

							case "element":
							case "elementType":
								object["elementType"] = ElementRepo.findType(value);
								break;

							case "rarity":
							case "rarityType":
								object["rarityType"] = RarityRepo.findType(value);
								break;

							case "klass":
							case "klassType":
								object["klassType"] = KlassRepo.findType(value);
								break;

							case "itemType":
								object["itemType"] = ItemRepo.findType(value);
								break;

							case "abilityType":
								object["abilityType"] = AbilityRepo.findType(value);
								break;

							case "brag":
							case "packs":
								object[key] = utils.parseBoolean(value);
								break;

							case "randomMats":
								object[key] = value.split(",").map(s => +s);
								break;

							case "boosterRarities":
							case "minValues":
								object[key] = value.split("|").map(s => s.split(",").map(s => +s));
								break;

							case "maxValues":
								object[key] = value.split("|").map(s => +s);
								break;

							case "typesTargets":
								object[key] = value.split("|").filter(s => !!s);
								break;

							case "runeHeroes":
							case "effects":
							case "mats":
							case "perks":
								object[key] = value.split(",").filter(s => !!s);
								break;

							case "keys":
							case "fame":
							case "gold":
							case "perkBase":
							case "turns":
								object[key] = +value;
								break;

							case "name":
								object["lower"] = value.toLowerCase();
								object[key] = (value || "").trim();
								break;

							default:
								object[key] = (value || "").trim();
								break;

						}
					});
					return <T>object;
				});
		}

		private static AllRepos: Repo<any>[] = [];
		public static init(): Promise<any>[] {
			return Repo.AllRepos.map(repo => repo.init());
		}
	}
}