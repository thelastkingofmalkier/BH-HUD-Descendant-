/// <reference path="listener.ts"/>
namespace bh {
	export namespace hud {
		export namespace guild {
			function showContainer() {
				var container = $("div.brain-hud-scouter-guild-container");
				if (!container.length) {
					var textarea = Player.me.canScout ? `<textarea id="brain-hud-scouter-guild-report" rows="1" type="text" class="active"></textarea>` : "";
					$("div.brain-hud-scouter-player-container").before(`<div class="brain-hud-scouter-guild-container"><button class="bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right" data-action="toggle-guild-scouter">[-]</button><button class="bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right" data-action="refresh-guild">${getImg12("icons", "glyphicons-82-refresh")}</button><select id="brain-hud-scouter-guild-target" data-action="toggle-scouter-guild"></select>${textarea}</div>`);
				}
				$("div.brain-hud-scouter-guild-container").addClass("active");
			}
			function addGuild(message: IMessage) {
				var guild: IGuild.Guild = message.data,
					guid = guild && guild.playerGuild && guild.playerGuild.id,
					name = guild && guild.playerGuild && guild.playerGuild.name;
				if (guid && name) {
					data.guilds.put(guid, name);
					data.reports.putGuild(guild);
					addGuildReport(guid);
				}
			}
			function addGuildSearchResults(message: IMessage) {
				var results: IGuildSearchGuild[] = message.data;
				results.forEach(guild => data.guilds.put(guild.id, guild.name));
			}
			function addGuildMembers(message: IMessage) {
				var members: IGuild.Player[] = message.data,
					guid = members[0].guildId;
				data.reports.putGuildMembers(members);
				addGuildReport(guid);
			}
			function addLeaderboardGuildMembers(message: IMessage) {
				addGuildReport(message.guildGuid);
			}
			function addGuildWar(message: IMessage) {
				var war: IGuildWar = message.data;
				if (war && war.guilds) {
					war.guilds.forEach(guild => data.guilds.put(guild.id, guild.name));
					data.reports.putGuildWar(war);
					war.guilds.forEach(guild => addGuildReport(guild.id));
				}
			}
			function addGuildLeaderBoard(message: IMessage) {
				var results: IGuildWarRangeResults = message.data;
				data.guilds.updateLeaderBoard(results);
				updateGuildOptions();
			}
			export function addGuildReport(guid: string) {
				var guildName = data.guilds.findNameByGuid(guid);
				if (!guildName) return console.log(`guildName not found: ${guid}`);

				var player = Player.me,
					playerGuildParent = player && player.guildParent || null,
					guilds = playerGuildParent && data.guilds.filterNamesByParent(playerGuildParent) || [],
					canScout = player && player.canScout,
					isGuild = player && player.guildGuid == guid;
				if (!guilds.find(g => g.guid == guid) && !canScout && !isGuild) return;

				showContainer();
				var select = $("#brain-hud-scouter-guild-target");
				if (!select.find(`option[value="${guid}"]`).length) {
					select.append(`<option value="${guid}">${guildName.name}</option>`);
					select.children().toArray().filter(opt => opt.value != player.guildGuid)
						.sort((a: HTMLOptionElement, b: HTMLOptionElement) => { return a.text < b.text ? -1 : a.text == b.text ? 0 : 1 })
						.forEach(el => select.append(el));
				}
				select.val(guid);
				selectGuildReport();
			}
			function updateGuildOptions() {
				$("#brain-hud-scouter-guild-target").children().toArray().forEach(updateGuildOption);
			}
			function updateGuildOption(opt: HTMLOptionElement) {
				if (!opt || !opt.value) return;
				var guid = opt.value,
					guildName = data.guilds.findNameByGuid(guid),
					leaderBoardEntry = guildName && guildName.leaderBoardEntry || null,
					rankText = leaderBoardEntry && `#${leaderBoardEntry.rank+1} ` || ``,
					winLossText = leaderBoardEntry && (leaderBoardEntry.wins || leaderBoardEntry.losses) && `(${guildName.leaderBoardEntry.wins}/${guildName.leaderBoardEntry.losses}) ` || ``,
					text = `${rankText}${winLossText}${guildName.name}`;
				opt.text = text;
			}
			export function selectGuildReport() {
				var guid = $("#brain-hud-scouter-guild-target").val();
				updateGuildOption(<HTMLOptionElement>$(`#brain-hud-scouter-guild-target > option[value="${guid}"]`)[0]);
				$("#brain-hud-scouter-guild-report").val(data.reports.getReport(guid)[guid] || "");
			}

			listener.addAction("get-guild", "/v1/guild/get?", addGuild);
			listener.addAction("get-guild-members", "/v1/guild/getmembers?", addGuildMembers);
			listener.addAction("get-guild-war", "/v1/guildwars/get?", addGuildWar);
			listener.addAction("get-leaderboard", "/v1/guildwars/getrange?", addGuildLeaderBoard);
			listener.addAction("get-guildsearch", "/v1/guild/getguilds?", addGuildSearchResults);
			listener.addAction("get-leaderboard-members", "/v1/guildwars/getguildmembersrange?", addLeaderboardGuildMembers);

			export function searchGuilds(filter: string, deep?: boolean) {
				var url = `https://battlehand-game-kong.anotherplacegames.com/v1/guild/getguilds?player=${Messenger.ActivePlayerGuid}&sessionKey=${Messenger.ActiveSessionKey}&name=${filter}&joinableonly=False&language=&minfamelevel=2&maxfamelevel=44`;
				return new Promise((res, rej) => {
					if (!Messenger.ActivePlayerGuid || !Messenger.ActiveSessionKey) return rej("not initialized");
					XmlHttpRequest.getJSON(url).then(json => {
						if (!json || !Array.isArray(json)) return rej("invalid json");
						guildsGetMembers(json, deep).then(res, rej);
					}, rej);
				});
			}
			export function guildsGetMembers(guilds: IGuildSearchGuild[], deep?: boolean) {
				return new Promise((res, rej) => {
					var _guilds = guilds.slice(), guild: IGuildSearchGuild;
					function fetch() {
						if (guild = _guilds.shift()) {
							setTimeout(() => guildGetMembers(guild.id, deep).then(fetch, fetch), _delayMS);
						}else {
							res();
						}
					}
					fetch();
				});
			}
			export function guildGetMembers(guid: string, deep?: boolean) {
				var url = `https://battlehand-game-kong.anotherplacegames.com/v1/guild/getmembers?player=${Messenger.ActivePlayerGuid}&sessionKey=${Messenger.ActiveSessionKey}&guild=${guid}`;
				if (isLocal) url = `./json/${guid}.json`;
				return new Promise((res, rej) => {
					if (!Messenger.ActivePlayerGuid || !Messenger.ActiveSessionKey) return rej("not initialized");
					if (!guid) return rej("no guild id");
					XmlHttpRequest.getJSON(url).then(json => {
						if (!json || !Array.isArray(json)) return rej("invalid json");
						Messenger.instance.postMessage(Messenger.createMessage("get-guild-members", json));
						if (deep) {
							var memberGuids = json.map(member => member.playerId);
							player.playersGet(memberGuids).then(res, res);
						}else {
							res(json);
						}
					}, rej);
				});
			}
			export function leaderBoardGet(start = 0, count = 13) {
				var url = `https://battlehand-game-kong.anotherplacegames.com/v1/guildwars/getrange?player=${Messenger.ActivePlayerGuid}&sessionKey=${Messenger.ActiveSessionKey}&start=${start}&count=${count}`;
				if (isLocal) url = `./json/top_guilds.json`;
				return new Promise((res, rej) => {
					if (!Messenger.ActivePlayerGuid || !Messenger.ActiveSessionKey) return rej("not initialized");
					XmlHttpRequest.getJSON(url).then(json => {
						if (!json || !json.leaderboardEntries) return rej("invalid json");
						Messenger.instance.postMessage(Messenger.createMessage("get-leaderboard", json));
						res(json);
					}, rej);
				});
			}

			listener.addAction("refresh-guild", null, message => {
				//leaderBoardGet();
				guildGetMembers(message.data, true);
			});

		}
	}
}