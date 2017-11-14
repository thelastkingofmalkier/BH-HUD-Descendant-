
interface INewCard { [key: string]: string; }
function updateCardData() {
	$.get("https://docs.google.com/spreadsheets/d/1xckeq3t9T2g4sR5zgKK52ZkXNEXQGgiUrJ8EQ5FJAPI/pub?output=tsv").then(raw => {
		var mapped = bh.Repo.mapTsv<INewCard>(raw),
			cards = mapped.map(card => {
				var guid = card["Id"],
					existing = bh.data.BattleCardRepo.find(guid),
					multiValues = card["Effect Type"].includes("/"),
					minValuesArray = multiValues ? [0,1] : [0];
				var created: IDataBattleCard = {
					guid: guid,
					name: existing && existing.name || card["Name"],
					klassType: bh.KlassType[<GameKlass>card["Class"].replace("Ranged", "Skill").replace("Melee", "Might")],
					elementType: bh.ElementType[<GameElement>card["Element"]],
					rarityType: bh.RarityType[<GameRarity>card["Rarity"].replace(/ /, "")],
					turns: +card["Turns"],
					typesTargets: card["Effect Type"].trim().split(/\s*\/\s*/),
					brag: bh.utils.parseBoolean(card["Is Brag?"]),
					minValues: minValuesArray.map(index => [0,1,2,3,4,5].map(i => card[`${i}* Min`]).filter(s => !!s).map(s => +s.split(/\s*\/\s*/)[index])),
					maxValues: [0,1,2,3,4,5].map(i => card[`${i}* Max`]).filter(s => !!s).pop().split(/\s*\/\s*/).map(s => +s),
					tier: existing && existing.tier || <any>"",
					mats: [1,2,3,4].map(i => card[`${i}* Evo Jar`]).filter(s => !!s),
					perkBase: +card["Perk %"],
					perks: [1,2].map(i => card[`Perk #${i}`]).filter(s => !!s),
					effects: [1,2,3].map(i => card[`Effect #${i}`]).filter(s => !!s && s != "Splash"),
					inPacks: bh.utils.parseBoolean(card["In Packs?"])
				};
				if (!existing) console.log("New Card: " + card["Name"]);
				else if (existing.name != card["Name"]) console.log(existing.name + " !== " + card["Name"]);
				return created;
			});
		var tsv = "guid\tname\tklassType\telementType\trarityType\tturns\ttypesTargets\tbrag\tminValues\tmaxValues\ttier\tmats\tperkBase\tperks\teffects\tpacks";
		cards.forEach(c => {
			tsv += `\n${c.guid}\t${c.name}\t${bh.KlassType[c.klassType]}\t${bh.ElementType[c.elementType]}\t${bh.RarityType[c.rarityType]}\t${c.turns}\t${c.typesTargets.join("|")}\t${c.brag}\t${c.minValues.map(a=>a.join(",")).join("|")}\t${c.maxValues.join("|")}\t${c.tier}\t${c.mats.join(",")}\t${c.perkBase}\t${c.perks.join(",")}\t${c.effects.join(",")}\t${c.inPacks}`;
		});
		$("#data-output").val(tsv)
	});
	// function effectTypeToTarget(value: string): GameBattleCardTarget[] {
	// 	return value.split("/").map(s => s.trim()).filter(s => !!s).map(s => {
	// 		// var gameTarget = totar
	// 		var parts = s.split(" "),
	// 			all = parts[1] == "All",
	// 			single = parts[1] == "Single",
	// 			splash = parts[1] == "Splash",
	// 			self = parts[1] == "Self";
	// 		if (s.includes("Flurry")) {
	// 			if (self) { return "Self Flurry"; }
	// 			if (all) { return "Multi Flurry"; }
	// 			if (single) { return "Single Flurry"; }
	// 		}
	// 		if (self) { return "Self"; }
	// 		if (single) { return "Single"; }
	// 		if (all) { return "Multi"; }
	// 		if (splash) { return "Splash"; }
	// 		console.log(`Target of "${s}"`);
	// 		return <any>s;
	// 	});
	// }
}

interface ICardScore { card:IDataBattleCard; score:number; effectMultipliers:number[]; }
function rateCards(max = true) {
	var cards = bh.data.BattleCardRepo.all;
	var scores = cards.map(card => {
		var scoreCard: ICardScore = { card:card, score:10, effectMultipliers:[] };
		card.typesTargets.forEach((type, typeIndex) => {
			scoreCard.score += calcTestScore(card, typeIndex, max ? card.rarityType : 0, max ? bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1 : 0);
		});
		return scoreCard;
	});
	scores.sort((a, b) => b.score - a.score);
	$("textarea").val(scores.map((s, i) => (i+1) + ": " + s.card.name + (s.card.rarityType == bh.RarityType.Legendary?" (L)":"")).slice(0, 30).join("\n"));
	$("#data-output").val(scores.map(score => `${score.score} > ${bh.RarityType[score.card.rarityType][0]} ${score.card.name} (${score.card.turns}; ${score.card.typesTargets.concat(score.card.effects).concat(score.card.perks.map(p => p + " (" + (score.card.perkBase+20*(1+score.card.rarityType)) + "%)"))})`).join("\n"));
	return scores;

	function calcTestScore(card: IDataBattleCard, typeIndex: number, evo: number, level: number) {
		var target = bh.PlayerBattleCard.parseTarget(card.typesTargets[typeIndex]),
			turns = card.turns,
			regen = card.effects.concat(card.perks).find(s => s.startsWith("Regen")),
			regenEffect = regen ? new bh.GameEffect(regen) : null,
			regenDivisor = regen && regenEffect.turns || 1,
			shieldDivisor = target.type == "Shield" ? 2 : 1,
			healDivisor = target.type == "Heal" ? 3 * regenDivisor : 1,
			perkMultiplier = bh.BattleCardRepo.getPerk(card, evo) / 100,
			value = calcValue(card, typeIndex, evo, level) / shieldDivisor / healDivisor / 888,
			effectPoints = 0,
			perkPoints = 0;
		card.effects.forEach(effect => effectPoints += getPoints(effect) * target.targetMultiplier);
		card.perks.forEach(perk => perkPoints += getPoints(perk) * perkMultiplier * target.targetMultiplier);
		return Math.round((value + effectPoints + perkPoints) / turns - turns);

		function getPoints(value: string) {
			var gameEffect = bh.GameEffect.parse(value),
				effect = gameEffect && gameEffect.effect || null;
			if (effect && !["Critical", "Regen"].includes(effect)) {
				if (target.offense) {
					if (["Interrupt", "Burn", "Bleed", "Shock", "Poison", "Backstab"].includes(effect)) return 1;
					if (["Sap", "Drown"].includes(effect)) return 2;
					if (["Mark", "Sleep"].includes(effect)) return gameEffect.turns;
					if (["Accuracy Down"].includes(effect)) return gameEffect.turns * gameEffect.percentMultiplier;
				}else {
					if (["Slow"].includes(effect)) return -1;
					if (["Cure All"].includes(effect)) return 1;
					if (["Evade"].includes(effect)) return gameEffect.turns;
				}
				if (["Attack Up"].includes(effect)) return 0.5 * gameEffect.turns;
				if (["Haste", "Trait Up", "Speed Up"].includes(effect)) return 2;
				// Trait up should scale by level ... assume level 50 = 100% and 1 = 0%
				console.log(effect);
				return 0.5;// * gameEffect.turns;
			}
			return 0;
		}
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
function tiered() {
	var tiered: { [tier: string]:IDataBattleCard[]; } = { };
	bh.data.BattleCardRepo.all.forEach(card => {
		if (!card.tier) return;
		if (!tiered[card.tier]) tiered[card.tier] = [];
		tiered[card.tier].push(card);
	});
	return tiered;
}
// $(() => bh.data.init().then(() => rateCards));