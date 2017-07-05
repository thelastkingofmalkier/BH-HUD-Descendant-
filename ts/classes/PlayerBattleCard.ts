namespace bh {
	export class PlayerBattleCard {
		private _bc: IDataBattleCard;

		private _rowHtml(badgeValue?: number) {
			var badgeHtml = badgeValue ? `<span class="badge pull-right">${badgeValue}</span>` : ``;
			return `<div data-element="${ElementType[this.elementType]}" data-rarity="${this.rarity}" data-klass="${this.klass}" data-brag="${this.brag ? "Brag" : ""}">${this.fullHtml}${badgeHtml}</div>`;
		}

		public constructor(public playerCard: IPlayer.PlayerCard) {
			if (!(this._bc = data.cards.battle.find(playerCard.configId))) {
				console.log("Missing BattleCard:", `${this.name}: ${playerCard.id} (${this.evoLevel})`);
			}
		}

		// BattleCard pass-through
		public get brag() { return this._bc && this._bc.brag || false; }
		public get elementType() { return this._bc ? this._bc.elementType : null; }
		public get klass() { return this._bc && this._bc.klass; }
		public get name() { return this._bc && this._bc.name || this.playerCard && this.playerCard.configId; }
		public get rarity() { return this._bc && this._bc.rarity || null; }
		public get rarityType(): RarityType { return this._bc && this._bc.rarity ? <any>RarityType[<any>this._bc.rarity.replace(/ /, "")] : null; }
		public get type() { return this._bc && this._bc.type || null; }
		public get tier() { return this._bc && this._bc.tier || null; }

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
				stars = utils.evoToStars(this.rarity, this.evoLevel),
				name = this.name.replace(/Mischievous/, "Misch.").replace(/Protection/, "Prot."),
				logoValue = "";
			return `${this.battleOrBragImage} ${this.evoLevel} <small>${stars}</small> ${name} ${count} ${logoValue}`;
		}
		public get isActive() { return (this.evo > 0 || this.level > 1) && !this.isMaxed; }
		public get isMaxed() { return this.evoLevel == ["1.10", "2.20", "3.35", "4.50", "5.50"][this.rarityType]; }
		public get maxWildCardsNeeded() { return data.getMaxWildCardsNeeded(this) * this.count; }
		public get nextWildCardsNeeded() { return data.getNextWildCardsNeeded(this) * this.count; }
		public get maxMaxSotNeeded() { return data.getMaxSotNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxSotNeeded() { return data.getMaxSotNeeded(this.rarity, this.evo) * this.count; }
		public get maxMaxGoldNeeded() { return data.getMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxGoldNeeded() { return data.getMaxGoldNeeded(this.rarity, this.evo) * this.count; }
		public get powerRating() { return PowerRating.ratePlayerCard(this.playerCard); }
		public get rarityEvoLevel() { return `${this.rarity[0]}.${this.evoLevel}`; }
		public get rowHtml() { return this._rowHtml();  }
		public get evoHtml() { return this._rowHtml(this.count * 60);  }
		public get goldHtml() { return this._rowHtml(this.maxMaxGoldNeeded);  }
		public get sotHtml() { return this._rowHtml(this.maxMaxSotNeeded);  }
		public get wcHtml() { return this._rowHtml(this.maxWildCardsNeeded);  }
		public get scoutHtml() { return `${this.rarityEvoLevel} ${this.name} ${this.count > 1 ? `x${this.count}` : ``}`; }
		public get typeImage() { return this.type ? getImg("cardtypes", this.type) : ``; }
		public get value() { return this.playerCard && data.cards.battle.calculateValue(this.playerCard) || 0; };

		public matches(other: PlayerBattleCard): boolean { return this._bc && other._bc && this._bc.guid == other._bc.guid && this.evoLevel == other.evoLevel; }
		public matchesElement(element: string) { return element && this.elementType === <any>ElementType[<any>element]; }
	}
}