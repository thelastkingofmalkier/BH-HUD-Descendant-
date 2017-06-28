namespace bh {
	export var isHud = false;
	export var isListener = false;
	export var isLocal = false;
	export var host: string;
	export namespace hud {
		export namespace listener {
			namespace resolution {
				var _win: Window, _resolve: (win: Window) => void, _hud = false, _listener = false, resolved = false;
				export function setResolve(win: Window, resolve: (win: Window) => void) { _win = win; _resolve = resolve; }
				export function resolveHud() { _hud = true; resolve(); }
				export function resolveListener() { _listener = true; resolve(); }
				function resolve() { if (!resolved) { if (_hud && _listener) { _resolve(_win); resolved = true; } } }
			}

			function handleMessage(message: IMessage) {
				if (Messenger.isValidMessage(message)) {
					actionItems.forEach(item => {
						if (item && item.action == message.action && item.callbackfn) {
							try {
								item.callbackfn(message);
							}catch(ex) {
								console.error(message.action, ex);
							}
						}
					});
				}else {
					console.log(`invalid message`, message);
				}
			}

			interface IActionItem { action: string; url: string; callbackfn:(message: IMessage) => void };

			var actionItems: IActionItem[] = [
				{ action:"hud-init", url:null, callbackfn:resolution.resolveHud }
			];
			export function addAction(action: string, url: string, callbackfn: (message: IMessage) => void) {
				actionItems.push({ action:action, url:url, callbackfn:callbackfn });
			}

			export function init(win: Window, host: string = "http://brains.sth.ovh") {
				return new Promise<Window>((res, rej) => {
					var href = String(win && win.location && win.location.href || "").toLowerCase();
					isLocal = href.includes("brain-bh/default.htm") || href.includes("brain-bh/iframe.htm");
					isHud = href.includes("brain-bh/default.htm") || href.startsWith("http://www.kongregate.com/games/anotherplaceprod/battlehand-web"),
					isListener = href.includes("brain-bh/iframe.htm") || href.startsWith("http://game261051.konggames.com/gamez/");
					bh.host = host;
					if (isHud) {
						(<any>win).bh = bh;
						XmlHttpRequest.attach(win);
						loaded(win).then(() => {
							Messenger.initialize(win, handleMessage);
							data.init().then(() => {
								render();
								Messenger.instance.postMessage(Messenger.createMessage("hud-init", "hud-init"));
								res(win);
							}, () => rej("data.init rejected"));
						}, (reason) => rej("loaded(win) rejected: " + reason));
					}else if (isListener) {
						resolution.setResolve(win, res);
						XmlHttpRequest.attach(win, readyStateChangeListener);
						Messenger.initialize(win, handleMessage);
					}else {
						rej("not hud nor listener");
					}
				});
			}
			function readyStateChangeListener() { handleReadyStateChange(this); }

			function urlToAction(url: string) {
				var actionItem = actionItems.find(item => url.includes(item.url));
				return actionItem && actionItem.action || null;
			}
			export function handleReadyStateChange(xhr: XmlHttpRequest) {
				if (xhr.readyState == XmlHttpRequest.DONE) {
					var match = xhr.requestUrl.match(/\?player=([a-z0-9]{8}(?:\-[a-z0-9]{4}){3}\-[a-z0-9]{12})&sessionKey=([a-z0-9]{32})(?:&guild(?:Id)?=([a-z0-9]{8}(?:\-[a-z0-9]{4}){3}\-[a-z0-9]{12}))?/);
					if (match) {
						var action = urlToAction(xhr.requestUrl),
							playerGuid = match[1],
							sessionKey = match[2],
							guildGuid = match[3],
							message: IMessage = { action:action, playerGuid:playerGuid, sessionKey:sessionKey, guildGuid:guildGuid, data:xhr.responseJSON };
						if (!action) return;
						resolution.resolveListener();
						Messenger.instance.postMessage(message);
					}
				}
			}


		}
	}
}
// 				// if (url.includes("/v1/player/get?")) return "get-player";           // SELF
// 				// if (url.includes("/v1/player/getplayerinfo?")) return "get-player"; // ANOTHER
// 				// if (url.includes("/v1/guildwars/getrange?")) return "get-leaderboard";
// 				// if (url.includes("/v1/guild/getguilds?")) return "get-guildsearch";
// 				// if (url.includes("/v1/guildwars/getguildmembersrange?")) return "get-guildwar-members";
// 				// if (url.includes("/v1/matchmaking/getmatches?")) return "get-arena-matches";
// 				// if (url.includes("/v1/player/challenges?")) return "get-active-challenge";
// 				// if (url.includes("/v1/player/stamina?")) return "get-dungeon-keys";
// 				// if (url.includes("/v1/player/pit?")) return "get-arena";
// 				// if (url.includes("/v1/player/catacombs?")) return "get-gauntlet";
// 				// if (url.includes("/v1/player/goldconversion?")) return "get-gold-conversion";
// 				// if (url.includes("/v1/player/shop?")) return "get-shop";
// 				// if (url.includes("/v1/player/bounties?")) return "get-bounties";
