/// <reference path="../classes/EffectRepo.ts"/>
/// <reference path="../classes/HeroRepo.ts"/>
/// <reference path="../classes/ItemRepo.ts"/>

namespace bh {
	export function getMaxLevel(fame: number) { return fame * 2; }
	export function getMaxTrait(level: number) { return Math.max(level - 1, 0); }
	export function getMaxActive(hero: Hero, level: number) { return hero.name == "Jinx" ? Math.max(level - 29, 0) : Math.max(level - 14, 0); }
	export function getMaxPassive(hero: Hero, level: number) { return hero.name == "Jinx" ? Math.max(level - 14, 0) : Math.max(level - 29, 0); }
	export function getAbilityLevelCap(playerHeroAbility: PlayerHeroAbility) {
		switch (playerHeroAbility.type) {
			case AbilityType.Active: return getMaxActive(playerHeroAbility.hero, playerHeroAbility.level);
			case AbilityType.Passive: return getMaxPassive(playerHeroAbility.hero, playerHeroAbility.level);
			case AbilityType.Trait: return getMaxTrait(playerHeroAbility.level);
		}
	}
	export function getAbilityLevelMax(playerHeroAbility: PlayerHeroAbility) {
		switch (playerHeroAbility.type) {
			case AbilityType.Active: return getMaxActive(playerHeroAbility.hero, MaxLevel);
			case AbilityType.Passive: return getMaxPassive(playerHeroAbility.hero, MaxLevel);
			case AbilityType.Trait: return getMaxTrait(MaxLevel);
		}
	}

	export var MaxFame = 45;
	export var MaxLevel = getMaxLevel(MaxFame);

	export function getAbilityMaxLevel(hero: Hero, abilityType: AbilityType) {
		switch(abilityType) {
			case AbilityType.Active: return getMaxActive(hero, MaxLevel);
			case AbilityType.Passive: return getMaxPassive(hero, MaxLevel);
			case AbilityType.Trait: return getMaxTrait(MaxLevel);
		}
	}

	export function isElement(element: string) { return String(element) in ElementType; }

	export function isRarity(rarity: string) { return String(rarity).replace(/ /g, "") in RarityType; }

	export namespace data {
		export var BoosterCardRepo = new Repo<IDataBoosterCard>(1709781959, true);
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
				_init = Promise.all<any>([cards.battle.init(), guilds.init()].concat(Repo.init()));
			}
			return _init;
		}

	}
}
