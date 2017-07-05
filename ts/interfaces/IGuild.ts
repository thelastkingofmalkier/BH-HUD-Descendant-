namespace IGuild {
	export interface Name extends IHasGuidAndName {
		parent: string;
		leaderBoardEntry?: IGuildWarLeaderboardEntry;
	}
	export interface PlayerGuild {
		id: string; // guid
		name: string;
		members: Player[];
		minFameLevel: number;
		motto: string;
		language: string;
		crestBG: number;
		crestIcon: number;
		crestBGColor: number;
		accessType: GameGuildWarAccessType;
		boosterCardRequests: any[];
		messages: { timestamp: number; content: string; id: string; playerId: string; }[];
		joinRequests: any[];
		guildScore: any;
		currentWar: string; // guid
		currentWarEvent: string; // guid
		eventWars: string[] // guids
		memberScoreSummary: { [guid: string]: IPlayerGuildMemberScoreSummary; };
		empty: boolean;
	}
	export interface Guild {
		playerGuild: PlayerGuild;
		booster_requests: any[];
		seconds_to_next_booster_card_request: number;
		active_guild_members: number;
		remaining_donations: number;
		members: Player[];
		seconds_to_next_donations_interval: number;
		arenaScore: number;
		gift_collections: number;
		seconds_to_next_gift_points_interval: number;
	}
	export interface Player {
		name: string;
		playerId: string; // guid
		language: string;
		fameLevel: number;
		arenaScore: number;
		arenaPlayerEventId: string; // guid
		guildId: string; // guid
		giftPoints: number;
		giftPointsInterval: number;
		position: GameGuildPosition;
		lastActivityTimeStamp: number;
		blockInvites: boolean;
		recentInvites: any[];
		cheater: boolean;
		kongregatePlayerId: string;
		archetypeLevels: { [guid: string]: number; };
		averageArchetypeLevel: number;
	}
}