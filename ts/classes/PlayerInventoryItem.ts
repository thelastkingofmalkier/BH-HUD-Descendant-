namespace bh {

	export class PlayerInventoryItem {

		public constructor(public player: Player, public item: IDataInventoryItem, public count = 0) { }

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
					filtered = activeRecipes.filter(recipe => !!recipe.getItem(this));
				filtered.forEach(recipe => needed += recipe.getMaxNeeded(this));

			}
			return needed;
		}
		public get rowHtml() {
			var folder = ItemType[this.itemType].toLowerCase() + "s",
				name = this.isEvoJar ? this.name.replace(/\W/g, "") : this.isCrystal ? this.name.split(/ /)[0] : data.HeroRepo.find(this.name.split("'")[0]).abilities[0].name.replace(/\W/g, ""),
				image = getImg20(folder, name),
				needed = this.needed,
				ofContent = needed ? ` / ${utils.formatNumber(needed)}` : "",
				color = needed ? this.count >= needed ? "bg-success" : "bg-danger" : "",
				badge = `<span class="badge pull-right ${color}">${utils.formatNumber(this.count)}${ofContent}</span>`,
				children = "";
			if (needed) {
				if (this.isCrystal) {
					this.player
						.filterHeroes(ElementType[this.elementType])
						.forEach(playerHero => {
							var active = playerHero.active, maxNeededActive: number,
								passive = playerHero.passive, maxNeededPassive: number;
							if (maxNeededActive = active.maxMaterialCount) {
								children += active.toRowHtml(maxNeededActive, this.count);
							}
							if (maxNeededPassive = passive.maxMaterialCount) {
								children += passive.toRowHtml(maxNeededPassive, this.count);
							}
						});
					this.player
						.filterActiveBattleCards(ElementType[this.elementType], "Legendary")
						.forEach(battleCard => {
							var maxNeeded = battleCard.count * data.calcMaxCrystalsNeeded(battleCard.playerCard, battleCard.evoLevel);
							children += battleCard.toRowHtml(maxNeeded, this.count);
						});

				}else if (this.isRune) {
					var heroName = this.name.split(`'`)[0];
					this.player
						.filterHeroes(heroName)
						.forEach(playerHero => {
							var trait = playerHero.trait, maxNeeded: number;
							if (maxNeeded = trait.maxMaterialCount) {
								children += trait.toRowHtml(maxNeeded, this.count);
							}
						});
					this.player
						.filterActiveBattleCards(heroName, "Legendary")
						.forEach(battleCard => {
							var maxNeeded = battleCard.count * data.calcMaxRunesNeeded(battleCard.playerCard, battleCard.evoLevel);
							children += battleCard.toRowHtml(maxNeeded, this.count);
						});

				}else if (this.isSandsOfTime) {
					this.player
						.activeBattleCards
						.forEach(playerBattleCard => {
							var maxNeeded = playerBattleCard.maxMaxSotNeeded;
							children += playerBattleCard.toRowHtml(playerBattleCard.maxMaxSotNeeded, this.count);
						});

				}else {
					var activeRecipes = this.player.activeRecipes,
						filtered = activeRecipes.filter(recipe => { var recipeItem = recipe.getItem(this); return recipeItem && recipeItem.max != 0; });
					filtered.forEach(recipe => {
						var maxNeeded = recipe.getMaxNeeded(this);
						children += (<PlayerBattleCard>recipe.card).toRowHtml(maxNeeded, this.count);
					});

				}
			}
			return `<div data-element-type="${this.elementType}" data-rarity-type="${this.rarityType}" data-item-type="${this.itemType}" data-hud="${this.isSandsOfTime}">${renderExpandable(this.guid, `${image} ${this.name} ${badge}`, children)}</div>`;
		}
		public static toRowHtml(item: PlayerInventoryItem, count: number, needed: number) {
			var folder = ItemType[item.itemType].toLowerCase() + "s",
				name = item.isEvoJar ? item.name.replace(/\W/g, "") : item.isCrystal ? item.name.split(/ /)[0] : data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name.replace(/\W/g, ""),
				image = getImg20(folder, name),
				color = count > needed ? "bg-success" : "bg-danger",
				badge = `<span class="badge pull-right ${color}">${utils.formatNumber(count)} / ${utils.formatNumber(needed)}</span>`;
			return `<div>${image} ${item.name} ${badge}</div>`;
		}
	}
	export function renderExpandable(guid: string, text: string, children: string) {
		if (!children) return `<div>${text}</div>`;
		var expander = `<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-button" type="button" data-action="toggle-child" data-guid="${guid}">[+]</button>`,
			expandable = `<div class="brain-hud-child-scroller" data-parent-guid="${guid}">${children}</div>`;
		return `<div>${text} ${expander}</div>${expandable}`;
	}
}