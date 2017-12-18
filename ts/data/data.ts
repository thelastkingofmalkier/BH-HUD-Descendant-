/// <reference path="../classes/repos/BattleCardRepo.ts"/>
/// <reference path="../classes/repos/BoosterCardRepo.ts"/>
/// <reference path="../classes/repos/EffectRepo.ts"/>
/// <reference path="../classes/repos/HeroRepo.ts"/>
/// <reference path="../classes/repos/ItemRepo.ts"/>

var DataSheetID = "1uXkC_xua7KhhWQsfX_CZNa6fyl9CJlV9E7KNDO4_1T4";
var BattleCardRepoGID = 1013492615;
var BoosterCardRepoGID = 1070164839;
var DungeonRepoGID = 1980099142;
var EffectRepoGID = 1091073205;
var HeroRepoGID = 1755919442;
var ItemRepoGID = 1250310062;
var WildCardRepoGID = 2106503523;
var GuildsGID = 496437953;
var USE_CACHE = true;
var NO_CACHE = false;
var MaxFameLevel = 45;
var AttackDivisor = 888;
var ShieldDivisor = 888 * 2;
var HealDivisor = 888 * 3;

var BattleCardDataUrl = "https://docs.google.com/spreadsheets/d/1xckeq3t9T2g4sR5zgKK52ZkXNEXQGgiUrJ8EQ5FJAPI/pub?output=tsv";
var DungeonDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCyjBTeKjsBri_uvkFnT-i9f-jI4RUR0YffYh32XFtQfywivXktmLcmGOuXTfOQZH1sv6VTmF9Ceee/pub?gid=1815567292&single=true&output=tsv";

namespace bh {
	export namespace data {
		export var BattleCardRepo = new bh.BattleCardRepo(DataSheetID, BattleCardRepoGID, NO_CACHE||true);
		export var BoosterCardRepo = new bh.BoosterCardRepo(DataSheetID, BoosterCardRepoGID, USE_CACHE);
		export var DungeonRepo = new bh.DungeonRepo(DataSheetID, DungeonRepoGID, NO_CACHE||true);
		export var EffectRepo = new bh.EffectRepo(DataSheetID, EffectRepoGID, NO_CACHE||true);
		export var HeroRepo = new bh.HeroRepo(DataSheetID, HeroRepoGID, USE_CACHE&&false);
		export var ItemRepo = new bh.ItemRepo(DataSheetID, ItemRepoGID, USE_CACHE);
		export var PlayerRepo = new Repo<Player>();
		export var WildCardRepo = new Repo<IDataWildCard>(DataSheetID, WildCardRepoGID, USE_CACHE);

		export function arenaToPlayers(json: any): IPlayer.Player[] {
			var players: IPlayer.Player[] = [];
			if (Array.isArray(json)) {
				if (json.length > 0) {
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
