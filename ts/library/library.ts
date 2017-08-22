namespace bh {
	export namespace library {
		var $: JQueryStatic = (<any>window)["jQuery"];
		var player: Player = null;

		function cleanImageName(value: string) {
			return value.trim().replace(/\W/g, "");
		}

		export function init() {
			var hud = location.search.includes("hud");
			if (hud) {
				window.addEventListener("message", handleOnLoadPlayer);
			}else {
				_init();
			}
		}
		export function handleOnLoadPlayer(ev: BaseWindowMessage) {
			var message: IMessage = ev.data || (ev.originalEvent && ev.originalEvent.data) || null;
			if (message && message.action == "hud-to-library" && message.data) {
				player = new Player(message.data);
				_init();
			}
		}
		function _init() {
			bh.host = "http://brains.sth.ovh";
			data.init().then(render);
			$(`body`).on("click", `[data-action="show-card"]`, onShowCard);
			$("input.library-search").on("change keyup", onSearch);
			$("button.library-search-clear").on("click", onSearchClear);

			var evoTabs = $("#card-evolution div.tab-pane"),
				template = evoTabs.html();
			evoTabs.html(template).toArray().forEach((div, i) => $(div).find("h3").text(`Evolution from ${i} to ${i+1}`));
		}
		function onSearchClear() {
			searching = null;
			$("input.library-search").val("");
			$(`a[href="#card-table"] > span.badge`).text(String(data.BattleCardRepo.length));
			$(`a[href="#effect-table"] > span.badge`).text(String(data.EffectRepo.length));
			$(`a[href="#item-table"] > span.badge`).text(String(data.ItemRepo.length));
			$("tbody > tr[id]").show();
		}

		function getMinValue(card: IDataBattleCard, typeIndex: number) {
			var playerCard = { configId:card.guid, evolutionLevel:0, level:0 };
			return bh.BattleCardRepo.calculateValue(<any>playerCard, typeIndex);
		}
		function getMaxValue(card: IDataBattleCard, typeIndex: number) {
			var maxEvo = card.rarityType + 1,
				maxLevel = bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1;
			var playerCard = { configId:card.guid, evolutionLevel:maxEvo, level:maxLevel };
			return bh.BattleCardRepo.calculateValue(<any>playerCard, typeIndex);
		}

		function onShowCard(ev: JQueryEventObject) {
			var link = $(ev.target),
				tr = link.closest("tr"),
				guid = tr.attr("id"),
				card = data.BattleCardRepo.find(guid);
			$("div.modal-card").modal("show");

			// $(`#card-name`).html(card.name);
			// $(`#card-name`).html(getImg20("battlecards", "icons", card.name.replace(/\W/g, "")) + " " + card.name);
			$(`#card-name`).html(card.name + " &nbsp; " + mapHeroesToImages(card).join(" "));
			$(`#card-tier`).html(card.tier || "");
			$(`#card-image`).attr("src", getSrc("battlecards", "blank", cleanImageName(card.name)));
			$(`#card-element`).html(ElementRepo.toImage(card.elementType) + " " + ElementType[card.elementType]);
			$(`#card-klass`).html(KlassRepo.toImage(card.klassType) + " " + KlassType[card.klassType]);
			$(`#card-klass`).removeClass("Magic Might Skill").addClass(KlassType[card.klassType]);
			$(`#card-rarity`).html(utils.evoToStars(card.rarityType) + " " + RarityType[card.rarityType]);
			$(`#card-types`).html(card.types.map((type, typeIndex) => getImg20("cardtypes", type) + ` ${type} (${utils.formatNumber(getMinValue(card, typeIndex))} - ${utils.formatNumber(getMaxValue(card, typeIndex))})`).join("<br/>"));
			$(`#card-turns`).html(String(card.turns));
			$(`div.panel-card span.card-targets`).html(card.targets.join());
			$(`div.panel-card span.card-brag`).html(String(card.brag));
			$(`div.panel-card span.card-min`).html(card.minValues.map(v => v.join()).join(" :: "));
			$(`div.panel-card span.card-max`).html(card.maxValues.join(" :: "));
			$(`div.panel-card span.card-mats`).html(card.mats.join());
			$(`#card-effects`).html(EffectRepo.mapEffects(card).map(effect => EffectRepo.toImage(effect) + " " + effect.name + "<br/>").join(""));
			$(`#card-perks`).html(EffectRepo.mapPerks(card).map(perk => EffectRepo.toImage(perk) + " " + perk.name).join("<br/>"));
			$(`div.panel-card span.card-perk`).html(card.perkBase + "%");
			$(`#card-mats`).html(card.mats.map(mat => data.ItemRepo.find(mat)).map(mat => ItemRepo.toImage(mat) + " " + mat.name).join("<br/>"));

			var recipe = new Recipe(card),
				minGold = 0,
				maxGold = 0,
			tabs = $("#card-evolution > ul.nav > li").toArray();
			[0,1,2,3,4].forEach(index => {
				var evo = recipe.evos[index],
					target = `#evo-${index}-${index+1}`,
					tab = $(tabs[index]).removeClass("disabled");
				if (!evo) {
					$(`${target} tbody`).html("");
					tab.addClass("disabled");
					return;
				}

				var html = ``,
					minGp = data.getMinGoldNeeded(card.rarityType, evo.evoFrom),
					maxGp = data.getMaxGoldNeeded(card.rarityType, evo.evoFrom);

				minGold += minGp;
				maxGold += maxGp;

				html += evoRow(getImg("misc", "Coin"), "Gold", minGp, maxGp);

				evo.items.filter(item => !!item.max)
					.forEach(item => html += evoRow(getImg20("evojars", cleanImageName(item.item.name)), item.item.name, item.min, item.max));

				if (evo.evoTo == 5) {
					var crystal = data.ItemRepo.crystals.find(item => item.elementType == card.elementType),
						hero = data.HeroRepo.all.find(hero => hero.elementType == card.elementType && hero.klassType == card.klassType),
						rune = data.ItemRepo.runes.find(item => item.name.startsWith(hero.name));
					html += evoRow(getImg20("crystals", ElementType[card.elementType]), crystal.name, data.getMinCrystalsNeeded(card.rarityType, evo.evoFrom), data.getMaxCrystalsNeeded(card.rarityType, evo.evoFrom));
					html += evoRow(getImg20("runes", cleanImageName(hero.trait.name)), rune.name, data.getMinRunesNeeded(card.rarityType, evo.evoFrom), data.getMaxRunesNeeded(card.rarityType, evo.evoFrom));
				}

				$(`${target} tbody`).html(html);
			});

			var allEvos = recipe.all,
				allTBody = $("#evo-all tbody").html("");
			allTBody.append(evoRow(getImg("misc", "Coin"), "Gold", minGold, maxGold));
			recipe.all.forEach(item => {
				allTBody.append(evoRow(getImg20("evojars", cleanImageName(item.item.name)), item.item.name, item.min, item.max));
			});
			if (card.rarityType == RarityType.Legendary) {
				var crystal = data.ItemRepo.crystals.find(item => item.elementType == card.elementType),
					hero = data.HeroRepo.all.find(hero => hero.elementType == card.elementType && hero.klassType == card.klassType),
					rune = data.ItemRepo.runes.find(item => item.name.startsWith(hero.name));
				allTBody.append(evoRow(getImg20("crystals", ElementType[card.elementType]), crystal.name, data.getMinCrystalsNeeded(card.rarityType, 0), data.getMaxCrystalsNeeded(card.rarityType, 4)));
				allTBody.append(evoRow(getImg20("runes", cleanImageName(hero.trait.name)), rune.name, data.getMinRunesNeeded(card.rarityType, 0), data.getMaxRunesNeeded(card.rarityType, 4)));
			}

			$("#card-evolution .active").removeClass("active");
			$("#card-evolution > ul.nav > li").first().addClass("active");
			$("#card-evolution > div.tab-content > div.tab-pane").first().addClass("active");
		}
		function evoRow(image: string, name: string, min: number, max: number) {
			return `<tr><td class="icon">${image}</td><td class="name">${name}</td><td class="min">${utils.formatNumber(min)}</td><td class="max">${utils.formatNumber(max)}</td></tr>`;
		}

		type FilterType = "card" | "effect" | "item";
		var filtered: { [which: string]: { [search: string]: string[]; } } = { card:{}, effect:{}, item:{} };

		// var filteredCards: { [search: string]: string[] } = { };
		// var filteredEffects: { [search: string]: string[] } = { };
		// var filteredItems: { [search: string]: string[] } = { };

		var searching: string;
		function onSearch(ev: JQueryEventObject) {
			var el = $(ev.target),
				value = el.val(),
				lower = value.trim().toLowerCase();
			if (!lower) return onSearchClear();
			searching = lower;
			["card", "effect", "item"].forEach((which: FilterType) => setTimeout((lower: string) => { matchAndToggle(which, lower); }, 0, lower));
		}
		function getAll(which: FilterType): IHasGuid[] {
			switch (which) {
				case "card": return data.BattleCardRepo.all;
				case "effect": return data.EffectRepo.all;
				case "item": return data.ItemRepo.all;
				default: return [];
			}
		}

		var tests: { [guid: string]: string[] } = {};
		function setCardTests(card: IDataBattleCard) {
			if (!tests[card.guid]) {
				var list: string[] = tests[card.guid] = [];
				if (card.brag) list.push("brag");
				card.effects.forEach(s => list.push(s.toLowerCase()));
				list.push(ElementType[card.elementType].toLowerCase());
				list.push(KlassType[card.klassType].toLowerCase());
				list.push(card.lower);
				card.mats.forEach(s => list.push(s.toLowerCase()));
				card.perks.forEach(s => list.push(s.toLowerCase()));
				list.push(RarityType[card.rarityType].toLowerCase());
				card.targets.forEach(s => list.push(s.toLowerCase()));
				list.push(String(card.turns));
				card.types.forEach(s => list.push(s.toLowerCase()));
				data.HeroRepo.all.filter(hero => hero.klassType == card.klassType && (card.elementType == ElementType.Neutral || hero.elementType == card.elementType)).forEach(hero => list.push(hero.lower));
			}
			return tests[card.guid] || [];
		}
		function setEffectTests(effect: IDataEffect) {
			if (!tests[effect.guid]) {
				var list: string[] = tests[effect.guid] = [];
				list.push(effect.description.toLowerCase());
				list.push(effect.lower);
			}
			return tests[effect.guid] || [];
		}
		function setItemTests(item: IDataInventoryItem) {
			if (!tests[item.guid]) {
				var list: string[] = tests[item.guid] = [];
				list.push(ElementType[item.elementType].toLowerCase());
				list.push(ItemType[item.itemType].toLowerCase());
				list.push(item.lower);
				list.push(RarityType[item.rarityType].toLowerCase());
			}
			return tests[item.guid] || [];
		}

		var elementLowers = ElementRepo.all.map(type => ElementType[type].toLowerCase());
		var rarityLowers = RarityRepo.all.map(type => RarityType[type].toLowerCase());
		var heroNameLowers: string[] = null;
		function matchTests(which: FilterType, tests: string[], word: string) {
			if (which == "effect") return matchTestsIncludes(tests, word);
			if (!heroNameLowers) heroNameLowers = data.HeroRepo.all.map(hero => hero.lower);
			return elementLowers.includes(word) || rarityLowers.includes(word) || heroNameLowers.includes(word) ? matchTestsEquals(tests, word) : matchTestsIncludes(tests, word);
		}
		function matchTestsEquals(tests: string[], word: string) {
			return tests.find(test => test == word);
		}
		function matchTestsIncludes(tests: string[], word: string) {
			return tests.find(test => test.includes(word));
		}
		function matchAndToggle(which: FilterType, search: string) {
			if (!filtered[which][search]) {
				var words = search.split(/\s+/);
				filtered[which][search] = getAll(which)
					.filter(item => !words.find(word => !matchTests(which, tests[item.guid] || [], word)))
					.map(item => item.guid);
			}

			var badge = $(`a[href="#${which}-table"] > span.badge`),
				show = filtered[which][search] || [],
				hide = getAll(which).map(item => item.guid).filter(guid => !show.includes(guid));

			if (search != searching) return; // in case it took too long to get to this point

			$("#" + show.join(",#")).show();
			$("#" + hide.join(",#")).hide();
			badge.text(String(show.length));
		}

		function mapPerksEffects(card: IDataBattleCard) {
			var list: IDataEffect[] = [];
			EffectRepo.mapTargets(card).forEach(target => !list.includes(target) ? list.push(target) : void 0);
			EffectRepo.mapEffects(card).forEach(effect => !list.includes(effect) ? list.push(effect) : void 0);
			EffectRepo.mapPerks(card).forEach(perk => !list.includes(perk) ? list.push(perk) : void 0);
			return list.reduce((out, item) => ["Self", "Single"].includes(item.name) ? out : out.concat([item]), []);
		}

		function mapPerksEffectsToImages(card: IDataBattleCard) {
			return mapPerksEffects(card).map(item => `<div class="bh-hud-image img-${item.guid}" title="${item.name}: ${item.description}" data-toggle="tooltip" data-placement="top"></div>`);
		}

		function mapMatsToImages(card: IDataBattleCard) {
			return card.mats.map(mat => data.ItemRepo.find(mat)).map(item => `<div class="bh-hud-image img-${item.guid}" title="${item.name}: ${RarityType[item.rarityType]} ${ElementType[item.elementType]} ${ItemType[item.itemType]} (${utils.formatNumber(ItemRepo.getValue(item.itemType, item.rarityType))} gold)" data-toggle="tooltip" data-placement="top"></div>`)
		}

		function mapHeroesToImages(card: IDataBattleCard) {
			return data.HeroRepo.all
				.filter(hero => (card.elementType == ElementType.Neutral || hero.elementType == card.elementType) && hero.klassType == card.klassType)
				.map(hero => `<div class="bh-hud-image img-${hero.guid}"></div>`);
		}

		function mapRarityToStars(rarityType: RarityType) {
			return `<span class="stars" title="${RarityType[rarityType]}" data-toggle="tooltip" data-placement="top">${utils.evoToStars(rarityType)}</span>`;
		}

		function render() {
			css.addCardTypes($);
			css.addEffects($);
			css.addElements($);
			css.addHeroes($);
			css.addItems($);
			css.addKlasses($);

			renderEffects();
			renderItems();
			renderCards();
			renderDungeons();

			$("div.row.alert-row").remove();
			$("div.row.table-row").show();
			$('[data-toggle="tooltip"]').tooltip();
		}
		function renderCards() {
			var complete = location.search.includes("complete");
			var cards = data.BattleCardRepo.all;
			$(`a[href="#card-table"] > span.badge`).text(String(cards.length));
			var tbody = $("table.card-list > tbody").html("");
			cards.forEach(card => {
				setCardTests(card);
				var owned = player && player.battleCards.find(bc => card.guid == bc.guid);
				var html = `<tr id="${card.guid}">`;
					if (player) html += `<td><span class="card-owned glyphicon ${owned ? "glyphicon-ok text-success" : "glyphicon-remove text-danger"}"></span></td>`;
					html += `<td><div class="bh-hud-image img-${card.brag? "Brag" : "BattleCard"}"></div></td>`;
					html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-card" style="padding:0;">${card.name}</a></span></td>`;
					if (complete) html += `<td>${mapRarityToStars(card.rarityType)}</td>`;
					if (complete) html += `<td><div class="bh-hud-image img-${ElementType[card.elementType]}"></div></td>`;
					if (complete) html += `<td><div class="hidden-xs bh-hud-image img-${KlassType[card.klassType]}"></div></td>`;
					html += `<td>${mapHeroesToImages(card).join("")}</td>`;
					if (complete) html += `<td class="hidden-xs">${mapPerksEffectsToImages(card).join("")}</td>`;
					if (complete) html += `<td class="hidden-xs">${mapMatsToImages(card).join("")}</td>`;
					html += `<td class="hidden-xs" style="width:100%;"></td>`;
					html += "</td></tr>";
				tbody.append(html);
			});
		}
		function renderEffects() {
			var effects = data.EffectRepo.all;
			$(`a[href="#effect-table"] > span.badge`).text(String(effects.length));
			var tbody = $("table.effect-list > tbody");
			effects.forEach(effect => {
				setEffectTests(effect);
				var html = `<tr id="${effect.guid}">`;
					html += `<td><div class="bh-hud-image img-${effect.guid}"></div></td>`;
					html += `<td><span class="card-name">${effect.name}</span><div class="visible-xs-block" style="border-top:1px dotted #666;">${effect.description}</div></td>`;
					html += `<td class="hidden-xs" style="width:100%;"><span class="card-description">${effect.description}</span></td>`;
					// html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-effect" style="padding:0;">${effect}</a></span></td>`;
					// html += `<td class="hidden-xs" style="width:100%;"></td>`;
					html += "</td></tr>";
				tbody.append(html);
			});
		}
		function renderItems() {
			var items = data.ItemRepo.all;
			$(`a[href="#item-table"] > span.badge`).text(String(items.length));
			var tbody = $("table.mat-list > tbody");
			items.forEach(item => {
				setItemTests(item);
				var html = `<tr id="${item.guid}">`;
				html += `<td><div class="bh-hud-image img-${item.guid}"></div></td>`;
				html += `<td><span class="card-name">${item.name}</span></td>`;
				html += `<td>${mapRarityToStars(item.rarityType)}</td>`;
				// html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-effect" style="padding:0;">${mat}</a></span></td>`;
				html += `<td class="hidden-xs" style="width:100%;"></td>`;
				html += "</td></tr>";
				tbody.append(html);
			});
		}
		function renderDungeons() {
			var dungeons = data.DungeonRepo.all;
			$(`a[href="#dungeon-table"] > span.badge`).text(String(dungeons.length));
			var tbody = $("table.dungeon-list > tbody");
			dungeons.forEach(dungeon => {
				// setItemTests(item);
				var html = `<tr id="${dungeon.guid}">`;
				// html += `<td><div class="bh-hud-image img-${item.guid}"></div></td>`;
				html += `<td><span class="">${dungeon.name}</span></td>`;
				html += `<td><span class="">${getImg20("keys", "SilverKey")} ${dungeon.keys}</span></td>`;
				html += `<td><span class="">${getImg20("misc", "Fame")} ${utils.formatNumber(dungeon.fame)}</span></td>`;
				html += `<td><span class="">${getImg20("keys", "RaidTicket")}</span></td>`;
				html += `<td><span class="">${getImg20("misc", "Coin")} ${utils.formatNumber(dungeon.gold)}</span></td>`;
				try {
					html += `<td><span class="">${dungeon.elementTypes.map(elementType => `<div class="bh-hud-image img-${ElementType[elementType]}"></div>`).join("")}</span></td>`;
					html += `<td><span class="">${dungeon.crystalElementTypes.map(elementType => getImg20("crystals", ElementType[elementType])).join("")}</span></td>`;
					html += `<td><span class="">${dungeon.runeHeroes.map(heroName => `<div class="bh-hud-image img-${data.ItemRepo.runes.find(rune => rune.name.startsWith(heroName)).guid}"></div>`).join("")}</span></td>`;
					html += `<td><span class="">${dungeon.mats.map(mat => `<div class="bh-hud-image img-${data.ItemRepo.evoJars.find(jar => jar.name == mat).guid}"></div>`).join("")}</span></td>`;
					html += `<td><span class="">${dungeon.randomMats.map((count, rarityType) => count ? getImg20("evojars", "random", `${RarityType[rarityType]}_Neutral_Small`) : "").join("")}</span></td>`;
					// html += `<td>${mapRarityToStars(item.rarityType)}</td>`;
					// html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-effect" style="padding:0;">${mat}</a></span></td>`;
				}catch(ex) {
					console.error(ex);
				}
				html += `<td class="hidden-xs" style="width:100%;"></td>`;
				html += "</td></tr>";
				tbody.append(html);
			});
		}
	}
}
