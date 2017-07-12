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

				export function calcDelta(base: number, max: number, rarityType: RarityType) {
					if (rarityType == RarityType.Common) { return (5 * max - 4 * base) / 81; }
					if (rarityType == RarityType.Uncommon) { return (100 * max - 68 * base) / 4807; }
					if (rarityType == RarityType.Rare) { return 625 * max / 68561 - 22 * base / 4033; }
					if (rarityType == RarityType.SuperRare) { return (12500 * max - 6732 * base) / 2391053; }
					if (rarityType == RarityType.Legendary) { return (12500 * max - 6732 * base) / 3003553; }
					return 0;
				}
				export function calcValue(base: number, max: number, rarityType: RarityType, evo: number, level: number) {
					var delta = calcDelta(base, max, rarityType),
						levels = rarityType == RarityType.Common ? 9 : rarityType == RarityType.Uncommon ? 19 : rarityType == RarityType.Rare ? 34 : 49,
						value = base;
					if (0 < evo) { value = Math.floor((value + levels * delta) * 0.80); }
					if (1 < evo) { value = Math.floor((value + levels * delta) * 0.85); }
					if (2 < evo) { value = Math.floor((value + levels * delta) * 0.88); }
					if (3 < evo) { value = Math.floor((value + levels * delta) * 0.90); }
					if (4 < evo) { value = Math.floor((value + levels * delta) * 1.00); }
					value += level * delta;
					return Math.floor(value);
				}
				export function calculateValue(playerCard: IPlayer.PlayerCard): number {
					var card = find(playerCard.configId);
					return !card || !card.base || !card.max ? 0 : calcValue(card.base, card.max, card.rarityType, playerCard.evolutionLevel, playerCard.level);
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
