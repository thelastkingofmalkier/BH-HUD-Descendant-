namespace bh {

	function getAbilityLevel(playerHero: PlayerHero, abilityType: AbilityType) {
		var level = playerHero.archetype.abilityLevels
			? playerHero.archetype.abilityLevels[playerHero.hero.abilities[abilityType].guid]
			: null;
		return isNaN(level) ? 0 : level + 1;
	}

	export class PlayerHero extends Cacheable {

		private getAbilityLevel(abilityType: AbilityType) {
			var level = this.archetype.abilityLevels
				? this.archetype.abilityLevels[this.hero.abilities[abilityType].guid]
				: null;
			return isNaN(level) ? 0 : level + 1;
		}

		public hero: Hero;

		public constructor (public player: Player, public archetype: IPlayer.Hero) {
			super();
			this.hero = data.HeroRepo.find(archetype.id);
		}

		// Passthrough for Hero
		public get abilities(): HeroAbility[] { return this.hero.abilities; }
		public get abilityLevels(): IPlayer.GuidNumberMap { return this.archetype.abilityLevels; }
		public get active(): PlayerHeroAbility { return this.fromCache("active", () => new PlayerHeroAbility(this, this.hero.active, getAbilityLevel(this, AbilityType.Active))); }
		public get guid(): string { return this.hero.guid; }
		public get elementType(): ElementType { return this.hero.elementType; }
		public get klassType(): KlassType { return this.hero.klassType; }
		public get name(): string { return this.hero.name; }
		public get passive(): PlayerHeroAbility { return this.fromCache("passive", () => new PlayerHeroAbility(this, this.hero.passive, getAbilityLevel(this, AbilityType.Passive))); }
		public get trait(): PlayerHeroAbility { return this.fromCache("trait", () => new PlayerHeroAbility(this, this.hero.trait, getAbilityLevel(this, AbilityType.Trait))); }

		// New to PlayerHero
		public get battleCards(): IDataBattleCard[] { return this.fromCache("battleCards", () => Hero.filterCardsByHero(this.hero, this.player.battleCards)); }
		public get completionLevel(): number { return this.level + this.trait.level + this.active.level + this.passive.level; }
		public get deck(): PlayerBattleCard[] { return this.fromCache("deck", () => this.player.sortAndReduceBattleCards(this.archetype.deck)); }
		public get hitPoints(): number { return this.hero.getHitPoints(this.level); }
		public get isCapped(): boolean { return this.active.isCapped && this.passive.isCapped && this.trait.isCapped; }
		public get isLocked(): boolean { return this.archetype.locked; }
		public get isMeat(): boolean { return this.level == HeroRepo.MaxLevel && this.isCapped; }
		public get level(): number { return this.archetype.level + 1; }
		public get playerHeroAbilities() { return [this.trait, this.active, this.passive]; }
		public get playerHeroGuid(): string { return `${this.player.guid}-${this.hero.guid}`; }
		public get powerPercent(): number { return Math.floor(100 * this.powerRating / this.hero.maxPowerRating); }
		public get powerRating(): number { return this.fromCache("powerRating", () => Math.round(PowerRating.ratePlayerHeroHitPoints(this) + this.trait.powerRating + this.active.powerRating + this.passive.powerRating + PowerRating.rateDeck(this.deck))); }

	}
}