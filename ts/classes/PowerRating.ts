namespace bh {
	// Power Rating
	var RarityEvolutions: { [rarity: string]: number; } = { Common: 1, Uncommon: 2, Rare: 3, SuperRare: 4, Legendary: 5 };
	var RarityLevels: { [rarity: string]: number; } = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 50 };
	var RarityMultipliers: { [rarity: string]: number; } = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 60 };

	export enum MinMaxType { Min, Max }
	export class PowerRating {
		public static rateMaxedHero(hero: Hero) {
			var abilities = hero.name == "Jinx" ? 45 : 55;
			return abilities + PowerRating.rateMaxedDeck(hero);
		}
		public static rateMaxedDeck(hero: Hero) {
			var heroCards = Hero.filterCardsByHero(hero, data.BattleCardRepo.all),
				ratedCards: ICardRating[] = heroCards.map(card => { return { card:card, powerRating:PowerRating.rateBattleCard(card, MinMaxType.Max) }; }),
				sortedCards = ratedCards.sort((a, b) => a.powerRating == b.powerRating ? 0 : a.powerRating < b.powerRating ? 1 : -1),
				topCards: ICardRating[] = [];
			sortedCards.forEach(card => {
				var existing = topCards.find(c => c.card.name == card.card.name);
				if (existing) {
					if (existing.card.rarityType == RarityType.SuperRare && card.card.rarityType == RarityType.Legendary) {
						topCards = topCards.filter(c => c != existing);
						topCards.push(card);
					}
				}else if (topCards.length < 4) {
					topCards.push(card);
				}
			});
			return topCards.reduce((score, card) => score + card.powerRating * 2, 0);
		}
		public static rateDeck(deck: PlayerBattleCard[]) {
			var rated = deck.reduce((out, card) => { out[card.playerCard.configId] = PowerRating.ratePlayerCard(card.playerCard); return out; }, <{[key:string]:number;}>{ }),
				cycleCards = deck.filter(card => BattleCardRepo.isCycleCard(card, card.evo)),
				cycleCount = cycleCards.length,
				cards = deck.filter(card => !cycleCards.includes(card));
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
			var mult = playerHeroAbility.type == AbilityType.Trait ? 2 : playerHeroAbility.type == AbilityType.Active ? 1.5 : 1;
			return mult * Math.round(1000 * playerHeroAbility.level / playerHeroAbility.levelMax) / 100;
		}
		public static ratePlayerHeroHitPoints(playerHero: PlayerHero) {
			var maxHeroLevel = HeroRepo.MaxLevel,
				maxHP = <number>bh.data.HeroRepo.all.map(h=>[bh.Hero.getHitPoints(h,maxHeroLevel),h]).sort().pop()[0],
				heroMultiplier = bh.Hero.getHitPoints(playerHero.hero, maxHeroLevel) / maxHP,
				levelMultiplier = playerHero.level / maxHeroLevel;
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
		targets.forEach((target, typeIndex) => rating += calcValue(card, typeIndex, evoLevel, level) / target.typeDivisor);
		gameEffects.forEach(gameEffect => rating += gameEffect.powerRating);
		rating /= card.turns;
		return Math.round(100 * rating);
	}
	function calcValue(card: IDataBattleCard, typeIndex: number, evo: number, level: number) {
		var baseValue = bh.BattleCardRepo.calculateValue(<any>{configId:card.guid,evolutionLevel:evo,level:level}),
			perkMultiplier = bh.BattleCardRepo.getPerk(card, evo) / 100,
			regenMultiplier = (bh.GameEffect.parse(card.effects.find(e=> e == "Regen")) || { turns:1 }).turns,
			critMultiplier = card.perks.includes("Critical") ? 1.5 * perkMultiplier : 1,
			target = bh.PlayerBattleCard.parseTarget(card.typesTargets[typeIndex]),
			value = Math.round(baseValue * critMultiplier * target.targetMultiplier * regenMultiplier);
		if (target.flurry) {
			value = value / target.flurryCount * target.flurryHitMultiplier * target.flurryCount;
		}
		if (!value) console.log(card.name, [card, typeIndex, evo, level, baseValue, perkMultiplier, critMultiplier, target, value]);
		return value;
	}
}

function rateCards(max = true) {
	var cards = bh.data.BattleCardRepo.all;
	var scores: bh.ICardRating[] = cards.map(card => {
		var playerCard: IPlayer.PlayerCard = <any> { configId:card.guid };
		playerCard.evolutionLevel = max ? card.rarityType : 0;
		playerCard.level = max ? bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1 : 0;
		return { card:card, powerRating:bh.PowerRating.ratePlayerCard(playerCard) };
	});
	scores.sort((a, b) => b.powerRating - a.powerRating);
	$("textarea").val(scores.map((s, i) => (i+1) + ": " + s.card.name + (s.card.rarityType == bh.RarityType.Legendary?" (L)":"")).slice(0, 30).join("\n"));
	$("#data-output").val(scores.map(score => `${score.powerRating} > ${bh.RarityType[score.card.rarityType][0]} ${score.card.name} (${score.card.turns}; ${score.card.typesTargets.concat(score.card.effects).concat(score.card.perks.map(p => p + " (" + (score.card.perkBase+bh.BattleCardRepo.AddedPerkPerEvo*(1+score.card.rarityType)) + "%)"))})`).join("\n"));
	return scores;
}
