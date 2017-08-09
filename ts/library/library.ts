namespace bh {
	export namespace library {
		var $ = jQuery;
		export function init() {
			data.cards.battle.init().then(renderCards, (reason) => console.error(reason));
		}
		function renderCards(cards: IDataBattleCard[]) {console.log(cards)
			var tbody = $("tbody");
			cards.forEach(card => {
				var html = "<tr><td>";
					html += `<span class="card-element">${getImg("crystals", ElementType[card.elementType])}</span>`;
					html += `<span class="card-klass">${getImg("classes", KlassType[card.klassType])}</span>`;
					html += `<span class="card-stars">${utils.evoToStars(card.rarityType)}</span>`;
					html += `<span class="card-name">${card.name}</span>`;
				html += "</td></tr>";
				tbody.append(html);
			});
			$("div.alert").remove();
			$("table.table").show();
		}
	}
}
