namespace bh {
	var root: string;
	function getRoot() {
		if (!root) {
			root = String(location.href).toLowerCase().includes("battlehand-hud/") ? "." : host;
		}
		return root;
	}
	function img(src: string, css?: string, style?: string) {
		var onerror = "",
			klass = css ? `class="${css}"` : "",
			style = style ? `style="${style}"` : "";
		if (src.includes("glyphicons-82-refresh")) {
			onerror = `onerror="bh.$(this).replaceWith('&#8634;')"`;
		}
		return `<img src="${src}" ${klass} ${style} ${onerror}/>`;
	}
	export function getImg(...parts: string[]): string { return img(getSrc(...parts)); }
	export function getImg12(...parts: string[]): string {return img(getSrc(...parts), "icon-12"); }
	export function getImg20(...parts: string[]): string {return img(getSrc(...parts), "icon-20"); }
	export function getImgG(...parts: string[]): string { return img(getSrc(...parts), "grayscale"); }
	function getSrc(...parts: string[]): string {
		var sliced = parts.slice(),
			image = (<any>images)[sliced.shift()];
		while (sliced.length) image = image[sliced.shift()];
		if (!image) image = `${getRoot()}/images/${parts.join("/")}.png`;
		return image;
	}
	export namespace images {
		export namespace battlecards {
			export namespace icons {
				export declare var HoistTheColours: string;
			}
		}
		export namespace cardtypes {
			export declare var Attack: string;
			export declare var BattleCard: string;
			export declare var Brag: string;
			export declare var Heal: string;
			export declare var Shield: string;
			export declare var WildCard: string;
		}
		export namespace classes {
			export declare var Magic: string;
			export declare var Might: string;
			export declare var Skill: string;
		}
		export namespace crystals {
			export declare var Air: string;
			export declare var Earth: string;
			export declare var Fire: string;
			export declare var Neutral: string;
			export declare var Spirit: string;
			export declare var Water: string;
		}
		export namespace elements {
			export declare var Air: string;
			export declare var Earth: string;
			export declare var Fire: string;
			export declare var Loop: string;
			export declare var Spirit: string;
			export declare var Water: string;
		}
		export namespace evojars {
			export declare var BeetleJuice: string;
			export declare var BlueJam: string;
			export declare var Brains: string;
			export declare var ChargedOre: string;
			export declare var Crystals: string;
			export declare var DragonsBreath: string;
			export declare var DungDollop: string;
			export declare var Ectoplasm: string;
			export declare var Eyeballs: string;
			export declare var Fireflies: string;
			export declare var FrostBite: string;
			export declare var Honey: string;
			export declare var Infinity: string;
			export declare var Leeches: string;
			export declare var Magma: string;
			export declare var Marmyte: string;
			export declare var MeanSpirit: string;
			export declare var Milk: string;
			export declare var MiracleWater: string;
			export declare var Oil: string;
			export declare var OreParticles: string;
			export declare var PhoenixFeather: string;
			export declare var PixieDust: string;
			export declare var SandsofTime: string;
			export declare var SeaSalt: string;
			export declare var SnapWeed: string;
			export declare var SpindleEggs: string;
			export declare var SpiritStone: string;
			export declare var Stardust: string;
			export declare var StrengthStone: string;
			export declare var SwampSpirit: string;
			export declare var TitaniumOre: string;
			export declare var ValerianRoot: string;
			export declare var Venom: string;
			export declare var VitalFluid: string;
			export declare var WaterVapour: string;
			export declare var WeederSeeds: string;
			export declare var Zapperball: string;
		}
		export namespace heroes {
			export declare var Brom: string;
			export declare var Hawkeye: string;
			export declare var Bree: string;
			export declare var Thrudd: string;
			export declare var Trix: string;
			export declare var Fergus: string;
			export declare var Monty: string;
			export declare var Red: string;
			export declare var Jinx: string;
			export declare var Krell: string;
			export declare var Gilda: string;
			export declare var Logan: string;
			export declare var Peg: string;
		}
		export namespace icons {
			export declare var logo: string;
		}
		export namespace keys {
			export declare var RaidTicket: string;
		}
		export namespace misc {
			export declare var Boosters: string;
			export declare var Coin: string;
			export declare var EvoJars: string;
			export declare var Fragments: string;
			export declare var GemStone: string;
		}
		export namespace runes {
			export declare var DeathTrap: string;
			export declare var GhostShip: string;
			export declare var Haunt: string;
			export declare var HippyShake: string;
			export declare var HolySword: string;
			export declare var Meteor: string;
			export declare var MonsterMagnet: string;
			export declare var RemedyRush: string;
			export declare var ShieldMaiden: string;
			export declare var SoulDrain: string;
			export declare var TheDropper: string;
			export declare var Waterwall: string;
			export declare var Whirlwind: string;
		}
		export namespace skills {
			export declare var BreeActive: string;
		}
	}
}