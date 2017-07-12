/// <reference path="Repo.ts"/>
namespace bh {
	export class HeroRepo extends Repo<Hero> {
		constructor() {
			super(411895816, true);
		}
		protected parseTsv(tsv: string) {
			return new Promise<Hero[]>((resolvefn: (heroes: Hero[]) => void) => {
				var mapped = Repo.mapTsv<IDataHeroAbility>(tsv),
					heroes: Hero[] = [];
				while (mapped.length) {
					heroes.push(new Hero([mapped.shift(), mapped.shift(), mapped.shift()]));
				}
				resolvefn(this.data = heroes);
			});
		}

		public filterByElement(elementType: ElementType): Hero[];
		public filterByElement(element: GameElement): Hero[];
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