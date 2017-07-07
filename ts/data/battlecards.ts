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
					return level == [10,20,35,50,50][<any>RarityType[<any>(rarity||"").replace(/ /, "")]];
				}

				export function calculateValue(playerCard: IPlayer.PlayerCard): number {
					var card = find(playerCard.configId),
						delta = card && card.delta || 0,
						levels = !card ? 0 : card.rarityType == RarityType.Common ? 9 : card.rarityType == RarityType.Uncommon ? 19 : card.rarityType == RarityType.Rare ? 34 : 49,
						value = card && card.base || 0;
					if (0 < playerCard.evolutionLevel) { value = (value + levels * delta) * 0.80; }
					if (1 < playerCard.evolutionLevel) { value = (value + levels * delta) * 0.85; }
					if (2 < playerCard.evolutionLevel) { value = (value + levels * delta) * 0.88; }
					if (3 < playerCard.evolutionLevel) { value = (value + levels * delta) * 0.90; }
					if (4 < playerCard.evolutionLevel) { value = (value + levels * delta) * 1.00; }
					value += playerCard.level * delta;
					return Math.floor(value);
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
/*
Turn count tag list:
• VERYSLOW = 5
• SLOW = 4
• MEDIUM = 3
• FAST = 2
• VERYFAST = 1
*/