namespace bh {
	export var TSV: { [key: string]: string; };
	export class Repo<T extends IHasGuidAndName> {
		private id: string;
		private gid: number;
		private cacheable: boolean;
		protected data: T[];

		constructor();
		constructor(gid: number);
		constructor(id: string, gid: number);
		constructor(gid: number, cacheable: boolean);
		constructor(id: string, gid: number, cacheable: boolean);
		constructor(idOrGid?: string|number, gidOrCacheable?: number|boolean, cacheable?: boolean) {
			Repo.AllRepos.push(this);
			this.id = typeof(gidOrCacheable) == "number" ? <string>idOrGid : null,
			this.gid = typeof(gidOrCacheable) == "number" ? gidOrCacheable : <number>idOrGid;
			this.cacheable = gidOrCacheable === true || cacheable === true;
		}

		private _init: Promise<T[]>;
		public init() {
			if (!this._init) {
				this._init = new Promise<T[]>((resolvefn: (data: T[]) => void) => {
					var tsv = (TSV||{})[String(this.gid||this.id)];
					if (!tsv && this.cacheable) {
						try {
							var cache: { tsv:string, date:number } = JSON.parse(localStorage.getItem(`${this.id}-${this.gid}`) || null);
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
					localStorage.setItem(`${this.id}-${this.gid}`, JSON.stringify({ tsv:tsv, date:new Date().getTime() }));
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
							case "element":
							case "elementType":
								object["elementType"] = ElementType[<GameElement>value];
								break;

							case "rarity":
							case "rarityType":
								object["rarityType"] = RarityType[<GameRarity>value.replace(/ /g, "")];
								break;

							case "klass":
							case "klassType":
								object["klassType"] = KlassType[<GameKlass>value];
								break;

							case "itemType":
								object["itemType"] = ItemType[<GameItemType>value.replace(/ /g, "")];
								break;

							case "abilityType":
								object["abilityType"] = AbilityType[<GameAbilityType>value];
								break;

							case "brag":
								object["brag"] = utils.parseBoolean(value);
								break;

							case "minValues":
								object[key] = value.split("|").map(s => s.split(",").map(s => +s));
								break;

							case "maxValues":
								object[key] = value.split("|").map(s => +s);
								break;

							case "targets":
							case "types":
								object[key] = value.split("|");
								break;

							case "effects":
							case "mats":
							case "perks":
								object[key] = value.split(",");
								break;

							case "turns":
								object[key] = +value;
								break;

							case "name":
								object["lower"] = value.toLowerCase();
							default:
								object[key] = value;
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