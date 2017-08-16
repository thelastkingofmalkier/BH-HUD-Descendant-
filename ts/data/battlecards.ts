namespace bh {
	export namespace data {
		export namespace cards {
			export namespace battle {
				var gid = 1325382981;

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
				export function calcDelta(min: number, max: number, rarityType: RarityType) {
					return (max - min) / (levelsPerRarity(rarityType) - 1);
				}
				export function levelsPerRarity(rarityType: RarityType) {
					return [10,20,35,50,50][rarityType];
				}
				export function evoMultiplier(fromEvo: number) {
					return [0.80, 0.85, 0.88, 0.90, 1.0][fromEvo];
				}
				export function calculateValue(playerCard: IPlayer.PlayerCard, typeIndex = 0): number {
					var card = find(playerCard.configId);
					if (!card) return 0;
					var min = card.minValues[typeIndex][playerCard.evolutionLevel],
						delta = calcDelta(card.minValues[typeIndex].slice().pop(), card.maxValues[typeIndex], card.rarityType);
					return Math.floor(min + delta * playerCard.level);
				}

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
function updateCardData() {
	$.get("https://docs.google.com/spreadsheets/d/1xckeq3t9T2g4sR5zgKK52ZkXNEXQGgiUrJ8EQ5FJAPI/pub?output=tsv").then(raw => {
		var mapped = bh.Repo.mapTsv<INewCard>(raw),
			cards = mapped.map(card => {
			var guid = card["Id"],
				existing = bh.data.cards.battle.find(guid),
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
				effects: [1,2,3].map(i => card[`Effect #${i}`]).filter(s => !!s)
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