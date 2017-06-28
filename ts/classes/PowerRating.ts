namespace bh {
	// Power Rating
	var CardMultiplier = 2.5;
	var AbilityBlock = 5000, CardBlock = 5000;
	var RarityEvolutions: { [rarity: string]: number; } = { Common: 1, Uncommon: 2, Rare: 3, SuperRare: 4, Legendary: 5 };
	var RarityLevels: { [rarity: string]: number; } = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 50 };
	var RarityMultipliers: { [rarity: string]: number; } = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 60 };

	var a1 = AbilityBlock * 0.40, a2 = AbilityBlock * 0.25, a3 = AbilityBlock * 0.20, a4 = AbilityBlock * 0.15;
	var b1 = a1 + a4 * 0.40, b2 = a2 + a4 * 0.25, b3 = a3 + a4 * 0.20, b4 = a4 * 0.15;
	var c1 = a1 + a4 * 0.45, c2 = a2 + a4 * 0.30, c3 = a3 + a4 * 0.25, c4 = 0;

	function calculateHeroAbilityScore(hero: Hero, ability: "HP" | "Trait" | "Active" | "Passive"): number {
		switch (hero.name) {
			case "Bree": return ability == "HP" ? b2 : ability == "Trait" ? b1 : ability == "Active" ? b4 : b3;
			case "Brom": return ability == "HP" ? b2 : ability == "Trait" ? b1 : ability == "Active" ? b4 : b3;
			case "Fergus": return ability == "HP" ? a2 : ability == "Trait" ? a3 : ability == "Active" ? a4 : a1;
			case "Gilda": return ability == "HP" ? a4 : ability == "Trait" ? a2 : ability == "Active" ? a1 : a3;
			case "Hawkeye": return ability == "HP" ? a4 : ability == "Trait" ? a1 : ability == "Active" ? a3 : a2;
			case "Jinx": return ability == "HP" ? c3 : ability == "Trait" ? c1 : ability == "Active" ? c2 : c4;
			case "Krell": return ability == "HP" ? a3 : ability == "Trait" ? a1 : ability == "Active" ? a2 : a4;
			case "Logan": return ability == "HP" ? b3 : ability == "Trait" ? b2 : ability == "Active" ? b4 : b1;
			case "Monty": return ability == "HP" ? a4 : ability == "Trait" ? a1 : ability == "Active" ? a2 : a3;
			case "Peg": return ability == "HP" ? a4 : ability == "Trait" ? a1 : ability == "Active" ? a2 : a3;
			case "Red": return ability == "HP" ? a4 : ability == "Trait" ? a1 : ability == "Active" ? a3 : a2;
			case "Thrudd": return ability == "HP" ? b2 : ability == "Trait" ? b1 : ability == "Active" ? b4 : b3;
			case "Trix": return ability == "HP" ? a4 : ability == "Trait" ? a3 : ability == "Active" ? a1 : a2;
			default: return 0;
		}
	}
	function calculateCardScore(rarity: string, evoLevel: number, level: number, multiplier: number): number {
		return CardMultiplier * (evoLevel * RarityMultipliers[rarity.replace(/ /, "")] + level) * multiplier;
	}

	export class PowerRating {
		public static rateMaxedHero(hero: Hero) {
			var hp = calculateHeroAbilityScore(hero, "HP"),
				trait = calculateHeroAbilityScore(hero, "Trait"),
				active = calculateHeroAbilityScore(hero, "Active"),
				passive = calculateHeroAbilityScore(hero, "Passive"),
				deck = PowerRating.rateMaxedDeck(hero);
			return hp + trait + active + passive + deck;
		}
		public static rateMaxedDeck(hero: Hero) {
			var heroCards = Hero.filterCardsByHero(hero, data.cards.battle.getAll()),
				ratedCards = heroCards.map(card => { return { card:card, score:PowerRating.rateMaxedBattleCard(card) }; })
								.sort((a, b) => a.score == b.score ? 0 : a.score < b.score ? 1 : -1),
				topCards = ratedCards.slice(0, 4),
				score = topCards.reduce((score, card) => score + card.score * 2, 0);
			return score;
		}
		public static rateMaxedBattleCard(battleCard: IDataBattleCard) {
			var key = battleCard.rarity.replace(/ /g, ""),
				evo = RarityEvolutions[key],
				level = RarityLevels[key];
			return PowerRating.ratePlayerCard(<any>{ configId:battleCard.guid, evolutionLevel:evo, level:level-1 });
		}
		public static ratePlayerCard(playerCard: IPlayer.PlayerCard) {
			var card = data.cards.battle.find(playerCard.configId),
				multiplier = PowerRating.tierToMultiplier(card.tier),
				score = calculateCardScore(card && card.rarity || "Legendary", playerCard.evolutionLevel, playerCard.level + 1, multiplier);
			return score;
		}
		public static ratePlayerHeroAbility(playerHeroAbility: PlayerHeroAbility) {
			return calculateHeroAbilityScore(playerHeroAbility.hero, <any>AbilityType[playerHeroAbility.type]);
		}
		public static ratePlayerHeroHitPoints(playerHero: PlayerHero) {
			return calculateHeroAbilityScore(playerHero.hero, "HP") * playerHero.level / MaxLevel;
		}
		public static tierToMultiplier(tier: string) {
			return tier == "OP" ? 1.2 : tier == "S" ? 1 : tier == "A" ? 0.8 : tier == "B" ? 0.6 : tier == "C" ? 0.4 : tier == "D" ? 0.2 : 0.5;
		}
	}
}