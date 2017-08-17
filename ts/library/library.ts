namespace bh {
	export namespace library {
		var $: JQueryStatic = (<any>window)["jQuery"];

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
			$(`a[href="#effect-table"] > span.badge`).text(String(data.EffectRepo.length));
			$(`a[href="#item-table"] > span.badge`).text(String(data.ItemRepo.length));
			$("tbody > tr[id]").show();
		}

		function getMinValue(card: IDataBattleCard, typeIndex: number) {
			var playerCard = { configId:card.guid, evolutionLevel:0, level:0 };
			return data.cards.battle.calculateValue(<any>playerCard, typeIndex);
		}
		function getMaxValue(card: IDataBattleCard, typeIndex: number) {
			var maxEvo = card.rarityType + 1,
				maxLevel = data.cards.battle.levelsPerRarity(card.rarityType) - 1;
			var playerCard = { configId:card.guid, evolutionLevel:maxEvo, level:maxLevel };
			return data.cards.battle.calculateValue(<any>playerCard, typeIndex);
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
				case "card": return data.cards.battle.getAll();
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
		function matchAndToggle(which: FilterType, search: string) {
			if (!filtered[which][search]) {
				var words = search.split(/\s+/);
				filtered[which][search] = getAll(which)
					.filter(item => !words.find(word => !(tests[item.guid] || []).find(test => test.includes(word))))
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
			return list;
		}

		function mapPerksEffectsToImages(card: IDataBattleCard) {
			return mapPerksEffects(card).map(item => `<span class="card-effect" title="${item.name}: ${item.description}" data-toggle="tooltip" data-placement="top">${EffectRepo.toImage(item)}</span>`);
		}

		function mapMatsToImages(card: IDataBattleCard) {
			return card.mats.map(mat => data.ItemRepo.find(mat)).map(item => `<span class="card-mat" title="${item.name}: ${RarityType[item.rarityType]} ${ElementType[item.elementType]} ${ItemType[item.itemType]} (${utils.formatNumber(ItemRepo.getValue(item.itemType, item.rarityType))} gold)" data-toggle="tooltip" data-placement="top">${ItemRepo.toImage(item)}</span>`)
		}

		function mapHeroesToImages(card: IDataBattleCard) {
			return data.HeroRepo.all
				.filter(hero => (card.elementType == ElementType.Neutral || hero.elementType == card.elementType) && hero.klassType == card.klassType)
				.map(hero => getImg("heroes", hero.name));
		}

		function render() {
			renderCards();
			renderEffects();
			renderItems();

			$("div.row.alert-row").remove();
			$("div.row.table-row").show();
			$('[data-toggle="tooltip"]').tooltip();
		}
		function renderCards() {
			var cards = data.cards.battle.getAll();
			$(`a[href="#card-table"] > span.badge`).text(String(cards.length));
			var tbody = $("table.card-list > tbody");
			cards.forEach(card => {
				setCardTests(card);
				var html = `<tr id="${card.guid}">`;
					html += `<td><span class="card-cardType">${getImg20("cardtypes", card.brag?"Brag":"BattleCard")}</span></td>`;
					html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-card" style="padding:0;">${card.name}</a></span></td>`;
					html += `<td><span class="card-stars">${utils.evoToStars(card.rarityType)}</span></td>`;
					html += `<td><span class="card-element">${ElementRepo.toImage(card.elementType)}</span></td>`;
					html += `<td><span class="hidden-xs card-klass ${KlassType[card.klassType]}">${KlassRepo.toImage(card.klassType)}</span></td>`;
					html += `<td class="hidden-xs"><span class="card-heroes">${mapHeroesToImages(card).join("")}</span></td>`;
					html += `<td class="hidden-xs"><span class="card-effects">${mapPerksEffectsToImages(card).join("")}</span></td>`;
					html += `<td class="hidden-xs"><span class="card-mats">${mapMatsToImages(card).join("")}</span></td>`;
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
					html += `<td><span class="card-icon">${EffectRepo.toImage(effect)}</span></td>`;
					html += `<td><span class="card-name">${effect.name}</span></td>`;
					html += `<td style="width:100%;"><span class="card-description">${effect.description}</span></td>`;
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
				html += `<td><span class="card-icon">${ItemRepo.toImage(item)}</span></td>`;
				html += `<td><span class="card-name">${item.name}</span></td>`;
				// html += `<td><span class="card-name"><a class="btn btn-link" data-action="show-effect" style="padding:0;">${mat}</a></span></td>`;
				html += `<td class="hidden-xs" style="width:100%;"></td>`;
				html += "</td></tr>";
				tbody.append(html);
			});
		}
	}
}
