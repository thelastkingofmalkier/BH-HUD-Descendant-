namespace bh {
	export class GameEffect {
		public effect: string;
		public value: number;
		public percent: string;
		public percentMultiplier: number;
		public perkMultiplier: number;
		public turns: number;
		public target: IDataBattleCardTarget;
		public constructor(value: string) {
			var parts = value.match(/([a-zA-z]+(?: [a-zA-Z]+)*)(?: (\d+)%)?(?: (\d+)T)?/),
				cleanValue = parts && parts[1] || value,
				effect = bh.data.EffectRepo.find(cleanValue);
			this.effect = effect && effect.name || cleanValue;
			this.percent = parts && parts[2] && (`${parts[2]}%`) || null;
			this.percentMultiplier = this.percent && (+parts[2]/100) || null;
			this.turns = parts && +parts[3] || null;
			this.value = effect && effect.value;
			this.perkMultiplier = 0;
			if (value.includes("Bamboozle")) console.log(value);
		}
		public get powerRating(): number { return getPowerRating(this); }
		private static parse(value: string): GameEffect {
			var gameEffect = new GameEffect(value);
			return gameEffect.effect && gameEffect || null;
		}
		public static parseAll(playerCard: IPlayer.PlayerCard): GameEffect[] {
			var card = data.BattleCardRepo.find(playerCard.configId),
				perkMultiplier = bh.BattleCardRepo.getPerk(card, playerCard.evolutionLevel) / 100,
				gameEffects = <GameEffect[]>[];
			card.effects.forEach(effectValue => {
				var gameEffect = GameEffect.parse(effectValue);
				if (!gameEffect) return console.error(`GameEffect.parse: ${effectValue}`);
				gameEffects.push(gameEffect);
			});
			card.perks.forEach(perkValue => {
				var gameEffect = GameEffect.parse(perkValue);
				if (!gameEffect) return console.error(`GameEffect.parse: ${perkValue}`);
				gameEffect.perkMultiplier = perkMultiplier;
				gameEffects.push(gameEffect);
			});
			reconcileTargets(gameEffects, card);
			return gameEffects;
		}
	}
	var offensiveEffects = ["Interrupt", "Reset", "Burn", "Bleed", "Shock", "Poison", "Backstab", "Sap", "Drown", "Pierce", "Perfect Shot"];
	var notRatedEffects = ["Stun", "Charm", "Max Health Up", "Luck Down", "Luck Up"];
	function reconcileTargets(gameEffects: GameEffect[], card: IDataBattleCard): void {
		var targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget)),
			damage = targets.find(t => t.type == "Damage"),
			shield = targets.find(t => t.type == "Shield"),
			heal = targets.find(t => t.type == "Heal"),
			damages = [];
		gameEffects.forEach(gameEffect => {
			if (targets.length == 1) {
				gameEffect.target = targets[0];
			}else {
				if (damageEffects.includes(gameEffect.effect)) {
					gameEffect.target = damage;
				}else if (shieldEffects.includes(gameEffect.effect)) {
					gameEffect.target = shield;
				}else if (healEffects.includes(gameEffect.effect)) {
					gameEffect.target = heal;
				}else {
					console.warn("can't find target for " + gameEffect.effect);
				}
			}
		});
	}
	function getPowerRating(gameEffect: GameEffect): number {
		var effect = gameEffect.effect,
			target = gameEffect.target && gameEffect.target.target
		if (target) {
			if (!["Critical", "Regen"].includes(effect)) {
				if (gameEffect.target.offense) {
					if (["Interrupt", "Burn", "Bleed", "Shock", "Poison", "Backstab"].includes(effect)) return 1;
					if (["Sap", "Drown"].includes(effect)) return 2;
					if (["Marked", "Sleep"].includes(effect)) return gameEffect.turns;
					if (["Accuracy Down"].includes(effect)) return gameEffect.turns * gameEffect.percentMultiplier;
				}else {
					if (["Slow"].includes(effect)) return -1;
					if (["Cure All"].includes(effect)) return 1;
					if (["Evade"].includes(effect)) return gameEffect.turns;
				}
				if (["Attack Up"].includes(effect)) return 0.5 * gameEffect.turns;
				if (["Haste", "Trait Up", "Speed Up"].includes(effect)) return 2;
				// Trait up should scale by level ... assume level 50 = 100% and 1 = 0%
				if (!notRatedEffects.includes(effect)) {
					console.log("not rating effect " + effect + " on " + target);
				}
				return 0.5;// * gameEffect.turns;
			}
		}else {
			console.warn("no target", gameEffect);
		}
		return 0;
	}
}