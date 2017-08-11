namespace bh {
	export namespace library {
		var $: JQueryStatic = (<any>window)["jQuery"];

		function cleanGuid(value: string) {
			return "#" + value.trim().toLowerCase().replace(/\W/g, "-");
		}
		function cleanImageName(value: string) {
			return value.trim().replace(/\W/g, "");
		}

		export function init() {
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
			$(`a[href="#card-table"] > span.badge`).text(String(data.cards.battle.getAll().length));
			$(`a[href="#effect-table"] > span.badge`).text(String(allEffects.length));
			$(`a[href="#item-table"] > span.badge`).text(String(data.ItemRepo.length));
			$("tbody > tr[id]").show();
		}

		function onShowCard(ev: JQueryEventObject) {
			var link = $(ev.target),
				tr = link.closest("tr"),
				guid = tr.attr("id"),
				card = data.cards.battle.find(guid);
			$("div.modal-card").modal("show");

			// $(`#card-name`).html(card.name);
			// $(`#card-name`).html(getImg20("battlecards", "icons", card.name.replace(/\W/g, "")) + " " + card.name);
			$(`#card-name`).html(card.name + " &nbsp; " + mapHeroesToImages(card).join(" "));
			$(`#card-tier`).html(card.tier || "");
			$(`#card-image`).attr("src", getSrc("battlecards", "blank", cleanImageName(card.name)));
			$(`#card-element`).html((card.elementType == ElementType.Neutral?"":getImg20("elements", ElementType[card.elementType])) + " " + ElementType[card.elementType]);
			$(`#card-klass`).html(getImg20("classes", KlassType[card.klassType]) + " " + KlassType[card.klassType]);
			$(`#card-klass`).removeClass("Magic Might Skill").addClass(KlassType[card.klassType]);
			$(`#card-rarity`).html(utils.evoToStars(card.rarityType) + " " + RarityType[card.rarityType]);
			$(`#card-types`).html(card.types.map(type => getImg20("cardtypes", type) + " " + type).join("<br/>"));
			$(`#card-turns`).html(String(card.turns));
			$(`div.panel-card span.card-targets`).html(card.targets.join());
			$(`div.panel-card span.card-brag`).html(String(card.brag));
			$(`div.panel-card span.card-min`).html(card.minValues.map(v => v.join()).join(" :: "));
			$(`div.panel-card span.card-max`).html(card.maxValues.join(" :: "));
			$(`div.panel-card span.card-mats`).html(card.mats.join());
			$(`#card-effects`).html(card.effects.map(effect => getImg20("effects", cleanImageName(effect)) + " " + effect + "<br/>").join(""));
			$(`#card-perks`).html(card.perks.map(perk => getImg20("effects", cleanImageName(perk)) + " " + perk).join("<br/>"));
			$(`div.panel-card span.card-perk`).html(card.perkBase + "%");
			$(`#card-mats`).html(card.mats.map(mat => getImg20("evojars", cleanImageName(mat)) + " " + mat).join("<br/>"));

			var recipe = new Recipe(card),
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

				var html = ``;

				html += evoRow(getImg("misc", "Coin"), "Gold", data.getMinGoldNeeded(card.rarityType, evo.evoFrom), data.getMaxGoldNeeded(card.rarityType, evo.evoFrom));

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

			$("#card-evolution .active").removeClass("active");
			$("#card-evolution > ul.nav > li").first().addClass("active");
			$("#card-evolution > div.tab-content > div.tab-pane").first().addClass("active");
		}
		function evoRow(image: string, name: string, min: number, max: number) {
			return `<tr><td class="icon">${image}</td><td class="name">${name}</td><td class="min">${utils.formatNumber(min)}</td><td class="max">${utils.formatNumber(max)}</td></tr>`;
		}

		var filteredCards: { [search: string]: string[] } = { };
		var filteredEffects: { [search: string]: string[] } = { };
		var filteredItems: { [search: string]: string[] } = { };
		var allEffects: string[] = [];

		var searching: string;
		function onSearch(ev: JQueryEventObject) {
			var el = $(ev.target),
				value = el.val(),
				lower = value.trim().toLowerCase();
			if (!lower) return onSearchClear();
			searching = lower;
			setTimeout((lower: string) => {
				if (!filteredCards[lower]) { matchCards(lower); } hideShowCards(lower);
				if (!filteredEffects[lower]) { matchEffects(lower); } hideShowEffects(lower);
				if (!filteredItems[lower]) { matchItems(lower); } hideShowItems(lower);
			}, 0, lower);
		}
		function hideShowCards(search: string) {
			var badge = $(`a[href="#card-table"] > span.badge`);
			if (search != searching) return;
			var show = filteredCards[search] || [],
				hide = data.cards.battle.getAll().map(card => cleanGuid(card.guid)).filter(guid => !show.includes(guid));
			$(show.join()).show();
			$(hide.join()).hide();
			badge.text(String(show.length));
		}
		function hideShowEffects(search: string) {
			var badge = $(`a[href="#effect-table"] > span.badge`);
			if (search != searching) return;
			var show = filteredEffects[search] || [],
				hide = allEffects.map(effect => cleanGuid(effect)).filter(guid => !show.includes(guid));
			$(show.join()).show();
			$(hide.join()).hide();
			badge.text(String(show.length));
		}
		function hideShowItems(search: string) {
			var badge = $(`a[href="#item-table"] > span.badge`);
			if (search != searching) return;
			var show = filteredItems[search] || [],
				hide = data.ItemRepo.all.map(item => cleanGuid(item.guid)).filter(guid => !show.includes(guid));
			$(show.join()).show();
			$(hide.join()).hide();
			badge.text(String(show.length));
		}

		var tests: { [guid: string]: string[] } = {};
		function getTests(card: IDataBattleCard) {
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
		function matchCards(lower: string) {
			var words = lower.split(/\s+/);
			filteredCards[lower] = data.cards.battle.getAll()
				.filter(card => !words.find(word => !matchCard(card, word)))
				.map(card => cleanGuid(card.guid));
		}
		function matchEffects(lower: string) {
			var words = lower.split(/\s+/);
			filteredEffects[lower] = allEffects
				.filter(effect => !words.find(word => !effect.includes(word)))
				.map(effect => cleanGuid(effect));
		}
		function matchItems(lower: string) {
			var words = lower.split(/\s+/);
			filteredItems[lower] = data.ItemRepo.all
				.filter(item => !words.find(word => !matchItem(item, word)))
				.map(item => cleanGuid(item.guid));
		}
		function matchCard(card: IDataBattleCard, lower: string) {
			return !!getTests(card).find(test => test.includes(lower));
		}
		function matchItem(item: IDataInventoryItem, lower: string) {
			return item.lower.includes(lower) || ElementType[item.elementType].toLowerCase().includes(lower) || RarityType[item.rarityType].toLowerCase().includes(lower);
		}

		function mapPerksEffects(card: IDataBattleCard) {
			var list: string[] = [];
			(<string[]>card.targets || []).concat(card.effects || []).concat(card.perks || []).forEach(pushItem);
			return list.filter(s => !!cleanImageName(s))

			function pushItem(item: string) {
				if (item == "MultiFlurry") {
					pushItem("Multi");
				}else if (item != "Flurry" && item.endsWith("Flurry")) {
					pushItem("Flurry");
				}else if (item != "Self" && item != "Single" && !list.includes(item)) {
					list.push(item);
				}
			}
		}

		function mapPerksEffectsToImages(card: IDataBattleCard) {
			return mapPerksEffects(card).map(s => `<span class="card-effect" title="${s.trim()}">${getImg20("effects", cleanImageName(s))}</span>`);
		}

		function mapMatsToImages(card: IDataBattleCard) {
			return card.mats.filter(s => !!cleanImageName(s)).map(s => `<span class="card-mat" title="${s.trim()}">${getImg20("evojars", cleanImageName(s))}</span>`);
		}

		function mapHeroesToImages(card: IDataBattleCard) {
			return data.HeroRepo.all
				.filter(hero => (card.elementType == ElementType.Neutral || hero.elementType == card.elementType) && hero.klassType == card.klassType)
				.map(hero => getImg("heroes", hero.name));
		}

		function render() {
			var cards = data.cards.battle.getAll();
			renderCards(cards);

			var effects: string[] = [];
			cards.forEach(card => mapPerksEffects(card).forEach(effect => effects.includes(effect) ? void 0 : effects.push(effect)));
			renderEffects(effects.sort());
			allEffects = effects.map(effect => effect.toLowerCase());

			renderItems(data.ItemRepo.all);

			$("div.row.alert-row").remove();
			$("div.row.table-row").show();
		}
		function renderCards(cards: IDataBattleCard[]) {
			$(`a[href="#card-table"] > span.badge`).text(String(cards.length));
			var tbody = $("table.card-list > tbody");
			cards.forEach(card => {
				getTests(card);
				var html = `<tr id="${card.guid}">`;
					html += `<td><span class="card-cardType">${getImg20("cardtypes", card.brag?"Brag":"BattleCard")}</span></td>`;
					html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-card" style="padding:0;">${card.name}</a></span></td>`;
					html += `<td><span class="card-stars">${utils.evoToStars(card.rarityType)}</span></td>`;
					html += `<td><span class="card-element">${card.elementType == ElementType.Neutral?"":getImg20("elements", ElementType[card.elementType])}</span></td>`;
					html += `<td><span class="hidden-xs card-klass ${KlassType[card.klassType]}">${getImg20("classes", KlassType[card.klassType])}</span></td>`;
					html += `<td class="hidden-xs"><span class="card-heroes">${mapHeroesToImages(card).join("")}</span></td>`;
					html += `<td class="hidden-xs"><span class="card-effects">${mapPerksEffectsToImages(card).join("")}</span></td>`;
					html += `<td class="hidden-xs"><span class="card-mats">${mapMatsToImages(card).join("")}</span></td>`;
					html += `<td class="hidden-xs" style="width:100%;"></td>`;
					html += "</td></tr>";
				tbody.append(html);
			});
		}
		function renderEffects(effects: string[]) {
			$(`a[href="#effect-table"] > span.badge`).text(String(effects.length));
			var tbody = $("table.effect-list > tbody");
			effects.forEach(effect => {
				var html = `<tr id="${cleanGuid(effect).slice(1)}">`;
					html += `<td><span class="card-icon">${getImg20("effects", cleanImageName(effect))}</span></td>`;
					html += `<td><span class="card-name">${effect}</span></td>`;
					// html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-effect" style="padding:0;">${effect}</a></span></td>`;
					html += `<td class="hidden-xs" style="width:100%;"></td>`;
					html += "</td></tr>";
				tbody.append(html);
			});
		}
		function renderItems(items: IDataInventoryItem[]) {
			$(`a[href="#item-table"] > span.badge`).text(String(items.length));
			var tbody = $("table.mat-list > tbody");
			items.forEach(item => {
				var folder = ItemType[item.itemType].toLowerCase() + "s",
					name = item.itemType == ItemType.EvoJar ? cleanImageName(item.name) : item.itemType == ItemType.Crystal ? item.name.split(/ /)[0] : cleanImageName(data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name),
					html = `<tr id="${item.guid}">`;
				html += `<td><span class="card-icon">${getImg20(folder, name)}</span></td>`;
				html += `<td><span class="card-name">${item.name}</span></td>`;
				// html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-effect" style="padding:0;">${mat}</a></span></td>`;
				html += `<td class="hidden-xs" style="width:100%;"></td>`;
				html += "</td></tr>";
				tbody.append(html);
			});
		}
	}
}
