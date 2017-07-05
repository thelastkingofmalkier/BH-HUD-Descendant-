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
		export function positionToType(position: string): PositionType { return <any>PositionType[<any>position]; }

		export function rarityToType(rarity: GameRarity): RarityType { return <any>RarityType[<any>rarity.replace(/ /g, "")]; }

		export function typeToElement(elementType: ElementType): GameElement { return <any>ElementType[elementType]; }

		export function typeToRarity(rarityType: RarityType): GameRarity { return <any>RarityType[rarityType]; }

		export function guessMinRarity(evoLevel: number, level: number): GameRarity {
			if (4 < evoLevel) return "Legendary";
			if (34 < level || 3 < evoLevel) return "SuperRare";
			if (19 < level || 2 < evoLevel) return "Rare";
			if (9 < level || 1 < evoLevel) return "Uncommon";
			return "Common";
		}
		export function rarityToStars(rarityType: RarityType): string {
			return `<small class='evo-star'>${(new Array(rarityType)).fill("&#9733;").join("")}</small>`;
		}
		export function evoToStars(rarityType: RarityType, evoLevel: string): string {
			var evo = +evoLevel.split(".")[0],
				level = +evoLevel.split(".")[1],
				stars: number = rarityType,
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
		export function createImagesJs() {
			var allTypes = Object.keys(images),
				loadedTypes: string[] = [],
				imageSources = unique($("img").toArray().map(img => img.src)),
				output = ``;
			output += `var bh;(function (bh) {var images;(function (images) {`;
			$("#data-output").val("Loading, please wait ...");
			asyncForEach(imageSources, imageSource => {
				var parts = imageSource.split("/images/")[1].split(".")[0].split("/");
				if (allTypes.includes(parts[0]) && parts.length == 2) {
					if (!loadedTypes.includes(parts[0])) {
						loadedTypes.push(parts[0]);
						output += `\nimages.${parts[0]} = {};`;
					}
					output += `\nimages.${parts[0]}["${parts[1]}"] = "${getBase64Image(imageSource)}";`;
				}
			}).then(() => {
				output += `\n})(images = bh.images || (bh.images = {}));})(bh || (bh = {}));`;
				$("#data-output").val(output);
			});
		}

		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => void): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => void, thisArg: any): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<any>): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<any>, thisArg: any): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<any>, thisArg?: any): Promise<T[]> {
			return new Promise<T[]>((resolvefn: (values: T[]) => void, rejectfn: (reason: any) => void) => {
				var functions = array.map((value: T, index: number, array: T[]) => {
					return function(value: T, index: number, array: T[]) {
						setTimeout((thisArg: any, value: T, index: number, array: T[]) => {
							try {
								var retVal: any = callbackfn.call(thisArg, value, index, array);
								retVal instanceof Promise ? (<Promise<any>>retVal).then(process, rejectfn) : process();
							}catch(ex) {
								rejectfn(ex);
							}
						}, 0, thisArg, value, index, array);
					}.bind(thisArg, value, index, array);
				});
				var process = () => {
					if (functions.length) {
						var fn = functions.shift();
						fn ? fn() : process();
					}else {
						resolvefn(array);
					}
				};
				process();
			});
		}
	}
}