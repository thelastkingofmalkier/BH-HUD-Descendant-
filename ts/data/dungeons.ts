interface INewDungeon { [key: string]: string; }
function numToRoman(num: string) {
	switch (+num) {
		case 1: return "I";
		case 2: return "II";
		case 3: return "III";
		case 4: return "IV";
		case 5: return "V";
		case 6: return "VI";
		case 7: return "VII";
		case 8: return "VIII";
		case 9: return "IX";
		case 10: return "X";
	}
}
function updateDungeonData() {
	$.get(DungeonDataUrl).then(raw => {
		var mapped = bh.Repo.mapTsv<INewDungeon>(raw),
			columns = Object.keys(mapped[0]),
			dungeons = mapped.map(d => {
				var name = `${d["Dungeon"]} ${d["Difficulty"]} ${numToRoman(d["Level"])}`,
					dungeon = bh.data.DungeonRepo.find(name);
				if (!dungeon) {
					dungeon = <any>{ };
					dungeon.guid = name.replace(/\W/g, "-");
					dungeon.name = name;
					dungeon.dungeon = d["Dungeon"];
					dungeon.difficulty = <any>d["Difficulty"];
					dungeon.act = numToRoman(d["Level"]);
					dungeon.keys = -1;
					dungeon.fame = -1;
					dungeon.gold = -1;
					dungeon.elementTypes = [];
					dungeon.crystals = [];
					dungeon.runes = [];
					dungeon.mats = [];
					dungeon.randomMats = [];
					dungeon.boosterElementTypes = [];
					dungeon.boosterRarities = [];
				}
				dungeon.keys = +d["Keys"];
				dungeon.crystals = bh.data.ItemRepo.crystals
								.filter(c => !!d[c.name])
								.map(c => c.name.split(/\W/)[0] + "|" + d[c.name].replace(/\s+/g, "").replace(",", "|"));
				dungeon.mats = bh.data.ItemRepo.evoJars
								.filter(item => !!d[item.name])
								.map(item => item.name + "|" + d[item.name].replace(/\s+/g, "").replace(",", "|"));
				dungeon.runes = bh.data.ItemRepo.runes
								.filter(r => !!d[r.name.startsWith("Hawk") ? "Hawkeye Air Rune" : r.name])
								.map(r => r.name.split(/\W/)[0] + "|" + d[r.name.startsWith("Hawk") ? "Hawkeye Air Rune" : r.name].replace(/\s+/g, "").replace(",", "|"));
				return dungeon;
			});
		bh.data.ItemRepo.all.filter(item => !columns.includes(item.name)).forEach(item => console.log(item.name))
			var tsv = "guid\tname\tdungeon\tdifficulty\tact\tkeys\tfame\tgold\telementTypes\tcrystals\trunes\tmats\trandomMats\tboosterElementTypes\tboosterRarities";
		dungeons.forEach(d => {
			tsv += `\n${d.guid}\t${d.name}\t${d.dungeon}\t${d.difficulty}\t${d.act}\t${d.keys}\t${d.fame}\t${d.gold}\t${d.elementTypes}\t${d.crystals}\t${d.runes}\t${d.mats}\t${d.randomMats}\t${d.boosterElementTypes}\t${d.boosterRarities}`;
		});
		$("#data-output").val(tsv)
	});
}