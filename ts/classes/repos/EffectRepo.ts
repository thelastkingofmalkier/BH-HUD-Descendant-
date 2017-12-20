/// <reference path="Repo.ts"/>
namespace bh {
	export class EffectRepo extends Repo<IDataEffect> {
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
		var gameEffect = GameEffect.parse(item),
			effect = gameEffect && data.EffectRepo.find(gameEffect.effect) || null,
			effects = effect ? [effect] : [];
		if (gameEffect) {
			if (gameEffect.raw.includes("All Allies")) effects.push(data.EffectRepo.find("Multi-Target (Ally)"));
			if (gameEffect.raw.includes("All Enemies")) effects.push(data.EffectRepo.find("Multi-Target (Enemy)"));
			if (gameEffect.raw.includes("Flurry")) effects.push(data.EffectRepo.find("Flurry"));
		}
		return effects;
	}
}