/// <reference path="Repo.ts"/>
namespace bh {
	export class DungeonRepo extends Repo<IDataDungeon> {
		constructor() {
			super(1980099142);
		}
		protected parseTsv(tsv: string): IDataDungeon[] {
			this.data = Repo.mapTsv<IDataDungeon>(tsv);
			this.data.forEach(effect => effect.guid = effect.lower.replace(/\W/g, "-"));
			return this.data;
		}
	}
}