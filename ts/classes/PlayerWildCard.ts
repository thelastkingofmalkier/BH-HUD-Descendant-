namespace bh {
	export class PlayerWildCard implements IHasRarity {
		private _: IDataWildCard;

		public constructor(public player: Player, guid: string) {
			this._ = data.WildCardRepo.find(guid);
		}

		public get count() { return (<any>this.player)._pp.wildcards[this.guid]; }
		public get guid() { return this._.guid; }
		public get html() {
			var needed = this.needed,
				ofContent = needed ? ` / ${utils.formatNumber(needed)}` : "",
				badge = `<span class="badge pull-right">${this.count}${ofContent}</span>`;
			return `${getImg("cardtypes", "WildCard")} ${this.name} WC ${badge}`;
		}
		public get name() { return this._.name; }
		public get needed() {
			var needed = 0;
			this.player
				.filterActiveBattleCards(this.rarity)
				.forEach(playerBattleCard => needed += playerBattleCard.maxWildCardsNeeded);
			return needed;
		}
		public get rarity(): "Common" | "Uncommon" | "Rare" | "Super Rare" | "Legendary" { return <any>this._.name; }
		public get rowHtml() {
			var html = this.html,
				expander = "",
				children = "";
			if (this.needed) {
				expander = `<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-button" type="button" data-action="toggle-child" data-guid="${this.guid}">[+]</button>`;
				children = `<div class="brain-hud-child-scroller" data-parent-guid="${this.guid}">`;
				this.player
					.filterActiveBattleCards(this.rarity)
					.forEach(playerBattleCard => children += playerBattleCard.wcHtml);
				children += "</div>";
			}
			return `<div data-type="${this.type}" data-rarity="${this.rarity}"><div>${html} ${expander}</div>${children}</div>`;
		}
		public type = "WildCard";
	}
}