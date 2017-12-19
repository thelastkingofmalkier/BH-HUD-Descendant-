/// <reference path="listener.ts"/>
namespace bh {
	export namespace hud {
		export namespace scouter {
			function getOrCreateContainer(guid: string): JQuery {
				if (!$(`div.brain-hud-scouter-player[data-guid="${guid}"]`).length) {
					$(`div#brain-hud-scouter-player-report`).append(`<div class="brain-hud-scouter-player" data-guid="${guid}"></div>`);
				}
				return $(`div.brain-hud-scouter-player[data-guid="${guid}"]`);
			}

			interface IArenaPlayer {
				[indexKey: string]: { [guid: string]: IPlayer.Player; }
			}
			function loadPlayers(arenaPlayers: IArenaPlayer[]): void {
				arenaPlayers.forEach((arenaPlayer, arenaIndex) => {
					var indexKey = Object.keys(arenaPlayer)[0],
						indexPlayer = arenaPlayer[indexKey],
						guid = Object.keys(indexPlayer)[0],
						player = indexPlayer[guid];
					loadPlayer(new Player(player, true), arenaIndex);
				})
			}
			export function loadPlayer(player: Player, arenaIndex: number = -1): void {
				var fullMeat = player.isFullMeat,
					star = fullMeat ? `&#9734;` : ``,
					// averagePercentText = player.powerPercent == player.averagePowerPercent ? `` : `; Avg ${player.averagePowerPercent}%`,
					// percentText = player.isArena ? `` : ` <span style="white-space:nowrap;">(${player.powerPercent}%${averagePercentText})</span>`,
					percentText = player.isArena || fullMeat ? `` : ` <span style="white-space:nowrap;">(${player.completionPercent}%)</span>`,
					html = `<div class="player-name" data-action="sort-heroes">${star} ${utils.htmlFriendly(player.name)} ${percentText}</div>`,
					playerHeroes: PlayerHero[] = player.heroes.sort(utils.sort.byElementThenKlass);
				playerHeroes.forEach(hero => {
					var id = `${player.guid}-${hero.guid}`,
						icon = hero.isLocked ? getImg("misc", "Lock") : getImg("heroes", hero.name),
						level = hero.isLocked ? `` : hero.level == HeroRepo.MaxLevel ? hero.isMeat ? `<span class="evo-star">&#9734;</span>` : `<span class="star">&#9734;</span>` : `(${hero.level})`,
						hitPoints = hero.isLocked ? `` : `${utils.truncateNumber(hero.hitPoints)} HP`,
						powerThresholds = hero.hero.maxPowerThresholds,
						powerRating = hero.powerRating,
						powerPercent = Math.round(100*powerRating/powerThresholds[powerRating<powerThresholds[3]?3:4]),
						progressBG = hero.isOp ? "background-color:pink;" : "",
						// color = powerPercent < 25 ? "progress-bar-info" : powerPercent < 50 ? "progress-bar-success" : powerPercent < 75 ? "progress-bar-warning" : "progress-bar-danger",
						color = powerRating <= powerThresholds[0] ? "progress-bar-info" : powerRating <= powerThresholds[1] ? "progress-bar-success" : powerRating <= powerThresholds[2] ? "progress-bar-warning" : "progress-bar-danger",
						progressBar = hero.isLocked ? `` : `<div class="progress" style="${progressBG}"><div class="progress-bar ${color}" style="width:${powerPercent}%;"><span></span></div></div>`,
						powerRatingText = hero.isLocked ? `` : powerRating,
						title = `<span class="hero-icon">${icon}</span>`
							+ `<span class="hero-name">${hero.name}</span>`
							+ `<span class="hero-level">${level}</span>`
							+ `<span class="hero-hp">${hitPoints}</span>`
							+ `<span class="hero-rating-bar">${progressBar}</span>`
							+ `<span class="hero-rating">${powerRatingText}</span>`,
						content = "";
					if (player.isMe || player.isAlly) {
						var abilities = hero.playerHeroAbilities
								.map(playerHeroAbility => {
									var cappedOrMaxed = playerHeroAbility.isMaxed ? "; maxed" : playerHeroAbility.isCapped ? "; capped" : "",
										levelText = playerHeroAbility.isLocked ? getImg("misc", "Lock") : `(${playerHeroAbility.level} / ${playerHeroAbility.levelMax}${cappedOrMaxed})`,
										text = `${playerHeroAbility.img} ${playerHeroAbility.name} ${levelText}`,
										children = "";
									if (!playerHeroAbility.isMaxed) { // !isCapped
										children += playerHeroAbility.materialHtml;
										children += playerHeroAbility.goldHtml;
									}
									return renderExpandable(hero.guid + playerHeroAbility.guid, text, children);
								}),
							cardsHtml = hero.deck.map(card => card.rowHtml).join("");
						content = `${abilities.join("")}${cardsHtml}`;
					}
					html += buildPanel(id, hero.elementType, title, content, player.isMe || player.isAlly);
				});
				getOrCreateContainer(arenaIndex == -1 ? player.guid : "arena-" + arenaIndex).html(html);
			}

			function buildPanel(id: string, elementType: ElementType, title: string, html: string, isMe: boolean): string {
				var header = `<button class="bs-btn bs-btn-link bs-btn-sm ${ElementType[elementType]}" ${isMe ? `data-action="toggle-scouter-hero"` : ``}>${title}</button>`;
				return `<div class="brain-hud-scouter-panel" data-guid="${id}"><div class="brain-hud-scouter-panel-header">${header}</div><div class="brain-hud-scouter-panel-content">${html}</div></div>`
			}
		}
	}
}