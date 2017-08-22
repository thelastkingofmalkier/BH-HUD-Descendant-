
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
				types: card["Effect Type"].split(/\s*\/\s*/).map(s => effectTypeToType(s.split(/\s*\-\s*/)[0])),
				targets: card["Effect Type"].split(/\s*\/\s*/).map(s => effectTypeToTarget(s.split(/\s*\-\s*/).slice(1).join("-"))),
				brag: bh.utils.parseBoolean(card["Is Brag?"]),
				minValues: minValuesArray.map(index => [0,1,2,3,4,5].map(i => card[`${i}* Min`]).filter(s => !!s).map(s => +s.split(/\s*\/\s*/)[index])),
				maxValues: [0,1,2,3,4,5].map(i => card[`${i}* Max`]).filter(s => !!s).pop().split(/\s*\/\s*/).map(s => +s),
				tier: existing && existing.tier || <any>"",
				mats: [1,2,3,4].map(i => card[`${i}* Evo Jar`]).filter(s => !!s),
				perkBase: +card["Perk %"],
				perks: [1,2,3,4].map(i => card[`Perk #${i}`]).filter(s => !!s),
				effects: [1,2,3].map(i => card[`Effect #${i}`]).filter(s => !!s && s != "Splash")
			};
			if (!existing) console.log(card["Name"]);
			else if (existing.name != card["Name"]) console.log(existing.name + " !== " + card["Name"]);
			return created;
		});
		var tsv = "guid\tname\tklassType\telementType\trarityType\tturns\ttypes\ttargets\tbrag\tminValues\tmaxValues\ttier\tmats\tperkBase\tperks\teffects";
		cards.forEach(c => {
			tsv += `\n${c.guid}\t${c.name}\t${bh.KlassType[c.klassType]}\t${bh.ElementType[c.elementType]}\t${bh.RarityType[c.rarityType]}\t${c.turns}\t${c.types.join("|")}\t${c.targets.join("|")}\t${c.brag}\t${c.minValues.map(a=>a.join(",")).join("|")}\t${c.maxValues.join("|")}\t${c.tier}\t${c.mats.join(",")}\t${c.perkBase}\t${c.perks.join(",")}\t${c.effects.join(",")}`;
		});
		$("#data-output").val(tsv)
	});
	function effectTypeToType(value: string): GameBattleCardType {
		switch(value) {
			case "": return null;
			case "Damage": return "Attack";
			case "Heal": return "Heal";
			case "Shield": return "Shield";
			default:
				console.log(`Type of "${value}"`);
				return <any>value;
		}
	}
	function effectTypeToTarget(value: string): GameBattleCardTarget {
		switch(value) {
			case "": return "Single";
			case "All": return "Multi";
			case "Flurry": return "Single Flurry";
			case "Flurry-All": return "Multi Flurry";
			case "Flurry-Self": return "Self Flurry";
			case "Self": return "Self";
			case "Splash": return "Splash";
			default:
				console.log(`Target of "${value}"`);
				return <any>value;
		}
	}
}

interface ICardScore { card:IDataBattleCard; score:number; }
function rateCards() {
	var cards = bh.data.BattleCardRepo.all;
	var scores = cards.map(card => {
		var scores = card.types.map((type, typeIndex) => {
			var turnMultiplier = 1 - (card.turns - 1) * 0.1,
				value = calcValue(card, typeIndex),
				valuePerTurn = value / card.turns,
				dotValuePerTurn = calcDotValue(card, typeIndex) / card.turns,
				regenTurns = card.effects.includes("Regen") && type != "Attack" ? getRegenDuration(card) : 0,
				regenDivisor = regenTurns || 1,
				score = 0;
// console.log(`${card.name} (${type}) valuePerTurn (${valuePerTurn}) * turnMultiplier (${turnMultiplier})`)
			return Math.round((valuePerTurn + dotValuePerTurn) / regenDivisor * turnMultiplier / 888);
		});
		var score = scores.reduce((total, score) => score + total, 0);
		return { card:card, score:score };
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
		var maxValue = card.maxValues[typeIndex],
			maxPerkPercent = (card.perkBase + 10 * (1 + card.rarityType)) / 100,
			critMultiplier = card.perks.includes("Critical") ? 1.5 * maxPerkPercent : 1,

			target = card.targets[typeIndex],
			targetMultiplier = target.includes("Multi") ? 2 : target.includes("Splash") ? 1.5 : card.types[typeIndex] != "Attack" && !target.includes("Self") ? 1.25 : 1,

			flurryCount = getFlurryCount(card),
			flurryHitPercent = 1 - getFlurryMiss(card);

		return Math.round(maxValue * critMultiplier * targetMultiplier * flurryHitPercent / flurryCount);
	}
	function getRegenDuration(card: IDataBattleCard) {
		switch (card.name) {
			case "Mutton Chops": return 2;

			case "Fairy Shield": return 3;
			case "Odd Seeds": return 3;
			case "Peace Pipe": return 3;
			case "Rooster Arrow": return 3;
			case "Sword of Justice": return 3;
			case "The Equalizer": return 3;
			case "Turkey Arrow": return 3;
			case "Turkey Sagitta": return 3;
			case "Warped Seeds": return 3;
			case "Weird Seeds": return 3;

			case "Candy Cauldron": return 5;
			case "Night Cap": return 5;
			case "Smelling Salts": return card.rarityType == bh.RarityType.SuperRare ? 5 : 5;
			case "Tides Control": return 5;

			case "Caribbean Cocktail": return 6;
			case "Fairy Bottle": return 6;
			case "Regen": return 6;
			case "Tropical Juice": return 6;

			case "Meditation": return 10;

			default: console.log(card.name); return 0;
		}
	}
	function getEffectDuration(card: IDataBattleCard, effect: string) {
		if (effect == "Poison" && card.name == "Box of Frogs") return card.rarityType == bh.RarityType.SuperRare ? 5 : 4;
		if (["Bleed","Burn"].includes(effect) && card.name == "Rain Of Fire") return 4;
		if (effect == "Bleed" && card.name == "Fiery Stars") return 3;
		if (effect == "Regen") { return getRegenDuration(card); }
		return 1;
	}
	function getFlurryCount(card: IDataBattleCard) {
		switch (card.name) {
			case "Flaming Stars": return 4;

			case "Annoying Elves": return 6;
			case "Blazing Stars": return 6;
			case "Box of Frogs": return 6;
			case "Cornholio": return 6;
			case "Easter Eggs": return 6;
			case "Pumpkin Field": return 6;
			case "Snowballs Squall": return 6;
			case "Vampiric Bats": return 6;
			case "Vampiric Lord": return 6;

			case "Fiery Stars": return 8;
			case "Sweet Corn": return 8;

			case "Rain Of Fire": return 10;

			case "Uber Cornholio": return 12;

			default: return 1;
		}
	}
	function getFlurryMiss(card: IDataBattleCard) {
		switch (card.name) {
			case "Box of Frogs": if (card.rarityType == bh.RarityType.Legendary) return 0.15;
			case "Annoying Elves":
			case "Blazing Stars":
			case "Cornholio":
			case "Easter Eggs":
			case "Fiery Stars":
			case "Flaming Stars":
			case "Pumpkin Field":
			case "Snowballs Squall":
			case "Sweet Corn":
			case "Vampiric Bats":;
			case "Vampiric Lord": return 0.25;

			case "Rain Of Fire": return 0.5;
			case "Uber Cornholio": return 0.5;

			default: return 0;
		}
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