namespace bh {
	export class GameEffect {
		public effect: string;
		public value: string;
		public percent: string;
		public percentMultiplier: number;
		public perkMultiplier: number;
		public turns: number;
		public target: IDataBattleCardTarget;
		public card: IDataBattleCard;
		public offense: boolean;

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
			this.offense = !(effect && effect.value || "").toLowerCase().startsWith("d");
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
	function reconcileTargets(gameEffects: GameEffect[], card: IDataBattleCard): void {
		var targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget)),
			damage = targets.find(t => t.type == "Damage"),
			shield = targets.find(t => t.type == "Shield"),
			heal = targets.find(t => t.type == "Heal"),
			def = targets.find(t => ["Heal", "Shield"].includes(t.type)),
			// first = targets[0],
			damages = [];
		gameEffects.slice().forEach(gameEffect => {
			if (gameEffect.effect == "Critical") {
				gameEffect.target = targets[0];
				targets.slice(1).forEach(t => {
					var ge = GameEffect.parse(gameEffect.raw);
					ge.target = t;
					gameEffects.push(ge);
				});

			}else if (gameEffect.effect.startsWith("Immunity")) {
				gameEffect.target = def || bh.PlayerBattleCard.parseTarget(damage.all ? "Heal All Allies" : "Heal Self");

			}else if (gameEffect.effect == "Bamboozle" && ["Rum Shower"].includes(card.name)) {
				gameEffect.target = gameEffect.perkMultiplier ? damage : bh.PlayerBattleCard.parseTarget("Heal Self");

			}else if (gameEffect.effect == "Stun" && ["Breaking Chakra"].includes(card.name)) {
				gameEffect.target = gameEffect.perkMultiplier ? damage : bh.PlayerBattleCard.parseTarget("Heal Self");

			}else if (["Attack Up", "Trait Up", "Evade", "Accuracy Up", "Defence Up"].includes(gameEffect.effect) && damage) {
				gameEffect.target = bh.PlayerBattleCard.parseTarget("Heal Self");

			}else if (["Charm", "Taunt"].includes(gameEffect.effect) && damage) {
				gameEffect.target = def || bh.PlayerBattleCard.parseTarget("Heal Self");

			}else if (["Haste", "Regen"].includes(gameEffect.effect)) {
				gameEffect.target = def || bh.PlayerBattleCard.parseTarget(damage.all ? "Heal All Allies" : "Heal Self");

			}else if (["Wet"].includes(gameEffect.effect) && card.name == "Apnoea") {
				gameEffect.target = damage || bh.PlayerBattleCard.parseTarget("Damage Single Enemy");

			}else if (["Storm", "Terra", "Wet"].includes(gameEffect.effect) && ["Wind Barrier", "Hurricane Barrier", "Forest Barrier", "Shield of The Nature", "Tides Control", "Wet Kiss"].includes(card.name)) {
				gameEffect.target = damage || bh.PlayerBattleCard.parseTarget(def.all ? "Damage All Enemies" : "Damage Single Enemy");

			}else if (gameEffect.effect == "Terra" && card.name == "Peace Pipe" && card.rarityType == RarityType.Legendary) {
				gameEffect.target = damage || bh.PlayerBattleCard.parseTarget(def.all ? "Damage All Enemies" : "Damage Single Enemy");

			}else if (targets.length == 1 || gameEffect.perkMultiplier) {
				gameEffect.target = targets[0];

			}else if (offensiveEffects.includes(gameEffect.effect) && damage) {
				gameEffect.target = damage;

			}else {

			}
			if (!gameEffect.target) console.warn("can't find target for " + gameEffect.effect, gameEffect.card);
		});
	}
	function getPowerRating(gameEffect: GameEffect): number {
		var rating = _getPowerRating(gameEffect);
		if (rating < 0) console.log(gameEffect);
		return rating;
	}
	function _getPowerRating(gameEffect: GameEffect): number {
		if (["Critical", "Regen"].includes(gameEffect.effect)) return 0;
		var target = gameEffect.target,
			targetOffense = target && target.offense,
			targetDefense = target && !target.offense,
			match = (gameEffect.value || "").toUpperCase().match(/(O|D)?((?:\+|\-)?\d+(?:\.\d+)?)(T)?(%)?/),
			effectOffense = match && match[1] == "O",
			effectDefense = match && match[1] == "D",
			points = match && +match[2] || 1,
			turns = match && match[3] == "T" ? gameEffect.turns : 1,
			percentMultiplier = match && match[4] == "%" ? gameEffect.percentMultiplier : 1,
			value = match ? points * turns * percentMultiplier : 0.5;
		if (target) {
			return value * gameEffect.perkMultiplier * (targetOffense == effectOffense || targetDefense == effectDefense ? 1 : -1);
		}else {
			console.warn("no target", gameEffect);
		}
		return 0;
	}
}