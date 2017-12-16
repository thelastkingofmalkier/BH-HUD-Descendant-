namespace IPlayer {
	// export interface Name extends IHasGuidAndName {
	// 	rank: string;
	// 	guild: string;
	// 	rating: number;
	// }
	export interface GuidNumberMap {
		[guid: string]: number;
	}
	export interface Quest {
		configId: string;
		objectives: {
			[guid: string]: {
				configId: string;
				progress: number;
			};
		};
		seen: boolean;
	}
	export interface Hero {
		playerId: string;
		id: string;
		experience: number;
		level: number;
		version: number;
		abilityLevels: GuidNumberMap;
		deck: string[]; // IPlayerCard.configId
		locked: boolean;
	}
	export interface DailyLoginInfo {
		playerId: string;
		loginPreviousReward: number;
		currentMonth: number;
		currentDay: number;
		dailyRewards: boolean[];
		claimedSRCards: number[];
		claimedDailyRewards: string[];
		canCollectReward: boolean;
		secondsToNextDailyBonus: number;
	}
	export interface GachaBox {
		configId: string;
		items: {
			cards: GuidNumberMap;
			materials: GuidNumberMap;
			wildcards: GuidNumberMap;
			feeders: GuidNumberMap;
			rewards: GuidNumberMap;
		};
		secondsRemaining: number;
		inProgress: boolean;
	}
	export interface PlayerBounty {
		bountyId: string; // guid
		startTime: number;
		archetypeIds: string[]; // guid
		bonusLootPercentage: number;
	}
	export interface PlayerBounties {
		playerId: string;
		lastBountiesGivenTime: number;
		availableBounties: string[]; // guid
		activeBounties: { [guid: string]: PlayerBounty; };
		bountyArchetypeCooldowns: any;
		bountyIdsWithBonusVideoWatched: string[]; // guid
	}
	export interface TeamOrders {
		Campaign: string[];
		Pit: string[];
		Challenge: string[];
	}
	export interface PlayerCard {
		id: string;
		configId: string;
		level: number;
		experience: number;
		evolutionLevel: number;
		evolutionResults: { [guid: string]: { [key: string]: number; }; };
		addedTime: number;
		isNew: boolean;
	}
	export interface PlayerCards {
		playerId: string;
		cards: { [guid: string]: PlayerCard };
	}
	export interface Player {
		activatedSpecialOffers: GuidNumberMap;
		activeQuests: { [guid: string]: Quest; };
		archetypes: Hero[];
		banned: boolean;
		battleKeys: number;
		battleKeysAwardedPerBrag: GuidNumberMap;
		battleKeysPurchasedDuringCurrentWar: number;
		blockInvites: boolean;
		boosterCardDonations: { [key: string]: number; };
		cards: any;
		cardPackPurchaseTimeStamps: { [guid: string]: number[]; }
		cheater: boolean;
		completedDungeons: string[]; // guid
		completedOnboardingSteps: string[];
		completedQuests: string[];
		craftingMaterials: GuidNumberMap;
		currentGuildWarId: string;
		dailyLoginInfo: DailyLoginInfo;
		dungeonResults: { [guid: string]: { stars: number; }; };
		evolutionArtisanLevel: number;
		fame: number;
		fameLevel: number;
		feederCards: any[];
		feederCardsMap: GuidNumberMap;
		firstPlayedVersion: string;
		fragments: number;
		gems: number;
		// gemsSpentSinceLastCooldown: number;
		gold: number;
		goldConversionTransactions: GuidNumberMap;
		guildForWarEvent: string; // guid
		guildInvites: any[];
		guildPointsBalance: number;
		guildWarEventId: string; // guid
		id: string;
		idStore: string[];
		inProgressGachaBoxes: { [guid: string]: GachaBox; };
		introducedLocations: string[];
		language: string;
		lastBoosterCardRequestTimeStamp: number;
		// lastGemPurchaseTime: number;
		lastLoggedIn: number;
		lastMessageAllTimeStamp: number;
		lastPlayedVersion: string;
		lastVideoWatchedTime: number;
		loginPreviousDailyQuests: number;
		name: string;
		numSessions: number;
		playerBounties: PlayerBounties;
		playerCards: PlayerCards;
		playerGuild: string;
		purchasedOffers: any[];
		raidKeys: number;
		secondsToMoreStamina: number;
		secondsToNextDailyQuests: number;
		stamina: number;
		storeItemTimeStamps: GuidNumberMap;
		teamOrders: TeamOrders;
		todayEasyQuests: string[]; // guid
		todayHardQuests: string[] // guid
		totalBattleKeysBought: number;
		totalBattleKeysEarned: number;
		totalBattleKeysSpent: number;
		totalCampaignDungeonsEntered: number;
		totalCampaignDungeonsWon: number;
		totalFragmentsSpent: number;
		totalGemsBought: number;
		totalGemsEarned: number;
		totalGemsSpent: number;
		totalGoldBought: number;
		totalGoldEarned: number;
		totalGoldSpent: number;
		totalGuildPointsEarned: number;
		totalRaidKeysEarned: number;
		totalRaidKeysSpent: number;
		visitedLocations: string[];
		wildcards: GuidNumberMap;
	}
}