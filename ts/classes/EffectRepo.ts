/// <reference path="Repo.ts"/>
namespace bh {
	export class EffectRepo extends Repo<IDataEffect> {

		constructor() {
			super(901337848, true);
		}
		protected parseTsv(tsv: string): IDataEffect[] {
			this.data = Repo.mapTsv<IDataEffect>(tsv);
			this.data.forEach(effect => effect.guid = effect.lower.replace(/\W/g, "-"));
			return this.data;
		}

		public find(value: string): IDataEffect {
			var lower = value.toLowerCase();
			return this.data.find(t => t.lower == lower || (t.alt || "").toLowerCase() == lower);
		}

		public static mapEffects(card: IDataBattleCard) {
			var effects: IDataEffect[] = [];
			card.effects.forEach(effect => {
				mapTargetOrEffectOrPerk(effect).forEach(item => {
					if (!effects.includes(item)) effects.push(item);
				});
			});
			return effects;
		}
		public static mapPerks(card: IDataBattleCard) {
			var perks: IDataEffect[] = [];
			card.perks.forEach(perk => {
				mapTargetOrEffectOrPerk(perk).forEach(item => {
					if (!perks.includes(item)) perks.push(item);
				});
			});
			return perks;
		}
		public static mapTargets(card: IDataBattleCard) {
			var targets: IDataEffect[] = [];
			card.targets.forEach((target, index) => {
				mapTargetOrEffectOrPerk(target, card.types[index]).forEach(item => {
					if (!targets.includes(item)) targets.push(item);
				});
			});
			return targets;
		}
		public static toImage(effect: IDataEffect, fn = getImg20) {
			return ["Self", "Single"].includes(effect.name) ? "" : fn("effects", effect.name.replace(/\W/g, ""));
		}
		public static toImageSrc(effect: IDataEffect) {
			return ["Self", "Single"].includes(effect.name) ? "" : getSrc("effects", effect.name.replace(/\W/g, ""));
		}
	}
	function mapTargetOrEffectOrPerk(item: string, type: GameBattleCardType = null) {
		var items: string[] = [];
		if (item.includes("Multi")) {
			items.push(type == "Attack" ? "Multi-Target (Enemy)" : "Multi-Target (Ally)");
		}
		if (item.includes("Flurry")) {
			items.push("Flurry");
		}
		if (!item.includes("Multi") && !item.includes("Flurry")) {
			items.push(item);
		}
		return items.map(i => {
			var effect = i ? data.EffectRepo.find(i) : null;
			if (!effect) console.log(item);
			return effect;
		}).filter(i => !!i);
	}
}