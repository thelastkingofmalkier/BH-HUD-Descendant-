/// <reference path="./Cacheable.ts" />

namespace bh {

	function formatRow(imageGroup: string, imageName: string, name: string, badgeValue: number | string) {
		if (typeof(badgeValue) == "number") { badgeValue = utils.formatNumber(badgeValue); }
		return `<div data-hud="true">${getImg20(imageGroup, imageName)} ${name}<span class="badge pull-right">${badgeValue}</span></div>`;
	}

	export class Player extends Cacheable {
		private _pp: IPlayer.Player;
		private _gp: IGuild.Player;

		public constructor(json: IPlayer.Player | IGuild.Player, public isArena = false) {
			super();
			if (data.isPlayer(json)) { this._pp = <IPlayer.Player>json; }
			if (data.isGuildPlayer(json)) { this._gp = <IGuild.Player>json; }
		}

		public get fameLevel() { return (this._pp && this._pp.fameLevel || this._gp.fameLevel) + 1; }
		public get fragments() { return this._pp && this._pp.fragments || 0; }
		public get fragmentsRowHtml() { return this._pp ? formatRow("misc", "Fragments", "Fragments", this.fragments) : ""; }
		public get gems() { return this._pp && this._pp.gems || 0; }
		public get gemsRowHtml() { return this._pp ? formatRow("misc", "GemStone", "Gems", this.gems) : ""; }
		public get gold() { return this._pp && this._pp.gold || 0; }
		public get goldNeeded(): number {
			return this.fromCache("goldNeeded", () => {
				var needed = 0;
				this.activeBattleCards.forEach(battleCard => needed += battleCard.maxMaxGoldNeeded);
				this.heroes.forEach(playerHero => needed += playerHero ? playerHero.trait.maxGoldCost + playerHero.active.maxGoldCost + playerHero.passive.maxGoldCost : 0);
				return needed;
			});
		}
		public get goldRowHtml() {
			var needed = this.goldNeeded,
				asterisk = "<sup>*</sup>", // AT SOME POINT REMOVE THIS WHEN ALL MATH IS ACCOUNTED FOR
				badge = needed ? `${utils.formatNumber(this.gold)} / ${utils.formatNumber(Math.abs(needed))}${asterisk}` : utils.formatNumber(this.gold);
			return this._pp ? formatRow("misc", "Coin", "Gold", badge) : "";
		}
		public get guid() { return this._pp && this._pp.id || this._gp.playerId; }
		public get guild() { return data.guilds.findByGuid(this.guildGuid); }
		public get guildGuid() { return this._pp ? this._pp.playerGuild || null : this._gp && this._gp.guildId || null; }
		public get guildParent() { var guildName = data.guilds.findNameByGuid(this.guildGuid); return guildName && guildName.parent || null; }
		public get guilds(): IGuild.Name[] {
			return this.fromCache("guilds", () => data.guilds.filterNamesByParent(this.guildParent));
		}
		public get heroes(): PlayerHero[] {
			return this.fromCache("heroes", () => {
				var archetypes: IPlayer.Hero[];
				if (this._pp) {
					archetypes = this._pp.archetypes || [];
				}else {
					archetypes = Object.keys(this._gp.archetypeLevels).map(guid => {
						return <any>{ playerId:this.guid, id:guid, level:this._gp.archetypeLevels[guid] };
					});
				}
				return archetypes.map(archetype => new PlayerHero(this, archetype));
			});
		}
		public get isAlly(): boolean {
			return this.fromCache("isAlly", () => !!Player.me.guilds.find(g => g.guid == this.guildGuid));
		}
		public get canScout() { return this.guid == "b0a8b57b-54f5-47d8-8b7a-f9dac8300ca0"; }
		public get isExtended() { return !!this._pp; }
		public get isFullMeat() { return this.heroes.length == data.HeroRepo.length && !this.heroes.find(hero => !hero.isMeat); }
		public get isMe() { return [Messenger.ActivePlayerGuid, "b0a8b57b-54f5-47d8-8b7a-f9dac8300ca0"].includes(this.guid); }
		public get name() { return this._pp ? this._pp.name : this._gp && this._gp.name || null; }
		public get position() { return this._gp && this._gp.position || null; }
		public get averagePowerPercent() { var percents = this.heroes.map(ph => ph.powerPercent); return Math.floor(percents.reduce((out, p) => out + p, 0) / percents.length); }
		public get powerPercent() { var percentSum = this.heroes.map(ph => ph.powerPercent).reduce((score, pp) => score + pp, 0), max = data.HeroRepo.length * 100; return Math.floor(100 * percentSum / max); }
		public get powerRating() { return this.heroes.reduce((power, hero) => power + hero.powerRating, 0); }
		public get raidRowHtml() { return this._pp ? formatRow("keys", "RaidTicket", "Raid Tickets", this.raidTickets) : ""; }
		public get raidTickets() { return this._pp && this._pp.raidKeys || 0; }
		public get battleCards(): PlayerBattleCard[] { return this.fromCache("battleCards", () => !(this._pp && this._pp.playerCards && this._pp.playerCards.cards) ? [] : this.sortAndReduceBattleCards(Object.keys(this._pp.playerCards.cards))); }
		public get activeBattleCards(): PlayerBattleCard[] { return this.fromCache("activeBattleCards", () => this.battleCards.filter(battleCard => battleCard.isActive)); }
		public get activeRecipes(): Recipe[] { return this.fromCache("activeRecipes", () => this.activeBattleCards.map(bc => new Recipe(bc).createPartial(bc)).filter(r => !!r)); }
		public get boosterCards() { var map = this._pp && this._pp.feederCardsMap; return !map ? [] : Object.keys(map).map(guid => new PlayerBoosterCard(guid, map[guid])).sort(utils.sort.byElementThenRarityThenName); }
		public get boosterCount() { var count = 0, map = this._pp && this._pp.feederCardsMap; Object.keys(map || {}).map(guid => count += map[guid]); return count; }
		public get boosterRowHtml() { return this._pp ? PlayerBoosterCard.rowHtml(this.boosterCount) : ""; }
		public get inventory() { var mats = this._pp && this._pp.craftingMaterials, playerHeroes = this.heroes; return !mats ? [] : Object.keys(mats).map(guid => new PlayerInventoryItem(this, data.ItemRepo.find(guid), mats[guid])).sort(utils.sort.byRarityThenName); }
		public get wildCards(): PlayerWildCard[] { return this.fromCache("wildCards", () => data.WildCardRepo.all.map(wc => new PlayerWildCard(this, wc.guid))); }
		public get wildCardRowHtml() { return this._pp ? formatRow("cardtypes", "WildCard", "Wild Cards", this.wildCards.filter(wc => wc.count).slice(-3).map(wc => RarityType[wc.rarityType][0] + ":" + wc.count).join(" / ")) : ""; }

		private battleCardToPlayerBattleInfo(guid: string) {
			var playerCard = this._pp.playerCards.cards[guid];
			return new PlayerBattleCard(playerCard);
		}
		public filterActiveBattleCards(...args: string[]) {
			var element: GameElement, rarity: GameRarity, name: string, hero: Hero;
			args.forEach(arg => isElement(arg) ? element = <GameElement>arg : isRarity(arg) ? rarity = <GameRarity>arg : name = arg);
			if (name) hero = data.HeroRepo.find(name);
			return this.activeBattleCards.filter(battleCard => battleCard.matchesElement(element) && battleCard.matchesRarity(rarity) && battleCard.matchesHero(hero));
		}
		public filterHeroes(elementOrName: string) {
			var element = isElement(elementOrName) ? <GameElement>elementOrName : null,
				name = !element ? elementOrName : null;
			return this.heroes.filter(playerHero => playerHero && ((element && ElementType[playerHero.elementType] == element) || (name && playerHero.name == name)));
		}

		public findPlayerCard(guid: string) {
			var cards = this._pp && this._pp.playerCards.cards,
				card = cards && cards[guid];
			if (!card && cards) {
				var guids = Object.keys(cards),
					match = guids.find(g => g == guid || cards[g].configId == guid);
				card = cards[match];
			}
			return card;
		}

		public merge(player: IPlayer.Player) {
			var mine = this._pp && this._pp.archetypes || [],
				theirs = player.archetypes || [];
			theirs.forEach(theirArch => {
				if (!mine.find(myArch => myArch.id == theirArch.id)) {
					mine.push(theirArch);
				}
			});
		}

		public sortAndReduceBattleCards(guids: string[]) {
			var cards = guids.map(guid => this.battleCardToPlayerBattleInfo(guid)),
				sorted = cards.sort(utils.sort.byRarityThenNameThenEvoLevel),
				reduced: PlayerBattleCard[] = [];
			sorted.forEach(card => {
				var existing = reduced.find(c => c.matches(card));
				if (existing) { existing.count++; } else { reduced.push(card); }
			});
			return reduced;
		}

		public static get me() { return data.PlayerRepo.find(Messenger.ActivePlayerGuid); }
	}
}