
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

interface ICardScore { card:IDataBattleCard; score:number; }
function rateCards() {
	var cards = bh.data.BattleCardRepo.all;
	var scores = cards.map(card => {
// 		var scores = card.types.map((type, typeIndex) => {
// 			var turnMultiplier = 1 - (card.turns - 1) * 0.1,
// 				value = calcValue(card, typeIndex),
// 				valuePerTurn = value / card.turns,
// 				dotValuePerTurn = calcDotValue(card, typeIndex) / card.turns,
// 				regenTurns = card.effects.includes("Regen") && type != "Attack" ? getRegenDuration(card) : 0,
// 				regenDivisor = regenTurns || 1,
// 				score = 0;
// // console.log(`${card.name} (${type}) valuePerTurn (${valuePerTurn}) * turnMultiplier (${turnMultiplier})`)
// 			return Math.round((valuePerTurn + dotValuePerTurn) / regenDivisor * turnMultiplier / 888);
// 		});
// 		var score = scores.reduce((total, score) => score + total, 0);
// 		return { card:card, score:score };
		return { card:card, score:0 };
	});
	scores.sort((a, b) => a.score < b.score ? 1 : a.score == b.score ? 0 : -1);
	$("#data-output").val(scores.map(score => `${score.score} > ${score.card.name}`).join("\n"));

	function calcDotValue(card: IDataBattleCard, typeIndex: number) {
		if (card.effects.includes("Drown")) return calcValue(card, typeIndex);
		var dots = ["Burn", "Bleed", "Shock", "Poison"],
			count = 0;
		card.effects.forEach(effect => dots.includes(effect) ? count++ : void 0);
		return count ? calcValue(card, typeIndex) * 0.6 * count : 0;
	}
	function calcValue(card: IDataBattleCard, typeIndex: number) {
		return 0;
		// var maxValue = card.maxValues[typeIndex],
		// 	maxPerkPercent = (card.perkBase + 10 * (1 + card.rarityType)) / 100,
		// 	critMultiplier = card.perks.includes("Critical") ? 1.5 * maxPerkPercent : 1,

		// 	target = card.targets[typeIndex],
		// 	targetMultiplier = target.includes("Multi") ? 2 : target.includes("Splash") ? 1.5 : card.types[typeIndex] != "Attack" && !target.includes("Self") ? 1.25 : 1,

		// 	flurryCount = getFlurryCount(card),
		// 	flurryHitPercent = 1 - getFlurryMiss(card);

		// return Math.round(maxValue * critMultiplier * targetMultiplier * flurryHitPercent / flurryCount);
	}
	function getEffectDuration(card: IDataBattleCard, effect: string) {
		return 1;
	}
	function getFlurryCount(card: IDataBattleCard) {
		return 0;
	}
	function getFlurryHitPercent(card: IDataBattleCard) {
		return 0;
	}
	function getPerkMultiplier(perk: string, percent: number) {
		return getMultiplier(perk) * percent;
	}
	function getMultiplier(value: string, card: IDataBattleCard = null) {
		if (value.startsWith("Immunity to") || value.startsWith("Immune To")) return 0.2;
		var turns = card && card.turns || 1;
		var targets = card && card
		switch (value) {
			case "Interrupt": return 1;
			case "Haste": return 1; // * target count

			default: return 0;
		}
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