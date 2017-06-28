namespace bh {
	export namespace utils {
		export namespace sort {

			// function elementToNumber(element: "Air" | "Earth" | "Fire" | "Water" | "Spirit" | "Neutral") {
			function elementToNumber(element: string) {
				switch (element) {
					case "Fire": return 0;
					case "Earth": return 1;
					case "Air": return 2;
					case "Spirit": return 3;
					case "Water": return 4;
					default: return 5
				}
			}
			export function byElement(a: IHasElementType, b: IHasElementType): number {
				var aValue = elementToNumber(ElementType[a.elementType]), bValue = elementToNumber(ElementType[b.elementType]);
				// var aValue = elementToNumber(a.element), bValue = elementToNumber(b.element);
				return aValue == bValue ? 0 : aValue < bValue ? -1 : 1;
			}
			export function byElementThenKlass(a: IHasElementType & IHasKlass, b: IHasElementType & IHasKlass): number {
				return byElement(a, b) || byKlass(a, b);
			}
			export function byElementThenName(a: IHasName & IHasElementType, b: IHasName & IHasElementType): number {
				return byElement(a, b) || byName(a, b);
			}
			export function byElementThenRarityThenName(a: IHasName & IHasElementType & IHasRarity, b: IHasName & IHasElementType & IHasRarity): number {
				return byElement(a, b) || byRarityThenName(a, b);
			}

			export function byKlass(a: IHasKlass, b: IHasKlass) {
				return a.klass == b.klass ? 0 : a.klass < b.klass ? -1 : 1;
			}

			export function byEvoLevel(a: IHasEvoLevel, b: IHasEvoLevel): number {
				return a.evoLevel == b.evoLevel ? 0 : +a.evoLevel < +b.evoLevel ? -1 : 1;
			}
			export function byEvoLevelThenName(a: IHasName & IHasEvoLevel, b: IHasName & IHasEvoLevel): number {
				return byEvoLevel(a, b) || byName(a, b);
			}

			export function byName(a: IHasName, b: IHasName): number {
				var an = a.lower || a.name.toLowerCase(), bn = a.lower || b.name.toLowerCase();
				return an == bn ? 0 : an < bn ? -1 : 1;
			}

			export function byPosition(a: IHasPosition, b: IHasPosition): number {
				var ap = rankToNumber(a.position), bp = rankToNumber(b.position);
				return ap == bp ? 0 : ap > bp ? -1 : 1;
			}
			export function byPositionThenName(a: IHasName & IHasPosition, b: IHasName & IHasPosition): number {
				return byPosition(a, b) || byName(a, b);
			}

			export function byRarity(a: IHasRarity, b: IHasRarity): number {
				var aStars = rarityToStars(a.rarity).length, bStars = rarityToStars(b.rarity).length;
				return aStars == bStars ? 0 : aStars < bStars ? -1 : 1;
			}
			export function byRarityThenName(a: IHasName & IHasRarity, b: IHasName & IHasRarity): number {
				return byRarity(a, b) || byName(a, b);
			}
			export function byRarityThenNameThenEvoLevel(a: IHasName & IHasEvoLevel & IHasRarity, b: IHasName & IHasEvoLevel & IHasRarity): number {
				return byRarity(a, b) || byName(a, b) || byEvoLevel(a, b);
			}

		}
	}
}