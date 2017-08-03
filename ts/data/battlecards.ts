namespace bh {
	export namespace data {
		export namespace cards {
			export namespace battle {
				var gid = 795369586;

				var _cards: IDataBattleCard[] = [];

				export function getAll(): IDataBattleCard[] {
					return _cards.slice();
				}

				export function getBrag(): IDataBattleCard[] {
					return _cards.filter(card => card.brag);
				}

				export function find(guid: string): IDataBattleCard {
					return _cards.find(card => card.guid == guid);
				}
				export function findByName(name: string): IDataBattleCard;
				export function findByName(name: string, rarityType: RarityType): IDataBattleCard;
				export function findByName(name: string, rarityType?: RarityType): IDataBattleCard {
					var lower = name.toLowerCase();
					if (rarityType === undefined) { return _cards.find(card => card.lower == lower); }
					return _cards.find(card => card.rarityType === rarityType && card.lower == lower);
				}

				export function getMaxEvo(rarityType: RarityType): number {
					return rarityType + 1;
				}
				export function isMaxLevel(rarity: GameRarity, level: number): boolean {
					return level == levelsPerRarity(RarityType[<GameRarity>(rarity||"").replace(/ /, "")]);
				}

				export function truncDecimal(value: number, places: number = 0) {
					var s = String(value),
						parts = s.split(".");
					if (parts.length == 1 || places < 1) return +parts[0];
					return +(parts[0] + "." + parts[1].slice(0, places));
				}
				export function calcDelta(base: number, max: number, rarityType: RarityType) {
					if (rarityType == RarityType.Common) { return (5 * max - 4 * base) / 81; }
					if (rarityType == RarityType.Uncommon) { return (100 * max - 68 * base) / 4807; }
					if (rarityType == RarityType.Rare) { return 625 * max / 68561 - 22 * base / 4033; }
					if (rarityType == RarityType.SuperRare) { return (12500 * max - 6732 * base) / 2391053; }
					if (rarityType == RarityType.Legendary) { return (12500 * max - 6732 * base) / 3003553; }
					return 0;
				}
				export function levelsPerRarity(rarity: RarityType) {
					return [10,20,35,50,50][rarity];
				}
				export function evoMultiplier(fromEvo: number) {
					return [0.80, 0.85, 0.88, 0.90, 1.0][fromEvo];
				}
				export function calcValue(base: number, max: number, rarityType: RarityType, evo: number, level: number, _delta?: number) {
					var delta = _delta || calcDelta(base, max, rarityType),
						levels = levelsPerRarity(rarityType) - 1,
						value = base;
					for (var i = 0; i < evo; i++) {
						value += levels * delta;
						value *= evoMultiplier(i);
					}
					return Math.floor(value) + Math.floor(level * delta);
				}
				// export function calculateValue(playerCard: IPlayer.PlayerCard): number {
				// 	var card = find(playerCard.configId);
				// 	return !card || !card.base || !card.max ? 0 : calcValue(card.base, card.max, card.rarityType, playerCard.evolutionLevel, playerCard.level);
				// }

				var _init: Promise<IDataBattleCard[]>;
				export function init(): Promise<IDataBattleCard[]> {
					if (!_init) {
						_init = new Promise<IDataBattleCard[]>((resolvefn: (cards: IDataBattleCard[]) => void) => {
							var tsv = (TSV||{})[String(gid)];
							if (tsv) {
								resolvefn(parseTSV(tsv));
							}else {
								Repo.fetchTsv(null, gid).then(tsv => resolvefn(parseTSV(tsv)), () => resolvefn(_cards));
							}
						});
					}
					return _init;
				}
				function parseTSV(tsv: string) {
					return _cards = Repo.mapTsv<IDataBattleCard>(tsv);
				}

			}
		}
	}
}
interface INewCard { [key: string]: string; }
function parseValue(card: INewCard, key: string, index = 0) {
	var value = card[key];
	if (value.includes("/")) {
		return +value.split(/\s*\/\s*/)[index];
	}
	return +value;
}
function effectTypeToType(card: INewCard, index = 0): GameBattleCardType {
	var value = card["Effect Type"],
		indexValue = value.split(/\s*\/\s*/)[index] || "",
		val = indexValue.split(/\s*\-\s*/)[0] || "";
	switch(val) {
		case "": return null;
		case "Damage": return "Attack";
		case "Heal": return "Heal";
		case "Shield": return "Shield";
		default:
			console.log(`Type of "${value}" for index ${index}`);
			return <any>value;
	}
}
function effectTypeToTarget(card: INewCard, index = 0): GameBattleCardTarget {
	if (!effectTypeToType(card, index)) return null;
	var value = card["Effect Type"],
		indexValue = value.split(/\s*\/\s*/)[index] || "",
		val = indexValue.split(/\s*\-\s*/).slice(1).join("-");
	switch(val) {
		case "": return "Single";
		case "All": return "Multi";
		case "Flurry": return "Single Flurry";
		case "Flurry-All": return "Multi Flurry";
		case "Flurry-Self": return "Self Flurry";
		case "Self": return "Self";
		case "Splash": return "Splash";
		default:
			console.log(`Target of "${value}" for index ${index}`);
			return <any>value;
	}
}
function classToKlassType(value: string) {
	return bh.KlassType[value == "Ranged" ? "Skill" : value == "Melee" ? "Might" : "Magic"];
}
function minValues(card: INewCard, index = 0) {
	return [1,2,3,4,5].map(i => `${i}* Min`).map(key => {
		var value = card[key] || "";
		return +value.split(/\s*\/\s*/)[index] || null;
	}).filter(value => !!value);
}
function maxValue(card: INewCard, index = 0) {
	return [1,2,3,4,5].map(i => `${i}* Max`).map(key => {
		var value = card[key] || "";
		return +value.split(/\s*\/\s*/)[index] || null;
	}).filter(value => !!value).pop();
}
function mats(card: INewCard) {
	var mats = [1,2,3,4].map(i => (card[`${i}* Evo Jar`] || "").trim()).filter(mat => !!mat);
	mats.forEach(mat => { if (!bh.data.ItemRepo.find(mat)) console.log(mat); });
	return mats.join(",");
}
function updateCardData() {
	var cards = bh.Repo.mapTsv<INewCard>($("#data-output").val());
	cards.forEach(card => {
		var guid = card["Id"];
		var existing = bh.data.cards.battle.find(guid);
		var created: IDataBattleCard = {
			guid: guid,
			name: card["Name"],
			klassType: classToKlassType(card["Class"]),
			elementType: bh.ElementType[<GameElement>card["Element"]],
			rarityType: bh.RarityType[<GameRarity>card["Rarity"].replace(/ /, "")],
			turns: +card["Turns"],
			type: effectTypeToType(card),
			type2nd: effectTypeToType(card, 1),
			target: effectTypeToTarget(card),
			target2nd: effectTypeToTarget(card, 1),
			brag: bh.utils.parseBoolean(card["Is Brag?"]),
			minValues: minValues(card),
			minValues2nd: minValues(card, 1),
			maxValue: maxValue(card),
			maxValue2nd: maxValue(card, 1),
			tier: null,
			mats: mats(card)
		};
		if (existing) {
			Object.keys(created).forEach(key => {
				if (["tier","maxValue","maxValue2nd","minValues","minValues2nd"].includes(key)) return;
				if ((<any>created)[key] && (<any>created)[key] != (<any>existing)[key]) {
					console.log(`${existing.name} (${key}): ${(<any>created)[key]} != ${(<any>existing)[key]} `);
				}
			})
		}
	});
}