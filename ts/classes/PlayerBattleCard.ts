namespace bh {
	function typesTargetsToTargets(values: string[]): GameBattleCardTarget[] {
		return values.map(s => s.trim()).filter(s => !!s).map(s => {
			var parts = s.split(" "),
				all = parts[1] == "All",
				single = parts[1] == "Single",
				splash = parts[1] == "Splash",
				self = parts[1] == "Self";
			if (s.includes("Flurry")) {
				if (self) { return "Self Flurry"; }
				if (all) { return "Multi Flurry"; }
				if (single) { return "Single Flurry"; }
			}
			if (self) { return "Self"; }
			if (single) { return "Single"; }
			if (all) { return "Multi"; }
			if (splash) { return "Splash"; }
			console.log(`Target of "${s}"`);
			return <any>s;
		});
	}
	export class PlayerBattleCard {
		private _bc: IDataBattleCard;
		public playerCard: IPlayer.PlayerCard;

		private _rowChildren() {
			var html = "";
			if (!this.isUnknown) {
				var me = Player.me,
					activeRecipe = new Recipe(this, true);
				if (activeRecipe) {
					var goldNeeded = data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count,
						goldOwned = me.gold,
						goldColor = goldOwned < goldNeeded ? `bg-danger` : `bg-success`;
					html += `<div>${getImg20("misc", "Coin")} Gold <span class="badge pull-right ${goldColor}">${utils.formatNumber(goldOwned)} / ${utils.formatNumber(goldNeeded)}</span></div>`;

					activeRecipe.all.forEach(recipeItem => {
						if (recipeItem.max) {
							var item = recipeItem.item,
								guid = item.guid,
								playerItem = me.inventory.find(item => item.guid == guid),
								count = playerItem && playerItem.count || 0;
							html += PlayerInventoryItem.toRowHtml(item, count, recipeItem.max * this.count);
						}
					});

					var wcNeeded = data.getMaxWildCardsNeeded(this) * this.count,
						wc = me.wildCards[this.rarityType],
						iwc = !wc && data.WildCardRepo.find(RarityType[this.rarityType]) || null,
						wcOwned = wc && me.wildCards[this.rarityType].count || 0;
					html += PlayerWildCard.toRowHtml(wc || iwc, wcOwned, wcNeeded);

					var runesNeeded = data.calcMaxRunesNeeded(this.playerCard, this.evoLevel),
						rune = me.inventory.find(item => item.isRune && this.matchesHero(data.HeroRepo.find(item.name.split("'")[0]))),
						runesOwned = rune && rune.count || 0;
					if (runesNeeded && rune) {
						html += PlayerInventoryItem.toRowHtml(rune, runesOwned, runesNeeded);
					}

					var crystalsNeeded = data.calcMaxCrystalsNeeded(this.playerCard, this.evoLevel),
						crystal = me.inventory.find(item => item.isCrystal && this.elementType == item.elementType),
						crystalsOwned = crystal && crystal.count || 0;
					if (crystalsNeeded && crystal) {
						html += PlayerInventoryItem.toRowHtml(crystal, crystalsOwned, crystalsNeeded);
					}
				}
			}
			return html;
		}
		private _rowHtml(badgeValue?: number, badgeCss?: string) {
			var badgeHtml = badgeValue ? `<span class="badge pull-right ${badgeCss||""}">${badgeValue}</span>` : ``,
				children = typeof(badgeValue) == "number" || this.isMaxed ? `` : this._rowChildren(),
				content = renderExpandable(this.playerCard.id, `${this.fullHtml}${badgeHtml}`, children);
			return `<div -class="${ElementType[this.elementType]}" data-element-type="${this.elementType}" data-rarity-type="${this.rarityType}" data-klass-type="${this.klassType}" data-brag="${this.brag ? "Brag" : ""}">${content}</div>`;
		}

		public constructor(playerCard: IPlayer.PlayerCard) {
			this.playerCard = playerCard;
			this._bc = data.BattleCardRepo.find(playerCard.configId);
			if (!this._bc) { utils.logMissingCard(this); }
		}

		// BattleCard pass-through
		public get brag() { return this._bc && this._bc.brag || false; }
		public get effects() { return this._bc && this._bc.effects || []; }
		public get elementType() { return this._bc ? this._bc.elementType : ElementType.Neutral; }
		public get inPacks() { return this._bc && this._bc.inPacks || false; }
		public get klassType() { return this._bc ? this._bc.klassType : null; }
		public get lower() { return this.name.toLowerCase(); }
		public get mats() { return this._bc && this._bc.mats || null; }
		public get maxValues() { return this._bc && this._bc.maxValues || []; }
		public get minValues() { return this._bc && this._bc.minValues || [[]]; }
		public get perkBase() { return this._bc && this._bc.perkBase || 0; }
		public get perks() { return this._bc && this._bc.perks || []; }
		public get name() { return this._bc && this._bc.name || this.playerCard && this.playerCard.configId; }
		public get rarityType() { return this._bc ? this._bc.rarityType : null; }
		public get targets() { return typesTargetsToTargets(this.typesTargets); }
		public get tier() { return this._bc && this._bc.tier || null; }
		public get turns() { return this._bc && this._bc.turns || 0; }
		public get types() { return this.typesTargets.map(s => <GameBattleCardType>s.split(" ")[0].replace("Damage", "Attack")); }
		public get typesTargets() { return this._bc && this._bc.typesTargets || []; }

		// PlayerCard pass-through
		public get evo() { return this.playerCard && this.playerCard.evolutionLevel || 0; }
		public get guid() { return this.playerCard && this.playerCard.configId; }
		public get level() { return this.playerCard && (this.playerCard.level + 1) || 0; }

		// New for PlayerBattleCard
		public get battleOrBragImage() { return getImg20("cardtypes", this.brag ? "Brag" : "BattleCard"); }
		public count = 1;
		public get evoLevel() { return `${this.evo}.${("0"+this.level).slice(-2)}`; }
		public get formattedValue() { return this.value ? utils.formatNumber(this.value) : ""; }
		public get fullHtml() {
			var count = this.count > 1 ? `x${this.count}` : ``,
				typeAndValue = this.value ? ` (${this.typeImage} ${this.formattedValue})` : ``,
				stars = utils.evoToStars(this.rarityType, this.evoLevel),
				name = this.name
					.replace(/Mischievous/, "Misch.")
					.replace(/Protection/, "Prot.")
					.replace(/-[\w-]+-/, "-...-");
			return `${this.battleOrBragImage} ${this.evoLevel} <small>${stars}</small> ${name} ${typeAndValue} ${count}`;
		}
		public get isActive() { return (this.evo > 0 || this.level > 1) && !this.isMaxed; }
		public get isMaxed() { return this.evoLevel == ["1.10", "2.20", "3.35", "4.50", "5.50"][this.rarityType]; }
		public get isUnknown() { return !this._bc; }
		public get maxWildCardsNeeded() { return data.getMaxWildCardsNeeded(this) * this.count; }
		public get nextWildCardsNeeded() { return data.getNextWildCardsNeeded(this) * this.count; }
		public get maxMaxSotNeeded() { return data.calcMaxSotNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxSotNeeded() { return data.getMaxSotNeeded(this.rarityType, this.evo) * this.count; }
		public get maxMaxGoldNeeded() { return data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxGoldNeeded() { return data.getMaxGoldNeeded(this.rarityType, this.evo) * this.count; }
		public get powerRating() { return PowerRating.ratePlayerCard(this.playerCard); }
		public get rarityEvoLevel() { return `${RarityType[this.rarityType][0]}.${this.evoLevel}`; }
		public get rowHtml() { return this._rowHtml();  }
		public get scoutHtml() { return `${this.rarityEvoLevel} ${this.name} ${this.count > 1 ? `x${this.count}` : ``}`; }
		public get typeImage() { return this.types.length ? getImg12("cardtypes", this.types[0]) : ``; }
		public get value() { return this.playerCard && bh.BattleCardRepo.calculateValue(this.playerCard) || 0; };

		public matches(other: PlayerBattleCard): boolean { return this._bc && other._bc && this._bc.guid == other._bc.guid && this.evoLevel == other.evoLevel; }
		public matchesElement(element: GameElement) { return !element || this.elementType === ElementType[element]; }
		public matchesHero(hero: Hero) { return !hero || (this.matchesElement(<GameElement>ElementType[hero.elementType]) && this.klassType === hero.klassType); }
		public matchesRarity(rarity: GameRarity) { return !rarity || this.rarityType === RarityType[rarity]; }
		public toRowHtml(needed: number, owned: number) { return this._rowHtml(needed, owned < needed ? "bg-danger" : "bg-success"); }
	}
}