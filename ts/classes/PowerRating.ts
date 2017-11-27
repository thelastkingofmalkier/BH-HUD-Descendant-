namespace bh {
	// Power Rating
	var RarityEvolutions: { [rarity: string]: number; } = { Common: 1, Uncommon: 2, Rare: 3, SuperRare: 4, Legendary: 5 };
	var RarityLevels: { [rarity: string]: number; } = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 50 };
	var RarityMultipliers: { [rarity: string]: number; } = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 60 };

	export enum MinMaxType { Min, Max }
	export class PowerRating {
		public static rateMaxedHero(hero: Hero) {
			var abilities = hero.name == "Jinx" ? 30 : 40;
			return abilities + PowerRating.rateMaxedDeck(hero);
		}
		public static rateMaxedDeck(hero: Hero) {
			var heroCards = Hero.filterCardsByHero(hero, data.BattleCardRepo.all),
				ratedCards = heroCards.map(card => { return { card:card, powerRating:PowerRating.rateBattleCard(card, MinMaxType.Max) }; }),
				sortedCards = ratedCards.sort((a, b) => a.powerRating == b.powerRating ? 0 : a.powerRating < b.powerRating ? 1 : -1),
				topCards = sortedCards.slice(0, 4);
			return topCards.reduce((score, card) => score + card.powerRating * 2, 0);
		}
		public static rateDeck(deck: PlayerBattleCard[]) {
			var rated = deck.reduce((out, card) => { out[card.playerCard.configId] = PowerRating.ratePlayerCard(card.playerCard); return out; }, <{[key:string]:number;}>{ }),
				cycleCards = deck.filter(card => BattleCardRepo.isCycleCard(card, card.evo)),
				cycleCount = cycleCards.length,
				cards = deck.filter(card => !cycleCards.includes(card));
			// console.log(rated);
			return deck.reduce((score, pbc) => score + PowerRating.ratePlayerCard(pbc.playerCard) * pbc.count, 0);
		}
		public static rateBattleCard(battleCard: IDataBattleCard, minMax: MinMaxType) {
			var key = RarityType[battleCard.rarityType],
				evo = minMax == MinMaxType.Max ? RarityEvolutions[key] : 0,
				level = minMax == MinMaxType.Max ? RarityLevels[key] : 0;
			return PowerRating.ratePlayerCard(<any>{ configId:battleCard.guid, evolutionLevel:evo, level:level-1 });
		}
		public static rateAndSort(cards: IDataBattleCard[], minMax = MinMaxType.Max): ICardRating[] {
			var rated = cards.map(card => { return { card:card, powerRating:PowerRating.rateBattleCard(card, minMax) }; });
			rated.sort((a, b) => { return b.powerRating - a.powerRating; });
			return rated;
		}
		public static ratePlayerCard(playerCard: IPlayer.PlayerCard) {
			return ratePlayerCard(playerCard);
		}
		public static ratePlayerHeroAbility(playerHeroAbility: PlayerHeroAbility) {
			if (playerHeroAbility.hero.name == "Jinx" && playerHeroAbility.heroAbility.type == AbilityType.Passive) return 0;
			return Math.round(1000 * playerHeroAbility.level / playerHeroAbility.levelMax) / 100;
		}
		public static ratePlayerHeroHitPoints(playerHero: PlayerHero) {
			// return Math.round(1000 * playerHero.level / 90) / 100;
			var maxHP = <number>bh.data.HeroRepo.all.map(h=>[bh.Hero.getHitPoints(h,90),h]).sort().pop()[0],
				heroMultiplier = bh.Hero.getHitPoints(playerHero.hero, 90) / maxHP,
				levelMultiplier = playerHero.level / 90;
			return Math.round(1000 * heroMultiplier * levelMultiplier) / 100;
		}
	}

	export interface ICardRating { card:IDataBattleCard; powerRating:number; }

	function ratePlayerCard(playerCard: IPlayer.PlayerCard): number {
		var card = data.BattleCardRepo.find(playerCard.configId),
			evoLevel = playerCard.evolutionLevel,
			level = playerCard.level,
			perkMultiplier = bh.BattleCardRepo.getPerk(card, evoLevel) / 100,
			targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget)),
			gameEffects = GameEffect.parseAll(playerCard),
			rating = 0;
		targets.forEach((target, typeIndex) => {
			var turns = card.turns,
				regen = card.effects.concat(card.perks).find(s => s.startsWith("Regen")),
				regenEffect = regen ? bh.GameEffect.parse(regen) : null,
				regenDivisor = regen && regenEffect.turns || 1,
				shieldDivisor = target.type == "Shield" ? 2 : 1,
				healDivisor = target.type == "Heal" ? 3 * regenDivisor : 1,
				value = calcValue(card, typeIndex, evoLevel, level) / shieldDivisor / healDivisor / 888;
			rating += value / turns - turns;
		});
		gameEffects.forEach(gameEffect => rating += gameEffect.powerRating);
		return Math.round(100 * rating) / 100;
	}
	function calcValue(card: IDataBattleCard, typeIndex: number, evo: number, level: number) {
		var baseValue = bh.BattleCardRepo.calculateValue(<any>{configId:card.guid,evolutionLevel:evo,level:level}),
			perkMultiplier = bh.BattleCardRepo.getPerk(card, evo) / 100,
			critMultiplier = card.perks.includes("Critical") ? 1.5 * perkMultiplier : 1,
			target = bh.PlayerBattleCard.parseTarget(card.typesTargets[typeIndex]),
			value = Math.round(baseValue * critMultiplier * target.targetMultiplier);
		if (target.flurry) {
			value = value / target.flurryCount * target.flurryHitMultiplier * target.flurryCount;
		}
		if (!value) console.log(card.name, target);
		return value;
	}
}

function rateCards(max = true) {
	var cards = bh.data.BattleCardRepo.all;
	var scores: bh.ICardRating[] = cards.map(card => {
		var playerCard: IPlayer.PlayerCard = <any> { configId:card.guid };
		playerCard.evolutionLevel = max ? card.rarityType : 0;
		playerCard.level = max ? bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1 : 0;
		return { card:card, powerRating:10 + bh.PowerRating.ratePlayerCard(playerCard) };
	});
	scores.sort((a, b) => b.powerRating - a.powerRating);
	$("textarea").val(scores.map((s, i) => (i+1) + ": " + s.card.name + (s.card.rarityType == bh.RarityType.Legendary?" (L)":"")).slice(0, 30).join("\n"));
	$("#data-output").val(scores.map(score => `${score.powerRating} > ${bh.RarityType[score.card.rarityType][0]} ${score.card.name} (${score.card.turns}; ${score.card.typesTargets.concat(score.card.effects).concat(score.card.perks.map(p => p + " (" + (score.card.perkBase+20*(1+score.card.rarityType)) + "%)"))})`).join("\n"));
	return scores;
}
