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
				var star = player.isFullMeat ? `&#9734;` : ``,
					averagePercentText = player.powerPercent == player.averagePowerPercent ? `` : `; Avg ${player.averagePowerPercent}%`,
					percentText = player.isArena ? `` : ` <span style="white-space:nowrap;">(${player.powerPercent}%${averagePercentText})</span>`,
					html = `<div class="player-name">${star} ${utils.htmlFriendly(player.name)} ${percentText}</div>`,
					playerHeroes: PlayerHero[] = player.heroes.sort(utils.sort.byElementThenKlass);
				playerHeroes.forEach(hero => {
					var id = `${player.guid}-${hero.guid}`,
						icon = getImg("heroes", hero.name), // hero.isMeat ? getImg("heroes", hero.name) : getImgG("heroes", hero.name),
						level = hero.level == MaxLevel ? hero.isMeat ? `<span class="evo-star">&#9734;</span>` : `<span class="star">&#9734;</span>` : `(${hero.level})`,
						powerPercent = hero.powerPercent,
						opCardNames = hero.opCards.map(card => card.name),
						striped = opCardNames.length ? "progress-bar-striped" : "",
						color = powerPercent < 25 ? "progress-bar-info" : powerPercent < 50 ? "progress-bar-success" : powerPercent < 75 ? "progress-bar-warning" : "progress-bar-danger",
						progressBar = `<div class="progress"><div class="progress-bar ${striped} ${color}" style="width:${powerPercent}%;"><span>${powerPercent}%</span></div></div>`,
						power = opCardNames.length ? opCardNames.map(name => getImg("battlecards", "icons", name.replace(/\W/g, ""))).join("") : `Power`,
						title = `<span class="hero-icon">${icon}</span><span class="hero-name">${hero.name}</span><span class="hero-level">${level}</span><span class="hero-hp">${utils.formatNumber(hero.hitPoints)} HP</span><span class="hero-rating">${progressBar}</span>`,
						content = "";
					if (player.isMe || player.isAlly) {
						var abilities = hero.playerHeroAbilities
								.map(playerHeroAbility => {
									var level = playerHeroAbility.level,
										isCapped = playerHeroAbility.isCapped,
										isLocked = playerHeroAbility.isLocked,
										isMaxed = playerHeroAbility.isMaxed,
										maxLevel = playerHeroAbility.levelMax,
										levelText = isLocked ? "locked" : isMaxed ? "max" : isCapped ? "capped" : `${level} / ${maxLevel}`,
										text = `${playerHeroAbility.img} ${playerHeroAbility.name} (${levelText})`,
										children = "";
									if (!isMaxed) { // !isCapped
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