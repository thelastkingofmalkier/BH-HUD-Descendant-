namespace bh {
	export class Cacheable {
		private _cache: { [key: string]: any; } = { };
		protected clearCache() {
			this._cache = { };
		}
		protected fromCache(key: string, fn:() => any) {
			if (!(key in this._cache)) {
				this._cache[key] = fn();
			}
			return this._cache[key];
		}
	}
}