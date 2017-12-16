/// <reference path="Repo.ts"/>
namespace bh {
	export class AbilityRepo {
		public static get allTypes(): AbilityType[] {
			return [0, 1, 2];
		}
		public static isAbility(ability: string) {
			return String(ability).replace(/ /g, "") in AbilityType;
		}
		public static findType(value: string): AbilityType {
			return this.allTypes.find(abilityType => value[0] == AbilityType[abilityType][0]);
		}
	}
}