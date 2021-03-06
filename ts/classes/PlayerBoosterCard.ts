namespace bh {
	export class PlayerBoosterCard {
		private _: IDataBoosterCard;

		public constructor(guid: string, public count: number = 0) {
			this._ = data.BoosterCardRepo.find(guid);
		}

		public get challenge() { return this._.challenge; }
		public get elementType() { return this._.elementType; }
		public get guid() { return this._.guid; }
		public get name() { return this._.name; }
		public get rarityType() { return this._.rarityType; }
		public get rowHtml() { return `<div class="${ElementType[this.elementType]}" data-element-type="${this.elementType}" data-type="${this.type}" data-rarity-type="${this.rarityType}">${getImg20("misc", "Boosters")} ${RarityType[this.rarityType][0]}${this.challenge?"*":""} ${this.name} <span class="badge pull-right">${utils.formatNumber(this.count)}</span></div>`; }
		public type = "BoosterCard";

		public static rowHtml(count: number) { return `<div data-hud="true">${getImg20("misc", "Boosters")} Boosters <span class="badge pull-right">${utils.formatNumber(count)}</span></div>`; }
	}
}