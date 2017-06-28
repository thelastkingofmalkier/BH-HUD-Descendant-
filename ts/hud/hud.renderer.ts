namespace bh {
	export namespace hud {
		export function render() {
			renderBootstrapCss();
			renderHtml();
			events.init();
		}
		function renderCss() {
var css = `<style id="brain-hud-styles" type="text/css">
div.brain-hud-container { font-size:8pt; position:fixed; top:0; right:0; width:250px; background:#FFF; color:#000; border:2px solid #000; z-index:9999; padding:2px; }
div.brain-hud-container div { clear:both; }
div.brain-hud-container table { width:100%; margin:0; padding:0; border:0; }
div.brain-hud-container td { padding:0; margin:0; border:0; }
div.brain-hud-container select { width:180px; }
div.brain-hud-container textarea { width:240px; font-size:8pt; display:none; }

div.brain-hud-header { text-align:center; font-weight:bold; }

div.brain-hud-main-container,
div.brain-hud-scouter-guild-container,
div.brain-hud-scouter-player-container,
div.brain-hud-scouter-player,
div.brain-hud-scouter-panel-content,
div.brain-hud-inventory,
div.brain-hud-inventory-container,
div.brain-hud-child-scroller { display:none; }

div.brain-hud-scouter-player-report { display:none; padding:0 2px; text-align:left; }
div.brain-hud-scouter-player > div.player-name { font-size:10pt; font-weight:bold; text-align:center; }

div.brain-hud-scouter-panel-header { padding:2px 0 0 0; }
div.brain-hud-scouter-panel-header > button { cursor:default; border:0; width:240px; text-align:left; padding:0; margin:0; }
div.brain-hud-scouter-panel-header > button[data-action] { cursor:pointer; }
div.brain-hud-scouter-panel-header > button > span.hero-level { display:inline-block; width:20px; }
div.brain-hud-scouter-panel-header > button > span.hero-name { display:inline-block; width:60px; }
div.brain-hud-scouter-panel-header > button > span.hero-hp { display:inline-block; width:75px; }
div.brain-hud-scouter-panel-header > button > span.hero-rating { display:inline-block; width:75px; }

div.brain-hud-inventory-buttons { text-align:center; }

div.brain-hud-container .active { display:block; }

div.brain-hud-container .star { color: darkgoldenrod; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; }
div.brain-hud-container .evo-star { color: gold; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; }

div.brain-hud-container img { height:16px; width:16px; }
div.brain-hud-container img.icon-12 { height:12px; width:12px; }
div.brain-hud-container img.icon-20 { height:20px; width:20px; }

div.brain-hud-child-scroller { max-height:125px; overflow:auto; }

div.progress { margin-bottom:0; height:10px; }
div.progress > div.progress-bar { line-height:10px; font-size:8px; font-weight:bold; clear:none; }
</style>`;
			$("head").append(css);
		}
		function renderBootstrapCss() {
			$().get("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css").then(css => {
				$("head").append(`<style type="text/css">${css.replace(/\.btn/g, ".bs-btn")}</style>`);
				renderCss();
			})
		}
		function inventoryButton(type: string, typeValue: string, imgType: string, imgName?: string) {
			return `<button class="bs-btn bs-btn-default brain-hud-button" type="button" data-action="toggle-${type}" data-${type}="${typeValue}">${getImg(imgType, imgName || typeValue)}</button>`;
		}
		function renderHtml() {
			var html = `<div class="brain-hud-header">
	<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right" data-action="toggle-hud">[-]</button>
	<span class="header">The Brain BattleHand HUD</span>
</div>
<div class="brain-hud-main-container active">
	<div class="brain-hud-scouter-player-container">
		<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right" data-action="toggle-player-scouter">[-]</button>
		<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right" data-action="refresh-player">${getImg12("icons", "glyphicons-82-refresh")}</button>
		<select id="brain-hud-scouter-player-target" data-action="toggle-scouter-player"></select>
		<div id="brain-hud-scouter-player-report" class="brain-hud-scouter-player-report active"></div>
	</div>
	<div id="brain-hud-inventory" class="brain-hud-inventory">
		<strong>Inventory</strong>
		<button class="bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right" data-action="toggle-inventory">[-]</button>
		<div class="brain-hud-inventory-container active">
			<div class="text-center">
				<div class="bs-btn-group bs-btn-group-xs brain-hud-inventory-buttons" role="group">
					${inventoryButton("element", "Air", "elements")}
					${inventoryButton("element", "Earth", "elements")}
					${inventoryButton("element", "Fire", "elements")}
					${inventoryButton("element", "Spirit", "elements")}
					${inventoryButton("element", "Water", "elements")}
					${inventoryButton("element", "Neutral", "elements", "Loop")}
				</div>
				<div class="bs-btn-group bs-btn-group-xs brain-hud-inventory-buttons">
					${inventoryButton("klass", "Magic", "classes")}
					${inventoryButton("klass", "Might", "classes")}
					${inventoryButton("klass", "Skill", "classes")}
					${inventoryButton("klass", "Brag", "cardtypes")}
					${inventoryButton("type", "Rune", "runes", "Meteor")}
					${inventoryButton("type", "Crystal", "crystals", "Neutral")}
				</div>
				<div class="bs-btn-group bs-btn-group-xs brain-hud-inventory-buttons">
					${inventoryButton("type", "BoosterCard", "misc", "Boosters")}
					${inventoryButton("type", "WildCard", "cardtypes", "WildCard")}
					${inventoryButton("type", "Evo Jar", "misc", "EvoJars")}
				</div>
			</div>
			<div id="brain-hud-inventory-items-container" class="brain-hud-inventory-items-container"></div>
		</div>
	</div>
</div>`;
			$("body").append(`<div id="brain-hud-container" class="brain-hud-container">${html}</div>`);
		}
	}
}