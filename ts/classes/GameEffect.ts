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
		}
		public static parse(value: string): GameEffect {
			var gameEffect = new GameEffect(value);
			return gameEffect.effect && gameEffect || null;
		}
		public static parseAll(playerCard: IPlayer.PlayerCard): GameEffect[] {
			var card = data.BattleCardRepo.find(playerCard.configId),
				evoLevel = playerCard.evolutionLevel,
				perkMultiplier = bh.BattleCardRepo.getPerk(card, evoLevel) / 100,
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
			return gameEffects;
		}
	}
	function reconcileTargets(gameEffects: GameEffect[], card: IDataBattleCard): void {
		var targets = card.typesTargets.map(typeTarget => bh.PlayerBattleCard.parseTarget(typeTarget));
		gameEffects.forEach(gameEffect => {
			if (targets.length == 1) {
				gameEffect.target = targets[0];
			}else {
				if ([].includes(gameEffect.value)) {  }
			}
		});
	}
}