declare var escape: (s: string) => string;
declare var unescape: (s: string) => string;
interface BaseWindowMessage { data: any; originalEvent?: { data?: any; } }
interface IMessage { action: string; playerGuid: string; sessionKey: string; guildGuid: string; data: any; }

type GameAbilityType = "Trait" | "Active" | "Passive";
type GameBattleCardTarget = "All Enemies" | "All Enemies Flurry" | "Single Enemy" | "Single Enemy Flurry" | "Splash Enemies" | "All Allies" | "Self" | "Self Flurry" | "Single Ally" | "Splash Allies";
type GameBattleCardTier = "OP" | "S" | "A" | "B" | "C" | "D";
type GameBattleCardType = "Damage" | "Heal" | "Shield";
type GameBoosterCardChallenge = "Halloween" | "Christmas";
type GameElement = "Air" | "Earth" | "Fire" | "Water" | "Spirit" | "Neutral";
type GameGuildPosition = "Member" | "Elder" | "CoLeader" | "Leader";
type GameGuildWarAccessType = "InviteOnly" | "Open" | "Closed";
type GameItemType = "EvoJar" | "Crystal" | "Rune";
type GameKlass = "Magic" | "Might" | "Skill";
type GamePowerRatingAbilityType = "HP" | "Trait" | "Active" | "Passive";
type GameRarity = "Common" | "Uncommon" | "Rare" | "SuperRare" | "Legendary";
type GameEffectType = "Status" | "Targeting";

interface IHasAbilityType { abilityType: bh.AbilityType; }
interface IHasElementType { elementType: bh.ElementType; }
interface IHasEvoLevel { evoLevel: string; }
interface IHasGuid { guid: string; }
interface IHasKlassType { klassType: bh.KlassType; }
interface IHasName { name: string; lower?: string; }
interface IHasPosition { position: GameGuildPosition; }
interface IHasRarityType { rarityType: bh.RarityType; }

interface IHasGuidAndName extends IHasGuid, IHasName { }

interface IDataBattleCard extends IHasGuid, IHasName, IHasElementType, IHasKlassType, IHasRarityType {
	brag: boolean;
	effects: string[];
	mats: string[];
	maxValues: number[];
	minValues: number[][];
	perkBase: number;
	perks: string[];
	tier: GameBattleCardTier;
	turns: number;
	inPacks: boolean;
	typesTargets: string[];
}
interface IDataBoosterCard extends IHasGuid, IHasName, IHasElementType, IHasRarityType {
	challenge?: GameBoosterCardChallenge;
}
interface IDataHeroAbility extends IHasElementType, IHasKlassType, IHasAbilityType {
	heroGuid: string;
	heroName: string;
	abilityGuid: string;
	abilityName: string;
}
interface IDataInventoryItem extends IHasGuid, IHasName, IHasElementType, IHasRarityType {
	itemType: bh.ItemType;
}
interface IDataWildCard extends IHasGuidAndName { }
interface IDataEffect extends IHasGuidAndName {
	effectType: GameEffectType;
	alt?: string;
	description: string;
	value: number;
}
interface IDataDungeon extends IHasGuidAndName {
	dungeon: string;
	difficulty: "Normal" | "Elite" | "Epic";
	act: string;
	keys: number;
	fame: number;
	gold: number;
	elementTypes: bh.ElementType[];
	crystalElementTypes: bh.ElementType[];
	runeHeroes: string[];
	mats: string[];
	randomMats: number[];
	boosterElementTypes: bh.ElementType[];
	boosterRarities: number[];
}
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
	accessType: GameGuildWarAccessType;
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