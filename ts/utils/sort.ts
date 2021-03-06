namespace bh {
	export namespace utils {
		export namespace sort {

			export function byElement(a: IHasElementType, b: IHasElementType): number {
				return a.elementType == b.elementType ? 0 : a.elementType < b.elementType ? -1 : 1;
			}
			export function byElementThenKlass(a: IHasElementType & IHasKlassType, b: IHasElementType & IHasKlassType): number {
				return byElement(a, b) || byKlass(a, b);
			}
			export function byElementThenName(a: IHasName & IHasElementType, b: IHasName & IHasElementType): number {
				return byElement(a, b) || byName(a, b);
			}
			export function byElementThenRarityThenName(a: IHasName & IHasElementType & IHasRarityType, b: IHasName & IHasElementType & IHasRarityType): number {
				return byElement(a, b) || byRarityThenName(a, b);
			}

			export function byKlass(a: IHasKlassType, b: IHasKlassType) {
				return a.klassType == b.klassType ? 0 : a.klassType < b.klassType ? -1 : 1;
			}

			export function byEvoLevel(a: IHasEvoLevel, b: IHasEvoLevel): number {
				return a.evoLevel == b.evoLevel ? 0 : +a.evoLevel < +b.evoLevel ? -1 : 1;
			}
			export function byEvoLevelThenName(a: IHasName & IHasEvoLevel, b: IHasName & IHasEvoLevel): number {
				return byEvoLevel(a, b) || byName(a, b);
			}

			export function byName(a: IHasName, b: IHasName): number {
				var an = a.lower || a.name.toLowerCase(), bn = a.lower || b.name.toLowerCase();
				if (an == "sands of time") return -1;
				if (bn == "sands of time") return 1;
				return an == bn ? 0 : an < bn ? -1 : 1;
			}

			export function byPosition(a: IHasPosition, b: IHasPosition): number {
				var ap = PositionType[a.position], bp = PositionType[b.position];
				return ap == bp ? 0 : ap > bp ? -1 : 1;
			}
			export function byPositionThenName(a: IHasName & IHasPosition, b: IHasName & IHasPosition): number {
				return byPosition(a, b) || byName(a, b);
			}

			export function byRarity(a: IHasRarityType, b: IHasRarityType): number {
				return a.rarityType == b.rarityType ? 0 : a.rarityType < b.rarityType ? -1 : 1;
			}
			export function byRarityThenName(a: IHasName & IHasRarityType, b: IHasName & IHasRarityType): number {
				return byRarity(a, b) || byName(a, b);
			}
			export function byRarityThenNameThenEvoLevel(a: IHasName & IHasEvoLevel & IHasRarityType, b: IHasName & IHasEvoLevel & IHasRarityType): number {
				return byRarity(a, b) || byName(a, b) || byEvoLevel(a, b);
			}

		}
	}
}