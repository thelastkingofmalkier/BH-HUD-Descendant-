namespace bh {
	export namespace css {
		export function addCardTypes($ = bh.$()) {
			var style = $("<style type='text/css' id='bh-hud-cardtypes'/>").appendTo($("head"));
			style.append(`div.bh-hud-image.img-Attack { background-image:url('${getSrc("cardtypes", "Attack")}'); }`);
			style.append(`div.bh-hud-image.img-Brag { background-image:url('${getSrc("cardtypes", "Brag")}'); }`);
			style.append(`div.bh-hud-image.img-BattleCard { background-image:url('${getSrc("cardtypes", "BattleCard")}'); }`);
			style.append(`div.bh-hud-image.img-Heal { background-image:url('${getSrc("cardtypes", "Heal")}'); }`);
			style.append(`div.bh-hud-image.img-Shield { background-image:url('${getSrc("cardtypes", "Shield")}'); }`);
			style.append(`div.bh-hud-image.img-WildCard { background-image:url('${getSrc("cardtypes", "WildCard")}'); }`);
		}
		export function addEffects($ = bh.$()) {
			var style = $("<style type='text/css' id='bh-hud-effects'/>").appendTo($("head"));
			data.EffectRepo.all.forEach(effect => style.append(`div.bh-hud-image.img-${effect.guid} { background-image:url('${EffectRepo.toImageSrc(effect)}'); }`))
		}
		export function addElements($ = bh.$()) {
			var style = $("<style type='text/css' id='bh-hud-elements'/>").appendTo($("head"));
			ElementRepo.all.forEach(elementType => elementType == ElementType.Neutral ? void 0 : style.append(`div.bh-hud-image.img-${ElementType[elementType]} { background-image:url('${ElementRepo.toImageSrc(elementType)}'); }`))
		}
		export function addHeroes($ = bh.$()) {
			var style = $("<style type='text/css' id='bh-hud-heroes'/>").appendTo($("head"));
			data.HeroRepo.all.forEach(hero => style.append(`div.bh-hud-image.img-${hero.guid} { background-image:url('${HeroRepo.toImageSrc(hero)}'); }`))
		}
		export function addItems($ = bh.$()) {
			var style = $("<style type='text/css' id='bh-hud-items'/>").appendTo($("head"));
			data.ItemRepo.all.forEach(item => style.append(`div.bh-hud-image.img-${item.guid} { background-image:url('${ItemRepo.toImageSrc(item)}'); }`))
		}
		export function addKlasses($ = bh.$()) {
			var style = $("<style type='text/css' id='bh-hud-klasses'/>").appendTo($("head")),
				widths = [16, 12, 12];
			KlassRepo.all.forEach(klassType => style.append(`div.bh-hud-image.img-${KlassType[klassType]} { width:16px; background-size:${widths[klassType]}px 20px; background-image:url('${KlassRepo.toImageSrc(klassType)}'); }`))
		}
	}
}