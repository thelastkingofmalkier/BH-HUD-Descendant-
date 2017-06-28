/// <reference path="Repo.ts"/>
namespace bh {
	export class HeroRepo extends Repo<Hero> {
		constructor() {
			super(742427723);
		}
		protected parseTsv(heroTsv: string) {
			return new Promise<Hero[]>((resolvefn: (heroes: Hero[]) => void) => {
				Repo.fetchTsv(null, 73325800).then((heroAbilitiesTsv: string) => {
					var parsedAbilities = heroAbilitiesTsv.trim().split(/\n/).slice(1).map(line => line.split(/\t/).map(s => s.trim()));
					this.data = heroTsv.trim().split(/\n/).slice(1).map(line => new Hero(line, parsedAbilities.filter(abil => line.startsWith(abil[3]))));
					resolvefn(this.data);
				}, () => resolvefn(this.data = []));
			});
		}

		public filterByElement(elementType: ElementType): Hero[];
		public filterByElement(element: "Air" | "Earth" | "Fire" | "Water" | "Spirit" | "Neutral"): Hero[];
		public filterByElement(elementOrElementType: any) {
			return this.data.filter(hero => hero.elementType === elementOrElementType || ElementType[hero.elementType] === elementOrElementType);
		}

		private _sorted: Hero[];
		public get sorted() {
			if (!this._sorted) {
				this._sorted = this.data.slice().sort(utils.sort.byElementThenKlass);
			}
			return this._sorted;
		}
		public sortBy(sort?: (a: Hero, b: Hero) => number) {
			if (!sort) { return this.sorted; }
			return this.data.slice().sort(sort);
		}
	}
}