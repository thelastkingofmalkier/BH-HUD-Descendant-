namespace bh {
	export class PlayerHero {
		public hero: Hero;

		public constructor (public player: Player, public archetype: IPlayer.Hero) {
			this.hero = data.HeroRepo.find(archetype.id);
		}

		// Passthrough for Hero
		public get abilities() { return this.hero.abilities; }
		public get abilityLevels() { return this.archetype.abilityLevels; }
		public get active() { return new PlayerHeroAbility(this, this.hero.active, this.activeLevel); }
		public get guid() { return this.hero.guid; }
		public get elementType() { return this.hero.elementType; }
		public get klassType() { return this.hero.klassType; }
		public get name() { return this.hero.name; }
		public get passive() { return new PlayerHeroAbility(this, this.hero.passive, this.passiveLevel); }
		public get trait() { return new PlayerHeroAbility(this, this.hero.trait, this.traitLevel); }

		private getAbilityLevel(abilityType: AbilityType) {
			var level = this.archetype.abilityLevels ? this.archetype.abilityLevels[this.hero.abilities[abilityType].guid] : null; return isNaN(level) ? 0 : level + 1;
		}

		// New to PlayerHero
		public get activeLevel() { return this.getAbilityLevel(AbilityType.Active); }
		public get activePowerRating() { return this.active.powerRating; }
		public get battleCards() { return Hero.filterCardsByHero(this.hero, this.player.battleCards); }
		public get deck() { return this.player.sortAndReduceBattleCards(this.archetype.deck); }
		public get deckPowerRating() { return this.deck.reduce((score, pbc) => score + PowerRating.ratePlayerCard(pbc.playerCard) * pbc.count, 0); }
		public get hitPoints() { return this.hero.getHitPoints(this.level); }
		public get hitPointsPowerRating() { return PowerRating.ratePlayerHeroHitPoints(this); }
		public get isActiveCapped() { return this.activeLevel == getMaxActive(this.hero, this.level); }
		public get isCapped() { return this.isActiveCapped && this.isPassiveCapped && this.isTraitCapped; }
		public get isMeat() { return this.level == MaxLevel && this.isCapped; }
		public get isPassiveCapped() { return this.passiveLevel == getMaxPassive(this.hero, this.level); }
		public get isTraitCapped() { return this.traitLevel == getMaxTrait(this.level); }
		public get level() { return this.archetype.level + 1; }
		public get opCards() { return this.deck.filter(pbc => pbc.tier == "OP"); }
		public get passiveLevel() { return this.getAbilityLevel(AbilityType.Passive); }
		public get passivePowerRating() { return this.passive.powerRating; }
		public get playerHeroAbilities() { return [this.trait, this.active, this.passive]; }
		public get playerHeroGuid() { return `${this.player.guid}-${this.hero.guid}`; }
		public get powerPercent() { return Math.floor(100 * this.powerRating / this.hero.maxPowerRating); }
		public get powerRating() { return Math.round(this.hitPointsPowerRating + this.traitPowerRating + this.activePowerRating + this.passivePowerRating + this.deckPowerRating); }
		public get traitLevel() { return this.getAbilityLevel(AbilityType.Trait); }
		public get traitPowerRating() { return this.trait.powerRating; }

	}
}