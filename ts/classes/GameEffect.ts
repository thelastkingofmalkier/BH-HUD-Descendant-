namespace bh {
	export class GameEffect {
		public effect: string;
		public value: number;
		public percent: string;
		public percentMultiplier: number;
		public perkMultiplier: number;
		public turns: number;
		public targetDamage: boolean;
		public targetHeal: boolean;
		public targetShield: boolean;
		public card: IDataBattleCard;

		private constructor(value: string) {
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
		public static parse(value: string): GameEffect {
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
				gameEffect.card = card;
				gameEffects.push(gameEffect);
			});
			card.perks.forEach(perkValue => {
				var gameEffect = GameEffect.parse(perkValue);
				if (!gameEffect) return console.error(`GameEffect.parse: ${perkValue}`);
				gameEffect.card = card;
				gameEffect.perkMultiplier = perkMultiplier;
				gameEffects.push(gameEffect);
			});
			reconcileTargets(gameEffects, card);
			return gameEffects;
		}
	}
	var offensiveEffects = ["Interrupt", "Reset", "Burn", "Bleed", "Shock", "Poison", "Backstab", "Sap", "Drown", "Pierce", "Perfect Shot"];
	var defensiveEffects = ["Regen"];
	var healEffects = ["Regen"];
	var shieldEffects = [""];
	var notRatedEffects = ["Stun", "Charm", "Max Health Up", "Luck Down", "Luck Up"];
	function reconcileTargets(gameEffects: GameEffect[], card: IDataBattleCard): void {
		var targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget)),
			damage = targets.find(t => t.type == "Damage"),
			shield = targets.find(t => t.type == "Shield"),
			heal = targets.find(t => t.type == "Heal"),
			damages = [];
		gameEffects.forEach(gameEffect => {
			if (gameEffect.effect == "Critical") {
				gameEffect.targetDamage = !!damage;
				gameEffect.targetHeal = !!heal;
				gameEffect.targetShield = !!shield;
			}else if (targets.length == 1 || gameEffect.perkMultiplier) {
				gameEffect.targetDamage = targets[0] == damage;
				gameEffect.targetShield = targets[0] == shield;
				gameEffect.targetHeal = targets[0] == heal;
			}else {
				if (offensiveEffects.includes(gameEffect.effect)) {
					gameEffect.targetDamage = !!damage;
				}else if (defensiveEffects.includes(gameEffect.effect)) {
					if (healEffects.includes(gameEffect.effect)) {
						gameEffect.targetHeal = !!heal;
					}else if (shieldEffects.includes(gameEffect.effect)) {
						gameEffect.targetShield = !!shield;
					}else if (gameEffect.effect.startsWith("Immunity")) {
						gameEffect.targetHeal = !!heal;
						gameEffect.targetShield = !!shield;
					}else {
						// gameEffect.target = shield;
						// gameEffect.target = heal;
					}
				}else {
					console.warn("can't find target for " + gameEffect.effect, gameEffect.card);
				}
			}
		});
	}
	function getPowerRating(gameEffect: GameEffect): number {
		var effect = gameEffect.effect,
			target = gameEffect.targetDamage || gameEffect.targetShield || gameEffect.targetHeal,
			offense = gameEffect.targetDamage;
		if (target) {
			if (!["Critical", "Regen"].includes(effect)) {
				if (["Slow"].includes(effect)) return offense ? 1 : -1;
				if (offense) {
					if (["Interrupt", "Burn", "Bleed", "Shock", "Poison", "Backstab", "Chill"].includes(effect)) return 1;
					if (["Sap", "Drown"].includes(effect)) return 2;
					if (["Marked", "Sleep"].includes(effect)) return gameEffect.turns;
					if (["Accuracy Down"].includes(effect)) return gameEffect.turns * gameEffect.percentMultiplier;
				}else {
					if (["Cure All"].includes(effect)) return 1;
					if (["Evade"].includes(effect)) return gameEffect.turns;
				}
				if (["Attack Up"].includes(effect)) return 0.5 * gameEffect.turns;
				if (["Haste", "Trait Up", "Speed Up"].includes(effect)) return 2;
				// Trait up should scale by level ... assume level 50 = 100% and 1 = 0%
				if (!notRatedEffects.includes(effect)) {
					// console.log("not rating effect " + effect + " on " + target);
				}
				return 0.5;// * gameEffect.turns;
			}
		}else {
			console.warn("no target", gameEffect);
		}
		return 0;
	}
}