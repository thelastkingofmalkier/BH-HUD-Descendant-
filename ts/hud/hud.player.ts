/// <reference path="listener.ts"/>
namespace bh {
	export namespace hud {
		export var _delayMS = 500;
		export namespace player {
			export function loadPlayer(player: Player) {
				if (player.isExtended) {
					$("#brain-hud-inventory").addClass("active");
					data.PlayerRepo.put(player);
					$("#brain-hud-inventory-items-container")
						.html("")
						.append(player.boosterCards.map(card => card.rowHtml))
						.append(player.battleCards.map(card => card.rowHtml))
						.append(player.inventory.sort(utils.sort.byName).map(item => item.rowHtml))
						.append(player.wildCards.map(card => card.rowHtml))
						.append(player.boosterRowHtml)
						.append(player.fragmentsRowHtml)
						.append(player.gemsRowHtml)
						.append(player.goldRowHtml)
						.append(player.raidRowHtml)
						.append(player.wildCardRowHtml)
						;
					events.toggle();
				}
			}
			export function addPlayerReport(message: IMessage) {
				var json: IPlayer.Player = message.data;
				var player = new Player(json),
					select = $("#brain-hud-scouter-player-target");

				if (!$(`#brain-hud-scouter-player-target > option[value="${player.guid}"]`).length) {
					select.append(`<option value="${player.guid}">${player.isFullMeat ? `&#9734; ` : ``}${utils.htmlFriendly(player.name)} (${player.powerPercent}%)</option>`);
					select.children().toArray().slice(1)
						.sort((a: HTMLOptionElement, b: HTMLOptionElement) => { return a.text < b.text ? -1 : a.text == b.text ? 0 : 1 })
						.forEach(el => select.append(el));
				}
				data.PlayerRepo.put(player);
				scouter.loadPlayer(player);
				if (player.isMe) {
					loadPlayer(player);
					var guilds = player.guilds;
					if (guilds.length && guild.addGuildReport) {
						guilds.forEach(g => guild.addGuildReport(g.guid));
					}
				}

				select.val(json.id);
				selectPlayerReport();
				guild.selectGuildReport();
			}
			export function selectPlayerReport() {
				$("div.brain-hud-scouter-player-container").addClass("active");
				$("#brain-hud-scouter-player-report").show();
				$("div.brain-hud-scouter-player").removeClass("active");
				var guid = $("#brain-hud-scouter-player-target").val();
				if (guid == "arena") {
					$(`div.brain-hud-scouter-player[data-guid="arena-0"]`).addClass("active");
					$(`div.brain-hud-scouter-player[data-guid="arena-1"]`).addClass("active");
					$(`div.brain-hud-scouter-player[data-guid="arena-2"]`).addClass("active");
				}else {
					$(`div.brain-hud-scouter-player[data-guid="${guid}"]`).addClass("active");
				}
			}
			listener.addAction("get-player", "/v1/player/get?", addPlayerReport);
			listener.addAction("get-player", "/v1/player/getplayerinfo?", addPlayerReport);

			export function playersGet(playerGuids: string[]) {
				return new Promise((res, rej) => {
					var guids = playerGuids.slice(), guid: string;
					function fetch() {
						if (guid = guids.shift()) {
							setTimeout(() => playerGet(guid).then(fetch, fetch), _delayMS);
						}else {
							res();
						}
					}
					fetch();
				});
			}
			export function playerGet(guid: string) {
				var url = `https://battlehand-game-kong.anotherplacegames.com/v1/player/getplayerinfo?player=${Messenger.ActivePlayerGuid}&sessionKey=${Messenger.ActiveSessionKey}&id_requested_player=${guid}`;
				if (isLocal) url = `./json/${guid}.json`;
				return new Promise((res, rej) => {
					if (!Messenger.ActivePlayerGuid || !Messenger.ActiveSessionKey) return rej("not initialized");
					if (!guid) return rej("no player id");
					XmlHttpRequest.getJSON(url).then(json => {
						if (!json) return rej("invalid json");
						Messenger.instance.postMessage(Messenger.createMessage("get-player", json));
						res(json);
					}, rej);
				});
			}
			listener.addAction("refresh-player", null, message => { console.log(`refresh-player: ${message&&message.data}`); playerGet(message.data); });
		}
	}
}