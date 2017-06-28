namespace bh {
	export namespace data {
		export namespace cards {
			export namespace battle {
				export var tsv: string;
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
				export function findByName(name: string): IDataBattleCard {
					return _cards.find(card => card.name == name);
				}

				export function getMaxEvo(rarity: "Legendary" | "Super Rare" | "Rare" | "Uncommon" | "Common"): number {
					return <any>RarityType[<any>rarity.replace(/ /, "")] + 1;
				}
				export function isMaxLevel(rarity: "Legendary" | "Super Rare" | "Rare" | "Uncommon" | "Common", level: number): boolean {
					return level == [10,20,35,50,50][<any>RarityType[<any>(rarity||"").replace(/ /, "")]];
				}

				export function calculateValue(playerCard: IPlayer.PlayerCard): number {
					var card = find(playerCard.configId),
						delta = card && card.delta || 0,
						levels = !card ? 0 : card.rarity == "Common" ? 9 : card.rarity == "Uncommon" ? 19 : card.rarity == "Rare" ? 34 : 49,
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
					_cards = Repo.mapTsv<IDataBattleCard>(tsv);
					_cards.forEach(card => {
						card.elementType = <any>ElementType[(<any>card).element];
						delete (<any>card).element;
					})
					return _cards;
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