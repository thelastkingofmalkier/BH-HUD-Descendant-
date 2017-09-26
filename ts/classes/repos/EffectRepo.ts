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
			card.typesTargets.forEach(target => {
				mapTargetOrEffectOrPerk(target).forEach(item => {
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
	function mapTargetOrEffectOrPerk(item: string) {
		var items: string[] = [];
		if (["Damage", "Heal", "Shield"].includes(item.split(" ")[0])) {
			if (item.includes("All Allies")) {
				items.push("Multi-Target (Ally)");
			}else if (item.includes("All Enemies")) {
				items.push("Multi-Target (Enemy)");
			}else if (item.includes("Splash")) {
				items.push("Splash");
			}
			if (item.includes("Flurry")) {
				items.push("Flurry");
			}
			if (!items.length) {
				items.push(item.split(" ")[1]);
			}
		}else {
			items.push(item);
		}
		return items.map(i => {
			var match = i.match(/([a-zA-z]+( [a-zA-Z]+)*)(?: (\d+%))?(?: (\d+T))?/),
				clean = match && match[1] || i,
				effect = data.EffectRepo.find(clean) || data.EffectRepo.find(i) || data.EffectRepo.find(item) || null;
			if (!effect) console.log(item, i, match, clean, effect);
			return effect;
		}).filter(i => !!i);
	}
	function effectTypeToTarget(value: string): GameBattleCardTarget[] {
		return value.split("/").map(s => s.trim()).filter(s => !!s).map(s => {
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
}