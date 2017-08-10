namespace bh {
	export namespace library {
		var $: JQueryStatic = (<any>window)["jQuery"];

		export function init() {
			data.cards.battle.init().then((cards) => { renderCards(cards); onSearchClear(); }, (reason) => console.error(reason));
			$(`body`).on("click", `[data-action="show-card"]`, onShowCard);
			$("#library-search").on("change keyup", onSearch);
			$("#library-search-clear").on("change", onSearchClear);
		}

		function onShowCard(ev: JQueryEventObject) {
			var link = $(ev.target),
				tr = link.closest("tr"),
				guid = tr.attr("id"),
				card = data.cards.battle.find(guid);
			$("div.col-xs-12").removeClass("col-xs-12").addClass("col-xs-8");
			$("div.col-xs-4").show();

			$(`#card-name`).html(card.name);
			$(`#card-tier`).html(card.tier || "");
			$(`div.panel-card div.panel-body`).css("background-image", "url(" + getSrc("battlecards", "blank", card.name.replace(/\W/g, "")) + ")");
			$(`#card-element`).html((card.elementType == ElementType.Neutral?"":getImg20("elements", ElementType[card.elementType])) + " " + ElementType[card.elementType]);
			$(`#card-klass`).html(getImg20("classes", KlassType[card.klassType]) + " " + KlassType[card.klassType]);
			$(`#card-rarity`).html(utils.evoToStars(card.rarityType) + " " + RarityType[card.rarityType]);
			$(`#card-types`).html(card.types.map(type => getImg20("cardtypes", type) + " " + type).join("<br/>"));
			$(`#card-turns`).html(String(card.turns));
			$(`div.panel-card span.card-targets`).html(card.targets.join());
			$(`div.panel-card span.card-brag`).html(String(card.brag));
			$(`div.panel-card span.card-min`).html(card.minValues.map(v => v.join()).join(" :: "));
			$(`div.panel-card span.card-max`).html(card.maxValues.join(" :: "));
			$(`div.panel-card span.card-mats`).html(card.mats.join());
			$(`#card-effects`).html(card.effects.map(effect => getImg20("effects", effect.replace(/\W/g, "")) + " " + effect + "<br/>").join(""));
			$(`#card-perks`).html(card.perks.map(perk => getImg20("effects", perk.replace(/\W/g, "")) + " " + perk).join("<br/>"));
			$(`div.panel-card span.card-perk`).html(card.perkBase + "%");
			$(`#card-mats`).html(card.mats.map(mat => getImg20("evojars", mat.replace(/\W/g, "")) + " " + mat).join("<br/>"));
		}

		var filteredLists: { [search: string]: string[] } = { };

		function onSearch() {
			var el = $("#library-search"),
				value = el.val(),
				lower = value.trim().toLowerCase();
			if (!lower) return onSearchClear();
			var filteredGuids = filteredLists[lower],
				cards = data.cards.battle.getAll();
			if (filteredGuids) {console.log("existing")
				$(filteredGuids.join()).show();
				// utils.asyncForEach(cards, card => filteredGuids.includes(card.guid) ? $(`#${card.guid}`).show() : $(`#${card.guid}`).hide());
			}else {console.log("searching")
				var show: string[] = filteredLists[lower] = [],
					hide: string[] = [];
				utils.asyncForEach(cards, card => {
try {
					if (matchCard(card, lower)) {
						show.push("#" + card.guid);
					}else {
						hide.push("#" + card.guid);
					}
}catch(ex) {
	console.error(ex);
}
				}).then(() => {
					try {
						$(show.join()).show();
						$(hide.join()).show();
					}catch(ex) {
						console.error(ex);
					}
				})
			}
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
			}
			return tests[card.guid] || [];
		}
		function matchCard(card: IDataBattleCard, lower: string) {
			return getTests(card).find(test => test.includes(lower));
		}

		function onSearchClear() {
			$("#library-search").val("");
			$("tbody > tr[id]").show();
		}

		function mapPerksEffectsToImages(card: IDataBattleCard) {
			var list: string[] = [];
			(<string[]>card.targets || []).concat(card.effects || []).concat(card.perks || []).forEach(pushItem);
			return list.filter(s => !!s.replace(/\W/g, "")).map(s => `<span class="card-effect" title="${s.trim()}">${getImg20("effects", s.replace(/\W/g, ""))}</span>`);

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

		function mapMatsToImages(card: IDataBattleCard) {
			return card.mats.filter(s => !!s.replace(/\W/g, "")).map(s => `<span class="card-mat" title="${s.trim()}">${getImg20("evojars", s.replace(/\W/g, ""))}</span>`);
		}

		function renderCards(cards: IDataBattleCard[]) {
			var tbody = $("tbody");
			cards.forEach(card => {
				getTests(card);
				var html = `<tr id="${card.guid}"><td>`;
					html += `<span class="card-element">${card.elementType == ElementType.Neutral?"":getImg20("elements", ElementType[card.elementType])}</span>`;
					html += `<span class="card-klass">${getImg20("classes", KlassType[card.klassType])}</span>`;
					html += `<span class="card-stars">${utils.evoToStars(card.rarityType)}</span>`;
					html += `<span class="card-name"><a class="btn btn-link" data-action="show-card" style="padding:0;">${card.name}</a></span>`;
					html += `<span class="card-effects">${mapPerksEffectsToImages(card).join("")}</span>`;
					html += `<span class="card-mats">${mapMatsToImages(card).join("")}</span>`;
				html += "</td></tr>";
				tbody.append(html);
			});
			$("div.alert").remove();
			$("table.table").show();
		}
	}
}
