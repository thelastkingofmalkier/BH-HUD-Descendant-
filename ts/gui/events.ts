namespace bh {
	var _win: Window, funcs: Function[] = [], resolved = false, tries = 0, promise: Promise<boolean>;
	export function loaded(win: Window): Promise<boolean> {
		_win = _win || win;
		return promise || (promise = new Promise<boolean>((res, rej) => {
			wait(res, rej);
			$(() => {res();});
		}));
	}
	function wait(res: () => void, rej: (reason: string) => void) {
		if (resolved) return;
		if (++tries > 60) {
			return rej("60 tries");
		}
		if (!_win || !(<any>_win).jQuery || !_win.document || !_win.document.body) {
			if (!resolved) setTimeout(wait, 1500, res, rej);
			return;
		}
		(<any>_win).jQuery(() => {
			funcs.forEach(fn => fn());
		});
		res();
	}

	function jqFN() { return jqObj; }
	var jqObj = { on:jqFN, val:jqFN }

	export function $(): JQueryStatic;
	export function $(fn: Function): void;
	export function $(selector: any): JQuery;
	export function $(selector?: any): JQuery | JQueryStatic {
		if (!selector) return _win ? (<any>_win).jQuery || jqFN : jqFN;
		if (typeof(selector) == "function" && !(_win && (<any>_win).jQuery)) return <any>funcs.push(selector);
		return (_win && (<any>_win).jQuery || jqFN)(selector);
	}

	export namespace events {
		var heroStack: string[] = [];

		export function init() {
			bh.data.init().then(() => {
				$("body").on("click change", "[data-action]", onAction);
			});
		}

		export function toggle(key?: string, value?: string) {
			if (key && value) {
				$(`.brain-hud-inventory-buttons > button[data-action="toggle-${key}"][data-${key}="${value}"]`).toggleClass("active");
			}
			var elements = $(`.brain-hud-inventory-buttons > [data-action="toggle-element"].active`).toArray().map(el => el.getAttribute("data-element")),
				klasses = $(`.brain-hud-inventory-buttons > [data-action="toggle-klass"].active`).toArray().map(el => el.getAttribute("data-klass")),
				types = $(`.brain-hud-inventory-buttons > [data-action="toggle-type"].active`).toArray().map(el => el.getAttribute("data-type"));

			$("#brain-hud-inventory-items-container > div").hide();
			if (!elements.length && !klasses.length && !types.length) {
				$(`#brain-hud-inventory-items-container > div[data-hud="true"]`).show();
			}else {
				$("#brain-hud-inventory-items-container > div").each((i, elem) => {
					var el = $(elem),
						element = !elements.length || elements.includes(el.data("element")),
						klass = !klasses.length || klasses.includes(el.data("klass")) || klasses.includes(el.data("brag")),
						type = !types.length || types.includes(el.data("type"));
					if (element && klass && type) {
						el.show();
					}
				});
			}
		}

		function onAction(ev: JQueryEventObject) {
			var el = $(ev.target).closest("[data-action]"),
				action = el.data("action"),
				guid: string;
			switch (action) {
				case "refresh-guild":
					Messenger.instance.postMessage(Messenger.createMessage("refresh-guild", $("#brain-hud-scouter-guild-target").val()));
					break;
				case "refresh-player":
					Messenger.instance.postMessage(Messenger.createMessage("refresh-player", $("#brain-hud-scouter-player-target").val()));
					break;
				case "toggle-child":
					guid = el.data("guid");
					var active = $(`div[data-parent-guid="${guid}"]`).toggleClass("active").hasClass("active");
					$(`button[data-action="toggle-child"][data-guid="${guid}"]`).text(active?"[-]":"[+]");
					break;
				case "toggle-element":
					toggle("element", el.data("element"));
					break;
				case "toggle-klass":
					toggle("klass", el.data("klass"));
					break;
				case "toggle-type":
					toggle("type", el.data("type"));
					break;
				case "toggle-scouter-guild":
					hud.guild.selectGuildReport();
					break;
				case "toggle-scouter-player":
					hud.player.selectPlayerReport();
					break;
				case "toggle-scouter-hero":
					var panel = el.closest("[data-guid]"),
						content = panel.find(".brain-hud-scouter-panel-content");
					content.toggleClass("active");
					break;
				case "toggle-hud":
					var visible = $("div.brain-hud-main-container").toggleClass("active").hasClass("active");
					$("div#brain-hud-container").css("width", visible ? 250 : 25);
					$("div.brain-hud-header>span.header")[visible?"show":"hide"]();
					$(`button.brain-hud-toggle[data-action="toggle-hud"]`).text(visible ? "[-]" : "[+]");
					break;
				case "toggle-guild-scouter":
					var visible = $("textarea#brain-hud-scouter-guild-report").toggleClass("active").hasClass("active");
					$(`button.brain-hud-toggle[data-action="toggle-guild-scouter"]`).text(visible ? "[-]" : "[+]");
					break;
				case "toggle-player-scouter":
					var visible = $("div#brain-hud-scouter-player-report").toggleClass("active").hasClass("active");
					$(`button.brain-hud-toggle[data-action="toggle-player-scouter"]`).text(visible ? "[-]" : "[+]");
					break;
				case "toggle-inventory":
					var visible = $("div.brain-hud-inventory-container").toggleClass("active").hasClass("active");
					$(`button.brain-hud-toggle[data-action="toggle-inventory"]`).text(visible ? "[-]" : "[+]");
					break;
				default:
					console.log(action);
					break;
			}
		}
	}
}
