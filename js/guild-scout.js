var bh;
(function (bh) {
   var hud;
    (function (hud) {
        var guild;
        (function (guild_1) {
            function addGuild(message) {
                var guild = message.data;
                bh.data.guilds.put(guild.playerGuild.id, guild.playerGuild.name);
                bh.data.reports.putGuild(guild);
                addGuildReport(guild.playerGuild.id, guild.playerGuild.name);
            }
            function addGuildSearchResults(message) {
                var results = message.data;
                results.forEach(function (guild) { return bh.data.guilds.put(guild.id, guild.name); });
            }
            function addGuildMembers(message) {
                var members = message.data, guildName = bh.data.guilds.findNameByGuid(members[0].guildId);
                bh.data.reports.putGuildMembers(members);
                if (guildName)
                    addGuildReport(guildName.guid, guildName.name);
            }
            function addLeaderboardGuildMembers(message) {
                var guildName = bh.data.guilds.findNameByGuid(message.guildGuid);
                if (guildName)
                    addGuildReport(guildName.guid, guildName.name);
            }
            function addGuildWar(message) {
                var war = message.data;
                war.guilds.forEach(function (guild) { return bh.data.guilds.put(guild.id, guild.name); });
                bh.data.reports.putGuildWar(war);
                war.guilds.forEach(function (guild) { return addGuildReport(guild.id, guild.name); });
            }
            function addGuildLeaderBoard(message) {
                var results = message.data;
                bh.data.guilds.updateLeaderBoard(results);
                updateGuildOptions();
            }
            function addGuildReport(guid, name) {
                var select = bh.$("#brain-hud-scouter-guild-target");
				if (!select.length) {

				}
                if (!select.find("option[value=\"" + guid + "\"]").length) {
                    select.append("<option value=\"" + guid + "\">" + name + "</option>");
                    select.children().toArray().slice(1)
                        .sort(function (a, b) { return a.text < b.text ? -1 : a.text == b.text ? 0 : 1; })
                        .forEach(function (el) { return select.append(el); });
                }
                bh.$("div.brain-hud-scouter-guild-container").addClass("active");
                select.val(guid);
                selectGuildReport();
            }
            guild_1.addGuildReport = addGuildReport;
            function updateGuildOptions() {
                bh.$("#brain-hud-scouter-guild-target").children().toArray().forEach(updateGuildOption);
            }
            function updateGuildOption(opt) {
                if (!opt || !opt.value)
                    return;
                var guid = opt.value, guildName = bh.data.guilds.findNameByGuid(guid), players = bh.data.players.filterByGuildGuid(guid), powerRating = players.map(function (player) { return player.powerRating; }).reduce(function (out, rating) { return out + rating; }, 0) || 0, powerRatingText = powerRating ? " (" + bh.utils.formatNumber(powerRating) + ")" : "", leaderBoardEntry = guildName && guildName.leaderBoardEntry || null, rankText = leaderBoardEntry ? "#" + (leaderBoardEntry.rank + 1) + " " : "", winLossText = leaderBoardEntry && (leaderBoardEntry.wins || leaderBoardEntry.losses) ? "(" + guildName.leaderBoardEntry.wins + "/" + guildName.leaderBoardEntry.losses + ") " : "", text = "" + rankText + winLossText + guildName.name + powerRatingText;
                opt.text = text;
            }
            function selectGuildReport() {
                var guid = bh.$("#brain-hud-scouter-guild-target").val();
                updateGuildOption(bh.$("#brain-hud-scouter-guild-target > option[value=\"" + guid + "\"]")[0]);
                bh.$("#brain-hud-scouter-guild-report").val(bh.data.reports.getReport(guid)[guid] || "");
            }
            guild_1.selectGuildReport = selectGuildReport;
            hud.listener.addAction("get-guild", "/v1/guild/get?", addGuild);
            hud.listener.addAction("get-guild-members", "/v1/guild/getmembers?", addGuildMembers);
            hud.listener.addAction("get-guild-war", "/v1/guildwars/get?", addGuildWar);
            hud.listener.addAction("get-leaderboard", "/v1/guildwars/getrange?", addGuildLeaderBoard);
            hud.listener.addAction("get-guildsearch", "/v1/guild/getguilds?", addGuildSearchResults);
            hud.listener.addAction("get-leaderboard-members", "/v1/guildwars/getguildmembersrange?", addLeaderboardGuildMembers);
            function searchGuilds(filter, deep) {
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/guild/getguilds?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&name=" + filter + "&joinableonly=False&language=&minfamelevel=2&maxfamelevel=44";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json || !Array.isArray(json))
                            return rej("invalid json");
                        guildsGetMembers(json, deep).then(res, rej);
                    }, rej);
                });
            }
            guild_1.searchGuilds = searchGuilds;
            function guildsGetMembers(guilds, deep) {
                return new Promise(function (res, rej) {
                    var _guilds = guilds.slice(), guild;
                    function fetch() {
                        if (guild = _guilds.shift()) {
                            setTimeout(function () { return guildGetMembers(guild.id, deep).then(fetch, fetch); }, hud._delayMS);
                        }
                        else {
                            res();
                        }
                    }
                    fetch();
                });
            }
            guild_1.guildsGetMembers = guildsGetMembers;
            function guildGetMembers(guid, deep) {
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/guild/getmembers?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&guild=" + guid;
                if (bh.isLocal)
                    url = "./json/" + guid + ".json";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    if (!guid)
                        return rej("no guild id");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json || !Array.isArray(json))
                            return rej("invalid json");
                        bh.Messenger.instance.postMessage(bh.Messenger.createMessage("get-guild-members", json));
                        if (deep) {
                            var memberGuids = json.map(function (member) { return member.playerId; });
                            hud.player.playersGet(memberGuids).then(res, res);
                        }
                        else {
                            res(json);
                        }
                    }, rej);
                });
            }
            guild_1.guildGetMembers = guildGetMembers;
            function leaderBoardGet(start, count) {
                if (start === void 0) { start = 0; }
                if (count === void 0) { count = 13; }
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/guildwars/getrange?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&start=" + start + "&count=" + count;
                if (bh.isLocal)
                    url = "./json/top_guilds.json";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json || !json.leaderboardEntries)
                            return rej("invalid json");
                        bh.Messenger.instance.postMessage(bh.Messenger.createMessage("get-leaderboard", json));
                        res(json);
                    }, rej);
                });
            }
            guild_1.leaderBoardGet = leaderBoardGet;
            hud.listener.addAction("refresh-guild", null, function (message) {
                guildGetMembers(message.data, true);
            });
        })(guild = hud.guild || (hud.guild = {}));
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));