namespace bh {
	export class PlayerBattleCard {
		private _bc: IDataBattleCard;

		private _rowChildren() {
			var me = Player.me,
				activeRecipe = new Recipe(this).createPartial(this),
				html = "";
			if (activeRecipe) {
				activeRecipe.all.forEach(recipeItem => {
					var item = me.inventory.find(item => item.guid == recipeItem.item.guid);
					html += PlayerInventoryItem.toRowHtml(item, item.count, recipeItem.max * this.count);
				});
				var wcNeeded = data.getMaxWildCardsNeeded(this) * this.count,
					wcOwned = me.wildCards[this.rarityType] && me.wildCards[this.rarityType].count || 0,
					wcColor = wcOwned < wcNeeded ? `bg-danger` : `bg-success`;
				html += `<div>${getImg20("cardtypes", "WildCard")} ${RarityType[this.rarityType]} WC <span class="badge pull-right ${wcColor}">${utils.formatNumber(wcOwned)} / ${utils.formatNumber(wcNeeded)}</span></div>`;
				var goldNeeded = data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count,
					goldOwned = me.gold,
					goldColor = goldOwned < goldNeeded ? `bg-danger` : `bg-success`;
				html += `<div>${getImg20("misc", "Coin")} Gold <span class="badge pull-right ${goldColor}">${utils.formatNumber(goldOwned)} / ${utils.formatNumber(goldNeeded)}</span></div>`;
			}
			return html;
		}
		private _rowHtml(badgeValue?: number) {
			var badgeHtml = badgeValue ? `<span class="badge pull-right">${badgeValue}</span>` : ``,
				children = badgeValue || this.isMaxed ? `` : this._rowChildren(),
				content = renderExpandable(this.playerCard.id, `${this.fullHtml}${badgeHtml}`, children);
			return `<div -class="${ElementType[this.elementType]}" data-element-type="${this.elementType}" data-rarity-type="${this.rarityType}" data-klass-type="${this.klassType}" data-brag="${this.brag ? "Brag" : ""}">${content}</div>`;
		}

		public constructor(public playerCard: IPlayer.PlayerCard) {
			if (!(this._bc = data.cards.battle.find(playerCard.configId))) {
				console.log("Missing BattleCard:", `${this.name}: ${playerCard.id} (${this.evoLevel})`);
			}
		}

		// BattleCard pass-through
		public get brag() { return this._bc && this._bc.brag || false; }
		public get elementType() { return this._bc ? this._bc.elementType : null; }
		public get klassType() { return this._bc ? this._bc.klassType : null; }
		public get name() { return this._bc && this._bc.name || this.playerCard && this.playerCard.configId; }
		public get lower() { return this.name.toLowerCase(); }
		public get rarityType() { return this._bc ? this._bc.rarityType : null; }
		public get type() { return this._bc && this._bc.type || null; }
		public get tier() { return this._bc && this._bc.tier || null; }
		public get mats() { return this._bc && this._bc.mats || null; }

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
				typeAndValue = this.value ? ` (${this.typeImage} ${this.formattedValue}` : ``,
				stars = utils.evoToStars(this.rarityType, this.evoLevel),
				name = this.name.replace(/Mischievous/, "Misch.").replace(/Protection/, "Prot.");
			return `${this.battleOrBragImage} ${this.evoLevel} <small>${stars}</small> ${name} ${count}`;
		}
		public get isActive() { return (this.evo > 0 || this.level > 1) && !this.isMaxed; }
		public get isMaxed() { return this.evoLevel == ["1.10", "2.20", "3.35", "4.50", "5.50"][this.rarityType]; }
		public get maxWildCardsNeeded() { return data.getMaxWildCardsNeeded(this) * this.count; }
		public get nextWildCardsNeeded() { return data.getNextWildCardsNeeded(this) * this.count; }
		public get maxMaxSotNeeded() { return data.calcMaxSotNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxSotNeeded() { return data.getMaxSotNeeded(this.rarityType, this.evo) * this.count; }
		public get maxMaxGoldNeeded() { return data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxGoldNeeded() { return data.getMaxGoldNeeded(this.rarityType, this.evo) * this.count; }
		public get powerRating() { return PowerRating.ratePlayerCard(this.playerCard); }
		public get rarityEvoLevel() { return `${RarityType[this.rarityType][0]}.${this.evoLevel}`; }
		public get rowHtml() { return this._rowHtml();  }
		public get evoHtml() { return this._rowHtml(this.count * 60);  }
		public get goldHtml() { return this._rowHtml(this.maxMaxGoldNeeded);  }
		public get wcHtml() { return this._rowHtml(this.maxWildCardsNeeded);  }
		public get scoutHtml() { return `${this.rarityEvoLevel} ${this.name} ${this.count > 1 ? `x${this.count}` : ``}`; }
		public get typeImage() { return this.type ? getImg("cardtypes", this.type) : ``; }
		public get value() { return this.playerCard && data.cards.battle.calculateValue(this.playerCard) || 0; };

		public matches(other: PlayerBattleCard): boolean { return this._bc && other._bc && this._bc.guid == other._bc.guid && this.evoLevel == other.evoLevel; }
		public matchesElement(element: GameElement) { return !element || this.elementType === ElementType[element]; }
		public matchesHero(hero: Hero) { return !hero || (this.matchesElement(<GameElement>ElementType[hero.elementType]) && this.klassType === hero.klassType); }
		public matchesRarity(rarity: GameRarity) { return !rarity || this.rarityType === RarityType[rarity]; }
		public toRowHtml(badge: number) { return this._rowHtml(badge); }
	}
}