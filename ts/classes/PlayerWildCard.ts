namespace bh {
	export class PlayerWildCard {
		private _: IDataWildCard;

		public constructor(public player: Player, guid: string) {
			this._ = data.WildCardRepo.find(guid);
		}

		public get count() { return (<any>this.player)._pp ? (<any>this.player)._pp.wildcards[this.guid] || 0 : 0; }
		public get guid() { return this._.guid; }
		public get html() {
			var needed = this.needed,
				ofContent = needed ? ` / ${utils.formatNumber(needed)}` : "",
				css = needed ? this.count < needed ? "bg-danger" : "bg-success" : "",
				badge = `<span class="badge pull-right ${css}">${this.count}${ofContent}</span>`;
			return `${getImg("cardtypes", "WildCard")} ${this.name} WC ${badge}`;
		}
		public get name() { return this._.name; }
		public get needed() {
			var needed = 0;
			this.player
				.filterActiveBattleCards(RarityType[<any>this.rarityType])
				.forEach(playerBattleCard => needed += playerBattleCard.maxWildCardsNeeded);
			return needed;
		}
		public get rarityType() { return RarityType[<GameRarity>this._.name.replace(/ /g, "")]; }
		public get rowHtml() {
			var html = this.html,
				expander = "",
				children = "";
			if (this.needed) {
				expander = `<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-button" type="button" data-action="toggle-child" data-guid="${this.guid}">[+]</button>`;
				children = `<div class="brain-hud-child-scroller" data-parent-guid="${this.guid}">`;
				this.player
					.filterActiveBattleCards(RarityType[<any>this.rarityType])
					.forEach(playerBattleCard => children += playerBattleCard.toRowHtml(playerBattleCard.maxWildCardsNeeded, this.count));
				children += "</div>";
			}
			return `<div data-type="${this.type}" data-rarity-type="${this.rarityType}"><div>${html} ${expander}</div>${children}</div>`;
		}
		public type = "WildCard";
	}
}