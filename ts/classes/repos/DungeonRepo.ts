/// <reference path="Repo.ts"/>
namespace bh {
	export class DungeonRepo extends Repo<IDataDungeon> {
		protected parseTsv(tsv: string): IDataDungeon[] {
			this.data = Repo.mapTsv<IDataDungeon>(tsv);
			this.data.forEach(effect => effect.guid = effect.lower.replace(/\W/g, "-"));
			return this.data;
		}
	}
}