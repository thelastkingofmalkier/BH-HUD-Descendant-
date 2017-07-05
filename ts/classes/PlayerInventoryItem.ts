namespace bh {

	export class PlayerInventoryItem {

		public constructor(public player: Player, public item: InventoryItem, public count = 0) { }

		// Passthrough for InventoryItem
		public get elementType() { return this.item.elementType; }
		public get guid() { return this.item.guid; }
		public get itemType() { return this.item.itemType; }
		public get name() { return this.item.name; }
		public get rarityType() { return this.item.rarityType; }

		// New to PlayerInventoryItem
		public get isCrystal() { return this.itemType === ItemType.Crystal; }
		public get isEvoJar() { return this.itemType === ItemType.EvoJar; }
		public get isSandsOfTime() { return this.name === "Sands of Time"; }
		public get isRune() { return this.itemType === ItemType.Rune; }
		public get needed() {
			var needed = 0;
			if (this.isRune) {
				var heroName = this.name.split(`'`)[0];
				this.player
					.filterHeroes(heroName)
					.forEach(playerHero => needed += playerHero.trait.maxMaterialCount || 0);
				this.player
					.filterActiveBattleCards(heroName, "Legendary")
					.forEach(battleCard => needed += battleCard.count * 60);

			}else if (this.isCrystal) {
				this.player
					.filterHeroes(ElementType[this.elementType])
					.forEach(playerHero => needed += (playerHero.active.maxMaterialCount || 0) + (playerHero.passive.maxMaterialCount || 0));
				this.player
					.filterActiveBattleCards(ElementType[this.elementType], "Legendary")
					.forEach(battleCard => needed += battleCard.count * 60);

			}else if (this.isSandsOfTime) {
				this.player.activeBattleCards.forEach(playerBattleCard => needed += playerBattleCard.maxMaxSotNeeded);

			}else {
				var activeRecipes = this.player.activeRecipes,
					recipes = data.RecipeRepo.findByMaterial(this.name),
					filtered = recipes.filter(recipe => activeRecipes.includes(recipe));
				filtered.forEach(recipe => {
					var item = recipe.getItemByName(this.name);
					needed += item.max;
				});

			}
			return needed;
		}
		public get rowHtml() {
			var folder = ItemType[this.itemType].toLowerCase() + "s",
				name = this.isEvoJar ? this.name.replace(/\W/g, "") : this.isCrystal ? this.name.split(/ /)[0] : data.HeroRepo.find(this.name.split("'")[0]).abilities[0].name.replace(/\W/g, ""),
				image = getImg20(folder, name),
				needed = this.needed,
				ofContent = needed ? ` / ${utils.formatNumber(needed)}` : "",
				hud = this.isSandsOfTime,
				badge = `<span class="badge pull-right">${utils.formatNumber(this.count)}${ofContent}</span>`,
				children = "";
			if (needed) {
				if (this.isCrystal) {
					this.player
						.filterHeroes(ElementType[this.elementType])
						.forEach(playerHero => children += playerHero.active.evoHtml + playerHero.passive.evoHtml);
					this.player
						.filterActiveBattleCards(ElementType[this.elementType], "Legendary")
						.forEach(battleCard => children += battleCard.evoHtml);

				}else if (this.isRune) {
					var heroName = this.name.split(`'`)[0];
					this.player
						.filterHeroes(heroName)
						.forEach(playerHero => children += playerHero.trait.evoHtml);
					this.player
						.filterActiveBattleCards(heroName, "Legendary")
						.forEach(battleCard => children += battleCard.evoHtml);

				}else if (this.isSandsOfTime) {
					this.player
						.activeBattleCards
						.forEach(playerBattleCard => children += playerBattleCard.toRowHtml(playerBattleCard.maxMaxSotNeeded));

				}else {
					var activeRecipes = this.player.activeRecipes,
						recipes = data.RecipeRepo.findByMaterial(this.name),
						filtered = recipes.filter(recipe => activeRecipes.includes(recipe));
if (this.name == "Spindle Eggs") console.log(recipes)
					filtered.forEach(recipe => {
						var item = recipe.getItemByName(this.name),
							playerBattleCard = this.player.activeBattleCards.find(bc => bc.name == recipe.name && bc.rarityType === recipe.rarityType);
						children += playerBattleCard.toRowHtml(item.max);
					});

				}
			}
			return `<div data-element-type="${this.elementType}" data-rarity-type="${this.rarityType}" data-item-type="${this.itemType}" data-hud="${hud}">${renderExpandable(this.guid, `${image} ${this.name} ${badge}`, children)}</div>`;
		}
	}
	export function renderExpandable(guid: string, text: string, children: string) {
		if (!children) return `<div>${text}</div>`;
		var expander = `<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-button" type="button" data-action="toggle-child" data-guid="${guid}">[+]</button>`,
			expandable = `<div class="brain-hud-child-scroller" data-parent-guid="${guid}">${children}</div>`;
		return `<div>${text} ${expander}</div>${expandable}`;
	}
}