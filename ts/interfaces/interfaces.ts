declare var escape: (s: string) => string;
declare var unescape: (s: string) => string;
interface BaseWindowMessage { data: any; originalEvent?: { data?: any; } }
//interface IPostedMessage { action: string; playerGuid: string; skey: string; data: any; }
interface IMessage { action: string; playerGuid: string; sessionKey: string; guildGuid: string; data: any; }

interface IHasGuid { guid: string; }
// interface IHasElement { element: "Air" | "Earth" | "Fire" | "Water" | "Spirit" | "Neutral"; }
interface IHasElementType { elementType: bh.ElementType; }
interface IHasKlass { klass: "Magic" | "Might" | "Skill"; }
interface IHasName { name: string; lower?: string; }
interface IHasPosition { position: "Member" | "Elder" | "CoLeader" | "Leader"; }
interface IHasRarity { rarity: "Common" | "Uncommon" | "Rare" | "Super Rare" | "Legendary"; }
interface IHasEvoLevel { evoLevel: string; }

interface IHasGuidAndName extends IHasGuid, IHasName { }

interface IDataAbility extends IHasGuid, IHasName {
	hero: string; // guid
	type: "Trait" | "Active" | "Passive";
}

interface IDataBattleCard extends IHasGuid, IHasName, IHasElementType, IHasKlass, IHasRarity {
	element: "Air" | "Earth" | "Fire" | "Water" | "Spirit" | "Neutral";
	turns: number;
	type: "Attack" | "Heal" | "Shield";
	target: "Multi" | "Multi Flurry" | "Self" | "Single" | "Single Flurry" | "Splash"
	brag: boolean;
	base: number;
	delta: number;
	tier: string;
}
interface IDataBoosterCard extends IHasGuid, IHasName, IHasElementType, IHasRarity {
	challenge?: "Halloween" | "Christmas";
}
interface IDataWildCard extends IHasGuidAndName { }

interface IPlayerGuildMemberScoreSummary {
	playerId: string;
	score: number;
	wins: number;
	losses: number;
	defensiveWins: number;
	strikes: number;
	rank: number;
	numSpinsRemaining: number;
	totalNumSpins: number;
}
interface IGuildWar {
	signedUp: boolean;
	eventScore: number;
	guilds: IGuildWarGuild[];
	scores: { [guid: string]: { [guid: string]: IGuildWarScore; } };
	secondsToNextWar: number;
	battleKeys: number;
	numSignedUpGuilds: number;
	secondsToNextEventStart: number;
	secondsToEndOfWar: number;
	battleKeysAwardedCurrentBrag: number;
	members: { [guid: string]: IGuild.Player[]; };
	currentWar: IGuildWarWar;
	rank: number;
	battleKeysPurchasedCurrentWar: number;
	activeGuildWarEvent: string; // guid
	secondsToEventEnd: number;
	secondsToAnnounceWinners: number;
}
interface IGuildWarGuild {
	id: string; // guid
	name: string;
	motto: string;
	language: string;
	minFameLevel: number;
	arenaScore: number;
	membersCount: number;
	accessType: "InviteOnly" | "Open" | "Closed";
	crestBG: number;
	crestIcon: number;
	crestBGColor: number;
	averageArchetypeLevel: number;
	previousOpponentId: string; // guid
}
interface IGuildWarScore {
	playerId: string; // guid
	score: number;
	wins: number;
	losses: number;
	defensiveWins: number;
	strikes: number;
	rank: number;
	numSpinsRemaining: number;
	totalNumSpins: number;
}
interface IGuildWarWar {
	id: string; // guid
	guildWarEventId: string; // guid
	participants: IGuildWarParticipant[];
	battles: IGuildWarBattle[];
	startTime: number;
	endTime: number;
	archetypeRequests: any[];
	winnerGuildId: string; // guid
}
interface IGuildWarParticipant {
	guildId: string; // guid
	rank: number;
	score: number;
	memberScores: { [guid: string]: IGuildWarScore; };
}
interface IGuildWarBattle {
	initiator: IGuildWarBattleResult;
	opponent: IGuildWarBattleResult;
	completedBragId: string; // guid
	endOfBattleTimestamp: number;
}
interface IGuildWarBattleResult {
	playerId: string; // guid
	totalScore: number;
	winner: boolean;
}
// [ { "0": { "GUID-VALUE": IPlayer } }; }, ... ]
interface IArenaOpponent {
	[index: string]: {
		[guid: string]: IPlayer.Player;
	};
}

interface IGuildWarLeaderboardEntry {
	crest_icon: number;
	wins: number;
	score: number;
	crest_bg: number;
	name: string;
	rank: number;
	crest_bgBorder: number;
	id: string;
	losses: number;
}
interface IGuildWarRangeResults {
	rank: number;
	leaderboardEntries: IGuildWarLeaderboardEntry[];
}
interface IGuildSearchGuild {
	id: string;
	name: string;
	motto: string;
	language: string;
	minFameLevel: number;
	arenaScore: number;
	membersCount: number;
	accessType: number;
	crestBG: number;
	crestIcon: number;
	crestBGColor: number;
	averageArchetypeLevel: number;
	previousOpponentId: number;
}

interface IPackets {
	packets: IPacket[];
	player: string; // guid
	sessionKey: string;
}
interface IPacket {
	command: ICommand[];
	id: string; // guid
}
interface ICommand {
	cmd: string; // guild_war_event_spin_wheel |
	args: any[];
}
interface ICommandResponse {
	[guid: string]: IResponse[]; // matches ID of IPacket
}
interface IResponse {
	cmd: string;  // guild_war_event_spin_wheel |
	resp: {
		added_cards: IResponseAddedCards[];
		reward_container_id: string;
		success: boolean;
	}
}
interface IResponseAddedCards {
	addedTime: number;
	configId: string;
	evolutionLevel: number;
	evolutionResults: any;
	experience: number;
	id: string;
	isNew: boolean;
	level: number;
}