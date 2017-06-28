namespace bh {
	export class PlayerInventoryItem {

		public constructor(public player: Player, public item: InventoryItem, public count = 0) { }

		// Passthrough for InventoryItem
		public get element() { return this.item.element; }
		public get elementType() { return ElementType[this.item.element] }
		public get guid() { return this.item.guid; }
		public get name() { return this.item.name; }
		public get rarity() { return this.item.rarity; }
		public get type() { return this.item.type; }

		// New to PlayerInventoryItem
		public get needed() {
			var needed = 0;
			if (this.type == "Rune") {
				var heroName = this.name.split(`'`)[0];
				this.player
					.filterHeroes(heroName)
					.forEach(playerHero => needed += playerHero.trait.maxMaterialCount || 0);
				this.player
					.filterActiveBattleCards(heroName, "Legendary")
					.forEach(battleCard => needed += battleCard.count * 60);
			}
			if (this.type == "Crystal") {
				this.player
					.filterHeroes(this.element)
					.forEach(playerHero => needed += (playerHero.active.maxMaterialCount || 0) + (playerHero.passive.maxMaterialCount || 0));
				this.player
					.filterActiveBattleCards(this.element, "Legendary")
					.forEach(battleCard => needed += battleCard.count * 60);
			}
			if (this.name == "Sands of Time") {
				this.player.activeBattleCards.forEach(playerBattleCard => needed += playerBattleCard.maxMaxSotNeeded);
			}
			return needed;
		}
		public get rowHtml() {
			var folder = this.type == "Evo Jar" ? "evojars" : this.type == "Crystal" ? "crystals" : "runes",
				name = this.type == "Evo Jar" ? this.name.replace(/\W/g, "") : this.type == "Crystal" ? this.name.split(/ /)[0] : data.HeroRepo.find(this.name.split("'")[0]).abilities[0].name.replace(/\W/g, ""),
				image = getImg20(folder, name),
				needed = this.needed,
				ofContent = needed ? ` / ${utils.formatNumber(needed)}` : "",
				hud = this.name == "Sands of Time",
				badge = `<span class="badge pull-right">${this.count}${ofContent}</span>`,
				children = "";
			if (needed && (this.type == "Crystal" || this.type == "Rune" || this.name == "Sands of Time")) {
				if (this.type == "Crystal") {
					this.player
						.filterHeroes(this.element)
						.forEach(playerHero => children += playerHero.active.evoHtml + playerHero.passive.evoHtml);
					this.player
						.filterActiveBattleCards(this.element, "Legendary")
						.forEach(battleCard => children += battleCard.evoHtml);
				}
				if (this.type == "Rune") {
					var heroName = this.name.split(`'`)[0];
					this.player
						.filterHeroes(heroName)
						.forEach(playerHero => children += playerHero.trait.evoHtml);
					this.player
						.filterActiveBattleCards(heroName, "Legendary")
						.forEach(battleCard => children += battleCard.evoHtml);
				}
				if (this.name == "Sands of Time") {
					this.player
						.activeBattleCards
						.forEach(playerBattleCard => children += playerBattleCard.sotHtml);
				}
			}
			return `<div data-element="${this.element}" data-rarity="${this.rarity}" data-type="${this.type}" data-hud="${hud}">${renderExpandable(this.guid, `${image} ${this.name} ${badge}`, children)}</div>`;
		}
	}
	export function renderExpandable(guid: string, text: string, children: string) {
		if (!children) return `<div>${text}</div>`;
		var expander = `<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-button" type="button" data-action="toggle-child" data-guid="${guid}">[+]</button>`,
			expandable = `<div class="brain-hud-child-scroller" data-parent-guid="${guid}">${children}</div>`;
		return `<div>${text} ${expander}</div>${expandable}`;
	}
}