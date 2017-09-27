
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
	var uniqueEffectTypes = [
"Damage All Enemies",
"Damage All Enemies Flurry (10 @ 50%)", "Damage All Enemies Flurry (6 @ 75%)", "Damage All Enemies Flurry (6 @ 85%)",
"Damage Single Enemy",
"Damage Single Enemy Flurry (12 @ 50%)", "Damage Single Enemy Flurry (4 @ 75%)", "Damage Single Enemy Flurry (6 @ 75%)", "Damage Single Enemy Flurry (8 @ 75%)",
"Damage Splash Enemies",
"Heal All Allies",
"Heal Self",
"Heal Self Flurry (8 @ 75%)",
"Heal Single Ally",
"Heal Splash Allies",
"Shield All Allies",
"Shield Self",
"Shield Single Ally"];
	function effectTypeToTarget(value: string): GameBattleCardTarget[] {
		return value.split("/").map(s => s.trim()).filter(s => !!s).map(s => {
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
	var AddedPerkPerEvo = 20;
	var cards = bh.data.BattleCardRepo.all;
	var scores = cards.map(card => {
		var scoreCard: ICardScore = { card:card, score:0, effectMultipliers:[] };
		card.typesTargets.forEach((type, typeIndex) => {
			var turnMultiplier = (8 - card.turns) / 7,
				typeMultiplier = type.startsWith("Damage") ? 1.25 : type.startsWith("Shield") ? 1 : 0.75,
				valuePerTurn = calcValue(card, typeIndex) / card.turns,
				dotValuePerTurn = calcDotValue(card, typeIndex) / card.turns,
				regen = card.effects.find(s => !!s.match(/Regen \d+T/)),
				regenTurns = regen && !type.startsWith("Damage") ? +regen.match(/(\d+)T/)[1] : 0,
				regenDivisor = regenTurns || 1,
				perkMultipliers = card.perks.map(perk => getPerkMultiplier(perk, card)),
				perkMultiplier = perkMultipliers.reduce((out, curr) => out + curr, 1),
				effectMultipliers = card.effects.map(effect => getMultiplier(effect, card)),
				effectMultiplier = effectMultipliers.reduce((out, curr) => out + curr, 1);
			scoreCard.effectMultipliers[typeIndex] = effectMultiplier;
			scoreCard.score += Math.round(((valuePerTurn + dotValuePerTurn) / regenDivisor / 888) * turnMultiplier * effectMultiplier * perkMultiplier * typeMultiplier);
		});
		return scoreCard;
	});
	scores.sort((a, b) => a.score < b.score ? 1 : a.score == b.score ? 0 : -1);
	$("textarea").val(scores.map((s, i) => (i+1) + ": " + s.card.name + (s.card.rarityType == bh.RarityType.Legendary?" (L)":"")).slice(0, 30).join(", "));
	$("#data-output").val(scores.map(score => `${score.score} > ${bh.RarityType[score.card.rarityType][0]} ${score.card.name} (${score.card.typesTargets.concat(score.card.effects).concat(score.card.perks)})`).join("\n"));

	function calcDotValue(card: IDataBattleCard, typeIndex: number) {
		var damageValue = calcValue(card, typeIndex),
			drownValue = card.effects.includes("Drown") ? damageValue : 0,
			dots = ["Burn", "Bleed", "Shock", "Poison"],
			dotValue = 0;
		dots.forEach(dot => {
			var effect = card.effects.find(e => e.startsWith(dot)),
				turns = effect && +effect.split(" ").pop().split("T")[0] || 0,
				multiplier = turns < 3 ? 0.7 : turns == 3 ? 0.6 : 0.5;
			dotValue += effect && turns ? damageValue * multiplier : 0;
		});
		return drownValue + dotValue;
	}
	function calcValue(card: IDataBattleCard, typeIndex: number) {
		var maxValue = card.maxValues[typeIndex],
			maxPerkPercent = (card.perkBase + AddedPerkPerEvo * (1 + card.rarityType)) / 100,
			critMultiplier = card.perks.includes("Critical") ? 1.5 * maxPerkPercent : 1,

			target = card.typesTargets[typeIndex],
			offense = target.startsWith("Damage"),
			targetMultiplier = target.includes("All Enemies") ? 2 : target.includes("All Allies") ? 2 : target.includes("Splash") ? 1.5 : !offense && !target.includes("Self") ? 1.25 : 1,

			flurryMatch = target.match(/Flurry \((\d+) @ (\d+)%\)/),
			// flurryCount = flurryMatch && +flurryMatch[1] || 1,
			flurryHitPercent = flurryMatch && (+flurryMatch[2] / 100) || 1,
			flurryMultiplier = flurryHitPercent,

			value = Math.round(maxValue * critMultiplier * targetMultiplier * flurryMultiplier);
		if (!value) console.log(card);
		return value;
	}
	function getPerkMultiplier(perk: string, card: IDataBattleCard) {
		if (perk == "Critical") return 0;
		return getMultiplier(perk, card);
	}
	function getMultiplier(value: string, card: IDataBattleCard) {
		var parts = value.match(/([a-zA-z]+(?: [a-zA-Z]+)*)(?: (\d+)%)?(?: (\d+)T)?/),
			cleanValue = parts && parts[1] || value,
			percent = parts && parts[2] && (+parts[2]/100) || 1,
			turns = parts && +parts[3] || 1,
			offense = card.typesTargets[0].startsWith("Damage"),
			flurryMatch = offense && card.typesTargets[0].match(/Flurry \((\d+) @ (\d+)%\)/),
			flurryCount = flurryMatch && +flurryMatch[1] || 1,
			flurryHitPercent = flurryMatch && (+flurryMatch[2] / 100) || 1,
			flurryMultiplier = flurryHitPercent * flurryCount,
			all = card.typesTargets.find(t => t.includes("All Allies") || t.includes("All Enemies"));
		if (["Regen", "Poison", "Drown", "Burn", "Bleed", "Shock"].find(dot => cleanValue == dot)) return 0;
		if (["Cure Confuse", "Cure Poison", "Cure Burn", "Cure Bleed", "Cure Shock"].find(dot => cleanValue == dot)) return 0.1;
		if (cleanValue.startsWith("Immunity to") || cleanValue.startsWith("Immune To")) return 0.1 * turns;
		if (cleanValue.startsWith("Weaken to")) return 0.1 * turns;
		if (cleanValue == "Warped") return 0.1 * turns;
		if (cleanValue == "Awaken") return 0.1 * turns;
		if (cleanValue == "Charm") return 0.1 * turns;
		if (["Luck Up", "Luck Down"].includes(cleanValue)) return 0.1 * turns;
		if (cleanValue == "Max HP Up") return 0.1 * turns;
		if (cleanValue == "Taunt") return 0.1 * turns;
		if (cleanValue == "Stun") return 0.1 * turns;
		if (cleanValue == "Sap") return 0.1 * turns;
		if (cleanValue == "Confuse") return 0.1 * turns;
		if (cleanValue == "Recoil") return -0.2;
		if (cleanValue == "Slow") return (offense ? 2 : -0.1) * turns;
		if (cleanValue == "Shield Pierce") return 0.5;
		if (cleanValue == "Regen Break") return 0.5;
		if (cleanValue == "Shield Break") return 0.5;
		if (cleanValue == "Cure All") return 0.5;
		if (cleanValue.startsWith("Extend")) return 1;
		if (cleanValue == "Interrupt") return 0.75 * flurryMultiplier;
		if (cleanValue == "Reset") return 1;
		if (cleanValue == "Leech") return 1;
		if (cleanValue == "Trait Down") return 1;
		if (cleanValue == "Shield Bind") return 1;
		if (cleanValue == "Perfect Shot") return 2;
		if (cleanValue == "Trait Up") return 2;
		if (["Mark", "Backstab"].includes(cleanValue)) return turns;
		if (cleanValue == "Chill") return turns;
		if (cleanValue == "Evade") return turns;
		if (cleanValue == "Sleep") return (offense ? 1 : -0.1) * turns * (all ? 2 : 1);
		if (cleanValue == "Haste") return 2 * (all ? 3 : 2);
		if (cleanValue == "Bamboozle") return 0.2 * turns * percent;
		if (cleanValue == "Accuracy Up") return 0.5 * turns * percent;
		if (cleanValue == "Accuracy Down") return 2 * flurryMultiplier;// * turns * percent
		if (["Attack Up", "Attack Down", "Defence Up", "Defence Down"].includes(cleanValue)) return 0.25;// * turns;
		console.log(value + " ("+cleanValue+")");
		return 0;
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