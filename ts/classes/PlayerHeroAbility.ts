namespace bh {

	function getMaterialCostForTrait(level: number): number {
		if (level < 2) return 1;
		if (level < 10) return 2;
		if (level < 18) return 3;
		if (level < 25) return 4;
		if (level < 33) return 5;
		if (level < 41) return 6;
		if (level < 49) return 7;
		if (level < 56) return 8;
		if (level < 64) return 9;
		if (level < 72) return 10;
		if (level < 80) return 11;
		if (level < 87) return 12;
		return 13;
	}
	function getGoldCostForTrait(level: number): number {
		if (level == 1) return 1000;
		var delta = 754,
			gold = 3000;
		for (var i = 2; i < level; i++) {
			gold += delta;
			delta += 8;
		}
		return gold;
	}

	function getMaterialCostForActive(level: number): number {
		if (level < 2) return 1;
		if (level < 7) return 3;
		if (level < 13) return 4;
		if (level < 18) return 5;
		if (level < 23) return 6;
		if (level < 28) return 7;
		if (level < 33) return 8;
		if (level < 38) return 9;
		if (level < 43) return 10;
		if (level < 48) return 11;
		if (level < 53) return 12;
		if (level < 58) return 13;
		if (level < 63) return 14;
		if (level < 68) return 15;
		if (level < 73) return 16;
		return 17;
	}
	function getGoldCostForActive(level: number): number {
		if (level == 1) return 5000;
		var delta = 510,
			gold = 3500;
		for (var i = 2; i < level; i++) {
			gold += delta;
			delta += 20;
		}
		return gold;
	}

	function getMaterialCostForPassive(level: number): number {
		if (level < 2) return 2;
		if (level < 6) return 4;
		if (level < 9) return 5;
		if (level < 12) return 6;
		if (level < 16) return 7;
		if (level < 19) return 8;
		if (level < 22) return 9;
		if (level < 26) return 10;
		if (level < 29) return 11;
		if (level < 32) return 12;
		if (level < 36) return 13;
		if (level < 39) return 14;
		if (level < 42) return 15;
		if (level < 46) return 16;
		if (level < 49) return 17;
		if (level < 52) return 18;
		if (level < 56) return 19;
		if (level < 59) return 20;
		return 21;
	}
	function getGoldCostForPassive(level: number): number {
		if (level == 1) return 7000;
		var delta = 1015,
			gold = 10000;
		for (var i = 2; i < level; i++) {
			gold += delta;
			delta += 30;
		}
		return gold;
	}

	export function getMaterialCountFor(abilityType: AbilityType, level: number): number {
		switch (abilityType) {
			case AbilityType.Trait: return getMaterialCostForTrait(level);
			case AbilityType.Active: return getMaterialCostForActive(level);
			case AbilityType.Passive: return getMaterialCostForPassive(level);
		}
	}
	export function getMaterialCountForRange(abilityType: AbilityType, from: number, to: number): number {
		var count = 0;
		for (var i = from + 1, l = to + 1; i < l; i++) {
			count += getMaterialCountFor(abilityType, i);
		}
		return count;
	}

	export function getGoldCostFor(abilityType: AbilityType, level: number): number {
		switch (abilityType) {
			case AbilityType.Trait: return getGoldCostForTrait(level);
			case AbilityType.Active: return getGoldCostForActive(level);
			case AbilityType.Passive: return getGoldCostForPassive(level);
		}
	}
	export function getGoldCostForRange(abilityType: AbilityType, from: number, to: number): number {
		var count = 0;
		for (var i = from + 1, l = to + 1; i < l; i++) {
			count += getGoldCostFor(abilityType, i);
		}
		return count;
	}

	export class PlayerHeroAbility {
		private get _type() {
			if (this.hero.name == "Jinx") {
				if (this.type == AbilityType.Active) return AbilityType.Passive;
				if (this.type == AbilityType.Passive) return AbilityType.Active;
			}
			return this.type;
		}

		public constructor(public playerHero: PlayerHero, public heroAbility: HeroAbility, public level: number) { }

		// Passthrough for HeroAbility
		public get hero() { return this.heroAbility.hero; }
		public get guid() { return this.heroAbility.guid; }
		public get name() { return this.heroAbility.name; }
		public get type() { return this.heroAbility.type; }

		// New to PlayerHeroAbility
		public get isLocked() { return !this.level; }
		public get isCapped() { return this.level == this.levelCap; }
		public get isMaxed() { return this.level == this.levelMax; }
		public get levelCap() { return HeroRepo.getAbilityLevelCap(this); }
		public get levelMax() { return HeroRepo.getAbilityLevelMax(this); }

		public get nextMaterialCount() {
			return getMaterialCountFor(this._type, this.level + 1);
		}
		public get maxMaterialCount() {
			var type = this._type,
				max = HeroRepo.getAbilityMaxLevel(this.hero, this.heroAbility.type);
			return getMaterialCountForRange(type, this.level, max);
		}
		public get nextGoldCost() {
			return getGoldCostFor(this._type, this.level + 1);
		}
		public get maxGoldCost() {
			var type = this._type,
				max = HeroRepo.getAbilityMaxLevel(this.hero, this.heroAbility.type);
			return getGoldCostForRange(this._type, this.level, max);
		}

		public get img() {
			return getImg("skills", this.playerHero.name + AbilityType[this.type]);
		}
		public get materialHtml() {
			var player = this.playerHero.player,
				item = this.type == AbilityType.Trait ? player.inventory.find(item => item.isRune && item.name.startsWith(this.hero.name))
					: player.inventory.find(item => item.isCrystal && item.elementType == this.playerHero.elementType),
				owned = item.count,
				color = owned < this.maxMaterialCount ? "bg-danger" : "bg-success",
				img = this.type == AbilityType.Trait ? getImg("runes", this.name.replace(/\W/g, "")) : getImg("crystals", ElementType[this.hero.elementType]);
			return `<div>${img} ${item.name} <span class="badge pull-right ${color}">${utils.formatNumber(owned)} / ${utils.formatNumber(this.maxMaterialCount || 0)}</span></div>`;
		}
		public get goldHtml() {
			var gold = this.playerHero.player.gold || 0,
				color = gold < this.maxGoldCost ? "bg-danger" : "bg-success";
			return `<div>${getImg("misc", "Coin")} Gold <span class="badge pull-right ${color}">${utils.formatNumber(gold)} / ${utils.formatNumber(this.maxGoldCost || 0)}</span></div>`;
		}
		public get powerRating() {
			return PowerRating.ratePlayerHeroAbility(this) * (this.level / HeroRepo.getAbilityMaxLevel(this.hero, this.type));
		}

		public toRowHtml(): string;
		public toRowHtml(needed: number): string;
		public toRowHtml(needed: number, owned: number): string;
		public toRowHtml(needed?: number, owned?: number) {
			var badgeCss = needed && owned ? owned < needed ? "bg-danger" : "bg-success" : "",
				badgeHtml = typeof(needed) == "number" ? `<span class="badge pull-right ${badgeCss}">${utils.formatNumber(needed)}</span>` : ``;
			return `<div>${this.img} ${this.playerHero.name} ${AbilityType[this.type]} ${badgeHtml}</div>`;
		}
	}
}