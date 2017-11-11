namespace bh {
	export class GameEffect {
		public effect: string;
		public value: number;
		public percent: string;
		public percentMultiplier: number;
		public turns: number;
		public constructor(value: string) {
			var parts = value.match(/([a-zA-z]+(?: [a-zA-Z]+)*)(?: (\d+)%)?(?: (\d+)T)?/),
				cleanValue = parts && parts[1] || value,
				effect = bh.data.EffectRepo.find(cleanValue);
			this.effect = effect && effect.name || cleanValue;
			this.percent = parts && parts[2] && (`${parts[2]}%`) || null;
			this.percentMultiplier = this.percent && (+parts[2]/100) || null;
			this.turns = parts && +parts[3] || null;
			this.value = effect && effect.value;
		}
		public static parse(value: string) {
			var gameEffect = new GameEffect(value);
			return gameEffect.effect && gameEffect || null;
		}
	}
}