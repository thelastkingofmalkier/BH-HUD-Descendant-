namespace bh {
	export namespace utils {
		export function htmlFriendly(value: string) {
			return String(value).replace(/\</g, "&lt;").replace(/\>/g, "&rt;");
		}
		// Numbers
		export function formatNumber(value: number) {
			var num = String(value).split(""),
				out = [],
				o = 0;
			for (var i = num.length; i--;) {
				if (out.length && o % 3 == 0) out.unshift(",");
				out.unshift(num.pop());
				o++;
			}
			return out.join("");
		}
		export function round(value: number, places: number): number {
			var shifter = (10 ^ places),
				bigger = value * shifter,
				biggerRounded = Math.round(bigger),
				rounded = biggerRounded / shifter;
			return rounded;
		}
		export function truncateNumber(value: number) {
			var out = utils.formatNumber(value),
				parts = out.split(",");
			return parts.length == 1 ? out : parts[0].length == 1 ? `${parts[0]}.${parts[1][0]}k` : `${parts[0]}k`;
		}

		// Arrays
		export function unique(array: string[]): string[] {
			var map: { [key: string]: string; } = { };
			array.forEach(s => map[s] = s);
			return Object.keys(map);
		}
		export function flatten(array: string[][]): string[] {
			var out: string[] = [];
			array.forEach(arr => arr.forEach(s => out.push(s)));
			return out;
		}

		// Other
		export function parseBoolean(value: any): boolean {
			var string = String(value).substring(0, 1).toLowerCase();
			return string === "y" || string === "t" || string === "1";
		}
		export function rankToNumber(rank: string): number {
			switch (rank) {
				case "Leader": return 4;
				case "CoLeader": return 3;
				case "Elder": return 2;
				default: return 1;
			}
		}
		export function guessMinRarity(evoLevel: number, level: number): string {
			if (4 < evoLevel) return "Legendary";
			if (34 < level || 3 < evoLevel) return "Super Rare";
			if (19 < level || 2 < evoLevel) return "Rare";
			if (9 < level || 1 < evoLevel) return "Uncommon";
			return "Common";
		}
		export function rarityToStars(rarity: string): string {
			switch (rarity) {
				case "Common": return "<small class='evo-star'>&#9733;</small>";
				case "Uncommon": return "<small class='evo-star'>&#9733;&#9733;</small>";
				case "Rare": return "<small class='evo-star'>&#9733;&#9733;&#9733;</small>";
				case "Super Rare": return "<small class='evo-star'>&#9733;&#9733;&#9733;&#9733;</small>";
				case "Legendary": return "<small class='evo-star'>&#9733;&#9733;&#9733;&#9733;&#9733;</small>";
				default: return "";
			}
		}
		export function evoToStars(rarity: string, evoLevel: string): string {
			var evo = +evoLevel.split(".")[0],
				level = +evoLevel.split(".")[1],
				rarity = rarity || guessMinRarity(evo, level - 1),
				stars = rarity == "Legendary" ? 5 : rarity == "Super Rare" ? 4 : rarity == "Rare" ? 3 : rarity == "Uncommon" ? 2 : 1,
				count = 0,
				value = "";
			while (evo--) {
				count++;
				value += "<span class='evo-star'>&#9733;</span>";
			}
			while (count < stars) {
				count++;
				value += "<span class='star'>&#9734;</span>";
			}
			return value;
		}

		export function getBase64Image(src: string) {
			var img = document.createElement("img");
			img.setAttribute('src', src);

			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			var dataURL = canvas.toDataURL("image/png");

			return dataURL;
		}

	}
}