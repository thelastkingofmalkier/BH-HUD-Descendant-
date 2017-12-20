namespace bh {
	export class GameEffect {
		public static matchEffect(raw: string): string[] {
			return raw == "Critical" ? ["Critical", "Critical"]
				: raw == "Splash Enemy" ? ["Splash", "Splash"]
				: raw.match(/([a-zA-z]+(?: [a-zA-Z]+)*)(?: (\d+)%)?(?: (\d+)T)?(?: (Enemy|Ally|Self))/);
		}

		public effect: string;
		public value: string;
		public percent: string;
		public percentMultiplier: number;
		public perkMultiplier: number;
		public rawTarget: string;
		public turns: number;
		public target: IDataBattleCardTarget;
		public card: IDataBattleCard;
		public offense: boolean;

		private constructor(public raw: string) {
			var parts =  GameEffect.matchEffect(raw),
				cleanValue = parts && parts[1] || raw,
				effect = bh.data.EffectRepo.find(cleanValue);
			this.effect = effect && effect.name || cleanValue;
			this.percent = parts && parts[2] && (`${parts[2]}%`) || null;
			this.percentMultiplier = this.percent && (+parts[2]/100) || null;
			this.turns = parts && +parts[3] || null;
			this.value = effect && effect.value;
			this.perkMultiplier = 0;
			this.offense = !(effect && effect.value || "").toLowerCase().startsWith("d");
			this.rawTarget = parts && parts[4] || null;
		}

		public get powerRating(): number { return getPowerRating(this); }
		public static parse(value: string): GameEffect {
			if (!value) return null;
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

	function reconcileTargets(gameEffects: GameEffect[], card: IDataBattleCard): void {
		var targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget)),
			damage = targets.find(t => t.type == "Damage"),
			def = targets.find(t => ["Heal", "Shield"].includes(t.type)),
			damages = [];
		gameEffects.slice().forEach(gameEffect => {
			if (["Leech", "Sap"].includes(gameEffect.effect)) {
				gameEffect.rawTarget = "Enemy";
			}
			if (gameEffect.effect == "Critical") {
				gameEffect.target = targets[0];
				targets.slice(1).forEach(t => {
					var ge = GameEffect.parse(gameEffect.raw);
					ge.target = t;
					gameEffects.push(ge);
				});
			}else if (gameEffect.effect == "Splash Damage") {
				// ignore
			}else if (gameEffect.rawTarget == "Enemy") {
				gameEffect.target = damage || bh.PlayerBattleCard.parseTarget(def.all ? "Damage All Enemies" : "Damage Single Enemy");

			}else if (gameEffect.rawTarget == "Ally") {
				var healOrShield = def && def.type || "Heal";
				gameEffect.target = bh.PlayerBattleCard.parseTarget((damage || def).all ? `${healOrShield} All Allies` : `${healOrShield} Single Ally`);

			}else if (gameEffect.rawTarget == "Self") {
				var healOrShield = def && def.type || "Heal";
				gameEffect.target = bh.PlayerBattleCard.parseTarget(`${healOrShield} Self`);

			}else {
				if (!gameEffect.target) console.warn("can't find target for " + gameEffect.effect, gameEffect.card);
			}
		});
	}
	function getPowerRating(gameEffect: GameEffect): number {
		var rating = _getPowerRating(gameEffect);
		return rating;
	}
	function _getPowerRating(gameEffect: GameEffect): number {
		if (["Critical", "Regen", "Splash Damage"].includes(gameEffect.effect)) return 0;
		var match = (gameEffect.value || "").toUpperCase().match(/(O|D)?((?:\+|\-)?\d+(?:\.\d+)?)(T)?(%)?/),
			effectOffense = match && match[1] == "O",
			effectDefense = match && match[1] == "D",
			points = match && +match[2] || 1,
			turns = match && match[3] == "T" ? gameEffect.turns : 1,
			percentMultiplier = match && match[4] == "%" ? gameEffect.percentMultiplier : 1,
			value = match ? points * turns * percentMultiplier : 0.5,
			target = gameEffect.target,
			targetOffense = target && target.offense,
			targetDefense = target && !target.offense,
			oppoMultiplier = targetOffense == effectOffense || targetDefense == effectDefense ? 1 : -1,
			perkMultiplier = gameEffect.perkMultiplier || 1;
		if (target) {
			return value * perkMultiplier * oppoMultiplier;
		}else {
			console.warn("no target", gameEffect);
		}
		return 0;
	}
}