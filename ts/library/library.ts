namespace bh {
	export namespace library {
		var $: JQueryStatic = (<any>window)["jQuery"];
		var player: Player = null;

		function cleanImageName(value: string) {
			return value.trim().replace(/\W/g, "");
		}

		var messenger: Messenger;
		export function openLibraryFromHud() {
			messenger = new Messenger(window, handleLibraryMessage, window.open(bh.host + "/cards.html?hud,complete", "bh-hud-library", "", true));
		}
		function postMessage(action: string, data: any = null) {
			var message = Messenger.createMessage(action, { action:action, data:data });
			message.playerGuid = action;
			message.sessionKey = action;
			messenger.postMessage(message);
		}

		export function init() {
			var hud = location.search.includes("hud");
			if (hud) {
				messenger = new Messenger(window, handleLibraryMessage, window.opener);
				postMessage("library-requesting-player");
			}else {
				_init();
			}
		}
		export function handleLibraryMessage(ev: BaseWindowMessage) {
			var message: IMessage = ev.data || (ev.originalEvent && ev.originalEvent.data) || null;
			if (message) {
				if (message.action == "hud-sending-player" && message.data) {
					player = new Player(message.data);
					_init();
				}
				if (message.action == "library-requesting-player") {
					postMessage("hud-sending-player", (<any>Player.me)._pp);
				}
			}
		}
		function _init() {
			bh.host = "http://bh.elvenintrigue.com";
			data.init().then(render);
			$(`body`).on("click", `[data-action="show-card"]`, onShowCard);
			$(`body`).on("click", `[data-action="show-item"]`, onShowItem);
			$(`body`).on("click", `[data-search-term]`, onSearchImage);
			$("input.library-search").on("change keyup", onSearch);
			$("button.library-search-clear").on("click", onSearchClear);
			$("input[type='range']").on("change input", onSliderChange);

			var evoTabs = $("#card-evolution div.tab-pane"),
				template = evoTabs.html();
			evoTabs.html(template).toArray().forEach((div, i) => $(div).find("h3").text(`Evolution from ${i} to ${i+1}`));
		}
		function onSearchImage(ev: JQueryEventObject) {
			var el = $(ev.target).closest("[data-search-term]"),
				newValue = el.attr("data-search-term"),
				lowerValue = newValue.toLowerCase(),
				input = $("input.library-search"),
				currentValue = input.val(),
				lowerValues = currentValue.trim().toLowerCase().split(/\s+/);
			if (!lowerValues.includes(lowerValue)) {
				input.focus().val((currentValue + " " + newValue).trim()).blur();
				performSearch((currentValue + " " + newValue).trim().toLowerCase());
			}
		}
		function onSearchClear() {
			searching = null;
			$("input.library-search").val("");
			$(`a[href="#card-table"] > span.badge`).text(String(data.BattleCardRepo.length));
			$(`a[href="#effect-table"] > span.badge`).text(String(data.EffectRepo.length));
			$(`a[href="#item-table"] > span.badge`).text(String(data.ItemRepo.length));
			$("tbody > tr[id]").show();
		}
		function onSliderChange(ev: JQueryEventObject) {
			var evo = $("#card-slider-evo").val(),
				level = $("#card-slider-level").val(),
				action = $(ev.target).closest("input[data-action]").data("action");
			$(`#card-slider-types`).html(`<span style="padding-left:25px;">${evo}.${("0"+level).substr(-2)}</span><br/>` + activeCard.typesTargets.map((type, typeIndex) => getImg20("cardtypes", type.split(" ")[0].replace("Damage", "Attack")) + ` ${type} (${utils.formatNumber(getValue(typeIndex, evo, level))})`).join("<br/>"));
		}
		function getValue(typeIndex: number, evolutionLevel: number, level: number) {
			var playerCard = { configId:activeCard.guid, evolutionLevel:evolutionLevel, level:level };
			return bh.BattleCardRepo.calculateValue(<any>playerCard, typeIndex);
		}
		function getMinValue(typeIndex: number) { return getValue(typeIndex, 0, 0); }
		function getMaxValue(typeIndex: number) {
			var maxEvo = activeCard.rarityType + 1,
				maxLevel = bh.BattleCardRepo.getLevelsForRarity(activeCard.rarityType) - 1;
			return getValue(typeIndex, maxEvo, maxLevel);
		}

		var activeItem: IDataInventoryItem;
		function onShowItem(ev: JQueryEventObject) {
			var link = $(ev.target),
				tr = link.closest("tr"),
				guid = tr.attr("id"),
				item = data.ItemRepo.find(guid);
			activeItem = item;
			$("div.modal-item").modal("show");

			$(`#item-name`).html(item.name + " &nbsp; " + mapMatsToImages([item.name]).join(" "));
			$(`#item-rarity`).html(utils.evoToStars(item.rarityType) + " " + RarityType[item.rarityType]);
			$(`#item-element`).html(ElementRepo.toImage(item.elementType) + " " + ElementType[item.elementType]);

			var html = data.DungeonRepo.getDropRates(item.name)
				.map(dropRate => `${dropRate.dungeon.name}: ${Math.round(100*dropRate.dropRate.averagePerKey)/100}% / key (${dropRate.dungeon.keys} keys)`)
				.join("<br/>")
			$("#item-dungeons").html(html);
		}

		var activeCard: IDataBattleCard;
		function onShowCard(ev: JQueryEventObject) {
			var link = $(ev.target),
				tr = link.closest("tr"),
				guid = tr.attr("id"),
				card = data.BattleCardRepo.find(guid);
			activeCard = card;
			$("div.modal-card").modal("show");

			// $(`#card-name`).html(card.name);
			// $(`#card-name`).html(getImg20("battlecards", "icons", card.name.replace(/\W/g, "")) + " " + card.name);
			$(`#card-name`).html(card.name + " &nbsp; " + mapHeroesToImages(card).join(" "));
			$(`#card-image`).attr("src", getSrc("battlecards", "blank", cleanImageName(card.name)));
			$(`#card-element`).html(ElementRepo.toImage(card.elementType) + " " + ElementType[card.elementType]);
			$(`#card-klass`).html(KlassRepo.toImage(card.klassType) + " " + KlassType[card.klassType]);
			$(`#card-klass`).removeClass("Magic Might Skill").addClass(KlassType[card.klassType]);
			$(`#card-rarity`).html(utils.evoToStars(card.rarityType) + " " + RarityType[card.rarityType]);
			$(`#card-types`).html(card.typesTargets.map((type, typeIndex) => getImg20("cardtypes", type.split(" ")[0].replace("Damage", "Attack")) + ` ${type.split(" ")[0].replace("Damage", "Attack")} (${utils.formatNumber(getMinValue(typeIndex))} - ${utils.formatNumber(getMaxValue(typeIndex))})`).join("<br/>"));
			$(`#card-turns`).html(String(card.turns));
			$(`div.panel-card span.card-brag`).html(String(card.brag));
			$(`div.panel-card span.card-min`).html(card.minValues.map(v => v.join()).join(" :: "));
			$(`div.panel-card span.card-max`).html(card.maxValues.join(" :: "));
			$(`div.panel-card span.card-mats`).html(card.mats.join());
			$(`#card-targets`).html(EffectRepo.mapTargets(card).map(target => EffectRepo.toImage(target) + " " + target.name + "<br/>").join(""));
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

			$("#card-slider-evo").val(<any>0).attr("max", card.rarityType + 1)
			$("#card-slider-evo-labels-table tbody").html((new Array(card.rarityType + 2)).fill(1).map((_,evo) => `<td class="text-${evo ? evo == card.rarityType + 1 ? "right" : "center" : "left"}">${evo}</td>`).join(""));
			var levelsForRarity = BattleCardRepo.getLevelsForRarity(card.rarityType),
				levelSliderLevels = levelsForRarity == 10 ? [1,5,10] : levelsForRarity == 20 ? [1,5,10,15,20] : levelsForRarity == 35 ? [1,5,10,15,20,25,30, 35] : [1,10,20,30,40,50];
			$("#card-slider-level").val(<any>1).attr("max", levelsForRarity);
			$("#card-slider-level-labels-table tbody").html(levelSliderLevels.map((level,index) => `<td class="text-${index ? index == levelSliderLevels.length - 1 ? "right" : "center" : "left"}">${level}</td>`).join(""));
			$(`#card-slider-types`).html(`<span style="padding-left:25px;">0.01</span><br/>` + card.typesTargets.map((type, typeIndex) => getImg20("cardtypes", type.split(" ")[0].replace("Damage", "Attack")) + ` ${type} (${utils.formatNumber(getMinValue(typeIndex))})`).join("<br/>"));
		}
		function evoRow(image: string, name: string, min: number, max: number) {
			return `<tr><td class="icon">${image}</td><td class="name">${name}</td><td class="min">${utils.formatNumber(min)}</td><td class="max">${utils.formatNumber(max)}</td></tr>`;
		}

		type FilterType = "card" | "effect" | "item" | "dungeon";
		var filtered: { [which: string]: { [search: string]: string[]; } } = { card:{}, effect:{}, item:{}, dungeon:{} };

		// var filteredCards: { [search: string]: string[] } = { };
		// var filteredEffects: { [search: string]: string[] } = { };
		// var filteredItems: { [search: string]: string[] } = { };

		var searching: string;
		function onSearch(ev: JQueryEventObject) {
			performSearch($(ev.target).val().trim().toLowerCase());
		}
		function performSearch(lower: string) {
			if (!lower) return onSearchClear();
			searching = lower;
			["card", "effect", "item", "dungeon"].forEach((which: FilterType) => setTimeout((lower: string) => { matchAndToggle(which, lower); }, 0, lower));
		}
		function getAll(which: FilterType): IHasGuid[] {
			switch (which) {
				case "card": return data.BattleCardRepo.all;
				case "effect": return data.EffectRepo.all;
				case "item": return data.ItemRepo.all;
				case "dungeon": return data.DungeonRepo.all;
				default: return [];
			}
		}

		var tests: { [guid: string]: string[] } = {};
		function setCardTests(card: IDataBattleCard) {
			if (!tests[card.guid]) {
				var list: string[] = tests[card.guid] = [];
				if (card.brag) list.push("brag");
				card.effects.forEach(s => list.push(s.toLowerCase().replace(/shield break(er)?/, "crush")));
				list.push(ElementType[card.elementType].toLowerCase());
				list.push(KlassType[card.klassType].toLowerCase());
				list.push(card.lower);
				card.mats.forEach(s => list.push(s.toLowerCase()));
				card.perks.forEach(s => list.push(s.toLowerCase()));
				list.push(RarityType[card.rarityType].toLowerCase());
				list.push(String(card.turns));
				card.typesTargets.forEach(s => list.push(s.toLowerCase().split(" (")[0]));
				data.HeroRepo.all.filter(hero => hero.klassType == card.klassType && (card.elementType == ElementType.Neutral || hero.elementType == card.elementType)).forEach(hero => list.push(hero.lower));
				if (player) list.push(player.battleCards.find(playerBattleCard => playerBattleCard.guid == card.guid) ? "have" : "need");
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
		function setDungeonTests(dungeon: Dungeon) {
			if (!tests[dungeon.guid]) {
				var list: string[] = tests[dungeon.guid] = [];
				list.push(dungeon.lower);
				dungeon.mats.forEach(s => list.push(s.name.toLowerCase()));
				// dungeon.runeHeroes.forEach(s => list.push(s.toLowerCase()));
			}
			return tests[dungeon.guid] || [];
		}

		var elementLowers = ElementRepo.allTypes.map(type => ElementType[type].toLowerCase());
		var rarityLowers = RarityRepo.allTypes.map(type => RarityType[type].toLowerCase());
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

		function cleanPerkEffectSearchTerm(term: string) {
			return term
				.replace("Splash Damage", "Splash")
				.replace("Multi-Target (Ally)", "Multi")
				.replace("Multi-Target (Enemy)", "Multi")
				;
		}
		function mapPerksEffectsToImages(card: IDataBattleCard) {
			return mapPerksEffects(card)
				.map(item => renderIcon(item.guid, cleanPerkEffectSearchTerm(item.name), `${item.name}: ${item.description}`));
		}

		function mapMatsToImages(mats: string[]) {
			return mats.map(mat => data.ItemRepo.find(mat))
				.map(item => renderIcon(item.guid, item.name, `${item.name}: ${RarityType[item.rarityType]} ${ElementType[item.elementType]} ${ItemType[item.itemType]} (${utils.formatNumber(ItemRepo.getValue(item.itemType, item.rarityType))} gold)`))
		}

		function mapHeroesToImages(card: IDataBattleCard) {
			return data.HeroRepo.all
				.filter(hero => (card.elementType == ElementType.Neutral || hero.elementType == card.elementType) && hero.klassType == card.klassType)
				.map(hero => renderIcon(hero.guid, hero.name, `${hero.name}: ${ElementType[hero.elementType]} ${KlassType[hero.klassType]} Hero`));
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
		function renderIcon(guid: string, term = guid, title = term, hiddenXs = false) {
			return `<div class="${hiddenXs ? "hidden-xs" : ""} bh-hud-image img-${guid}" title="${title}" data-toggle="tooltip" data-placement="top" data-search-term="${term}"></div>`;
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
					if (player) html += `<td><span class="card-owned glyphicon ${owned ? "glyphicon-ok text-success" : "glyphicon-remove text-danger"}" title="${owned ? "Have" : "Need"}" data-toggle="tooltip" data-placement="top"></span></td>`;
					html += `<td><div class="bh-hud-image img-${card.brag? "Brag" : "BattleCard"}" title="${card.brag? "Brag" : "BattleCard"}" data-toggle="tooltip" data-placement="top"></div></td>`;
					html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-card" style="padding:0;">${card.name}</a></span></td>`;
					html += `<td class="text-center"><span class="card-rating">${utils.formatNumber(PowerRating.rateBattleCard(card, MinMaxType.Max))}</span></td>`;
					if (complete) html += `<td class="text-center" data-search-term="${RarityType[card.rarityType]}">${mapRarityToStars(card.rarityType)}</td>`;
					if (complete) html += `<td>${renderIcon(ElementType[card.elementType])}</td>`;
					if (complete) html += `<td>${renderIcon(KlassType[card.klassType], undefined, undefined, true)}</td>`;
					html += `<td>${mapHeroesToImages(card).join("")}</td>`;
					if (complete) html += `<td class="hidden-xs">${mapPerksEffectsToImages(card).join("")}</td>`;
					if (complete) html += `<td class="hidden-xs">${mapMatsToImages(card.mats).join("")}</td>`;
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
				var owned = player && player.inventory.find(playerInventoryItem => playerInventoryItem.guid == item.guid);
				setItemTests(item);
				var html = `<tr id="${item.guid}">`;
				html += `<td><div class="bh-hud-image img-${item.guid}"></div></td>`;
				html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-item" style="padding:0;">${item.name}</a></span></td>`;
				html += `<td>${mapRarityToStars(item.rarityType)}</td>`;
				if (player) { html += `<td><span class="badge">${utils.formatNumber(owned && owned.count || 0)}</span></td>`; }
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
				setDungeonTests(dungeon);
				var html = `<tr id="${dungeon.guid}">`;
				// html += `<td><div class="bh-hud-image img-${item.guid}"></div></td>`;
				html += `<td><span class="">${dungeon.name}</span></td>`;
				html += `<td><span class="">${getImg20("keys", "SilverKey")} ${dungeon.keys}</span></td>`;
				html += `<td><span class="">${getImg20("misc", "Fame")} ${utils.formatNumber(dungeon.fame)}</span></td>`;
				html += `<td><span class="">${getImg20("keys", "RaidTicket")}</span></td>`;
				html += `<td><span class="">${getImg20("misc", "Coin")} ${utils.formatNumber(dungeon.gold)} <small>(${utils.formatNumber(Math.round(dungeon.gold / dungeon.keys))} / key)</small></span></td>`;
				try {
					html += `<td><span class="">${dungeon.elementTypes.map(elementType => `<div class="bh-hud-image img-${ElementType[elementType]}"></div>`).join("")}</span></td>`;
					//html += `<td><span class="">${dungeon.crystalElementTypes.map(elementType => getImg20("crystals", ElementType[elementType])).join("")}</span></td>`;
					html += "<td/>";
					// html += `<td><span class="">${dungeon.runeHeroes.map(heroName => `<div class="bh-hud-image img-${data.ItemRepo.runes.find(rune => rune.name.startsWith(heroName)).guid}"></div>`).join("")}</span></td>`;
					html += "<td/>";
					html += `<td><span>${mapMatsToImages(dungeon.mats.map(m=>m.name)).join("")}</span></td>`;
					html += `<td><span class="">${dungeon.randomMats.map((count, rarityType) => count ? getImg20("evojars", "random", `${RarityType[rarityType]}_Neutral_Small`) + count : "").join(" ")}</span></td>`;
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
