namespace bh {
	export var TSV: { [key: string]: string; };
	export class Repo<T extends IHasGuidAndName> {
		private id: string;
		private gid: number;
		protected data: T[];

		constructor();
		constructor(gid: number);
		constructor(id: string, gid: number)
		constructor(idOrGid?: string|number, gid?: number) {
			Repo.AllRepos.push(this);
			this.id = typeof(gid) == "number" ? <string>idOrGid : null,
			this.gid = typeof(gid) == "number" ? gid : <number>idOrGid;
		}

		private _init: Promise<T[]>;
		public init() {
			if (!this._init) {
				this._init = new Promise<T[]>((resolvefn: (data: T[]) => void) => {
					var tsv = (TSV||{})[String(this.gid||this.id)];
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
				.map(line => {
					if (!line.trim().length) { return null; }
					var parts = line.split(/\t/).map(s => s.trim()),
						value: { [key: string]: string | boolean | number; } = { };
					keys.forEach((key, index) => {
						switch(key) {
							case "element":
							case "elementType":
								value["elementType"] = ElementType[<GameElement>parts[index]];
								break;

							case "rarity":
							case "rarityType":
								value["rarityType"] = RarityType[<GameRarity>parts[index].replace(/ /g, "")];
								break;

							case "klass":
							case "klassType":
								value["klassType"] = KlassType[<GameKlass>parts[index]];
								break;

							case "itemType":
								value["itemType"] = ItemType[<GameItemType>parts[index].replace(/ /g, "")];
								break;

							case "abilityType":
								value["abilityType"] = AbilityType[<GameAbilityType>parts[index]];
								break;

							case "brag":
								value["brag"] = !!parts[index].match(/\d+(,\d+)*/);
								break;

							case "turns":
								value["turns"] = +parts[index];
								break;

							case "name":
								value["lower"] = parts[index].toLowerCase();
							default:
								value[key] = parts[index];
								break;

						}
					});
					return <T><any>value;
				})
				.filter(value => value != null);
		}

		private static AllRepos: Repo<any>[] = [];
		public static init(): Promise<any>[] {
			return Repo.AllRepos.map(repo => repo.init());
		}
	}
}