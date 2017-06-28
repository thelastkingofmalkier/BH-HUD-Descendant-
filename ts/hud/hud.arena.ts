/// <reference path="listener.ts"/>
namespace bh {
	export namespace hud {
		export namespace arena {
			function selectArenaMatches(message: IMessage) {
				if (!$(`#brain-hud-scouter-player-target > option[value="arena"]`).length) {
					$("#brain-hud-scouter-player-target").children().first().after("<option value='arena'>Arena Opponents</option>");
				}
				var matches = message.data;
				var players = data.arenaToPlayers(matches);
				players.forEach((player, i) => scouter.loadPlayer(new Player(player, true), i));
				$("#brain-hud-scouter-player-target").val("arena");
				player.selectPlayerReport();
			}
			listener.addAction("get-arena-matches", "/v1/matchmaking/getmatches?", selectArenaMatches);
		}
	}
}