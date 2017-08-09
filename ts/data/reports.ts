namespace bh {
	export namespace data {
		export namespace reports {

	// function createHeroLevelCell(playerHero: PlayerHero): string {
	// 	var level = playerHero.level,
	// 		color = level < 15 ? "lightgreen" : level < 30 ? "green" : level < 45 ? "blue" : level < 60 ? "black" : level < 75 ? "maroon" : "red",
	// 		atts = playerHero.player.isExtended ? ` data-action="show-hero" data-player-hero-guid="${playerHero.playerHeroGuid}"` : "";
	// 	return `<td style="color:${color};" data-level="${level}" data-hitPoints="${utils.truncateNumber(playerHero.hitPoints)}" data-powerRating="${utils.truncateNumber(playerHero.powerRating.maxScore)}" ${atts}>${level}</td>`;
	// }
			export interface IScoutReport { [guid: string]: string; }
			interface IBattleData {
				winCount: number;
				lossCount: number;
				dwCount: number;
				score: number;
				brags: number;
			}

			var reports: IScoutReport = { };
			export function getReport(guid: string): IScoutReport {
				var report = getGuildWarReport(guid);
				if (!report[guid]) report = getGuildReport(guid);
				if (!report[guid]) report = getGuildMembersReport(guid);
				if (!report[guid]) report = reports;
				return report;
			}

			var guilds: { [guid: string]: IGuild.Guild; } = { };
			export function putGuild(guild: IGuild.Guild) {
				if (!guild || !guild.playerGuild) return { };
				guilds[guild.playerGuild.id] = guild;
				return getGuildReport(guild.playerGuild.id);
			}
			export function getGuildReport(guid: string): IScoutReport {
				return guilds[guid] ? guildMembersToReport(guilds[guid].members) || { } : { };
			}

			var guildMembers: { [guid: string]: IGuild.Player[]; } = { };
			export function putGuildMembers(members: IGuild.Player[]) {
				guildMembers[members[0].guildId] = members.slice();
				return getGuildMembersReport(members[0].guildId);
			}
			export function getGuildMembersReport(guid: string): IScoutReport {
				return guildMembers[guid] ? guildMembersToReport(guildMembers[guid]) || { } : { };
			}

			var guildWars: { [guid: string]: IGuildWar; } = { };
			export function putGuildWar(war: IGuildWar) {
				war.guilds.forEach(guild => guildWars[guild.id] = war);
				return getGuildWarReport(war.guilds[0].id);
			}
			export function getGuildWarReport(guid: string): IScoutReport {
				return guildWars[guid] ? guildWarToReport(guildWars[guid]) || { } : { };
			}

			function guildMembersToReport(members: IGuild.Player[]) {
				var heroes = data.HeroRepo.sorted,
					report: IScoutReport = { },
					guildGuid = members[0].guildId;
				report[guildGuid] = members.slice().sort(utils.sort.byPositionThenName).map(mapMemberToOutput).join("\n");
				return report;
			}
			function mapMemberToOutput(member: IGuild.Player, index: number): string {
				var player = PlayerRepo.find(member.playerId),
					role = PositionType[member.position] + 1,
					fame = member.fameLevel + 1,
					heroData = data.HeroRepo.sorted.map(player ? mapPlayerHero : mapHero),
					position = index ? index + 1 : "GL";
				return [position, fame, member.name, role, ...heroData].join("\t");

				function mapHero(hero: Hero) {
					var level = member.archetypeLevels[hero.guid] + 1,
						hp = utils.truncateNumber(hero.getHitPoints(level));
					return level ? level + "|" + hp + "|" : "/|/|/";
				}
				function mapPlayerHero(hero: Hero) {
					var playerHero = player.heroes.find(h => hero.guid == h.guid),
						level = playerHero ? playerHero.level : "/",
						hp = playerHero ? utils.truncateNumber(playerHero.hitPoints) : "/",
						op = playerHero && playerHero.isOp ? "-" : "",
						power = playerHero ? playerHero.powerPercent + "%" : "/";
					return level + "|" + hp + "|" + op + power;
				}
			}
			function calculateBattleData(war: IGuildWar, member: IGuild.Player) {
				var battles = war.currentWar.battles,
					winCount = 0, lossCount = 0, dwCount = 0, brags = 0, score = 0;

				if (member) {
					battles.forEach(battle => {
						if (battle.initiator.playerId == member.playerId) {
							battle.initiator.winner ? winCount++ : lossCount++;
							if (battle.completedBragId) brags++;
							score += battle.initiator.totalScore;
						}
						if (battle.opponent.playerId == member.playerId) {
							if (battle.opponent.winner) dwCount++;
							score += battle.opponent.totalScore;
						}
					})
				}

				return <IBattleData>{ winCount: winCount, lossCount: lossCount, dwCount: dwCount, score: score, brags: brags };
			}
			function guildWarToReport(war: IGuildWar) {
				var heroes = data.HeroRepo.sorted,
					us = war.guilds[0],
					them = war.guilds.find(g => g.id != us.id),
					ourMembers = war.members[us.id].sort(utils.sort.byPositionThenName),
					theirMembers = war.members[them.id].sort(utils.sort.byPositionThenName),
					ourOutput = ourMembers.map((m, i)=> _mapMemberToOutput(i, m, theirMembers[i])).join("\n"),
					theirOutput = theirMembers.map((m, i) => _mapMemberToOutput(i, m, ourMembers[i])).join("\n"),
					report: IScoutReport = { },
					legacy = true;
				report[us.id] = ourOutput;
				report[them.id] = theirOutput;
				return report;

				function _mapMemberToOutput(index: number, member: IGuild.Player, oppo: IGuild.Player): string {
					var memberTsv = mapMemberToOutput(member, index),
						battleData = calculateBattleData(war, member);
					return `${memberTsv}\t${battleData.winCount}\t${battleData.lossCount}\t${battleData.dwCount}\t${battleData.score}`;
				}
			}
		}
	}
}