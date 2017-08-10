namespace bh {

	export namespace utils {
		// Strings
		export function formatString(value: string, args: any[]): string {
			// Similar to String.format, except that it uses named properties of an object:
			//    String.namedFormat("I am #{age} #{what} old.", { age:8, what:"years" });
			//    String.namedFormat("I am #{age} #{what} old.", { age:8 }, { what:"years" });
			var keyRegex: RegExp = new RegExp("\\w+");
			var keys: string[] = value.match(new RegExp("#{\\w+}", "g"));
			for (var i = 0, l = keys.length; i < l; i++) {
				keys[i] = keys[i].match(keyRegex)[0];
			}
			var result = value;
			for (i = 0, l = keys.length; i < l; i++) {
				var key: string = keys[i];
				for (var j = 0, m = args.length; j < m; j++) {
					var obj = args[j];
					if (key in obj) {
						result = result.replace("#{" + key + "}", obj[key]);
						break;
					}
				}
			}
			return result;
		}
		export function htmlFriendly(value: string) {
			return String(value).replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		}

		// Arrays
		export function unique<T>(array: T[]): T[] {
			return array.reduce((out, curr) => out.includes(curr) ? out : out.concat([curr]), []);
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

		// Other
		export function parseBoolean(value: any): boolean {
			var string = String(value), char = string.substring(0, 1).toLowerCase();
			return char === "y" || char === "t" || string === "1";
		}

		export function evoToStars(rarityType: RarityType, evoLevel: string = String(rarityType+1)): string {
			var evo = +evoLevel.split(".")[0],
				stars: number = rarityType + 1,
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
				imageSources: string[] = $("img").toArray().map(img => img.src).reduce((arr, src) => arr.includes(src) ? arr : arr.concat(src), []),
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

		var loggedCards: { [guid: string]: boolean; } = { }
		export function logMissingCard(playerBattleCard: PlayerBattleCard) {
			if (!loggedCards[playerBattleCard.playerCard.id]) {
				console.log("Missing BattleCard:", `${playerBattleCard.name}: ${playerBattleCard.playerCard.id} (${playerBattleCard.evoLevel})`);
				loggedCards[playerBattleCard.playerCard.id] = true;
			}

		}

		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => void): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => void, thisArg: any): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<any>): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<any>, thisArg: any): Promise<T[]>;
		export function asyncForEach<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): Promise<T[]> {
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