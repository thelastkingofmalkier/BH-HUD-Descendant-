/// <reference path="../classes/repos/BattleCardRepo.ts"/>
/// <reference path="../classes/repos/BoosterCardRepo.ts"/>
/// <reference path="../classes/repos/EffectRepo.ts"/>
/// <reference path="../classes/repos/HeroRepo.ts"/>
/// <reference path="../classes/repos/ItemRepo.ts"/>

namespace bh {
	export namespace data {
		export var BattleCardRepo = new bh.BattleCardRepo();
		export var BoosterCardRepo = new bh.BoosterCardRepo();
		export var EffectRepo = new bh.EffectRepo();
		export var HeroRepo = new bh.HeroRepo();
		export var ItemRepo = new bh.ItemRepo();
		export var PlayerRepo = new Repo<Player>();
		export var WildCardRepo = new Repo<IDataWildCard>(2106503523, true);

		export function arenaToPlayers(json: any): IPlayer.Player[] {
			var players: IPlayer.Player[] = [];
			if (Array.isArray(json)) {
				if (json.length == 3) {
					(<any[]>json).forEach(match => {
						var indexKeys = Object.keys(match) || [],
							indexKey = indexKeys[0] || "0",
							playerContainer = match[indexKey],
							playerGuids = Object.keys(playerContainer) || [],
							playerGuid = playerGuids[0] || "",
							player = playerContainer[playerGuid] || null;
						if (isPlayer(player)) players.push(player);
					});
				}
			}
			return players;
		}
		export function isGuildWar(json: any): boolean {
			return json && json.guilds && json.currentWar && true;
		}
		export function isGuild(json: any): boolean {
			return json && json.playerGuild && json.members && true;
		}
		export function isArena(json: any): boolean {
			return arenaToPlayers(json).length && true;
		}
		export function isPlayer(json: any): boolean {
			return json && json.id && json.firstPlayedVersion && true;
		}
		export function isGuildMembers(json: any): boolean {
			return json && Array.isArray(json) && !json.map(isGuildPlayer).includes(false);
		}
		export function isGuildPlayer(json: any): boolean {
			return json && json.playerId && json.archetypeLevels && true || false;
		}

		var _init: Promise<any>;
		export function init(): Promise<any> {
			if (!_init) {
				_init = Promise.all<any>([guilds.init()].concat(Repo.init()));
			}
			return _init;
		}

	}
}
