namespace bh {
	export enum AbilityType { Trait, Active, Passive }

	export interface HeroAbility { hero: Hero; guid: string; name: string; type: AbilityType; }
	function createHeroAbility(hero: Hero, values: string[]): HeroAbility {
		return { hero: hero, guid: values.shift(), name: values.shift(), type: <any>AbilityType[<any>values.shift()] };
	}

	export class Hero {
		public get abilities() { return [this.trait, this.active, this.passive]; }
		public active: HeroAbility;
		public guid: string;
		public elementType: ElementType;
		public klassType: KlassType;
		public lower: string;
		public name: string;
		public passive: HeroAbility;
		public trait: HeroAbility;

		public constructor(line: string, abilities: string[][]) {
			var values = line.split(/\t/).map(s => s.trim());
			this.guid = values.shift();
			this.name = values.shift();
			this.elementType = <any>ElementType[<any>values.shift()];
			this.klassType = <any>KlassType[<any>values.shift()];
			this.trait = createHeroAbility(this, abilities.shift());
			this.active = createHeroAbility(this, abilities.shift());
			this.passive = createHeroAbility(this, abilities.shift());
			this.lower = this.name.toLowerCase();
		}

		public get allBattleCards(): IDataBattleCard[] {
			return Hero.filterCardsByHero(this, data.cards.battle.getAll());
		}

		public getHitPoints(level: number) {
			return Hero.getHitPoints(this, level);
		}

		public get maxPowerRating() {
			return PowerRating.rateMaxedHero(this);
		}

		public static filterCardsByHero(hero: Hero, cards: IDataBattleCard[]): IDataBattleCard[];
		public static filterCardsByHero(hero: Hero, cards: PlayerBattleCard[]): PlayerBattleCard[];
		public static filterCardsByHero(hero: Hero, cards: (IDataBattleCard | PlayerBattleCard)[]) {
			return cards.filter(card => card.klassType === hero.klassType && (card.elementType == ElementType.Neutral || card.elementType == hero.elementType));
		}
		public static getHitPoints(hero: Hero, level: number): number {
			switch (hero.name) {
				case "Bree": case "Hawkeye": case "Krell":
					return Math.floor(5 * level * level + 2.5 * level + 167.5);
				case "Monty": case "Trix":
					return Math.floor(4.286 * level * level + 2.142 * level + 143.572);
				case "Jinx": case "Logan": case "Red":
					return 4 * level * level + 2 * level + 134;
				case "Fergus":
					return 6 * level * level + 3 * level + 201;
				case "Brom": case "Gilda":
					return Math.floor(5.714 * level * level + 2.858 * level + 191.438);
				case "Peg":
					return Math.floor(4.5 * level * level + 2 * level + 153.5);
				case "Thrudd":
					return Math.floor(38/7 * level * level + 19/7 * level + 190 - 38/7 - 19/7);
				default:
					console.log(hero.name); return 0;
			}
		}
	}
}