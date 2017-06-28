namespace bh {
	export class PlayerBoosterCard {
		private _: IDataBoosterCard;

		public constructor(guid: string, public count: number = 0) {
			this._ = data.BoosterCardRepo.find(guid);
		}

		public get challenge() { return this._.challenge; }
		public get elementType(): ElementType { return <any>ElementType[(<any>this._).element]; }
		public get guid() { return this._.guid; }
		public get name() { return this._.name; }
		public get rarity() { return this._.rarity; }
		public get rowHtml() { return `<div data-element="${ElementType[this.elementType]}" data-type="${this.type}" data-rarity="${this.rarity}">${getImg20("misc", "Boosters")} ${this.rarity[0]}${this.challenge?"*":""} ${this.name} <span class="badge pull-right">${this.count}</span></div>`; }
		public type = "BoosterCard";

		public static rowHtml(count: number) { return `<div data-hud="true">${getImg20("misc", "Boosters")} Boosters <span class="badge pull-right">${utils.formatNumber(count)}</span></div>`; }
	}
}