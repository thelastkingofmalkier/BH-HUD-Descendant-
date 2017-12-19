/// <reference path="Repo.ts"/>
namespace bh {
	export class HeroRepo extends Repo<Hero> {
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

		public static toImageSrc(hero: Hero) {
			return getSrc("heroes", hero.name);
		}

		public static getMaxLevel(fame: number) { return fame * 2; }
		public static getMaxTrait(level: number) { return Math.max(level - 1, 0); }
		public static getMaxActive(hero: Hero, level: number) { return hero.name == "Jinx" ? Math.max(level - 29, 0) : Math.max(level - 14, 0); }
		public static getMaxPassive(hero: Hero, level: number) { return hero.name == "Jinx" ? Math.max(level - 14, 0) : Math.max(level - 29, 0); }
		public static getAbilityLevelCap(playerHeroAbility: PlayerHeroAbility) {
			switch (playerHeroAbility.type) {
				case AbilityType.Active: return HeroRepo.getMaxActive(playerHeroAbility.hero, playerHeroAbility.playerHero.level);
				case AbilityType.Passive: return HeroRepo.getMaxPassive(playerHeroAbility.hero, playerHeroAbility.playerHero.level);
				case AbilityType.Trait: return HeroRepo.getMaxTrait(playerHeroAbility.playerHero.level);
			}
		}
		public static getAbilityLevelMax(playerHeroAbility: PlayerHeroAbility) {
			switch (playerHeroAbility.type) {
				case AbilityType.Active: return HeroRepo.getMaxActive(playerHeroAbility.hero, HeroRepo.MaxLevel);
				case AbilityType.Passive: return HeroRepo.getMaxPassive(playerHeroAbility.hero, HeroRepo.MaxLevel);
				case AbilityType.Trait: return HeroRepo.getMaxTrait(HeroRepo.MaxLevel);
			}
		}

		public static get MaxHeroCount() { return MaxHeroCount; }
		public static get MaxFame() { return MaxFameLevel; }
		public static get MaxLevel() { return HeroRepo.getMaxLevel(HeroRepo.MaxFame); }
		public static get MaxCompletionLevel() {
			var maxLevel = HeroRepo.MaxLevel, hero = <any>{ };
			return maxLevel + HeroRepo.getMaxTrait(maxLevel) + HeroRepo.getMaxActive(hero, maxLevel) + HeroRepo.getMaxPassive(hero, maxLevel);
		}

		public static getAbilityMaxLevel(hero: Hero, abilityType: AbilityType) {
			switch(abilityType) {
				case AbilityType.Active: return HeroRepo.getMaxActive(hero, HeroRepo.MaxLevel);
				case AbilityType.Passive: return HeroRepo.getMaxPassive(hero, HeroRepo.MaxLevel);
				case AbilityType.Trait: return HeroRepo.getMaxTrait(HeroRepo.MaxLevel);
			}
		}

		public static getLockedArchetype(playerGuid: string, heroGuid: string): IPlayer.Hero {
			return <any>{
					"playerId": playerGuid,
					"id": heroGuid,
					"experience": 0,
					"level": 0,
					"version": 0,
					"abilityLevels": { },
					"deck": [],
					"locked": true
				};
		}
	}
}