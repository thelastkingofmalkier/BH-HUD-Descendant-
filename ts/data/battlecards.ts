
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
	function effectTypeToTarget(value: string): GameBattleCardTarget[] {
		return value.split("/").map(s => s.trim()).filter(s => !!s).map(s => {
			// var gameTarget = totar
			var parts = s.split(" "),
				all = parts[1] == "All",
				single = parts[1] == "Single",
				splash = parts[1] == "Splash",
				self = parts[1] == "Self";
			if (s.includes("Flurry")) {
				if (self) { return "Self Flurry"; }
				if (all) { return "Multi Flurry"; }
				if (single) { return "Single Flurry"; }
			}
			if (self) { return "Self"; }
			if (single) { return "Single"; }
			if (all) { return "Multi"; }
			if (splash) { return "Splash"; }
			console.log(`Target of "${s}"`);
			return <any>s;
		});
	}
}

interface ICardScore { card:IDataBattleCard; score:number; effectMultipliers:number[]; }
function rateCards() {
	var cards = bh.data.BattleCardRepo.all;
	var scores = cards.map(card => {
		var scoreCard: ICardScore = { card:card, score:10, effectMultipliers:[] };
		card.typesTargets.forEach((type, typeIndex) => {
			scoreCard.score += calcTestScore(card, typeIndex);
			// var turnMultiplier = (8 - card.turns) / 7,
			// 	typeMultiplier = type.startsWith("Damage") ? 1.25 : type.startsWith("Shield") ? 1 : 0.75,
			// 	valuePerTurn = calcValue(card, typeIndex) / card.turns,
			// 	dotValuePerTurn = calcDotValue(card, typeIndex) / card.turns,
			// 	regen = card.effects.find(s => !!s.match(/Regen \d+T/)),
			// 	regenTurns = regen && !type.startsWith("Damage") ? +regen.match(/(\d+)T/)[1] : 0,
			// 	regenDivisor = regenTurns || 1,
			// 	perkMultipliers = card.perks.map(perk => getPerkMultiplier(perk, card)),
			// 	perkMultiplier = 1 + perkMultipliers.reduce((out, curr) => out + curr, 1),
			// 	effectMultipliers = card.effects.map(effect => getMultiplier(effect, card)),
			// 	effectMultiplier = 1 + effectMultipliers.reduce((out, curr) => out + curr, 1);
			// scoreCard.effectMultipliers[typeIndex] = effectMultiplier;
			// scoreCard.score += Math.round(((valuePerTurn + dotValuePerTurn) / regenDivisor / 888) * turnMultiplier * effectMultiplier * perkMultiplier * typeMultiplier);
		});
		return scoreCard;
	});
	scores.sort((a, b) => a.score < b.score ? 1 : a.score == b.score ? 0 : -1);
	$("textarea").val(scores.map((s, i) => (i+1) + ": " + s.card.name + (s.card.rarityType == bh.RarityType.Legendary?" (L)":"")).slice(0, 30).join(", "));
	$("#data-output").val(scores.map(score => `${score.score} > ${bh.RarityType[score.card.rarityType][0]} ${score.card.name} (${score.card.turns}; ${score.card.typesTargets.concat(score.card.effects).concat(score.card.perks.map(p => p + " (" + (score.card.perkBase+20*(1+score.card.rarityType)) + "%)"))})`).join("\n"));

	function calcTestScore(card: IDataBattleCard, typeIndex: number) {
		var target = bh.PlayerBattleCard.parseTarget(card.typesTargets[typeIndex]),
			targetMultiplier = target.all ? 2 : target.splash ? 1.5 : target.single ? 1.25 : 1,
			turns = card.turns,
			regen = card.effects.concat(card.perks).find(s => s.startsWith("Regen")),
			regenEffect = regen ? new bh.GameEffect(regen) : null,
			regenDivisor = regen && regenEffect.turns || 1,
			shieldDivisor = card.typesTargets[typeIndex].startsWith("Shield") ? 2 : 1,
			healDivisor = card.typesTargets[typeIndex].startsWith("Heal") ? 3 * regenDivisor : 1,
			perkMultiplier = Math.min((card.perkBase + bh.BattleCardRepo.AddedPerkPerEvo * (1 + card.rarityType)), 100) / 100,
			value = calcValue(card, typeIndex) / shieldDivisor / healDivisor / 888 / turns,
			effectPoints = 0,
			perkPoints = 0;
		card.effects.forEach(effect => effectPoints += getPoints(effect));
		card.perks.forEach(perk => perkPoints += getPoints(perk) * perkMultiplier);
		return Math.round((value + effectPoints + perkPoints) * targetMultiplier - turns);

		function getPoints(value: string) {
			var gameEffect = new bh.GameEffect(value),
				effect = gameEffect.effect,
				offense = card.typesTargets[typeIndex].startsWith("Damage");
			if (gameEffect) {
				if (offense) {
					if (["Interrupt", "Burn", "Bleed", "Shock", "Poison", "Backstab"].includes(effect)) return 1;
					if (["Sap", "Drown"].includes(effect)) return 2;
					if (["Mark"].includes(effect)) return gameEffect.turns;
					if (["Sleep"].includes(effect)) return gameEffect.turns * target.targetMultiplier;
					if (effect == "Accuracy Down" && gameEffect.percentMultiplier == 1) return gameEffect.turns;
				}else {
					if (["Cure All"].includes(effect)) return 1;
					if (["Haste", "Trait Up"].includes(effect)) return 2 * target.targetMultiplier;
					if (["Evade"].includes(effect)) return gameEffect.turns;
				}
			}
			return 0;
		}
	}
	function calcDotValue(card: IDataBattleCard, typeIndex: number) {
		var damageValue = calcValue(card, typeIndex),
			maxPerkMultiplier = bh.BattleCardRepo.getMaxPerk(card) / 100,
			value = 0;
		card.effects.forEach(effect => value += damageValue * calcDotMultiplier(effect));
		card.perks.forEach(perk => value += damageValue * calcDotMultiplier(perk) * maxPerkMultiplier);
		return value;
	}
	function calcDotMultiplier(effect: string) {
		var gameEffect = new bh.GameEffect(effect),
			multiplier = 0;
		if (["Burn", "Bleed", "Shock", "Poison"].includes(gameEffect.effect)) {
			multiplier = gameEffect.turns < 3 ? 0.7 : gameEffect.turns == 3 ? 0.6 : 0.5
		}else if (["Sap", "Drown"].includes(gameEffect.effect)) {
			multiplier = gameEffect.turns < 2 ? 1.2 : gameEffect.turns == 3 ? 1.1 : 1.0
		}
		return multiplier;
	}
	function calcValue(card: IDataBattleCard, typeIndex: number) {
		var maxValue = card.maxValues[typeIndex],
			maxPerkPercent = bh.BattleCardRepo.getMaxPerk(card) / 100,
			critMultiplier = card.perks.includes("Critical") ? 1.5 * maxPerkPercent : 1,
			target = bh.PlayerBattleCard.parseTarget(card.typesTargets[typeIndex]),
			flurryMultiplier = target.flurry ? target.flurryHitMultiplier : 1,
			value = Math.round(maxValue * critMultiplier * target.targetMultiplier * flurryMultiplier);
		if (!value) console.log(card.name, target);
		return value;
	}
	function getPerkMultiplier(perk: string, card: IDataBattleCard) {
		if (perk == "Critical") return 0;
		var perkMultiplier = (card.perkBase + bh.BattleCardRepo.AddedPerkPerEvo * (1 + card.rarityType)) / 100;
		return getMultiplier(perk, card, perkMultiplier);
	}
	function getMultiplier(value: string, card: IDataBattleCard, perkMultiplier = 1) {
		var effect = new bh.GameEffect(value),
			target = bh.PlayerBattleCard.parseTarget(card.typesTargets[0]),
			multiplier = effect.value * (effect.turns || 1) * (effect.percentMultiplier || 1) * (target.flurryHitMultiplier || 1) * perkMultiplier;
		if (effect.effect == "Haste") {
			if (["Hoist the Colours", "Ride of the Valkyries"].includes(card.name)) { multiplier * 2; }
			// else console.log(card, multiplier)
		}
		// if (!multiplier) console.log(value);
		return multiplier || 1;
	}
	// function _getMultiplier(value: string, card: IDataBattleCard) {
	// 	var effect = new bh.GameEffect(value),
	// 		targets = card.typesTargets.map(bh.PlayerBattleCard.parseTarget),
	// 		target = targets[0],

	// 		cleanValue = effect.effect,
	// 		turns = effect.turns;

	// 	if (["Regen", "Poison", "Drown", "Burn", "Bleed", "Shock", "Sap"].find(dot => cleanValue == dot)) return 0;
	// 	if (["Cure Confuse", "Cure Poison", "Cure Burn", "Cure Bleed", "Cure Shock"].find(dot => cleanValue == dot)) return 0.1;
	// 	if (cleanValue.startsWith("Immunity to") || cleanValue.startsWith("Immune To")) return 0.1 * turns;
	// 	if (cleanValue.startsWith("Weaken to")) return 0.1 * turns;
	// 	if (cleanValue == "Warped") return 0.1 * turns;
	// 	if (cleanValue == "Awaken") return 0.1 * turns;
	// 	if (cleanValue == "Charm") return 0.1 * turns;
	// 	if (["Luck Up", "Luck Down"].includes(cleanValue)) return 0.1 * turns;
	// 	if (cleanValue == "Max HP Up") return 0.1 * turns;
	// 	if (cleanValue == "Taunt") return 0.1 * turns;
	// 	if (cleanValue == "Stun") return 0.1 * turns;
	// 	if (cleanValue == "Confuse") return 0.1 * turns;
	// 	if (cleanValue == "Recoil") return -0.2;
	// 	if (cleanValue == "Slow") return (target.offense ? 2 : -0.1) * turns;
	// 	if (cleanValue == "Shield Pierce") return 0.5;
	// 	if (cleanValue == "Regen Break") return 0.5;
	// 	if (cleanValue == "Shield Break") return 0.5;
	// 	if (cleanValue == "Cure All") return 0.5;
	// 	if (cleanValue.startsWith("Extend")) return 1;
	// 	if (cleanValue == "Interrupt") return 0.75 * (target.flurryMultiplier || 1);
	// 	if (cleanValue == "Reset") return 1;
	// 	if (cleanValue == "Leech") return 1;
	// 	if (cleanValue == "Trait Down") return 1;
	// 	if (cleanValue == "Shield Bind") return 1;
	// 	if (cleanValue == "Perfect Shot") return 2;
	// 	if (cleanValue == "Trait Up") return 2;
	// 	if (["Mark", "Backstab"].includes(cleanValue)) return turns;
	// 	if (cleanValue == "Chill") return turns;
	// 	if (cleanValue == "Evade") return turns;
	// 	if (cleanValue == "Sleep") return (target.offense ? 1 : -0.1) * turns * (target.all ? 2 : 1);
	// 	if (cleanValue == "Haste") return 2 * (target.all ? 3 : 2);
	// 	if (cleanValue == "Bamboozle") return 0.2 * turns * effect.percentMultiplier;
	// 	if (cleanValue == "Accuracy Up") return 0.5 * turns * effect.percentMultiplier;
	// 	if (cleanValue == "Accuracy Down") return 2 * target.flurryMultiplier;// * turns * percent
	// 	if (["Attack Up", "Attack Down", "Defence Up", "Defence Down"].includes(cleanValue)) return 0.25;// * turns;
	// 	console.log(value + " ("+cleanValue+")");
	// 	return 0;
	// }
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