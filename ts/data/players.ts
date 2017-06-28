// namespace bh {
// 	export namespace data {
// 		export namespace players {
// 			export var tsv: string;

// 			var _players: Player[] = [];

// 			export function findByGuid(guid: string): Player {
// 				return _players.find(player => player.guid == guid);
// 			}

// 			export function filterByGuildGuid(guid: string) {
// 				return _players.filter(player => player.guildGuid == guid);
// 			}

// 			export function put(player: Player): void {
// 				var index = _players.findIndex(p => p.guid == player.guid);
// 				if (-1 < index) {
// 					if (_players[index].isArena) {
// 						_players[index] = player;
// 					}
// 				}else {
// 					_players.push(player);
// 				}
// 			}

// 		}
// 	}
// }
