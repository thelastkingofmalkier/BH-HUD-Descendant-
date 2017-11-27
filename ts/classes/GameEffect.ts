namespace bh {
	export class GameEffect {
		public effect: string;
		public value: number;
		public percent: string;
		public percentMultiplier: number;
		public perkMultiplier: number;
		public turns: number;
		public target: IDataBattleCardTarget;
		public card: IDataBattleCard;

		private constructor(public raw: string) {
			var parts = raw.match(/([a-zA-z]+(?: [a-zA-Z]+)*)(?: (\d+)%)?(?: (\d+)T)?/),
				cleanValue = parts && parts[1] || raw,
				effect = bh.data.EffectRepo.find(cleanValue);
			this.effect = effect && effect.name || cleanValue;
			this.percent = parts && parts[2] && (`${parts[2]}%`) || null;
			this.percentMultiplier = this.percent && (+parts[2]/100) || null;
			this.turns = parts && +parts[3] || null;
			this.value = effect && effect.value;
			this.perkMultiplier = 0;
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
	var offensiveEffects = ["Interrupt", "Reset", "Burn", "Bleed", "Shock", "Poison", "Backstab", "Sap", "Drown", "Pierce", "Perfect Shot", "Taunt"];
	var defensiveEffects = ["Regen", "Immunity to Bleed", "Immunity to Burn", "Immunity to Charm", "Immunity to Chill", "Immunity to Confuse", "Immunity to Poison", "Immunity to Shock", "Immunity to Stun", "Attack Up", "Accuracy Up", "Trait Up"];
	var healEffects = ["Regen"];
	var shieldEffects = [""];
	var notRatedEffects = ["Stun", "Charm", "Max Health Up", "Luck Down", "Luck Up", "Bamboozle"];
	function reconcileTargets(gameEffects: GameEffect[], card: IDataBattleCard): void {
		var targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget)),
			damage = targets.find(t => t.type == "Damage"),
			shield = targets.find(t => t.type == "Shield"),
			heal = targets.find(t => t.type == "Heal"),
			def = targets.find(t => ["Heal", "Shield"].includes(t.type)),
			damages = [];
		gameEffects.slice().forEach(gameEffect => {
			if (gameEffect.effect == "Critical") {
				gameEffect.target = targets[0];
				targets.slice(1).forEach(t => {
					var ge = GameEffect.parse(gameEffect.raw);
					ge.target = t;
					gameEffects.push(ge);
				});
			}else if (targets.length == 1 || gameEffect.perkMultiplier) {
				if (gameEffect.effect == "Storm" && ["Wind Barrier", "Hurricane Barrier"].includes(card.name)) {
					gameEffect.target = bh.PlayerBattleCard.parseTarget("Damage All Enemies");
				}else if (gameEffect.effect == "Terra" && ["Forest Barrier", "Shield of The Nature"].includes(card.name)) {
					gameEffect.target = bh.PlayerBattleCard.parseTarget("Damage All Enemies");
				}else if (gameEffect.effect == "Bamboozle" && ["Rum Shower"].includes(card.name)) {
					gameEffect.target = gameEffect.perkMultiplier ? damage : bh.PlayerBattleCard.parseTarget("Heal Self");
				}else if (gameEffect.effect == "Stun" && ["Breaking Chakra"].includes(card.name)) {
					gameEffect.target = gameEffect.perkMultiplier ? damage : bh.PlayerBattleCard.parseTarget("Heal Self");
				}else {
					gameEffect.target = targets[0];
				}
			}else {
				if (offensiveEffects.includes(gameEffect.effect)) {
					gameEffect.target = damage;
				}else if (defensiveEffects.includes(gameEffect.effect)) {
					if (healEffects.includes(gameEffect.effect)) {
						gameEffect.target = heal;
					}else if (shieldEffects.includes(gameEffect.effect)) {
						gameEffect.target = shield;
					}else if (gameEffect.effect.startsWith("Immunity")) {
						gameEffect.target = def;
					}
				}else if (gameEffect.effect == "Storm" && ["Wind Barrier", "Hurricane Barrier"].includes(card.name)) {
					gameEffect.target = bh.PlayerBattleCard.parseTarget("Damage All Enemies");
				}else if (gameEffect.effect == "Terra" && ["Forest Barrier", "Shield of The Nature"].includes(card.name)) {
					gameEffect.target = bh.PlayerBattleCard.parseTarget("Damage All Enemies");
				}
			}
			if (!gameEffect.target) console.warn("can't find target for " + gameEffect.effect, gameEffect.card);
		});
	}
	function getPowerRating(gameEffect: GameEffect): number {
		var effect = gameEffect.effect,
			target = gameEffect.target,
			offense = target && target.offense;
		if (target) {
			if (!["Critical", "Regen"].includes(effect)) {
				if (["Slow"].includes(effect)) return offense ? 1 : -1;
				if (["Sleep"].includes(effect)) return (offense ? 1 : -1) * gameEffect.turns;
				if (offense) {
					if (["Interrupt", "Burn", "Bleed", "Shock", "Poison", "Backstab", "Chill", "Reset"].includes(effect)) return 1;
					if (["Sap", "Drown"].includes(effect)) return 2;
					if (["Marked"].includes(effect)) return gameEffect.turns;
					if (["Accuracy Down"].includes(effect)) return gameEffect.turns * gameEffect.percentMultiplier;
				}else {
					if (["Cure All"].includes(effect)) return 1;
					if (["Evade"].includes(effect)) return gameEffect.turns;
				}
				if (["Attack Up"].includes(effect)) return 0.5 * gameEffect.turns;
				if (["Haste", "Trait Up", "Speed Up"].includes(effect)) return 2;
				// Trait up should scale by level ... assume level 50 = 100% and 1 = 0%
				if (!notRatedEffects.includes(effect)) {
					// console.log("not rating effect " + effect + " on " + target.target);
				}
				return 0.5;// * gameEffect.turns;
			}
		}else {
			console.warn("no target", gameEffect);
		}
		return 0;
	}
}