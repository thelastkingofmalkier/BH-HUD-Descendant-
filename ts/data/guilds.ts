namespace bh {
	export namespace data {
		export namespace guilds {
			var gid = 496437953;

			var _names: IGuild.Name[] = [];
			var _guilds: IGuild.Guild[] = [];

			export function findByGuid(guid: string): IGuild.Guild {
				return _guilds.find(guild => guild && guild.playerGuild && guild.playerGuild.id == guid);
			}
			export function filterByName(value: string): IGuild.Guild[] {
				return filterNamesByName(value).map(name => findByGuid(name.guid)).filter(guild => !!guild);
			}

			export function filterNamesByName(name: string): IGuild.Name[] {
				var lower = (name || "").toLowerCase();
				return _names.filter(name => name.lower == lower);
			}
			export function filterNamesByParent(parent: string): IGuild.Name[] {
				return parent && _names.filter(name => name.parent === parent) || [];
			}
			export function findNameByGuid(guid: string): IGuild.Name {
				return _names.filter(name => name.guid == guid)[0] || null;
			}

			export function getNames(): IGuild.Name[] { return _names.slice(); }

			export function updateLeaderBoard(results: IGuildWarRangeResults) {
				if (results && results.leaderboardEntries) {
					results.leaderboardEntries.forEach(entry => {
						var name = findNameByGuid(entry.id);
						if (!name) {
							put(entry.id, entry.name);
							name = findNameByGuid(entry.id);
						}
						name.leaderBoardEntry = entry;
					})
				}
			}

			export function put(guild: IGuild.Guild): void;
			export function put(members: IGuild.Player[]): void;
			export function put(guid: string, name: string): void;
			export function put(guid: string, name: string, parent: string): void;
			export function put(guidOrGuild: string | IGuild.Guild | IGuild.Player[], name?: string, parent?: string) {
				if (name) {
					var _name = _names.find(n => n.guid == guidOrGuild);
					if (_name) {
						_name.lower = (name || "").toLowerCase();
						_name.name = name || "";
						_name.parent = _name.parent || parent || null;
					}else {
						_names.push({
							guid: <string>guidOrGuild,
							lower: (name||"").toLowerCase(),
							name: name || null,
							parent: parent || null
						});
					}
				}else {
					if (Array.isArray(guidOrGuild)) {
						var guid = (<IGuild.Player[]>guidOrGuild)[0].guildId,
							guildName = findNameByGuid(guid),
							existing = guildName && findByGuid(guildName.guid);
						if (existing) {
							existing.members = guidOrGuild;
						}else {
							_guilds.push(<any>{ playerGuild:{ members:(<IGuild.Player[]>guidOrGuild).map(player => { return { playerId:player.playerId } }), id:guid, name:guildName.name }, members:guidOrGuild });
						}
					}else {
						var guild = <IGuild.Guild>guidOrGuild,
							playerGuild = guild.playerGuild;
						if (playerGuild) {
							put(playerGuild.id, playerGuild.name);
							var index = _guilds.findIndex(g => g.playerGuild.id == playerGuild.id);
							if (-1 < index) {
								_guilds[index] = <IGuild.Guild>guidOrGuild;
							}else {
								_guilds.push(<IGuild.Guild>guidOrGuild);
							}
							guild.members.forEach(player => PlayerRepo.put(new Player(player)));
						}
					}
				}
			}

			var _init: Promise<IGuild.Name[]>;
			export function init(): Promise<IGuild.Name[]> {
				if (!_init) {
					_init = new Promise<IGuild.Name[]>((resolvefn: (names: IGuild.Name[]) => void) => {
						var tsv = (TSV||{})[String(gid)];
						if (tsv) {
							resolvefn(parseTSV(tsv));
						}else {
							Repo.fetchTsv(null, gid).then(tsv => resolvefn(parseTSV(tsv)), () => resolvefn(_names));
						}
					});
				}
				return _init;
			}
			function parseTSV(tsv: string) {
				return _names = Repo.mapTsv<IGuild.Name>(tsv);
			}

		}
	}
}
