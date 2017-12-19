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
			return `${this.battleOrBragImage} ${this.evoLevel} <small>${stars}</small> ${name} ${typeAndValue} ${count}<span class="pull-right">${Math.round(this.powerRating)*this.count}</span>`;
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

		public static parseTarget(value: string): IDataBattleCardTarget {
			var parts = value.split("Flurry")[0].trim().split(" "),
				type = parts.shift(),
				target = parts.join(" "),
				offense = type == "Damage",
				all = target.includes("All Allies") || target.includes("All Enemies"),
				splash = target.includes("Splash"),
				self = target.includes("Self"),
				single = !all && !splash && !self,
				flurryMatch = value.match(/Flurry \((\d+) @ (\d+)%\)/),
				flurryCount = flurryMatch && +flurryMatch[1] || null,
				flurryHitPercent = flurryMatch && (`${flurryMatch[2]}%`) || null,
				flurryHitMultiplier = flurryMatch && (+flurryMatch[2] / 100) || null;
			return {
				type: <GameBattleCardType>type,
				typeDivisor: type == "Damage" ? AttackDivisor : type == "Shield" ? ShieldDivisor : HealDivisor,
				target: <GameBattleCardTarget>target,
				offense: offense,
				all: all,
				splash: splash,
				single: single,
				self: self,
				targetMultiplier: all ? offense? 3 : 2 : splash ? offense ? 2 : 1.5 : single ? offense ? 1 : 1.25 : self ? 1 : 0,
				flurry: !!flurryMatch,
				flurryCount: flurryCount,
				flurryHitPercent: flurryHitPercent,
				flurryHitMultiplier: flurryHitMultiplier
			};
		}
	}
}

interface INewCard { [key: string]: string; }
function updateCardData() {
	$.get(BattleCardDataUrl).then(raw => {
		var mapped = bh.Repo.mapTsv<INewCard>(raw),
			cards = mapped.map(card => {
				try{
				var guid = card["Id"],
					existing = bh.data.BattleCardRepo.find(guid),
					multiValues = card["Effect Type"].includes("/"),
					minValuesArray = multiValues ? [0,1] : [0];
				var created: IDataBattleCard = {
					guid: guid,
					name: existing && existing.name || card["Name"],
					klassType: bh.KlassType[<GameKlass>card["Class"].replace("Ranged", "Skill").replace("Melee", "Might")],
					elementType: bh.ElementType[<GameElement>card["Element"]],
					rarityType: bh.RarityType[<GameRarity>card["Rarity"].replace(/ /, "")],
					turns: +card["Turns"],
					typesTargets: card["Effect Type"].trim().split(/\s*\/\s*/),
					brag: bh.utils.parseBoolean(card["Is Brag?"]),
					minValues: minValuesArray.map(index => [0,1,2,3,4,5].map(i => card[`${i}* Min`]).filter(s => !!s).map(s => +String(s).split(/\s*\/\s*/)[index])),
					maxValues: [0,1,2,3,4,5].map(i => card[`${i}* Max`]).filter(s => !!s).pop().split(/\s*\/\s*/).map(s => +s),
					tier: existing && existing.tier || <any>"",
					mats: [1,2,3,4].map(i => card[`${i}* Evo Jar`]).filter(s => !!s),
					perkBase: +card["Perk %"],
					perks: [1,2].map(i => card[`Perk #${i}`]).filter(s => !!s),
					effects: [1,2,3].map(i => card[`Effect #${i}`]).filter(s => !!s && s != "Splash"),
					inPacks: bh.utils.parseBoolean(card["In Packs?"])
				};
				if (!existing) console.log("New Card: " + card["Name"]);
				else if (existing.name != card["Name"]) console.log(existing.name + " !== " + card["Name"]);
				return created;
			}catch(ex){
				console.error(card)
			}
			return null;
			});
		var tsv = "guid\tname\tklassType\telementType\trarityType\tturns\ttypesTargets\tbrag\tminValues\tmaxValues\ttier\tmats\tperkBase\tperks\teffects\tpacks";
		cards.filter(c=>!!c).forEach(c => {
			tsv += `\n${c.guid}\t${c.name}\t${bh.KlassType[c.klassType].slice(0, 2)}\t${bh.ElementType[c.elementType][0]}\t${bh.RarityType[c.rarityType][0]}\t${c.turns}\t${c.typesTargets.join("|")}\t${String(c.brag)[0]}\t${c.minValues.map(a=>a.join(",")).join("|")}\t${c.maxValues.join("|")}\t${c.tier}\t${c.mats.join(",")}\t${c.perkBase}\t${c.perks.join(",")}\t${c.effects.join(",")}\t${String(c.inPacks)[0]}`;
		});
		$("#data-output").val(tsv)
	});
}

