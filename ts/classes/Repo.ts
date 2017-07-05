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
			this.id = gid ? <string>idOrGid || null : null;
			this.gid = gid || <number>idOrGid || null;
		}

		private _init: Promise<T[]>;
		public init() {
			if (!this._init) {
				this._init = new Promise<T[]>((resolvefn: (data: T[]) => void) => {
					var tsv = (TSV||{})[String(this.gid)];
					if (tsv) {
						this.resolveTsv(tsv, resolvefn);
					}else if (this.gid) {
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
			var id = gidOrUndefined ? <string>idOrGid : null,
				gid = gidOrUndefined || <number>idOrGid;
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
						if (key == "element") {
							value["elementType"] = ElementType[<GameElement>parts[index]];

						}else if (key == "rarity") {
							value["rarityType"] = RarityType[<GameRarity>parts[index].replace(/ /g, "")];

						}else if (key == "klass") {
							value["klassType"] = KlassType[<GameKlass>parts[index]];

						}else {
							value[key] = key == "brag" ? !!parts[index].match(/\d+(,\d+)*/) //utils.parseBoolean(parts[index])
										: key == "turns" ? +parts[index]
										: parts[index];
							if (key == "name") value["lower"] = parts[index].toLowerCase();
						}
					});
					return <T><any>value;
				})
				.filter(value => value != null);
		}

		private static AllRepos: Repo<any>[] = [];
		// public static init(): Promise<boolean, any> {
		// 	return Promise.all(abilities.init()
		// }
	}
}