var __extends = (this && this.__extends) || (function () {
   var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var bh;
(function (bh) {
    var Cacheable = (function () {
        function Cacheable() {
            this._cache = {};
        }
        Cacheable.prototype.clearCache = function () {
            this._cache = {};
        };
        Cacheable.prototype.fromCache = function (key, fn) {
            if (!(key in this._cache)) {
                this._cache[key] = fn();
            }
            return this._cache[key];
        };
        return Cacheable;
    }());
    bh.Cacheable = Cacheable;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var Dungeon = (function (_super) {
        __extends(Dungeon, _super);
        function Dungeon(data) {
            var _this = _super.call(this) || this;
            _this.data = data;
            return _this;
        }
        Object.defineProperty(Dungeon.prototype, "act", {
            get: function () { return this.data.act; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "boosterElementTypes", {
            get: function () { return this.data.boosterElementTypes; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "boosterRarities", {
            get: function () { return this.data.boosterRarities; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "crystals", {
            get: function () {
                var _this = this;
                return this.fromCache("crystals", function () { return _this.data.crystals.map(function (v) { return toDropRate(v, _this.keys); }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "dungeon", {
            get: function () { return this.data.dungeon; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "difficulty", {
            get: function () { return this.data.difficulty; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "elementTypes", {
            get: function () { return this.data.elementTypes; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "fame", {
            get: function () { return this.data.fame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "guid", {
            get: function () { return this.data.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "gold", {
            get: function () { return this.data.gold; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "keys", {
            get: function () { return this.data.keys; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "lower", {
            get: function () { return this.data.lower; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "mats", {
            get: function () {
                var _this = this;
                return this.fromCache("mats", function () { return _this.data.mats.map(function (v) { return toDropRate(v, _this.keys); }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "name", {
            get: function () { return this.data.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "randomMats", {
            get: function () { return this.data.randomMats; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dungeon.prototype, "runes", {
            get: function () {
                var _this = this;
                return this.fromCache("runes", function () { return _this.data.runes.map(function (v) { return toDropRate(v, _this.keys); }); });
            },
            enumerable: true,
            configurable: true
        });
        Dungeon.prototype.findDrop = function (value) {
            var drop = this.crystals.find(function (dr) { return dr.name == value.split(" ")[0]; })
                || this.runes.find(function (dr) { return dr.name == value.split("'")[0]; })
                || this.mats.find(function (dr) { return dr.name == value; });
            return drop && { dungeon: this, dropRate: drop } || null;
        };
        return Dungeon;
    }(bh.Cacheable));
    bh.Dungeon = Dungeon;
    function toDropRate(value, keys) {
        var parts = value.split("|"), percentMultiplier = +parts[1].match(/(\d+)/)[1] / 100, minMax = parts[2].split("-"), min = +minMax[0], max = +minMax[1] || min, average = (min + max) / 2 * percentMultiplier, averagePerKey = average / keys;
        console.log([value, minMax, min, max, percentMultiplier, average, averagePerKey]);
        return { name: parts[0], percent: parts[1], percentMultiplier: percentMultiplier, min: min, max: max, average: average, averagePerKey: averagePerKey };
    }
})(bh || (bh = {}));
var bh;
(function (bh) {
    var AbilityType;
    (function (AbilityType) {
        AbilityType[AbilityType["Trait"] = 0] = "Trait";
        AbilityType[AbilityType["Active"] = 1] = "Active";
        AbilityType[AbilityType["Passive"] = 2] = "Passive";
    })(AbilityType = bh.AbilityType || (bh.AbilityType = {}));
    var ElementType;
    (function (ElementType) {
        ElementType[ElementType["Fire"] = 0] = "Fire";
        ElementType[ElementType["Earth"] = 1] = "Earth";
        ElementType[ElementType["Air"] = 2] = "Air";
        ElementType[ElementType["Spirit"] = 3] = "Spirit";
        ElementType[ElementType["Water"] = 4] = "Water";
        ElementType[ElementType["Neutral"] = 5] = "Neutral";
    })(ElementType = bh.ElementType || (bh.ElementType = {}));
    var ItemType;
    (function (ItemType) {
        ItemType[ItemType["EvoJar"] = 0] = "EvoJar";
        ItemType[ItemType["Crystal"] = 1] = "Crystal";
        ItemType[ItemType["Rune"] = 2] = "Rune";
    })(ItemType = bh.ItemType || (bh.ItemType = {}));
    var KlassType;
    (function (KlassType) {
        KlassType[KlassType["Magic"] = 0] = "Magic";
        KlassType[KlassType["Might"] = 1] = "Might";
        KlassType[KlassType["Skill"] = 2] = "Skill";
    })(KlassType = bh.KlassType || (bh.KlassType = {}));
    var PositionType;
    (function (PositionType) {
        PositionType[PositionType["Member"] = 0] = "Member";
        PositionType[PositionType["Elder"] = 1] = "Elder";
        PositionType[PositionType["CoLeader"] = 2] = "CoLeader";
        PositionType[PositionType["Leader"] = 3] = "Leader";
    })(PositionType = bh.PositionType || (bh.PositionType = {}));
    var RarityType;
    (function (RarityType) {
        RarityType[RarityType["Common"] = 0] = "Common";
        RarityType[RarityType["Uncommon"] = 1] = "Uncommon";
        RarityType[RarityType["Rare"] = 2] = "Rare";
        RarityType[RarityType["SuperRare"] = 3] = "SuperRare";
        RarityType[RarityType["Legendary"] = 4] = "Legendary";
    })(RarityType = bh.RarityType || (bh.RarityType = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var EvoReport = (function () {
        function EvoReport(card, evo) {
            this.wildCards = bh.data.wildsForEvo(card.rarityType, evo);
            this.minSot = bh.data.getMinSotNeeded(card.rarityType, evo);
            this.maxSot = bh.data.getMaxSotNeeded(card.rarityType, evo);
            this.minGold = bh.data.getMinGoldNeeded(card.rarityType, evo);
        }
        return EvoReport;
    }());
    bh.EvoReport = EvoReport;
    var EvoReportCard = (function () {
        function EvoReportCard(card) {
            this.reports = [];
            var evo = card.evo, max = bh.data.getMaxEvo(card.rarityType);
            for (var i = evo; i < max; i++) {
                this.reports.push(new EvoReport(card, i));
            }
        }
        Object.defineProperty(EvoReportCard.prototype, "next", {
            get: function () { return this.reports[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvoReportCard.prototype, "wildCards", {
            get: function () { return this.reports.reduce(function (count, report) { return count + report.wildCards; }, 0); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvoReportCard.prototype, "minSot", {
            get: function () { return this.reports.reduce(function (count, report) { return count + report.minSot; }, 0); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvoReportCard.prototype, "maxSot", {
            get: function () { return this.reports.reduce(function (count, report) { return count + report.maxSot; }, 0); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvoReportCard.prototype, "minGold", {
            get: function () { return this.reports.reduce(function (count, report) { return count + report.minGold; }, 0); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvoReportCard.prototype, "maxGold", {
            get: function () { return this.reports.reduce(function (count, report) { return count + report.maxGold; }, 0); },
            enumerable: true,
            configurable: true
        });
        return EvoReportCard;
    }());
    bh.EvoReportCard = EvoReportCard;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var GameEffect = (function () {
        function GameEffect(raw) {
            this.raw = raw;
            var parts = GameEffect.matchEffect(raw), cleanValue = parts && parts[1] || raw, effect = bh.data.EffectRepo.find(cleanValue);
            this.effect = effect && effect.name || cleanValue;
            this.percent = parts && parts[2] && (parts[2] + "%") || null;
            this.percentMultiplier = this.percent && (+parts[2] / 100) || null;
            this.turns = parts && +parts[3] || null;
            this.value = effect && effect.value;
            this.perkMultiplier = 0;
            this.offense = !(effect && effect.value || "").toLowerCase().startsWith("d");
            this.rawTarget = parts && parts[4] || null;
        }
        GameEffect.matchEffect = function (raw) {
            return raw == "Critical" ? ["Critical", "Critical"]
                : raw == "Splash Enemy" ? ["Splash", "Splash"]
                    : raw.match(/([a-zA-z]+(?: [a-zA-Z]+)*)(?: (\d+)%)?(?: (\d+)T)?(?: (Enemy|Ally|Self))/);
        };
        Object.defineProperty(GameEffect.prototype, "powerRating", {
            get: function () { return getPowerRating(this); },
            enumerable: true,
            configurable: true
        });
        GameEffect.parse = function (value) {
            if (!value)
                return null;
            var gameEffect = new GameEffect(value);
            return gameEffect.effect && gameEffect || null;
        };
        GameEffect.parseAll = function (playerCard) {
            var card = bh.data.BattleCardRepo.find(playerCard.configId), perkMultiplier = bh.BattleCardRepo.getPerk(card, playerCard.evolutionLevel) / 100, gameEffects = [];
            card.effects.forEach(function (effectValue) {
                var gameEffect = GameEffect.parse(effectValue);
                if (!gameEffect)
                    return console.error("GameEffect.parse: " + effectValue);
                gameEffect.card = card;
                gameEffects.push(gameEffect);
            });
            card.perks.forEach(function (perkValue) {
                var gameEffect = GameEffect.parse(perkValue);
                if (!gameEffect)
                    return console.error("GameEffect.parse: " + perkValue);
                gameEffect.card = card;
                gameEffect.perkMultiplier = perkMultiplier;
                gameEffects.push(gameEffect);
            });
            reconcileTargets(gameEffects, card);
            return gameEffects;
        };
        return GameEffect;
    }());
    bh.GameEffect = GameEffect;
    function reconcileTargets(gameEffects, card) {
        var targets = card.typesTargets.map(function (typeTarget) { return bh.PlayerBattleCard.parseTarget(typeTarget); }), damage = targets.find(function (t) { return t.type == "Damage"; }), def = targets.find(function (t) { return ["Heal", "Shield"].includes(t.type); }), damages = [];
        gameEffects.slice().forEach(function (gameEffect) {
            if (["Leech", "Sap"].includes(gameEffect.effect)) {
                gameEffect.rawTarget = "Enemy";
            }
            if (gameEffect.effect == "Critical") {
                gameEffect.target = targets[0];
                targets.slice(1).forEach(function (t) {
                    var ge = GameEffect.parse(gameEffect.raw);
                    ge.target = t;
                    gameEffects.push(ge);
                });
            }
            else if (gameEffect.effect == "Splash Damage") {
            }
            else if (gameEffect.rawTarget == "Enemy") {
                gameEffect.target = damage || bh.PlayerBattleCard.parseTarget(def.all ? "Damage All Enemies" : "Damage Single Enemy");
            }
            else if (gameEffect.rawTarget == "Ally") {
                var healOrShield = def && def.type || "Heal";
                gameEffect.target = bh.PlayerBattleCard.parseTarget((damage || def).all ? healOrShield + " All Allies" : healOrShield + " Single Ally");
            }
            else if (gameEffect.rawTarget == "Self") {
                var healOrShield = def && def.type || "Heal";
                gameEffect.target = bh.PlayerBattleCard.parseTarget(healOrShield + " Self");
            }
            else {
                if (!gameEffect.target)
                    console.warn("can't find target for " + gameEffect.effect, gameEffect.card);
            }
        });
    }
    function getPowerRating(gameEffect) {
        var rating = _getPowerRating(gameEffect);
        return rating;
    }
    function _getPowerRating(gameEffect) {
        if (["Critical", "Regen", "Splash Damage"].includes(gameEffect.effect))
            return 0;
        var match = (gameEffect.value || "").toUpperCase().match(/(O|D)?((?:\+|\-)?\d+(?:\.\d+)?)(T)?(%)?/), effectOffense = match && match[1] == "O", effectDefense = match && match[1] == "D", points = match && +match[2] || 1, turns = match && match[3] == "T" ? gameEffect.turns : 1, percentMultiplier = match && match[4] == "%" ? gameEffect.percentMultiplier : 1, value = match ? points * turns * percentMultiplier : 0.5, target = gameEffect.target, targetOffense = target && target.offense, targetDefense = target && !target.offense, oppoMultiplier = targetOffense == effectOffense || targetDefense == effectDefense ? 1 : -1, perkMultiplier = gameEffect.perkMultiplier || 1;
        if (target) {
            return value * perkMultiplier * oppoMultiplier;
        }
        else {
            console.warn("no target", gameEffect);
        }
        return 0;
    }
})(bh || (bh = {}));
var bh;
(function (bh) {
    function createHeroAbility(hero, heroAbility) {
        return { hero: hero, guid: heroAbility.abilityGuid, name: heroAbility.abilityName, type: heroAbility.abilityType };
    }
    var Hero = (function () {
        function Hero(heroAbilities) {
            var trait = heroAbilities[0], active = heroAbilities[1], passive = heroAbilities[2];
            this.guid = trait.heroGuid;
            this.name = trait.heroName;
            this.elementType = trait.elementType;
            this.klassType = trait.klassType;
            this.trait = createHeroAbility(this, trait);
            this.active = createHeroAbility(this, active);
            this.passive = createHeroAbility(this, passive);
            this.lower = this.name.toLowerCase();
        }
        Object.defineProperty(Hero.prototype, "abilities", {
            get: function () { return [this.trait, this.active, this.passive]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hero.prototype, "allBattleCards", {
            get: function () {
                return Hero.filterCardsByHero(this, bh.data.BattleCardRepo.all);
            },
            enumerable: true,
            configurable: true
        });
        Hero.prototype.getHitPoints = function (level) {
            return Hero.getHitPoints(this, level);
        };
        Object.defineProperty(Hero.prototype, "maxPowerRating", {
            get: function () {
                return bh.PowerRating.rateMaxedHero(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hero.prototype, "maxPowerThresholds", {
            get: function () {
                var _this = this;
                return bh.RarityRepo.allTypes.map(function (r) { return bh.PowerRating.rateMaxedHero(_this, r); });
            },
            enumerable: true,
            configurable: true
        });
        Hero.filterCardsByHero = function (hero, cards) {
            return cards.filter(function (card) { return card.klassType === hero.klassType && (card.elementType == bh.ElementType.Neutral || card.elementType == hero.elementType); });
        };
        Hero.getHitPoints = function (hero, level) {
            switch (hero.name) {
                case "Bree":
                case "Hawkeye":
                case "Krell":
                    return Math.floor(5 * level * level + 2.5 * level + 167.5);
                case "Monty":
                case "Trix":
                    return Math.floor(4.286 * level * level + 2.142 * level + 143.572);
                case "Jinx":
                case "Logan":
                case "Red":
                    return 4 * level * level + 2 * level + 134;
                case "Fergus":
                    return 6 * level * level + 3 * level + 201;
                case "Brom":
                case "Gilda":
                    return Math.floor(5.714 * level * level + 2.858 * level + 191.438);
                case "Peg":
                    return Math.floor(4.5 * level * level + 2 * level + 153.5);
                case "Thrudd":
                    return Math.floor(38 / 7 * level * level + 19 / 7 * level + 190 - 38 / 7 - 19 / 7);
                default:
                    return 0;
            }
        };
        return Hero;
    }());
    bh.Hero = Hero;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var messenger;
    var Messenger = (function () {
        function Messenger(win, callbackfn, _targetWindow) {
            if (_targetWindow === void 0) { _targetWindow = null; }
            var _this = this;
            this.win = win;
            this.callbackfn = callbackfn;
            this._targetWindow = _targetWindow;
            window.addEventListener("message", function (ev) {
                var message = ev.data || (ev.originalEvent && ev.originalEvent.data) || null;
                if (Messenger.isValidMessage(message)) {
                    _this.updateActive(message);
                    _this.callbackfn(message);
                }
            });
        }
        Object.defineProperty(Messenger.prototype, "targetWindow", {
            get: function () {
                if (!this._targetWindow) {
                    if (bh.isHud) {
                        var iframe = bh.$("#gameiframe")[0];
                        this._targetWindow = iframe && iframe.contentWindow || null;
                    }
                    if (bh.isListener) {
                        this._targetWindow = this.win && this.win.parent || null;
                    }
                }
                if (!this._targetWindow) {
                    console.log("no target window: " + location.href);
                }
                return this._targetWindow;
            },
            enumerable: true,
            configurable: true
        });
        Messenger.prototype.updateActive = function (message) {
            if (message.playerGuid !== message.action && message.sessionKey !== message.action) {
                if (!Messenger.ActivePlayerGuid || Messenger.ActivePlayerGuid !== message.playerGuid)
                    Messenger.ActivePlayerGuid = message.playerGuid;
                if (!Messenger.ActiveSessionKey || Messenger.ActiveSessionKey !== message.sessionKey)
                    Messenger.ActiveSessionKey = message.sessionKey;
            }
        };
        Messenger.prototype.postMessage = function (message) {
            if (Messenger.isValidMessage(message) && this.targetWindow) {
                this.updateActive(message);
                this.targetWindow.postMessage(message, "*");
            }
            else {
                if (!this.targetWindow) {
                    console.log("no target window: " + (message && message.action || "[no message]"));
                }
                else {
                    console.log("invalid message: " + (message && message.action || "[no message]"));
                }
            }
        };
        Messenger.isValidMessage = function (message) {
            if (!message) {
                return false;
            }
            var keys = Object.keys(message);
            return keys.includes("action") && keys.includes("playerGuid") && keys.includes("sessionKey") && keys.includes("data");
        };
        Messenger.createMessage = function (action, data) {
            return {
                action: action,
                playerGuid: Messenger.ActivePlayerGuid,
                sessionKey: Messenger.ActiveSessionKey,
                data: data
            };
        };
        Messenger.initialize = function (targetWindow, callbackfn) {
            return messenger = new Messenger(targetWindow, callbackfn);
        };
        Object.defineProperty(Messenger, "instance", {
            get: function () { return messenger; },
            enumerable: true,
            configurable: true
        });
        return Messenger;
    }());
    bh.Messenger = Messenger;
})(bh || (bh = {}));
var bh;
(function (bh) {
    function formatRow(imageGroup, imageName, name, badgeValue) {
        if (typeof (badgeValue) == "number") {
            badgeValue = bh.utils.formatNumber(badgeValue);
        }
        return "<div data-hud=\"true\">" + bh.getImg20(imageGroup, imageName) + " " + name + "<span class=\"badge pull-right\">" + badgeValue + "</span></div>";
    }
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(json, isArena) {
            if (isArena === void 0) { isArena = false; }
            var _this = _super.call(this) || this;
            _this.isArena = isArena;
            if (bh.data.isPlayer(json)) {
                _this._pp = json;
            }
            if (bh.data.isGuildPlayer(json)) {
                _this._gp = json;
            }
            return _this;
        }
        Object.defineProperty(Player.prototype, "fameLevel", {
            get: function () { return (this._pp && this._pp.fameLevel || this._gp.fameLevel) + 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "fragments", {
            get: function () { return this._pp && this._pp.fragments || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "fragmentsRowHtml", {
            get: function () { return this._pp ? formatRow("misc", "Fragments", "Fragments", this.fragments) : ""; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "gems", {
            get: function () { return this._pp && this._pp.gems || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "gemsRowHtml", {
            get: function () { return this._pp ? formatRow("misc", "GemStone", "Gems", this.gems) : ""; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "gold", {
            get: function () { return this._pp && this._pp.gold || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "goldNeeded", {
            get: function () {
                var _this = this;
                return this.fromCache("goldNeeded", function () {
                    var needed = 0;
                    _this.activeBattleCards.forEach(function (battleCard) { return needed += battleCard.maxMaxGoldNeeded; });
                    _this.heroes.forEach(function (playerHero) { return needed += playerHero ? playerHero.trait.maxGoldCost + playerHero.active.maxGoldCost + playerHero.passive.maxGoldCost : 0; });
                    return needed;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "goldRowHtml", {
            get: function () {
                var needed = this.goldNeeded, asterisk = "<sup>*</sup>", badge = needed ? bh.utils.formatNumber(this.gold) + " / " + bh.utils.formatNumber(Math.abs(needed)) + asterisk : bh.utils.formatNumber(this.gold);
                return this._pp ? formatRow("misc", "Coin", "Gold", badge) : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "guid", {
            get: function () { return this._pp && this._pp.id || this._gp.playerId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "guild", {
            get: function () { return bh.data.guilds.findByGuid(this.guildGuid); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "guildGuid", {
            get: function () { return this._pp ? this._pp.playerGuild || null : this._gp && this._gp.guildId || null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "guildParent", {
            get: function () { var guildName = bh.data.guilds.findNameByGuid(this.guildGuid); return guildName && guildName.parent || null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "guilds", {
            get: function () {
                var _this = this;
                var guilds = this.fromCache("guilds", function () { return bh.data.guilds.filterNamesByParent(_this.guildParent); });
                if (!guilds.length) {
                    var guildName = bh.data.guilds.findNameByGuid(this.guildGuid);
                    if (guildName) {
                        guilds.push(guildName);
                    }
                }
                return guilds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "heroes", {
            get: function () {
                var _this = this;
                return this.fromCache("heroes", function () {
                    var archetypes;
                    if (_this._pp) {
                        archetypes = bh.data.HeroRepo.all.map(function (hero) { return _this._pp.archetypes.find(function (arch) { return arch.id == hero.guid; }) || bh.HeroRepo.getLockedArchetype(_this.guid, hero.guid); });
                    }
                    else {
                        archetypes = Object.keys(_this._gp.archetypeLevels).map(function (guid) {
                            return { playerId: _this.guid, id: guid, level: _this._gp.archetypeLevels[guid] };
                        });
                    }
                    return archetypes.map(function (archetype) { return new bh.PlayerHero(_this, archetype); });
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isAlly", {
            get: function () {
                var _this = this;
                return this.fromCache("isAlly", function () { return !!(Player.me && Player.me.guilds || []).find(function (g) { return g.guid == _this.guildGuid; }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "canScout", {
            get: function () {
                return this.guid == "b0a8b57b-54f5-47d8-8b7a-f9dac8300ca0";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "completionPercent", {
            get: function () {
                return Math.floor(100 * this.heroes.map(function (h) { return h.completionLevel; }).reduce(function (l, c) { return l + c; }, 0) / (bh.HeroRepo.MaxCompletionLevel * bh.HeroRepo.MaxHeroCount));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isExtended", {
            get: function () {
                return !!this._pp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isFullMeat", {
            get: function () {
                var heroes = this.heroes.filter(function (h) { return !h.isLocked && h.isMeat; });
                return heroes.length == bh.HeroRepo.MaxHeroCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isMe", {
            get: function () {
                return bh.Messenger.ActivePlayerGuid == this.guid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "name", {
            get: function () {
                return this._pp ? this._pp.name : this._gp && this._gp.name || null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "position", {
            get: function () {
                return this._gp && this._gp.position || null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "powerRating", {
            get: function () {
                var _this = this;
                return this.fromCache("poewrRating", function () { return _this.heroes.reduce(function (power, hero) { return power + hero.powerRating; }, 0); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "raidRowHtml", {
            get: function () {
                return this._pp ? formatRow("keys", "RaidTicket", "Raid Tickets", this.raidTickets) : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "raidTickets", {
            get: function () {
                return this._pp && this._pp.raidKeys || 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "battleCards", {
            get: function () {
                var _this = this;
                return this.fromCache("battleCards", function () { return !(_this._pp && _this._pp.playerCards && _this._pp.playerCards.cards) ? [] : _this.sortAndReduceBattleCards(Object.keys(_this._pp.playerCards.cards)); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "activeBattleCards", {
            get: function () {
                var _this = this;
                return this.fromCache("activeBattleCards", function () { return _this.battleCards.filter(function (battleCard) { return battleCard.isActive; }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "activeRecipes", {
            get: function () {
                var _this = this;
                return this.fromCache("activeRecipes", function () { return _this.activeBattleCards.map(function (bc) { return new bh.Recipe(bc, true); }).filter(function (r) { return !!r; }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "boosterCards", {
            get: function () {
                var map = this._pp && this._pp.feederCardsMap;
                return !map ? [] : Object.keys(map).map(function (guid) { return new bh.PlayerBoosterCard(guid, map[guid]); }).sort(bh.utils.sort.byElementThenRarityThenName);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "boosterCount", {
            get: function () {
                var count = 0, map = this._pp && this._pp.feederCardsMap || {};
                Object.keys(map).map(function (guid) { return count += map[guid]; });
                return count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "boosterRowHtml", {
            get: function () {
                return this._pp ? bh.PlayerBoosterCard.rowHtml(this.boosterCount) : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "inventory", {
            get: function () {
                var _this = this;
                var mats = this._pp && this._pp.craftingMaterials;
                return bh.data.ItemRepo.allSortedByName.map(function (item) { return new bh.PlayerInventoryItem(_this, item, mats[item.guid] || 0); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "wildCards", {
            get: function () {
                var _this = this;
                return this.fromCache("wildCards", function () { return bh.data.WildCardRepo.all.map(function (wc) { return new bh.PlayerWildCard(_this, wc.guid); }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "wildCardRowHtml", {
            get: function () {
                return this._pp ? formatRow("cardtypes", "WildCard", "Wild Cards", this.wildCards.filter(function (wc) { return wc.count; }).slice(-3).map(function (wc) { return bh.RarityType[wc.rarityType][0] + ":" + wc.count; }).join(" / ")) : "";
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.battleCardToPlayerBattleInfo = function (guid) {
            var playerCard = this._pp.playerCards.cards[guid];
            return new bh.PlayerBattleCard(playerCard);
        };
        Player.prototype.filterActiveBattleCards = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var element, rarity, name, hero;
            args.forEach(function (arg) { return bh.ElementRepo.isElement(arg) ? element = arg : bh.RarityRepo.isRarity(arg) ? rarity = arg : name = arg; });
            if (name)
                hero = bh.data.HeroRepo.find(name);
            return this.activeBattleCards.filter(function (battleCard) { return battleCard.matchesElement(element) && battleCard.matchesRarity(rarity) && battleCard.matchesHero(hero); });
        };
        Player.prototype.filterHeroes = function (elementOrName) {
            var element = bh.ElementRepo.isElement(elementOrName) ? elementOrName : null, name = !element ? elementOrName : null;
            return this.heroes.filter(function (playerHero) { return playerHero && ((element && bh.ElementType[playerHero.elementType] == element) || (name && playerHero.name == name)); });
        };
        Player.prototype.findPlayerCard = function (guid) {
            var cards = this._pp && this._pp.playerCards.cards, card = cards && cards[guid];
            if (!card && cards) {
                var guids = Object.keys(cards), match = guids.find(function (g) { return g == guid || cards[g].configId == guid; });
                card = cards[match];
            }
            return card;
        };
        Player.prototype.merge = function (player) {
            var mine = this._pp && this._pp.archetypes || [], theirs = player.archetypes || [];
            theirs.forEach(function (theirArch) {
                if (!mine.find(function (myArch) { return myArch.id == theirArch.id; })) {
                    mine.push(theirArch);
                }
            });
        };
        Player.prototype.sortAndReduceBattleCards = function (guids) {
            var _this = this;
            var cards = guids.map(function (guid) { return _this.battleCardToPlayerBattleInfo(guid); }), sorted = cards.sort(bh.utils.sort.byRarityThenNameThenEvoLevel), reduced = [];
            sorted.forEach(function (card) {
                var existing = reduced.find(function (c) { return c.matches(card); });
                if (existing) {
                    existing.count++;
                }
                else {
                    reduced.push(card);
                }
            });
            return reduced;
        };
        Object.defineProperty(Player, "me", {
            get: function () { return bh.data.PlayerRepo.find(bh.Messenger.ActivePlayerGuid); },
            enumerable: true,
            configurable: true
        });
        return Player;
    }(bh.Cacheable));
    bh.Player = Player;
})(bh || (bh = {}));
var bh;
(function (bh) {
    function typesTargetsToTargets(values) {
        return values.map(function (s) { return s.trim(); }).filter(function (s) { return !!s; }).map(function (s) {
            var parts = s.split(" "), all = parts[1] == "All", single = parts[1] == "Single", splash = parts[1] == "Splash", self = parts[1] == "Self";
            if (s.includes("Flurry")) {
                if (self) {
                    return "Self Flurry";
                }
                if (all) {
                    return "Multi Flurry";
                }
                if (single) {
                    return "Single Flurry";
                }
            }
            if (self) {
                return "Self";
            }
            if (single) {
                return "Single";
            }
            if (all) {
                return "Multi";
            }
            if (splash) {
                return "Splash";
            }
            console.log("Target of \"" + s + "\"");
            return s;
        });
    }
    var PlayerBattleCard = (function () {
        function PlayerBattleCard(playerCard) {
            this.count = 1;
            this.playerCard = playerCard;
            this._bc = bh.data.BattleCardRepo.find(playerCard.configId);
            if (!this._bc) {
                bh.utils.logMissingCard(this);
            }
        }
        PlayerBattleCard.prototype._rowChildren = function () {
            var _this = this;
            var html = "";
            if (!this.isUnknown) {
                var me = bh.Player.me, activeRecipe = new bh.Recipe(this, true);
                if (activeRecipe) {
                    var goldNeeded = bh.data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count, goldOwned = me.gold, goldColor = goldOwned < goldNeeded ? "bg-danger" : "bg-success";
                    html += "<div>" + bh.getImg20("misc", "Coin") + " Gold <span class=\"badge pull-right " + goldColor + "\">" + bh.utils.formatNumber(goldOwned) + " / " + bh.utils.formatNumber(goldNeeded) + "</span></div>";
                    activeRecipe.all.forEach(function (recipeItem) {
                        if (recipeItem.max) {
                            var item = recipeItem.item, guid = item.guid, playerItem = me.inventory.find(function (item) { return item.guid == guid; }), count = playerItem && playerItem.count || 0;
                            html += bh.PlayerInventoryItem.toRowHtml(item, count, recipeItem.max * _this.count);
                        }
                    });
                    var wcNeeded = bh.data.getMaxWildCardsNeeded(this) * this.count, wc = me.wildCards[this.rarityType], iwc = !wc && bh.data.WildCardRepo.find(bh.RarityType[this.rarityType]) || null, wcOwned = wc && me.wildCards[this.rarityType].count || 0;
                    html += bh.PlayerWildCard.toRowHtml(wc || iwc, wcOwned, wcNeeded);
                    var runesNeeded = bh.data.calcMaxRunesNeeded(this.playerCard, this.evoLevel), rune = me.inventory.find(function (item) { return item.isRune && _this.matchesHero(bh.data.HeroRepo.find(item.name.split("'")[0])); }), runesOwned = rune && rune.count || 0;
                    if (runesNeeded && rune) {
                        html += bh.PlayerInventoryItem.toRowHtml(rune, runesOwned, runesNeeded);
                    }
                    var crystalsNeeded = bh.data.calcMaxCrystalsNeeded(this.playerCard, this.evoLevel), crystal = me.inventory.find(function (item) { return item.isCrystal && _this.elementType == item.elementType; }), crystalsOwned = crystal && crystal.count || 0;
                    if (crystalsNeeded && crystal) {
                        html += bh.PlayerInventoryItem.toRowHtml(crystal, crystalsOwned, crystalsNeeded);
                    }
                }
            }
            return html;
        };
        PlayerBattleCard.prototype._rowHtml = function (badgeValue, badgeCss) {
            var badgeHtml = badgeValue ? "<span class=\"badge pull-right " + (badgeCss || "") + "\">" + badgeValue + "</span>" : "", children = typeof (badgeValue) == "number" || this.isMaxed ? "" : this._rowChildren(), content = bh.renderExpandable(this.playerCard.id, "" + this.fullHtml + badgeHtml, children);
            return "<div -class=\"" + bh.ElementType[this.elementType] + "\" data-element-type=\"" + this.elementType + "\" data-rarity-type=\"" + this.rarityType + "\" data-klass-type=\"" + this.klassType + "\" data-brag=\"" + (this.brag ? "Brag" : "") + "\">" + content + "</div>";
        };
        Object.defineProperty(PlayerBattleCard.prototype, "brag", {
            get: function () { return this._bc && this._bc.brag || false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "effects", {
            get: function () { return this._bc && this._bc.effects || []; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "elementType", {
            get: function () { return this._bc ? this._bc.elementType : bh.ElementType.Neutral; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "inPacks", {
            get: function () { return this._bc && this._bc.inPacks || false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "klassType", {
            get: function () { return this._bc ? this._bc.klassType : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "lower", {
            get: function () { return this.name.toLowerCase(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "mats", {
            get: function () { return this._bc && this._bc.mats || null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "maxValues", {
            get: function () { return this._bc && this._bc.maxValues || []; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "minValues", {
            get: function () { return this._bc && this._bc.minValues || [[]]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "isOp", {
            get: function () { return this._bc && this._bc.isOp || false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "perkBase", {
            get: function () { return this._bc && this._bc.perkBase || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "perks", {
            get: function () { return this._bc && this._bc.perks || []; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "name", {
            get: function () { return this._bc && this._bc.name || this.playerCard && this.playerCard.configId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "rarityType", {
            get: function () { return this._bc ? this._bc.rarityType : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "targets", {
            get: function () { return typesTargetsToTargets(this.typesTargets); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "turns", {
            get: function () { return this._bc && this._bc.turns || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "tier", {
            get: function () { return this._bc && this._bc.tier || null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "types", {
            get: function () { return this.typesTargets.map(function (s) { return s.split(" ")[0].replace("Damage", "Attack"); }); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "typesTargets", {
            get: function () { return this._bc && this._bc.typesTargets || []; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "evo", {
            get: function () { return this.playerCard && this.playerCard.evolutionLevel || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "guid", {
            get: function () { return this.playerCard && this.playerCard.configId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "level", {
            get: function () { return this.playerCard && (this.playerCard.level + 1) || 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "battleOrBragImage", {
            get: function () { return bh.getImg20("cardtypes", this.brag ? "Brag" : "BattleCard"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "evoLevel", {
            get: function () { return this.evo + "." + ("0" + this.level).slice(-2); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "formattedValue", {
            get: function () { return this.value ? bh.utils.formatNumber(this.value) : ""; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "fullHtml", {
            get: function () {
                var count = this.count > 1 ? "x" + this.count : "", typeAndValue = this.value ? " (" + this.typeImage + " " + this.formattedValue + ")" : "", stars = bh.utils.evoToStars(this.rarityType, this.evoLevel), name = this.name
                    .replace(/Mischievous/, "Misch.")
                    .replace(/Protection/, "Prot.")
                    .replace(/-[\w-]+-/, "-...-");
                return this.battleOrBragImage + " " + this.evoLevel + " <small>" + stars + "</small> " + name + " " + typeAndValue + " " + count + "<span class=\"pull-right\">" + Math.round(this.powerRating) * this.count + "</span>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "isActive", {
            get: function () { return (this.evo > 0 || this.level > 1) && !this.isMaxed; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "isMaxed", {
            get: function () { return this.evoLevel == ["1.10", "2.20", "3.35", "4.50", "5.50"][this.rarityType]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "isUnknown", {
            get: function () { return !this._bc; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "maxWildCardsNeeded", {
            get: function () { return bh.data.getMaxWildCardsNeeded(this) * this.count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "nextWildCardsNeeded", {
            get: function () { return bh.data.getNextWildCardsNeeded(this) * this.count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "maxMaxSotNeeded", {
            get: function () { return bh.data.calcMaxSotNeeded(this.playerCard, this.evoLevel) * this.count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "nextMaxSotNeeded", {
            get: function () { return bh.data.getMaxSotNeeded(this.rarityType, this.evo) * this.count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "maxMaxGoldNeeded", {
            get: function () { return bh.data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "nextMaxGoldNeeded", {
            get: function () { return bh.data.getMaxGoldNeeded(this.rarityType, this.evo) * this.count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "powerRating", {
            get: function () { return bh.PowerRating.ratePlayerCard(this.playerCard); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "rarityEvoLevel", {
            get: function () { return bh.RarityType[this.rarityType][0] + "." + this.evoLevel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "rowHtml", {
            get: function () { return this._rowHtml(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "scoutHtml", {
            get: function () { return this.rarityEvoLevel + " " + this.name + " " + (this.count > 1 ? "x" + this.count : ""); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "typeImage", {
            get: function () { return this.types.length ? bh.getImg12("cardtypes", this.types[0]) : ""; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBattleCard.prototype, "value", {
            get: function () { return this.playerCard && bh.BattleCardRepo.calculateValue(this.playerCard) || 0; },
            enumerable: true,
            configurable: true
        });
        ;
        PlayerBattleCard.prototype.matches = function (other) { return this._bc && other._bc && this._bc.guid == other._bc.guid && this.evoLevel == other.evoLevel; };
        PlayerBattleCard.prototype.matchesElement = function (element) { return !element || this.elementType === bh.ElementType[element]; };
        PlayerBattleCard.prototype.matchesHero = function (hero) { return !hero || (this.matchesElement(bh.ElementType[hero.elementType]) && this.klassType === hero.klassType); };
        PlayerBattleCard.prototype.matchesRarity = function (rarity) { return !rarity || this.rarityType === bh.RarityType[rarity]; };
        PlayerBattleCard.prototype.toRowHtml = function (needed, owned) { return this._rowHtml(needed, owned < needed ? "bg-danger" : "bg-success"); };
        PlayerBattleCard.parseTarget = function (value) {
            var parts = value.split("Flurry")[0].trim().split(" "), type = parts.shift(), target = parts.join(" "), offense = type == "Damage", all = target.includes("All Allies") || target.includes("All Enemies"), splash = target.includes("Splash"), self = target.includes("Self"), single = !all && !splash && !self, flurryMatch = value.match(/Flurry \((\d+) @ (\d+)%\)/), flurryCount = flurryMatch && +flurryMatch[1] || null, flurryHitPercent = flurryMatch && (flurryMatch[2] + "%") || null, flurryHitMultiplier = flurryMatch && (+flurryMatch[2] / 100) || null;
            return {
                type: type,
                typeDivisor: type == "Damage" ? AttackDivisor : type == "Shield" ? ShieldDivisor : HealDivisor,
                target: target,
                offense: offense,
                all: all,
                splash: splash,
                single: single,
                self: self,
                targetMultiplier: all ? offense ? 3 : 2 : splash ? offense ? 2 : 1.5 : single ? offense ? 1 : 1.25 : self ? 1 : 0,
                flurry: !!flurryMatch,
                flurryCount: flurryCount,
                flurryHitPercent: flurryHitPercent,
                flurryHitMultiplier: flurryHitMultiplier
            };
        };
        return PlayerBattleCard;
    }());
    bh.PlayerBattleCard = PlayerBattleCard;
})(bh || (bh = {}));
function updateCardData() {
    $.get(BattleCardDataUrl).then(function (raw) {
        var mapped = bh.Repo.mapTsv(raw), cards = mapped.map(function (card) {
            try {
                var guid = card["Id"], existing = bh.data.BattleCardRepo.find(guid), multiValues = card["Effect Type"].includes("/"), minValuesArray = multiValues ? [0, 1] : [0];
                var created = {
                    guid: guid,
                    name: existing && existing.name || card["Name"],
                    klassType: bh.KlassType[card["Class"].replace("Ranged", "Skill").replace("Melee", "Might")],
                    elementType: bh.ElementType[card["Element"]],
                    rarityType: bh.RarityType[card["Rarity"].replace(/ /, "")],
                    turns: +card["Turns"],
                    typesTargets: card["Effect Type"].trim().split(/\s*\/\s*/),
                    brag: bh.utils.parseBoolean(card["Is Brag?"]),
                    minValues: minValuesArray.map(function (index) { return [0, 1, 2, 3, 4, 5].map(function (i) { return card[i + "* Min"]; }).filter(function (s) { return !!s; }).map(function (s) { return +String(s).split(/\s*\/\s*/)[index]; }); }),
                    maxValues: [0, 1, 2, 3, 4, 5].map(function (i) { return card[i + "* Max"]; }).filter(function (s) { return !!s; }).pop().split(/\s*\/\s*/).map(function (s) { return +s; }),
                    tier: existing && existing.tier || "",
                    mats: [1, 2, 3, 4].map(function (i) { return card[i + "* Evo Jar"]; }).filter(function (s) { return !!s; }),
                    perkBase: +card["Perk %"],
                    perks: [1, 2].map(function (i) { return card["Perk #" + i]; }).filter(function (s) { return !!s; }),
                    effects: [1, 2, 3].map(function (i) { return card["Effect #" + i]; }).filter(function (s) { return !!s && s != "Splash"; }),
                    inPacks: bh.utils.parseBoolean(card["In Packs?"])
                };
                if (!existing)
                    console.log("New Card: " + card["Name"]);
                else if (existing.name != card["Name"])
                    console.log(existing.name + " !== " + card["Name"]);
                return created;
            }
            catch (ex) {
                console.error(card);
            }
            return null;
        });
        var tsv = "guid\tname\tklassType\telementType\trarityType\tturns\ttypesTargets\tbrag\tminValues\tmaxValues\ttier\tmats\tperkBase\tperks\teffects\tpacks";
        cards.filter(function (c) { return !!c; }).forEach(function (c) {
            tsv += "\n" + c.guid + "\t" + c.name + "\t" + bh.KlassType[c.klassType].slice(0, 2) + "\t" + bh.ElementType[c.elementType][0] + "\t" + bh.RarityType[c.rarityType][0] + "\t" + c.turns + "\t" + c.typesTargets.join("|") + "\t" + String(c.brag)[0] + "\t" + c.minValues.map(function (a) { return a.join(","); }).join("|") + "\t" + c.maxValues.join("|") + "\t" + c.tier + "\t" + c.mats.join(",") + "\t" + c.perkBase + "\t" + c.perks.join(",") + "\t" + c.effects.join(",") + "\t" + String(c.inPacks)[0];
        });
        $("#data-output").val(tsv);
    });
}
var bh;
(function (bh) {
    var PlayerBoosterCard = (function () {
        function PlayerBoosterCard(guid, count) {
            if (count === void 0) { count = 0; }
            this.count = count;
            this.type = "BoosterCard";
            this._ = bh.data.BoosterCardRepo.find(guid);
        }
        Object.defineProperty(PlayerBoosterCard.prototype, "challenge", {
            get: function () { return this._.challenge; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBoosterCard.prototype, "elementType", {
            get: function () { return this._.elementType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBoosterCard.prototype, "guid", {
            get: function () { return this._.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBoosterCard.prototype, "name", {
            get: function () { return this._.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBoosterCard.prototype, "rarityType", {
            get: function () { return this._.rarityType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBoosterCard.prototype, "rowHtml", {
            get: function () { return "<div class=\"" + bh.ElementType[this.elementType] + "\" data-element-type=\"" + this.elementType + "\" data-type=\"" + this.type + "\" data-rarity-type=\"" + this.rarityType + "\">" + bh.getImg20("misc", "Boosters") + " " + bh.RarityType[this.rarityType][0] + (this.challenge ? "*" : "") + " " + this.name + " <span class=\"badge pull-right\">" + bh.utils.formatNumber(this.count) + "</span></div>"; },
            enumerable: true,
            configurable: true
        });
        PlayerBoosterCard.rowHtml = function (count) { return "<div data-hud=\"true\">" + bh.getImg20("misc", "Boosters") + " Boosters <span class=\"badge pull-right\">" + bh.utils.formatNumber(count) + "</span></div>"; };
        return PlayerBoosterCard;
    }());
    bh.PlayerBoosterCard = PlayerBoosterCard;
})(bh || (bh = {}));
var bh;
(function (bh) {
    function getAbilityLevel(playerHero, abilityType) {
        var level = playerHero.archetype.abilityLevels
            ? playerHero.archetype.abilityLevels[playerHero.hero.abilities[abilityType].guid]
            : null;
        return isNaN(level) ? 0 : level + 1;
    }
    var PlayerHero = (function (_super) {
        __extends(PlayerHero, _super);
        function PlayerHero(player, archetype) {
            var _this = _super.call(this) || this;
            _this.player = player;
            _this.archetype = archetype;
            _this.hero = bh.data.HeroRepo.find(archetype.id);
            return _this;
        }
        PlayerHero.prototype.getAbilityLevel = function (abilityType) {
            var level = this.archetype.abilityLevels
                ? this.archetype.abilityLevels[this.hero.abilities[abilityType].guid]
                : null;
            return isNaN(level) ? 0 : level + 1;
        };
        Object.defineProperty(PlayerHero.prototype, "abilities", {
            get: function () { return this.hero.abilities; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "abilityLevels", {
            get: function () { return this.archetype.abilityLevels; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "active", {
            get: function () {
                var _this = this;
                return this.fromCache("active", function () { return new bh.PlayerHeroAbility(_this, _this.hero.active, getAbilityLevel(_this, bh.AbilityType.Active)); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "guid", {
            get: function () { return this.hero.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "elementType", {
            get: function () { return this.hero.elementType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "klassType", {
            get: function () { return this.hero.klassType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "name", {
            get: function () { return this.hero.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "passive", {
            get: function () {
                var _this = this;
                return this.fromCache("passive", function () { return new bh.PlayerHeroAbility(_this, _this.hero.passive, getAbilityLevel(_this, bh.AbilityType.Passive)); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "trait", {
            get: function () {
                var _this = this;
                return this.fromCache("trait", function () { return new bh.PlayerHeroAbility(_this, _this.hero.trait, getAbilityLevel(_this, bh.AbilityType.Trait)); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "battleCards", {
            get: function () {
                var _this = this;
                return this.fromCache("battleCards", function () { return bh.Hero.filterCardsByHero(_this.hero, _this.player.battleCards); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "completionLevel", {
            get: function () { return this.level + this.trait.level + this.active.level + this.passive.level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "deck", {
            get: function () {
                var _this = this;
                return this.fromCache("deck", function () { return _this.player.sortAndReduceBattleCards(_this.archetype.deck); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "hitPoints", {
            get: function () { return this.hero.getHitPoints(this.level); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "isCapped", {
            get: function () { return this.active.isCapped && this.passive.isCapped && this.trait.isCapped; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "isLocked", {
            get: function () { return this.archetype.locked; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "isMeat", {
            get: function () { return this.level == bh.HeroRepo.MaxLevel && this.isCapped; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "level", {
            get: function () { return this.archetype.level + 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "isOp", {
            get: function () { return !!this.deck.find(function (pbc) { return pbc.tier == "OP"; }); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "playerHeroAbilities", {
            get: function () { return [this.trait, this.active, this.passive]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "playerHeroGuid", {
            get: function () { return this.player.guid + "-" + this.hero.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "powerPercent", {
            get: function () { return Math.floor(100 * this.powerRating / this.hero.maxPowerRating); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHero.prototype, "powerRating", {
            get: function () {
                var _this = this;
                return this.fromCache("powerRating", function () { return Math.round(bh.PowerRating.ratePlayerHeroHitPoints(_this) + _this.trait.powerRating + _this.active.powerRating + _this.passive.powerRating + bh.PowerRating.rateDeck(_this.deck)); });
            },
            enumerable: true,
            configurable: true
        });
        return PlayerHero;
    }(bh.Cacheable));
    bh.PlayerHero = PlayerHero;
})(bh || (bh = {}));
var bh;
(function (bh) {
    function getMaterialCostForTrait(level) {
        if (level < 2)
            return 1;
        if (level < 10)
            return 2;
        if (level < 18)
            return 3;
        if (level < 25)
            return 4;
        if (level < 33)
            return 5;
        if (level < 41)
            return 6;
        if (level < 49)
            return 7;
        if (level < 56)
            return 8;
        if (level < 64)
            return 9;
        if (level < 72)
            return 10;
        if (level < 80)
            return 11;
        if (level < 87)
            return 12;
        if (level < 95)
            return 13;
        if (level < 103)
            return 14;
        return 15;
    }
    function getGoldCostForTrait(level) {
        if (level == 1)
            return 1000;
        var delta = 754, gold = 3000;
        for (var i = 2; i < level; i++) {
            gold += delta;
            delta += 8;
        }
        return gold;
    }
    function getMaterialCostForActive(level) {
        if (level < 2)
            return 1;
        if (level < 7)
            return 3;
        if (level < 13)
            return 4;
        if (level < 18)
            return 5;
        if (level < 23)
            return 6;
        if (level < 28)
            return 7;
        if (level < 33)
            return 8;
        if (level < 38)
            return 9;
        if (level < 43)
            return 10;
        if (level < 48)
            return 11;
        if (level < 53)
            return 12;
        if (level < 58)
            return 13;
        if (level < 63)
            return 14;
        if (level < 68)
            return 15;
        if (level < 73)
            return 16;
        if (level < 78)
            return 17;
        if (level < 83)
            return 18;
        return 19;
    }
    function getGoldCostForActive(level) {
        if (level == 1)
            return 5000;
        var delta = 510, gold = 3500;
        for (var i = 2; i < level; i++) {
            gold += delta;
            delta += 20;
        }
        return gold;
    }
    function getMaterialCostForPassive(level) {
        if (level < 2)
            return 2;
        if (level < 6)
            return 4;
        if (level < 9)
            return 5;
        if (level < 12)
            return 6;
        if (level < 16)
            return 7;
        if (level < 19)
            return 8;
        if (level < 22)
            return 9;
        if (level < 26)
            return 10;
        if (level < 29)
            return 11;
        if (level < 32)
            return 12;
        if (level < 36)
            return 13;
        if (level < 39)
            return 14;
        if (level < 42)
            return 15;
        if (level < 46)
            return 16;
        if (level < 49)
            return 17;
        if (level < 52)
            return 18;
        if (level < 56)
            return 19;
        if (level < 59)
            return 20;
        if (level < 62)
            return 21;
        if (level < 66)
            return 22;
        return 23;
    }
    function getGoldCostForPassive(level) {
        if (level == 1)
            return 7000;
        var delta = 1015, gold = 10000;
        for (var i = 2; i < level; i++) {
            gold += delta;
            delta += 30;
        }
        return gold;
    }
    function getMaterialCountFor(abilityType, level) {
        switch (abilityType) {
            case bh.AbilityType.Trait: return getMaterialCostForTrait(level);
            case bh.AbilityType.Active: return getMaterialCostForActive(level);
            case bh.AbilityType.Passive: return getMaterialCostForPassive(level);
        }
    }
    bh.getMaterialCountFor = getMaterialCountFor;
    function getMaterialCountForRange(abilityType, from, to) {
        var count = 0;
        for (var i = from + 1, l = to + 1; i < l; i++) {
            count += getMaterialCountFor(abilityType, i);
        }
        return count;
    }
    bh.getMaterialCountForRange = getMaterialCountForRange;
    function getGoldCostFor(abilityType, level) {
        switch (abilityType) {
            case bh.AbilityType.Trait: return getGoldCostForTrait(level);
            case bh.AbilityType.Active: return getGoldCostForActive(level);
            case bh.AbilityType.Passive: return getGoldCostForPassive(level);
        }
    }
    bh.getGoldCostFor = getGoldCostFor;
    function getGoldCostForRange(abilityType, from, to) {
        var count = 0;
        for (var i = from + 1, l = to + 1; i < l; i++) {
            count += getGoldCostFor(abilityType, i);
        }
        return count;
    }
    bh.getGoldCostForRange = getGoldCostForRange;
    var PlayerHeroAbility = (function () {
        function PlayerHeroAbility(playerHero, heroAbility, level) {
            this.playerHero = playerHero;
            this.heroAbility = heroAbility;
            this.level = level;
        }
        Object.defineProperty(PlayerHeroAbility.prototype, "_type", {
            get: function () {
                if (this.hero.name == "Jinx") {
                    if (this.type == bh.AbilityType.Active)
                        return bh.AbilityType.Passive;
                    if (this.type == bh.AbilityType.Passive)
                        return bh.AbilityType.Active;
                }
                return this.type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "hero", {
            get: function () { return this.heroAbility.hero; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "guid", {
            get: function () { return this.heroAbility.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "name", {
            get: function () { return this.heroAbility.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "type", {
            get: function () { return this.heroAbility.type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "isLocked", {
            get: function () { return !this.level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "isCapped", {
            get: function () { return this.level == this.levelCap; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "isMaxed", {
            get: function () { return this.level == this.levelMax; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "levelCap", {
            get: function () { return bh.HeroRepo.getAbilityLevelCap(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "levelMax", {
            get: function () { return bh.HeroRepo.getAbilityLevelMax(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "nextMaterialCount", {
            get: function () {
                return getMaterialCountFor(this._type, this.level + 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "maxMaterialCount", {
            get: function () {
                var type = this._type, max = bh.HeroRepo.getAbilityMaxLevel(this.hero, this.heroAbility.type);
                return getMaterialCountForRange(type, this.level, max);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "nextGoldCost", {
            get: function () {
                return getGoldCostFor(this._type, this.level + 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "maxGoldCost", {
            get: function () {
                var type = this._type, max = bh.HeroRepo.getAbilityMaxLevel(this.hero, this.heroAbility.type);
                return getGoldCostForRange(this._type, this.level, max);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "img", {
            get: function () {
                return bh.getImg("skills", this.playerHero.name + bh.AbilityType[this.type]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "materialHtml", {
            get: function () {
                var _this = this;
                var player = this.playerHero.player, item = this.type == bh.AbilityType.Trait ? player.inventory.find(function (item) { return item.isRune && item.name.startsWith(_this.hero.name); })
                    : player.inventory.find(function (item) { return item.isCrystal && item.elementType == _this.playerHero.elementType; }), owned = item.count, color = owned < this.maxMaterialCount ? "bg-danger" : "bg-success", img = this.type == bh.AbilityType.Trait ? bh.getImg("runes", this.name.replace(/\W/g, "")) : bh.getImg("crystals", bh.ElementType[this.hero.elementType]);
                return "<div>" + img + " " + item.name + " <span class=\"badge pull-right " + color + "\">" + bh.utils.formatNumber(owned) + " / " + bh.utils.formatNumber(this.maxMaterialCount || 0) + "</span></div>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "goldHtml", {
            get: function () {
                var gold = this.playerHero.player.gold || 0, color = gold < this.maxGoldCost ? "bg-danger" : "bg-success";
                return "<div>" + bh.getImg("misc", "Coin") + " Gold <span class=\"badge pull-right " + color + "\">" + bh.utils.formatNumber(gold) + " / " + bh.utils.formatNumber(this.maxGoldCost || 0) + "</span></div>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerHeroAbility.prototype, "powerRating", {
            get: function () {
                return bh.PowerRating.ratePlayerHeroAbility(this);
            },
            enumerable: true,
            configurable: true
        });
        PlayerHeroAbility.prototype.toRowHtml = function (needed, owned) {
            var badgeCss = needed && owned ? owned < needed ? "bg-danger" : "bg-success" : "", badgeHtml = typeof (needed) == "number" ? "<span class=\"badge pull-right " + badgeCss + "\">" + bh.utils.formatNumber(needed) + "</span>" : "";
            return "<div>" + this.img + " " + this.playerHero.name + " " + bh.AbilityType[this.type] + " " + badgeHtml + "</div>";
        };
        return PlayerHeroAbility;
    }());
    bh.PlayerHeroAbility = PlayerHeroAbility;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var PlayerInventoryItem = (function () {
        function PlayerInventoryItem(player, item, count) {
            if (count === void 0) { count = 0; }
            this.player = player;
            this.item = item;
            this.count = count;
        }
        Object.defineProperty(PlayerInventoryItem.prototype, "elementType", {
            get: function () { return this.item.elementType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "guid", {
            get: function () { return this.item.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "itemType", {
            get: function () { return this.item.itemType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "name", {
            get: function () { return this.item.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "rarityType", {
            get: function () { return this.item.rarityType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "isCrystal", {
            get: function () { return PlayerInventoryItem.isCrystal(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "isEvoJar", {
            get: function () { return PlayerInventoryItem.isEvoJar(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "isSandsOfTime", {
            get: function () { return PlayerInventoryItem.isSandsOfTime(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "isRune", {
            get: function () { return PlayerInventoryItem.isRune(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "needed", {
            get: function () {
                var _this = this;
                var needed = 0;
                if (this.isRune) {
                    var heroName = this.name.split("'")[0];
                    this.player
                        .filterHeroes(heroName)
                        .forEach(function (playerHero) { return needed += playerHero.trait.maxMaterialCount || 0; });
                    this.player
                        .filterActiveBattleCards(heroName, "Legendary")
                        .forEach(function (battleCard) { return needed += battleCard.count * 60; });
                }
                else if (this.isCrystal) {
                    this.player
                        .filterHeroes(bh.ElementType[this.elementType])
                        .forEach(function (playerHero) { return needed += (playerHero.active.maxMaterialCount || 0) + (playerHero.passive.maxMaterialCount || 0); });
                    this.player
                        .filterActiveBattleCards(bh.ElementType[this.elementType], "Legendary")
                        .forEach(function (battleCard) { return needed += battleCard.count * 60; });
                }
                else if (this.isSandsOfTime) {
                    this.player.activeBattleCards.forEach(function (playerBattleCard) { return needed += playerBattleCard.maxMaxSotNeeded; });
                }
                else {
                    var activeRecipes = this.player.activeRecipes, filtered = activeRecipes.filter(function (recipe) { return !!recipe.getItem(_this); });
                    filtered.forEach(function (recipe) { return needed += recipe.getMaxNeeded(_this); });
                }
                return needed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerInventoryItem.prototype, "rowHtml", {
            get: function () {
                var _this = this;
                var folder = bh.ItemType[this.itemType].toLowerCase() + "s", name = this.isEvoJar ? this.name.replace(/\W/g, "") : this.isCrystal ? this.name.split(/ /)[0] : bh.data.HeroRepo.find(this.name.split("'")[0]).abilities[0].name.replace(/\W/g, ""), image = bh.getImg20(folder, name), needed = this.needed, ofContent = needed ? " / " + bh.utils.formatNumber(needed) : "", color = needed ? this.count < needed ? "bg-danger" : "bg-success" : "", badge = "<span class=\"badge pull-right " + color + "\">" + bh.utils.formatNumber(this.count) + ofContent + "</span>", children = "";
                if (needed) {
                    if (this.isCrystal) {
                        this.player
                            .filterHeroes(bh.ElementType[this.elementType])
                            .forEach(function (playerHero) {
                            var active = playerHero.active, maxNeededActive, passive = playerHero.passive, maxNeededPassive;
                            if (maxNeededActive = active.maxMaterialCount) {
                                children += active.toRowHtml(maxNeededActive, _this.count);
                            }
                            if (maxNeededPassive = passive.maxMaterialCount) {
                                children += passive.toRowHtml(maxNeededPassive, _this.count);
                            }
                        });
                        this.player
                            .filterActiveBattleCards(bh.ElementType[this.elementType], "Legendary")
                            .forEach(function (battleCard) {
                            var maxNeeded = battleCard.count * bh.data.calcMaxCrystalsNeeded(battleCard.playerCard, battleCard.evoLevel);
                            children += battleCard.toRowHtml(maxNeeded, _this.count);
                        });
                    }
                    else if (this.isRune) {
                        var heroName = this.name.split("'")[0];
                        this.player
                            .filterHeroes(heroName)
                            .forEach(function (playerHero) {
                            var trait = playerHero.trait, maxNeeded;
                            if (maxNeeded = trait.maxMaterialCount) {
                                children += trait.toRowHtml(maxNeeded, _this.count);
                            }
                        });
                        this.player
                            .filterActiveBattleCards(heroName, "Legendary")
                            .forEach(function (battleCard) {
                            var maxNeeded = battleCard.count * bh.data.calcMaxRunesNeeded(battleCard.playerCard, battleCard.evoLevel);
                            children += battleCard.toRowHtml(maxNeeded, _this.count);
                        });
                    }
                    else if (this.isSandsOfTime) {
                        this.player
                            .activeBattleCards
                            .forEach(function (playerBattleCard) {
                            var maxNeeded = playerBattleCard.maxMaxSotNeeded;
                            children += playerBattleCard.toRowHtml(playerBattleCard.maxMaxSotNeeded, _this.count);
                        });
                    }
                    else {
                        var activeRecipes = this.player.activeRecipes, filtered = activeRecipes.filter(function (recipe) { var recipeItem = recipe.getItem(_this); return recipeItem && recipeItem.max != 0; });
                        filtered.forEach(function (recipe) {
                            var maxNeeded = recipe.getMaxNeeded(_this);
                            children += recipe.card.toRowHtml(maxNeeded, _this.count);
                        });
                    }
                }
                return "<div data-element-type=\"" + this.elementType + "\" data-rarity-type=\"" + this.rarityType + "\" data-item-type=\"" + this.itemType + "\" data-hud=\"" + this.isSandsOfTime + "\">" + renderExpandable(this.guid, image + " " + this.name + " " + badge, children) + "</div>";
            },
            enumerable: true,
            configurable: true
        });
        PlayerInventoryItem.isCrystal = function (item) { return item && item.itemType === bh.ItemType.Crystal; };
        PlayerInventoryItem.isEvoJar = function (item) { return item && item.itemType === bh.ItemType.EvoJar; };
        PlayerInventoryItem.isSandsOfTime = function (item) { return item && item.name === "Sands of Time"; };
        PlayerInventoryItem.isRune = function (item) { return item && item.itemType === bh.ItemType.Rune; };
        PlayerInventoryItem.toRowHtml = function (item, count, needed) {
            var folder = bh.ItemType[item.itemType].toLowerCase() + "s", name = PlayerInventoryItem.isEvoJar(item) ? item.name.replace(/\W/g, "") : PlayerInventoryItem.isCrystal(item) ? item.name.split(/ /)[0] : bh.data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name.replace(/\W/g, ""), image = bh.getImg20(folder, name), color = count < needed ? "bg-danger" : "bg-success", badge = "<span class=\"badge pull-right " + color + "\">" + bh.utils.formatNumber(count) + " / " + bh.utils.formatNumber(needed) + "</span>";
            return "<div>" + image + " " + item.name + " " + badge + "</div>";
        };
        return PlayerInventoryItem;
    }());
    bh.PlayerInventoryItem = PlayerInventoryItem;
    function renderExpandable(guid, text, children) {
        if (!children)
            return "<div>" + text + "</div>";
        var expander = "<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-button\" type=\"button\" data-action=\"toggle-child\" data-guid=\"" + guid + "\">[+]</button>", expandable = "<div class=\"brain-hud-child-scroller\" data-parent-guid=\"" + guid + "\">" + children + "</div>";
        return "<div>" + text + " " + expander + "</div>" + expandable;
    }
    bh.renderExpandable = renderExpandable;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var PlayerWildCard = (function () {
        function PlayerWildCard(player, guid) {
            this.player = player;
            this.type = "WildCard";
            this._ = bh.data.WildCardRepo.find(guid);
        }
        Object.defineProperty(PlayerWildCard.prototype, "count", {
            get: function () { return this.player._pp ? this.player._pp.wildcards[this.guid] || 0 : 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerWildCard.prototype, "guid", {
            get: function () { return this._.guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerWildCard.prototype, "html", {
            get: function () {
                var needed = this.needed, ofContent = needed ? " / " + bh.utils.formatNumber(needed) : "", css = needed ? this.count < needed ? "bg-danger" : "bg-success" : "", badge = "<span class=\"badge pull-right " + css + "\">" + this.count + ofContent + "</span>";
                return bh.getImg("cardtypes", "WildCard") + " " + this.name + " WC " + badge;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerWildCard.prototype, "name", {
            get: function () { return this._.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerWildCard.prototype, "needed", {
            get: function () {
                var needed = 0;
                this.player
                    .filterActiveBattleCards(bh.RarityType[this.rarityType])
                    .forEach(function (playerBattleCard) { return needed += playerBattleCard.maxWildCardsNeeded; });
                return needed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerWildCard.prototype, "rarityType", {
            get: function () { return bh.RarityType[this._.name.replace(/ /g, "")]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerWildCard.prototype, "rowHtml", {
            get: function () {
                var _this = this;
                var html = this.html, expander = "", children = "";
                if (this.needed) {
                    expander = "<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-button\" type=\"button\" data-action=\"toggle-child\" data-guid=\"" + this.guid + "\">[+]</button>";
                    children = "<div class=\"brain-hud-child-scroller\" data-parent-guid=\"" + this.guid + "\">";
                    this.player
                        .filterActiveBattleCards(bh.RarityType[this.rarityType])
                        .forEach(function (playerBattleCard) { return children += playerBattleCard.toRowHtml(playerBattleCard.maxWildCardsNeeded, _this.count); });
                    children += "</div>";
                }
                return "<div data-type=\"" + this.type + "\" data-rarity-type=\"" + this.rarityType + "\"><div>" + html + " " + expander + "</div>" + children + "</div>";
            },
            enumerable: true,
            configurable: true
        });
        PlayerWildCard.toRowHtml = function (wc, count, needed) {
            var image = bh.getImg20("cardtypes", "WildCard"), color = count < needed ? "bg-danger" : "bg-success", badge = "<span class=\"badge pull-right " + color + "\">" + bh.utils.formatNumber(count) + " / " + bh.utils.formatNumber(needed) + "</span>";
            return "<div>" + image + " " + wc.name + " WC " + badge + "</div>";
        };
        return PlayerWildCard;
    }());
    bh.PlayerWildCard = PlayerWildCard;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var RarityEvolutions = { Common: 1, Uncommon: 2, Rare: 3, SuperRare: 4, Legendary: 5 };
    var RarityLevels = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 50 };
    var RarityMultipliers = { Common: 10, Uncommon: 20, Rare: 35, SuperRare: 50, Legendary: 60 };
    var MinMaxType;
    (function (MinMaxType) {
        MinMaxType[MinMaxType["Min"] = 0] = "Min";
        MinMaxType[MinMaxType["Max"] = 1] = "Max";
    })(MinMaxType = bh.MinMaxType || (bh.MinMaxType = {}));
    var PowerRating = (function () {
        function PowerRating() {
        }
        PowerRating.rateMaxedHero = function (hero, maxRarity) {
            if (maxRarity === void 0) { maxRarity = bh.RarityType.Legendary; }
            var abilities = hero.name == "Jinx" ? 45 : 55, maxRarityMultiplier = (maxRarity + 1) * 20 / 100;
            return abilities * maxRarityMultiplier + PowerRating.rateMaxedDeck(hero, maxRarity);
        };
        PowerRating.rateMaxedDeck = function (hero, maxRarity) {
            if (maxRarity === void 0) { maxRarity = bh.RarityType.Legendary; }
            var heroCards = bh.Hero.filterCardsByHero(hero, bh.data.BattleCardRepo.all).filter(function (c) { return c.rarityType <= maxRarity; }), ratedCards = heroCards.map(function (card) { return { card: card, powerRating: PowerRating.rateBattleCard(card, MinMaxType.Max) }; }), sortedCards = ratedCards.sort(function (a, b) { return a.powerRating == b.powerRating ? 0 : a.powerRating < b.powerRating ? 1 : -1; }), topCards = [];
            sortedCards.forEach(function (card) {
                var existing = topCards.find(function (c) { return c.card.name == card.card.name; });
                if (existing) {
                    if (existing.card.rarityType == bh.RarityType.SuperRare && card.card.rarityType == bh.RarityType.Legendary) {
                        topCards = topCards.filter(function (c) { return c != existing; });
                        topCards.push(card);
                    }
                }
                else if (topCards.length < 4) {
                    topCards.push(card);
                }
            });
            return topCards.reduce(function (score, card) { return score + card.powerRating * 2; }, 0);
        };
        PowerRating.rateDeck = function (deck) {
            var rated = deck.reduce(function (out, card) { out[card.playerCard.configId] = PowerRating.ratePlayerCard(card.playerCard); return out; }, {}), cycleCards = deck.filter(function (card) { return bh.BattleCardRepo.isCycleCard(card, card.evo); }), cycleCount = cycleCards.length, cards = deck.filter(function (card) { return !cycleCards.includes(card); });
            return deck.reduce(function (score, pbc) { return score + PowerRating.ratePlayerCard(pbc.playerCard) * pbc.count; }, 0);
        };
        PowerRating.rateBattleCard = function (battleCard, minMax) {
            var key = bh.RarityType[battleCard.rarityType], evo = minMax == MinMaxType.Max ? RarityEvolutions[key] : 0, level = minMax == MinMaxType.Max ? RarityLevels[key] : 0;
            return PowerRating.ratePlayerCard({ configId: battleCard.guid, evolutionLevel: evo, level: level - 1 });
        };
        PowerRating.rateAndSort = function (cards, minMax) {
            if (minMax === void 0) { minMax = MinMaxType.Max; }
            var rated = cards.map(function (card) { return { card: card, powerRating: PowerRating.rateBattleCard(card, minMax) }; });
            rated.sort(function (a, b) { return b.powerRating - a.powerRating; });
            return rated;
        };
        PowerRating.ratePlayerCard = function (playerCard) {
            return ratePlayerCard(playerCard);
        };
        PowerRating.ratePlayerHeroAbility = function (playerHeroAbility) {
            if (playerHeroAbility.hero.name == "Jinx" && playerHeroAbility.heroAbility.type == bh.AbilityType.Passive)
                return 0;
            var mult = playerHeroAbility.type == bh.AbilityType.Trait ? 2 : playerHeroAbility.type == bh.AbilityType.Active ? 1.5 : 1;
            return mult * Math.round(1000 * playerHeroAbility.level / playerHeroAbility.levelMax) / 100;
        };
        PowerRating.ratePlayerHeroHitPoints = function (playerHero) {
            var maxHeroLevel = bh.HeroRepo.MaxLevel, maxHP = bh.data.HeroRepo.all.map(function (h) { return [bh.Hero.getHitPoints(h, maxHeroLevel), h]; }).sort().pop()[0], heroMultiplier = bh.Hero.getHitPoints(playerHero.hero, maxHeroLevel) / maxHP, levelMultiplier = playerHero.level / maxHeroLevel;
            return Math.round(1000 * heroMultiplier * levelMultiplier) / 100;
        };
        return PowerRating;
    }());
    bh.PowerRating = PowerRating;
    function ratePlayerCard(playerCard) {
        var card = bh.data.BattleCardRepo.find(playerCard.configId), evoLevel = playerCard.evolutionLevel, level = playerCard.level, perkMultiplier = bh.BattleCardRepo.getPerk(card, evoLevel) / 100, targets = card.typesTargets.map(function (typeTarget) { return bh.PlayerBattleCard.parseTarget(typeTarget); }), gameEffects = bh.GameEffect.parseAll(playerCard), rating = 0;
        targets.forEach(function (target, typeIndex) { return rating += calcValue(card, typeIndex, evoLevel, level) / target.typeDivisor; });
        gameEffects.forEach(function (gameEffect) { return rating += gameEffect.powerRating; });
        rating /= card.turns;
        return Math.round(100 * rating);
    }
    function calcValue(card, typeIndex, evo, level) {
        var baseValue = bh.BattleCardRepo.calculateValue({ configId: card.guid, evolutionLevel: evo, level: level }), perkMultiplier = bh.BattleCardRepo.getPerk(card, evo) / 100, regenMultiplier = (bh.GameEffect.parse(card.effects.find(function (e) { return e == "Regen"; })) || { turns: 1 }).turns, critMultiplier = card.perks.includes("Critical") ? 1.5 * perkMultiplier : 1, target = bh.PlayerBattleCard.parseTarget(card.typesTargets[typeIndex]), value = Math.round(baseValue * critMultiplier * target.targetMultiplier * regenMultiplier);
        if (target.flurry) {
            value = value / target.flurryCount * target.flurryHitMultiplier * target.flurryCount;
        }
        if (!value)
            console.log(card.name, [card, typeIndex, evo, level, baseValue, perkMultiplier, critMultiplier, target, value]);
        return value;
    }
})(bh || (bh = {}));
function rateCards(max) {
    if (max === void 0) { max = true; }
    var cards = bh.data.BattleCardRepo.all;
    var scores = cards.map(function (card) {
        var playerCard = { configId: card.guid };
        playerCard.evolutionLevel = max ? card.rarityType : 0;
        playerCard.level = max ? bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1 : 0;
        return { card: card, powerRating: bh.PowerRating.ratePlayerCard(playerCard) };
    });
    scores.sort(function (a, b) { return b.powerRating - a.powerRating; });
    $("textarea").val(scores.map(function (s, i) { return (i + 1) + ": " + s.powerRating + " - " + bh.RarityType[s.card.rarityType][0] + " " + s.card.name; }).join("\n"));
    return scores;
}
var bh;
(function (bh) {
    var Recipe = (function (_super) {
        __extends(Recipe, _super);
        function Recipe(card, partial) {
            if (partial === void 0) { partial = false; }
            var _this = _super.call(this) || this;
            _this.card = card;
            _this.evos = [];
            var matItems = (card && card.mats || [])
                .map(function (mat) { return bh.data.ItemRepo.find(mat.trim()); }).filter(function (item) { return !!item; })
                .sort(bh.utils.sort.byRarity);
            [0, 1, 2, 3, 4]
                .slice(0, card.rarityType + 1)
                .slice(partial ? card.evo : 0)
                .forEach(function (evoFrom) {
                var sands = bh.ItemRepo.sandsOfTime;
                _this.addItem(evoFrom, bh.data.getMinSotNeeded(card.rarityType, evoFrom), bh.data.getMaxSotNeeded(card.rarityType, evoFrom), sands.name);
                matItems.forEach(function (item) {
                    _this.addItem(evoFrom, 0, bh.data.getMaxMatNeeded(card.rarityType, evoFrom, item.rarityType), item.name);
                });
            });
            return _this;
        }
        Object.defineProperty(Recipe.prototype, "lower", {
            get: function () { return this.card.lower; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "name", {
            get: function () { return this.card.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "rarityType", {
            get: function () { return this.card.rarityType; },
            enumerable: true,
            configurable: true
        });
        Recipe.prototype.addItem = function (evoFrom, min, max, itemName) {
            var evo = this.evos[evoFrom] || (this.evos[evoFrom] = { evoFrom: evoFrom, evoTo: evoFrom + 1, items: [] }), evoItem = { item: bh.data.ItemRepo.find(itemName), min: min, max: max };
            evo.items.push(evoItem);
        };
        Object.defineProperty(Recipe.prototype, "common", {
            get: function () {
                var _this = this;
                return this.fromCache("common", function () {
                    var recipeItem = _this.all.find(function (item) { return item.item.rarityType == bh.RarityType.Common; });
                    return recipeItem && recipeItem.item;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "uncommon", {
            get: function () {
                var _this = this;
                return this.fromCache("uncommon", function () {
                    var recipeItem = _this.all.find(function (item) { return item.item.rarityType == bh.RarityType.Uncommon && item.item.name != "Sands of Time"; });
                    return recipeItem && recipeItem.item;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "rare", {
            get: function () {
                var _this = this;
                return this.fromCache("rare", function () {
                    var recipeItem = _this.all.find(function (item) { return item.item.rarityType == bh.RarityType.Rare; });
                    return recipeItem && recipeItem.item;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "superRare", {
            get: function () {
                var _this = this;
                return this.fromCache("superRare", function () {
                    var recipeItem = _this.all.find(function (item) { return item.item.rarityType == bh.RarityType.SuperRare; });
                    return recipeItem && recipeItem.item;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "inventoryItems", {
            get: function () {
                return [this.common, this.uncommon, this.rare, this.superRare];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Recipe.prototype, "all", {
            get: function () {
                var _this = this;
                return this.fromCache("recipeItems", function () {
                    var items = [];
                    _this.evos.forEach(function (evo) {
                        evo.items.forEach(function (recipeItem) {
                            var item = items.find(function (item) { return item.item == recipeItem.item; });
                            if (!item) {
                                items.push(item = { item: recipeItem.item, min: 0, max: 0 });
                            }
                            item.min += recipeItem.min;
                            item.max += recipeItem.max;
                        });
                    });
                    return items;
                });
            },
            enumerable: true,
            configurable: true
        });
        Recipe.prototype.getItem = function (item) {
            return this.all.find(function (recipeItem) { return recipeItem.item.name == item.name; });
        };
        Recipe.prototype.getMaxNeeded = function (item) {
            var recipeItem = this.getItem(item), max = recipeItem && recipeItem.max, multiplier = this.card instanceof bh.PlayerBattleCard ? this.card.count : 1;
            return max * multiplier;
        };
        return Recipe;
    }(bh.Cacheable));
    bh.Recipe = Recipe;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var Repo = (function () {
        function Repo(id, gid, cacheable) {
            if (id === void 0) { id = ""; }
            if (gid === void 0) { gid = 0; }
            if (cacheable === void 0) { cacheable = false; }
            this.id = id;
            this.gid = gid;
            this.cacheable = cacheable;
            Repo.AllRepos.push(this);
        }
        Repo.prototype.init = function () {
            var _this = this;
            if (!this._init) {
                this._init = new Promise(function (resolvefn) {
                    var tsv = (bh.TSV || {})[String(_this.gid || _this.id)];
                    if (!tsv && _this.cacheable) {
                        try {
                            var cache = JSON.parse(bh.utils.getFromStorage(_this.id + "-" + _this.gid) || null);
                            if (cache && cache.date && (new Date().getTime() < cache.date + 1000 * 60 * 60 * 24)) {
                                tsv = cache.tsv || null;
                            }
                        }
                        catch (ex) { }
                    }
                    if (tsv) {
                        _this.resolveTsv(tsv, resolvefn);
                    }
                    else if (typeof (_this.gid) == "number") {
                        Repo.fetchTsv(_this.id, _this.gid).then(function (tsv) { return _this.resolveTsv(tsv, resolvefn); }, function () { return _this.unresolveTsv(); });
                    }
                    else {
                        resolvefn(_this.data = []);
                    }
                });
            }
            return this._init;
        };
        Repo.prototype.resolveTsv = function (tsv, resolvefn) {
            var _this = this;
            if (this.cacheable) {
                try {
                    bh.utils.setToStorage(this.id + "-" + this.gid, JSON.stringify({ tsv: tsv, date: new Date().getTime() }));
                }
                catch (ex) { }
            }
            var parsed = this.parseTsv(tsv);
            if (parsed instanceof Promise) {
                parsed.then(function (data) { return resolvefn(data); }, function () { return _this.unresolveTsv(); });
            }
            else {
                resolvefn(parsed);
            }
        };
        Repo.prototype.unresolveTsv = function () {
            this.data = [];
        };
        Repo.prototype.parseTsv = function (tsv) {
            return this.data = Repo.mapTsv(tsv);
        };
        Object.defineProperty(Repo.prototype, "all", {
            get: function () {
                return this.data.slice();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Repo.prototype, "allSortedByName", {
            get: function () {
                if (!this.sortedByName) {
                    this.sortedByName = this.all.sort(bh.utils.sort.byName);
                }
                return this.sortedByName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Repo.prototype, "length", {
            get: function () {
                return this.data.length;
            },
            enumerable: true,
            configurable: true
        });
        Repo.prototype.find = function (value) {
            var lower = value.toLowerCase();
            return this.data.find(function (t) { return t.guid == value || t.name == value || t.lower == lower; });
        };
        Repo.prototype.put = function (value) {
            var index = this.data.findIndex(function (t) { return t.guid == value.guid; });
            if (-1 < index) {
                this.data[index] = value;
            }
            else {
                this.data.push(value);
            }
        };
        Repo.fetchTsv = function (idOrGid, gidOrUndefined) {
            var id = typeof (gidOrUndefined) == "number" ? idOrGid : null, gid = typeof (gidOrUndefined) == "number" ? gidOrUndefined : idOrGid;
            if ((bh.TSV || {})[String(gid)]) {
                return Promise.resolve(bh.TSV[String(gid)]);
            }
            return XmlHttpRequest.get(bh.host + "/tsv.php?gid=" + gid + (id ? "&id=" + id : ""));
        };
        Repo.mapTsv = function (raw) {
            var lines = raw.split(/\n/), keys = lines.shift().split(/\t/).map(function (s) { return s.trim(); });
            return lines
                .filter(function (line) { return !!line.trim().length; })
                .map(function (line) {
                var values = line.split(/\t/).map(function (s) { return s.trim(); }), object = {};
                keys.forEach(function (key, index) {
                    var value = values[index];
                    switch (key) {
                        case "elementTypes":
                        case "crystalElementTypes":
                        case "boosterElementTypes":
                            object[key] = value.split(",").filter(function (s) { return !!s; }).map(function (s) { return bh.ElementRepo.findType(s); });
                            break;
                        case "element":
                        case "elementType":
                            object["elementType"] = bh.ElementRepo.findType(value);
                            break;
                        case "rarity":
                        case "rarityType":
                            object["rarityType"] = bh.RarityRepo.findType(value);
                            break;
                        case "klass":
                        case "klassType":
                            object["klassType"] = bh.KlassRepo.findType(value);
                            break;
                        case "itemType":
                            object["itemType"] = bh.ItemRepo.findType(value);
                            break;
                        case "abilityType":
                            object["abilityType"] = bh.AbilityRepo.findType(value);
                            break;
                        case "brag":
                        case "packs":
                            object[key] = bh.utils.parseBoolean(value);
                            break;
                        case "randomMats":
                            object[key] = value.split(",").map(function (s) { return +s; });
                            break;
                        case "boosterRarities":
                        case "minValues":
                            object[key] = value.split("|").map(function (s) { return s.split(",").map(function (s) { return +s; }); });
                            break;
                        case "maxValues":
                            object[key] = value.split("|").map(function (s) { return +s; });
                            break;
                        case "typesTargets":
                            object[key] = value.split("|").filter(function (s) { return !!s; });
                            break;
                        case "runeHeroes":
                        case "effects":
                        case "mats":
                        case "perks":
                            object[key] = value.split(",").filter(function (s) { return !!s; });
                            break;
                        case "keys":
                        case "fame":
                        case "gold":
                        case "perkBase":
                        case "turns":
                            object[key] = +value;
                            break;
                        case "name":
                            object["lower"] = value.toLowerCase();
                            object[key] = (value || "").trim();
                            break;
                        default:
                            object[key] = (value || "").trim();
                            break;
                    }
                });
                return object;
            });
        };
        Repo.init = function () {
            return Repo.AllRepos.map(function (repo) { return repo.init(); });
        };
        Repo.AllRepos = [];
        return Repo;
    }());
    bh.Repo = Repo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var AbilityRepo = (function () {
        function AbilityRepo() {
        }
        Object.defineProperty(AbilityRepo, "allTypes", {
            get: function () {
                return [0, 1, 2];
            },
            enumerable: true,
            configurable: true
        });
        AbilityRepo.isAbility = function (ability) {
            return String(ability).replace(/ /g, "") in bh.AbilityType;
        };
        AbilityRepo.findType = function (value) {
            return this.allTypes.find(function (abilityType) { return value[0] == bh.AbilityType[abilityType][0]; });
        };
        return AbilityRepo;
    }());
    bh.AbilityRepo = AbilityRepo;
})(bh || (bh = {}));
var _allHastes = [];
var bh;
(function (bh) {
    var BattleCardRepo = (function (_super) {
        __extends(BattleCardRepo, _super);
        function BattleCardRepo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BattleCardRepo.isCycleCard = function (card, evo) {
            if (evo === void 0) { evo = card.rarityType + 1; }
            card.effects.concat(card.perks).filter(function (e) { return e.toLowerCase().includes("haste") || e.toLowerCase().includes("speed"); }).forEach(function (e) { return _allHastes.push(card.name + " (" + bh.RarityType[card.rarityType][0] + "): " + e); });
            if (card.turns != 1)
                return false;
            if (card.effects.find(function (e) { return e == "Haste 1T"; }))
                return true;
            var perk = card.perks.find(function (p) { return p == "Haste 1T"; });
            if (perk && BattleCardRepo.getPerk(card, evo) == 100)
                return true;
            return false;
        };
        BattleCardRepo.getPerk = function (card, evo) {
            return Math.min(100, card.perkBase + BattleCardRepo.AddedPerkPerEvo * evo);
        };
        BattleCardRepo.getMaxPerk = function (card) {
            return BattleCardRepo.getPerk(card, 1 + card.rarityType);
        };
        BattleCardRepo.calculateValue = function (playerCard, typeIndex) {
            if (typeIndex === void 0) { typeIndex = 0; }
            var card = bh.data.BattleCardRepo.find(playerCard.configId);
            if (!card)
                return 0;
            var min = card.minValues[typeIndex][playerCard.evolutionLevel], deltaMin = card.minValues[typeIndex].slice().pop(), deltaMax = card.maxValues[typeIndex], delta = (deltaMax - deltaMin) / (bh.BattleCardRepo.getLevelsForRarity(card.rarityType) - 1);
            return Math.floor(min + delta * playerCard.level);
        };
        BattleCardRepo.getLevelsForRarity = function (rarityType) {
            return [10, 20, 35, 50, 50][rarityType];
        };
        BattleCardRepo.isMaxLevel = function (rarity, level) {
            return level == BattleCardRepo.getLevelsForRarity(bh.RarityRepo.findType(rarity));
        };
        BattleCardRepo.getXpDeltaFromLevel = function (level) {
            return level ? (level - 1) * 36 + 100 : 0;
        };
        BattleCardRepo.getXpForLevel = function (level) {
            var xp = 0;
            for (var i = 1; i < level; i++) {
                xp += BattleCardRepo.getXpDeltaFromLevel(i);
            }
            return xp;
        };
        BattleCardRepo.getXpValue = function (card) {
            switch (card.rarityType) {
                case bh.RarityType.Common: return 400;
                case bh.RarityType.Uncommon: return 700;
                case bh.RarityType.Rare: return 1200;
                case bh.RarityType.SuperRare: return 0;
                case bh.RarityType.Legendary: return 0;
                default: return 0;
            }
        };
        BattleCardRepo.AddedPerkPerEvo = 10;
        return BattleCardRepo;
    }(bh.Repo));
    bh.BattleCardRepo = BattleCardRepo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var BoosterCardRepo = (function (_super) {
        __extends(BoosterCardRepo, _super);
        function BoosterCardRepo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoosterCardRepo.getXpValue = function (card, match) {
            if (match === void 0) { match = false; }
            var multiplier = match ? 1.5 : 1;
            switch (card.rarityType) {
                case bh.RarityType.Common: return 120 * multiplier;
                case bh.RarityType.Uncommon: return 220 * multiplier;
                case bh.RarityType.Rare: return 350 * multiplier;
                case bh.RarityType.SuperRare: return 700 * multiplier;
                default: return 0;
            }
        };
        return BoosterCardRepo;
    }(bh.Repo));
    bh.BoosterCardRepo = BoosterCardRepo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var DungeonRepo = (function (_super) {
        __extends(DungeonRepo, _super);
        function DungeonRepo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DungeonRepo.prototype.parseTsv = function (tsv) {
            var data = bh.Repo.mapTsv(tsv);
            data.forEach(function (dungeon) {
                dungeon.guid = dungeon.lower.replace(/\W/g, "-");
                if (!Array.isArray(dungeon.crystals)) {
                    dungeon.crystals = String(dungeon.crystals).split(",").filter(function (c) { return !!c; });
                }
                if (!Array.isArray(dungeon.mats)) {
                    dungeon.mats = String(dungeon.mats).split(",").filter(function (m) { return !!m; });
                }
                if (!Array.isArray(dungeon.runes)) {
                    dungeon.runes = String(dungeon.runes).split(",").filter(function (r) { return !!r; });
                }
            });
            return this.data = data.map(function (d) { return new bh.Dungeon(d); });
        };
        DungeonRepo.prototype.findDungeonFor = function (value) {
            return this.all.filter(function (dungeon) { return !!dungeon.findDrop(value); });
        };
        DungeonRepo.prototype.getDropRates = function (value) {
            return this.all
                .map(function (dungeon) { return dungeon.findDrop(value); })
                .filter(function (drop) { return !!drop; })
                .sort(sortDropRates)
                .reverse();
        };
        return DungeonRepo;
    }(bh.Repo));
    bh.DungeonRepo = DungeonRepo;
    function sortDropRates(a, b) {
        var aPerKey = a.dropRate.averagePerKey, bPerKey = b.dropRate.averagePerKey;
        if (aPerKey != bPerKey)
            return aPerKey < bPerKey ? -1 : 1;
        var aKeys = a.dungeon.keys, bKeys = b.dungeon.keys;
        if (aKeys != bKeys)
            return aKeys < bKeys ? 1 : -1;
        var aDiff = a.dungeon.difficulty == "Normal" ? 0 : a.dungeon.difficulty == "Elite" ? 1 : 2, bDiff = b.dungeon.difficulty == "Normal" ? 0 : b.dungeon.difficulty == "Elite" ? 1 : 2;
        if (aDiff != bDiff)
            return aDiff < bDiff ? 1 : -1;
        return 0;
    }
})(bh || (bh = {}));
var bh;
(function (bh) {
    var EffectRepo = (function (_super) {
        __extends(EffectRepo, _super);
        function EffectRepo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EffectRepo.prototype.parseTsv = function (tsv) {
            this.data = bh.Repo.mapTsv(tsv);
            this.data.forEach(function (effect) { return effect.guid = effect.lower.replace(/\W/g, "-"); });
            return this.data;
        };
        EffectRepo.prototype.find = function (value) {
            var lower = value.toLowerCase();
            return this.data.find(function (t) { return t.lower == lower || (t.alt || "").toLowerCase() == lower; });
        };
        EffectRepo.mapEffects = function (card) {
            var effects = [];
            card.effects.forEach(function (effect) {
                mapTargetOrEffectOrPerk(effect).forEach(function (item) {
                    if (!effects.includes(item))
                        effects.push(item);
                });
            });
            return effects;
        };
        EffectRepo.mapPerks = function (card) {
            var perks = [];
            card.perks.forEach(function (perk) {
                mapTargetOrEffectOrPerk(perk).forEach(function (item) {
                    if (!perks.includes(item))
                        perks.push(item);
                });
            });
            return perks;
        };
        EffectRepo.mapTargets = function (card) {
            var targets = [];
            card.typesTargets.forEach(function (target) {
                mapTargetOrEffectOrPerk(target).forEach(function (item) {
                    if (!targets.includes(item))
                        targets.push(item);
                });
            });
            return targets;
        };
        EffectRepo.toImage = function (effect, fn) {
            if (fn === void 0) { fn = bh.getImg20; }
            return ["Self", "Single"].includes(effect.name) ? "" : fn("effects", effect.name.replace(/\W/g, ""));
        };
        EffectRepo.toImageSrc = function (effect) {
            return ["Self", "Single"].includes(effect.name) ? "" : bh.getSrc("effects", effect.name.replace(/\W/g, ""));
        };
        return EffectRepo;
    }(bh.Repo));
    bh.EffectRepo = EffectRepo;
    function mapTargetOrEffectOrPerk(item) {
        var gameEffect = bh.GameEffect.parse(item), effect = gameEffect && bh.data.EffectRepo.find(gameEffect.effect) || null, effects = effect ? [effect] : [];
        if (gameEffect) {
            if (gameEffect.raw.includes("All Allies"))
                effects.push(bh.data.EffectRepo.find("Multi-Target (Ally)"));
            if (gameEffect.raw.includes("All Enemies"))
                effects.push(bh.data.EffectRepo.find("Multi-Target (Enemy)"));
            if (gameEffect.raw.includes("Flurry"))
                effects.push(bh.data.EffectRepo.find("Flurry"));
        }
        return effects;
    }
})(bh || (bh = {}));
var bh;
(function (bh) {
    var ElementRepo = (function () {
        function ElementRepo() {
        }
        Object.defineProperty(ElementRepo, "allTypes", {
            get: function () {
                return [0, 1, 2, 3, 4, 5];
            },
            enumerable: true,
            configurable: true
        });
        ElementRepo.toImage = function (elementType, fn) {
            if (fn === void 0) { fn = bh.getImg20; }
            return elementType == bh.ElementType.Neutral ? "" : fn("elements", bh.ElementType[elementType]);
        };
        ElementRepo.toImageSrc = function (elementType) {
            return bh.getSrc("elements", bh.ElementType[elementType]);
        };
        ElementRepo.isElement = function (element) {
            return String(element) in bh.ElementType;
        };
        ElementRepo.findType = function (value) {
            var type = this.allTypes.find(function (elementType) { return value[0] == bh.ElementType[elementType][0]; });
            if (type === null)
                console.log(value);
            return type;
        };
        return ElementRepo;
    }());
    bh.ElementRepo = ElementRepo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var HeroRepo = (function (_super) {
        __extends(HeroRepo, _super);
        function HeroRepo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HeroRepo.prototype.parseTsv = function (tsv) {
            var _this = this;
            return new Promise(function (resolvefn) {
                var mapped = bh.Repo.mapTsv(tsv), heroes = [];
                while (mapped.length) {
                    heroes.push(new bh.Hero([mapped.shift(), mapped.shift(), mapped.shift()]));
                }
                resolvefn(_this.data = heroes);
            });
        };
        HeroRepo.prototype.filterByElement = function (elementOrElementType) {
            return this.data.filter(function (hero) { return hero.elementType === elementOrElementType || bh.ElementType[hero.elementType] === elementOrElementType; });
        };
        Object.defineProperty(HeroRepo.prototype, "sorted", {
            get: function () {
                if (!this._sorted) {
                    this._sorted = this.data.slice().sort(bh.utils.sort.byElementThenKlass);
                }
                return this._sorted;
            },
            enumerable: true,
            configurable: true
        });
        HeroRepo.prototype.sortBy = function (sort) {
            if (!sort) {
                return this.sorted;
            }
            return this.data.slice().sort(sort);
        };
        HeroRepo.toImageSrc = function (hero) {
            return bh.getSrc("heroes", hero.name);
        };
        HeroRepo.getMaxLevel = function (fame) { return fame * 2; };
        HeroRepo.getMaxTrait = function (level) { return Math.max(level - 1, 0); };
        HeroRepo.getMaxActive = function (hero, level) { return hero.name == "Jinx" ? Math.max(level - 29, 0) : Math.max(level - 14, 0); };
        HeroRepo.getMaxPassive = function (hero, level) { return hero.name == "Jinx" ? Math.max(level - 14, 0) : Math.max(level - 29, 0); };
        HeroRepo.getAbilityLevelCap = function (playerHeroAbility) {
            switch (playerHeroAbility.type) {
                case bh.AbilityType.Active: return HeroRepo.getMaxActive(playerHeroAbility.hero, playerHeroAbility.playerHero.level);
                case bh.AbilityType.Passive: return HeroRepo.getMaxPassive(playerHeroAbility.hero, playerHeroAbility.playerHero.level);
                case bh.AbilityType.Trait: return HeroRepo.getMaxTrait(playerHeroAbility.playerHero.level);
            }
        };
        HeroRepo.getAbilityLevelMax = function (playerHeroAbility) {
            switch (playerHeroAbility.type) {
                case bh.AbilityType.Active: return HeroRepo.getMaxActive(playerHeroAbility.hero, HeroRepo.MaxLevel);
                case bh.AbilityType.Passive: return HeroRepo.getMaxPassive(playerHeroAbility.hero, HeroRepo.MaxLevel);
                case bh.AbilityType.Trait: return HeroRepo.getMaxTrait(HeroRepo.MaxLevel);
            }
        };
        Object.defineProperty(HeroRepo, "MaxHeroCount", {
            get: function () { return MaxHeroCount; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroRepo, "MaxFame", {
            get: function () { return MaxFameLevel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroRepo, "MaxLevel", {
            get: function () { return HeroRepo.getMaxLevel(HeroRepo.MaxFame); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroRepo, "MaxCompletionLevel", {
            get: function () {
                var maxLevel = HeroRepo.MaxLevel, hero = {};
                return maxLevel + HeroRepo.getMaxTrait(maxLevel) + HeroRepo.getMaxActive(hero, maxLevel) + HeroRepo.getMaxPassive(hero, maxLevel);
            },
            enumerable: true,
            configurable: true
        });
        HeroRepo.getAbilityMaxLevel = function (hero, abilityType) {
            switch (abilityType) {
                case bh.AbilityType.Active: return HeroRepo.getMaxActive(hero, HeroRepo.MaxLevel);
                case bh.AbilityType.Passive: return HeroRepo.getMaxPassive(hero, HeroRepo.MaxLevel);
                case bh.AbilityType.Trait: return HeroRepo.getMaxTrait(HeroRepo.MaxLevel);
            }
        };
        HeroRepo.getLockedArchetype = function (playerGuid, heroGuid) {
            return {
                "playerId": playerGuid,
                "id": heroGuid,
                "experience": 0,
                "level": 0,
                "version": 0,
                "abilityLevels": {},
                "deck": [],
                "locked": true
            };
        };
        return HeroRepo;
    }(bh.Repo));
    bh.HeroRepo = HeroRepo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var ItemRepo = (function (_super) {
        __extends(ItemRepo, _super);
        function ItemRepo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ItemRepo.prototype, "evoJars", {
            get: function () {
                return this.data.filter(function (item) { return item.itemType === bh.ItemType.EvoJar; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemRepo.prototype, "crystals", {
            get: function () {
                return this.data.filter(function (item) { return item.itemType === bh.ItemType.Crystal; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemRepo.prototype, "runes", {
            get: function () {
                return this.data.filter(function (item) { return item.itemType === bh.ItemType.Rune; });
            },
            enumerable: true,
            configurable: true
        });
        ItemRepo.getValue = function (itemType, rarityType) {
            if (itemType == bh.ItemType.Crystal)
                return 1000;
            if (itemType == bh.ItemType.Rune)
                return 2000;
            return [300, 800, 1500, 3000][rarityType];
        };
        Object.defineProperty(ItemRepo, "sandsOfTime", {
            get: function () {
                return bh.data.ItemRepo.find("Sands of Time");
            },
            enumerable: true,
            configurable: true
        });
        ItemRepo.toImage = function (item, fn) {
            if (fn === void 0) { fn = bh.getImg20; }
            var folder = bh.ItemType[item.itemType].toLowerCase() + "s", name = item.itemType == bh.ItemType.EvoJar ? item.name.replace(/\W/g, "")
                : item.itemType == bh.ItemType.Crystal ? item.name.split(/ /)[0]
                    : bh.data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name.replace(/\W/g, "");
            return fn(folder, name);
        };
        ItemRepo.toImageSrc = function (item) {
            var folder = bh.ItemType[item.itemType].toLowerCase() + "s", name = item.itemType == bh.ItemType.EvoJar ? item.name.replace(/\W/g, "")
                : item.itemType == bh.ItemType.Crystal ? item.name.split(/ /)[0]
                    : bh.data.HeroRepo.find(item.name.split("'")[0]).abilities[0].name.replace(/\W/g, "");
            return bh.getSrc(folder, name);
        };
        Object.defineProperty(ItemRepo, "allTypes", {
            get: function () {
                return [0, 1, 2];
            },
            enumerable: true,
            configurable: true
        });
        ItemRepo.findType = function (value) {
            return this.allTypes.find(function (itemType) { return value[0] == bh.ItemType[itemType][0]; });
        };
        return ItemRepo;
    }(bh.Repo));
    bh.ItemRepo = ItemRepo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var KlassRepo = (function () {
        function KlassRepo() {
        }
        Object.defineProperty(KlassRepo, "allTypes", {
            get: function () {
                return [0, 1, 2];
            },
            enumerable: true,
            configurable: true
        });
        KlassRepo.toImage = function (klassType, fn) {
            if (fn === void 0) { fn = bh.getImg20; }
            return fn("classes", bh.KlassType[klassType]);
        };
        KlassRepo.toImageSrc = function (klassType) {
            return bh.getSrc("classes", bh.KlassType[klassType]);
        };
        KlassRepo.findType = function (value) {
            return this.allTypes.find(function (klassType) { return value.slice(0, 2) == bh.KlassType[klassType].slice(0, 2); });
        };
        return KlassRepo;
    }());
    bh.KlassRepo = KlassRepo;
})(bh || (bh = {}));
var bh;
(function (bh) {
    var RarityRepo = (function () {
        function RarityRepo() {
        }
        Object.defineProperty(RarityRepo, "allTypes", {
            get: function () {
                return [0, 1, 2, 3, 4];
            },
            enumerable: true,
            configurable: true
        });
        RarityRepo.isRarity = function (rarity) {
            return String(rarity).replace(/ /g, "") in bh.RarityType;
        };
        RarityRepo.findType = function (value) {
            return this.allTypes.find(function (rarityType) { return value[0] == bh.RarityType[rarityType][0]; });
        };
        return RarityRepo;
    }());
    bh.RarityRepo = RarityRepo;
})(bh || (bh = {}));
var DataSheetID = "1203v6egra6rDQShMdklVHQrPa7lfP6RaSCcqdATIEIo";
var BattleCardRepoGID = 1013492615;
var BoosterCardRepoGID = 1070164839;
var DungeonRepoGID = 1980099142;
var EffectRepoGID = 1091073205;
var HeroRepoGID = 1755919442;
var ItemRepoGID = 1250310062;
var WildCardRepoGID = 2106503523;
var GuildsGID = 496437953;
var USE_CACHE = true;
var NO_CACHE = false;
var MaxHeroCount = 13;
var MaxFameLevel = 45;
var AttackDivisor = 750;
var ShieldDivisor = 1500;
var HealDivisor = 1500;
var BattleCardDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgpt5tf178r4MJku64wjcQyK-py5KTwbeoePP4vnFQ0gEJWowglA-cGHLSQtVbpp7kb_07gLbZP1N_/pub?output=tsv";
var DungeonDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCyjBTeKjsBri_uvkFnT-i9f-jI4RUR0YffYh32XFtQfywivXktmLcmGOuXTfOQZH1sv6VTmF9Ceee/pub?gid=1815567292&single=true&output=tsv";
var bh;
(function (bh) {
    var data;
    (function (data) {
        data.BattleCardRepo = new bh.BattleCardRepo(DataSheetID, BattleCardRepoGID, NO_CACHE);
        data.BoosterCardRepo = new bh.BoosterCardRepo(DataSheetID, BoosterCardRepoGID, USE_CACHE);
        data.DungeonRepo = new bh.DungeonRepo(DataSheetID, DungeonRepoGID, NO_CACHE);
        data.EffectRepo = new bh.EffectRepo(DataSheetID, EffectRepoGID, NO_CACHE);
        data.HeroRepo = new bh.HeroRepo(DataSheetID, HeroRepoGID, USE_CACHE);
        data.ItemRepo = new bh.ItemRepo(DataSheetID, ItemRepoGID, USE_CACHE);
        data.PlayerRepo = new bh.Repo();
        data.WildCardRepo = new bh.Repo(DataSheetID, WildCardRepoGID, USE_CACHE);
        function arenaToPlayers(json) {
            var players = [];
            if (Array.isArray(json)) {
                if (json.length > 0) {
                    json.forEach(function (match) {
                        var indexKeys = Object.keys(match) || [], indexKey = indexKeys[0] || "0", playerContainer = match[indexKey], playerGuids = Object.keys(playerContainer) || [], playerGuid = playerGuids[0] || "", player = playerContainer[playerGuid] || null;
                        if (isPlayer(player))
                            players.push(player);
                    });
                }
            }
            return players;
        }
        data.arenaToPlayers = arenaToPlayers;
        function isGuildWar(json) {
            return json && json.guilds && json.currentWar && true;
        }
        data.isGuildWar = isGuildWar;
        function isGuild(json) {
            return json && json.playerGuild && json.members && true;
        }
        data.isGuild = isGuild;
        function isArena(json) {
            return arenaToPlayers(json).length && true;
        }
        data.isArena = isArena;
        function isPlayer(json) {
            return json && json.id && json.firstPlayedVersion && true;
        }
        data.isPlayer = isPlayer;
        function isGuildMembers(json) {
            return json && Array.isArray(json) && !json.map(isGuildPlayer).includes(false);
        }
        data.isGuildMembers = isGuildMembers;
        function isGuildPlayer(json) {
            return json && json.playerId && json.archetypeLevels && true || false;
        }
        data.isGuildPlayer = isGuildPlayer;
        var _init;
        function init() {
            if (!_init) {
                _init = Promise.all([data.guilds.init()].concat(bh.Repo.init()));
            }
            return _init;
        }
        data.init = init;
    })(data = bh.data || (bh.data = {}));
})(bh || (bh = {}));
function numToRoman(num) {
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
    $.get(DungeonDataUrl).then(function (raw) {
        var mapped = bh.Repo.mapTsv(raw), columns = Object.keys(mapped[0]), dungeons = mapped.map(function (d) {
            var name = d["Dungeon"] + " " + d["Difficulty"] + " " + numToRoman(d["Level"]), dungeon = bh.data.DungeonRepo.find(name).data;
            if (!dungeon) {
                dungeon = {};
                dungeon.guid = name.replace(/\W/g, "-");
                dungeon.name = name;
                dungeon.dungeon = d["Dungeon"];
                dungeon.difficulty = d["Difficulty"];
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
                .filter(function (c) { return !!d[c.name]; })
                .map(function (c) { return c.name.split(/\W/)[0] + "|" + d[c.name].replace(/\s+/g, "").replace(",", "|"); });
            dungeon.mats = bh.data.ItemRepo.evoJars
                .filter(function (item) { return !!d[item.name]; })
                .map(function (item) { return item.name + "|" + d[item.name].replace(/\s+/g, "").replace(",", "|"); });
            dungeon.runes = bh.data.ItemRepo.runes
                .filter(function (r) { return !!d[r.name.startsWith("Hawk") ? "Hawkeye Air Rune" : r.name]; })
                .map(function (r) { return r.name.split(/\W/)[0] + "|" + d[r.name.startsWith("Hawk") ? "Hawkeye Air Rune" : r.name].replace(/\s+/g, "").replace(",", "|"); });
            return dungeon;
        });
        bh.data.ItemRepo.all.filter(function (item) { return !columns.includes(item.name); }).forEach(function (item) { return console.log(item.name); });
        var tsv = "guid\tname\tdungeon\tdifficulty\tact\tkeys\tfame\tgold\telementTypes\tcrystals\trunes\tmats\trandomMats\tboosterElementTypes\tboosterRarities";
        dungeons.forEach(function (d) {
            tsv += "\n" + d.guid + "\t" + d.name + "\t" + d.dungeon + "\t" + d.difficulty + "\t" + d.act + "\t" + d.keys + "\t" + d.fame + "\t" + d.gold + "\t" + d.elementTypes + "\t" + d.crystals + "\t" + d.runes + "\t" + d.mats + "\t" + d.randomMats + "\t" + d.boosterElementTypes + "\t" + d.boosterRarities;
        });
        $("#data-output").val(tsv);
    });
}
var bh;
(function (bh) {
    var data;
    (function (data) {
        function getMaxEvo(rarityType) {
            return rarityType + 1;
        }
        data.getMaxEvo = getMaxEvo;
        function evoMultiplier(fromEvo) {
            return [0.80, 0.85, 0.88, 0.90, 1.0][fromEvo];
        }
        data.evoMultiplier = evoMultiplier;
        function wildsForEvo(rarityType, currentEvoLevel) {
            return [[1], [1, 2], [1, 2, 4], [1, 2, 4, 5], [1, 2, 3, 4, 5]][rarityType || 0][currentEvoLevel || 0];
        }
        data.wildsForEvo = wildsForEvo;
        function getNextWildCardsNeeded(playerCard) {
            return wildsForEvo(playerCard.rarityType, playerCard.evo);
        }
        data.getNextWildCardsNeeded = getNextWildCardsNeeded;
        function getMaxWildCardsNeeded(playerCard) {
            var max = getMaxEvo(playerCard.rarityType), needed = 0;
            for (var evo = playerCard.evo; evo < max; evo++) {
                needed += wildsForEvo(playerCard.rarityType, evo);
            }
            return needed;
        }
        data.getMaxWildCardsNeeded = getMaxWildCardsNeeded;
        function getBaseGoldNeeded(rarityType, currentEvoLevel) {
            return [[1000], [3700, 11300], [4200, 19200, 49000], [25000, 44000, 70000, 155000], [45000, 90000, 180000, 360000, 540000]][rarityType][currentEvoLevel];
        }
        data.getBaseGoldNeeded = getBaseGoldNeeded;
        function getMinGoldNeeded(rarityType, currentEvoLevel) {
            var sands = bh.ItemRepo.sandsOfTime;
            return getBaseGoldNeeded(rarityType, currentEvoLevel) + getMinSotNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(sands.itemType, sands.rarityType);
        }
        data.getMinGoldNeeded = getMinGoldNeeded;
        function getMaxGoldNeeded(rarityType, currentEvoLevel) {
            var base = getBaseGoldNeeded(rarityType, currentEvoLevel), sands = bh.ItemRepo.sandsOfTime, sotCosts = getMaxSotNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(sands.itemType, sands.rarityType), matCounts = [0, 1, 2, 3].map(function (matRarityType) { return getMaxMatNeeded(rarityType, currentEvoLevel, matRarityType); }), matCosts = matCounts.map(function (count, rarityType) { return count * bh.ItemRepo.getValue(bh.ItemType.EvoJar, rarityType); }), matCostsSum = matCosts.reduce(function (sum, cost) { return sum + cost; }, 0), runeCosts = getMaxRunesNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(bh.ItemType.Rune, bh.RarityType.Rare), crystalCosts = getMaxCrystalsNeeded(rarityType, currentEvoLevel) * bh.ItemRepo.getValue(bh.ItemType.Crystal, bh.RarityType.Uncommon);
            return base + sotCosts + matCostsSum + runeCosts + crystalCosts;
        }
        data.getMaxGoldNeeded = getMaxGoldNeeded;
        function calcMaxGoldNeeded(playerCard, evoAndLevel) {
            var needed = 0, rarityType = (data.BattleCardRepo.find(playerCard.configId) || {}).rarityType || 0, evoCap = getMaxEvo(rarityType);
            for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
                needed += getMaxGoldNeeded(rarityType, i);
            }
            return needed;
        }
        data.calcMaxGoldNeeded = calcMaxGoldNeeded;
        function getMinSotNeeded(rarityType, currentEvoLevel) {
            return [[0], [2, 5], [5, 10, 20], [10, 20, 30, 40], [20, 30, 40, 60, 60]][rarityType || 0][currentEvoLevel || 0];
        }
        data.getMinSotNeeded = getMinSotNeeded;
        function getMaxSotNeeded(rarityType, currentEvoLevel) {
            return [[10], [12, 15], [15, 20, 30], [20, 30, 40, 60], [30, 40, 60, 80, 100]][rarityType || 0][currentEvoLevel || 0];
        }
        data.getMaxSotNeeded = getMaxSotNeeded;
        function calcMaxSotNeeded(playerCard, evoAndLevel) {
            var needed = 0, rarityType = (data.BattleCardRepo.find(playerCard.configId) || {}).rarityType || 0, evoCap = getMaxEvo(rarityType);
            for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
                needed += getMaxSotNeeded(rarityType, i);
            }
            return needed;
        }
        data.calcMaxSotNeeded = calcMaxSotNeeded;
        function getMaxMatNeeded(cardRarityType, currentEvoLevel, matRarityType) {
            return ([
                [[12]],
                [[12, 2], [12, 6, 2]],
                [[14, 2], [26, 10, 4], [, 14, 8, 6]],
                [[26, 6, 2], [40, 20, 12], [, 26, 16, 8], [, 26, 20, 12]],
                [[40, 20, 12], [, 26, 16, 8], [, 30, 24, 12], [, 36, 30, 16]]
            ][cardRarityType][currentEvoLevel] || [])[matRarityType] || 0;
        }
        data.getMaxMatNeeded = getMaxMatNeeded;
        function getMinCrystalsNeeded(rarityType, currentEvoLevel) {
            return rarityType == bh.RarityType.Legendary && currentEvoLevel == 4 ? 30 : 0;
        }
        data.getMinCrystalsNeeded = getMinCrystalsNeeded;
        function getMaxCrystalsNeeded(rarityType, currentEvoLevel) {
            return rarityType == bh.RarityType.Legendary && currentEvoLevel == 4 ? 60 : 0;
        }
        data.getMaxCrystalsNeeded = getMaxCrystalsNeeded;
        function calcMaxCrystalsNeeded(playerCard, evoAndLevel) {
            var needed = 0, rarityType = (data.BattleCardRepo.find(playerCard.configId) || {}).rarityType || 0, evoCap = getMaxEvo(rarityType);
            for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
                needed += data.getMaxCrystalsNeeded(rarityType, i);
            }
            return needed;
        }
        data.calcMaxCrystalsNeeded = calcMaxCrystalsNeeded;
        function getMinRunesNeeded(rarityType, currentEvoLevel) {
            return rarityType == bh.RarityType.Legendary && currentEvoLevel == 4 ? 30 : 0;
        }
        data.getMinRunesNeeded = getMinRunesNeeded;
        function getMaxRunesNeeded(rarityType, currentEvoLevel) {
            return rarityType == bh.RarityType.Legendary && currentEvoLevel == 4 ? 60 : 0;
        }
        data.getMaxRunesNeeded = getMaxRunesNeeded;
        function calcMaxRunesNeeded(playerCard, evoAndLevel) {
            var needed = 0, rarityType = (data.BattleCardRepo.find(playerCard.configId) || {}).rarityType || 0, evoCap = getMaxEvo(rarityType);
            for (var i = +evoAndLevel.split(/\./)[0]; i < evoCap; i++) {
                needed += data.getMaxRunesNeeded(rarityType, i);
            }
            return needed;
        }
        data.calcMaxRunesNeeded = calcMaxRunesNeeded;
    })(data = bh.data || (bh.data = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var data;
    (function (data) {
        var guilds;
        (function (guilds) {
            var _names = [];
            var _guilds = [];
            function findByGuid(guid) {
                return _guilds.find(function (guild) { return guild && guild.playerGuild && guild.playerGuild.id == guid; });
            }
            guilds.findByGuid = findByGuid;
            function filterByName(value) {
                return filterNamesByName(value).map(function (name) { return findByGuid(name.guid); }).filter(function (guild) { return !!guild; });
            }
            guilds.filterByName = filterByName;
            function filterNamesByName(name) {
                var lower = (name || "").toLowerCase();
                return _names.filter(function (name) { return name.lower == lower; });
            }
            guilds.filterNamesByName = filterNamesByName;
            function filterNamesByParent(parent) {
                return parent && _names.filter(function (name) { return name.parent === parent; }) || [];
            }
            guilds.filterNamesByParent = filterNamesByParent;
            function findNameByGuid(guid) {
                return _names.filter(function (name) { return name.guid == guid; })[0] || null;
            }
            guilds.findNameByGuid = findNameByGuid;
            function getNames() { return _names.slice(); }
            guilds.getNames = getNames;
            function updateLeaderBoard(results) {
                if (results && results.leaderboardEntries) {
                    results.leaderboardEntries.forEach(function (entry) {
                        var name = findNameByGuid(entry.id);
                        if (!name) {
                            put(entry.id, entry.name);
                            name = findNameByGuid(entry.id);
                        }
                        name.leaderBoardEntry = entry;
                    });
                }
            }
            guilds.updateLeaderBoard = updateLeaderBoard;
            function put(guidOrGuild, name, parent) {
                if (name) {
                    var _name = _names.find(function (n) { return n.guid == guidOrGuild; });
                    if (_name) {
                        _name.lower = (name || "").toLowerCase();
                        _name.name = name || "";
                        _name.parent = _name.parent || parent || null;
                    }
                    else {
                        _names.push({
                            guid: guidOrGuild,
                            lower: (name || "").toLowerCase(),
                            name: name || null,
                            parent: parent || null
                        });
                    }
                }
                else {
                    if (Array.isArray(guidOrGuild)) {
                        var guid = guidOrGuild[0].guildId, guildName = findNameByGuid(guid), existing = guildName && findByGuid(guildName.guid);
                        if (existing) {
                            existing.members = guidOrGuild;
                        }
                        else {
                            _guilds.push({ playerGuild: { members: guidOrGuild.map(function (player) { return { playerId: player.playerId }; }), id: guid, name: guildName.name }, members: guidOrGuild });
                        }
                    }
                    else {
                        var guild = guidOrGuild, playerGuild = guild.playerGuild;
                        if (playerGuild) {
                            put(playerGuild.id, playerGuild.name);
                            var index = _guilds.findIndex(function (g) { return g.playerGuild.id == playerGuild.id; });
                            if (-1 < index) {
                                _guilds[index] = guidOrGuild;
                            }
                            else {
                                _guilds.push(guidOrGuild);
                            }
                            guild.members.forEach(function (player) { return data.PlayerRepo.put(new bh.Player(player)); });
                        }
                    }
                }
            }
            guilds.put = put;
            var _init;
            function init() {
                if (!_init) {
                    _init = new Promise(function (resolvefn) {
                        var tsv = (bh.TSV || {})[String(GuildsGID)];
                        if (tsv) {
                            resolvefn(parseTSV(tsv));
                        }
                        else {
                            bh.Repo.fetchTsv(DataSheetID, GuildsGID).then(function (tsv) { return resolvefn(parseTSV(tsv)); }, function () { return resolvefn(_names); });
                        }
                    });
                }
                return _init;
            }
            guilds.init = init;
            function parseTSV(tsv) {
                return _names = bh.Repo.mapTsv(tsv);
            }
        })(guilds = data.guilds || (data.guilds = {}));
    })(data = bh.data || (bh.data = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var data;
    (function (data) {
        var reports;
        (function (reports_1) {
            var reports = {};
            function getReport(guid) {
                var report = getGuildWarReport(guid);
                if (!report[guid])
                    report = getGuildReport(guid);
                if (!report[guid])
                    report = getGuildMembersReport(guid);
                if (!report[guid])
                    report = reports;
                return report;
            }
            reports_1.getReport = getReport;
            var guilds = {};
            function putGuild(guild) {
                if (!guild || !guild.playerGuild)
                    return {};
                guilds[guild.playerGuild.id] = guild;
                return getGuildReport(guild.playerGuild.id);
            }
            reports_1.putGuild = putGuild;
            function getGuildReport(guid) {
                return guilds[guid] ? guildMembersToReport(guilds[guid].members) || {} : {};
            }
            reports_1.getGuildReport = getGuildReport;
            var guildMembers = {};
            function putGuildMembers(members) {
                guildMembers[members[0].guildId] = members.slice();
                return getGuildMembersReport(members[0].guildId);
            }
            reports_1.putGuildMembers = putGuildMembers;
            function getGuildMembersReport(guid) {
                return guildMembers[guid] ? guildMembersToReport(guildMembers[guid]) || {} : {};
            }
            reports_1.getGuildMembersReport = getGuildMembersReport;
            var guildWars = {};
            function putGuildWar(war) {
                war.guilds.forEach(function (guild) { return guildWars[guild.id] = war; });
                return getGuildWarReport(war.guilds[0].id);
            }
            reports_1.putGuildWar = putGuildWar;
            function getGuildWarReport(guid) {
                return guildWars[guid] ? guildWarToReport(guildWars[guid]) || {} : {};
            }
            reports_1.getGuildWarReport = getGuildWarReport;
            function guildMembersToReport(members) {
                var heroes = data.HeroRepo.sorted, report = {}, guildGuid = members[0].guildId;
                report[guildGuid] = members.slice().sort(bh.utils.sort.byPositionThenName).map(mapMemberToOutput).join("\n");
                return report;
            }
            function mapMemberToOutput(member, index) {
              var player = data.PlayerRepo.find(member.playerId), role = bh.PositionType[member.position] + 1, fame = member.fameLevel + 1, heroData = data.HeroRepo.sorted.map(player ? mapPlayerHero : mapHero), position = index ? index + 1 : "GL";
              return [position, fame, member.name, role].concat(heroData).join("\t");
              function mapHero(hero) {
                  var level = member.archetypeLevels[hero.guid] + 1, hp = bh.utils.truncateNumber(hero.getHitPoints(level));
                  return level ? level + "|" + hp + "|" : "/|/|/|/";
              }
              function mapPlayerHero(hero) {
                  var playerHero = player.heroes.find(function (h) { return hero.guid == h.guid; }), level = playerHero ? playerHero.level : "/", hp = playerHero ? bh.utils.truncateNumber(playerHero.hitPoints) : "/", op = playerHero && playerHero.isOp ? "Y" : " ", power = playerHero ? playerHero.powerRating + " " : "/";
                  return level + "|" + hp + "|" + op + "|" + power;
              }
          }
            function calculateBattleData(war, member) {
                var battles = war.currentWar.battles, winCount = 0, lossCount = 0, dwCount = 0, brags = 0, score = 0;
                if (member) {
                    battles.forEach(function (battle) {
                        if (battle.initiator.playerId == member.playerId) {
                            battle.initiator.winner ? winCount++ : lossCount++;
                            if (battle.completedBragId)
                                brags++;
                            score += battle.initiator.totalScore;
                        }
                        if (battle.opponent.playerId == member.playerId) {
                            if (battle.opponent.winner)
                                dwCount++;
                            score += battle.opponent.totalScore;
                        }
                    });
                }
                return { winCount: winCount, lossCount: lossCount, dwCount: dwCount, score: score, brags: brags };
            }
            function guildWarToReport(war) {
                var heroes = data.HeroRepo.sorted, us = war.guilds[0], them = war.guilds.find(function (g) { return g.id != us.id; }), ourMembers = war.members[us.id].sort(bh.utils.sort.byPositionThenName), theirMembers = war.members[them.id].sort(bh.utils.sort.byPositionThenName), ourOutput = ourMembers.map(function (m, i) { return _mapMemberToOutput(i, m, theirMembers[i]); }).join("\n"), theirOutput = theirMembers.map(function (m, i) { return _mapMemberToOutput(i, m, ourMembers[i]); }).join("\n"), report = {}, legacy = true;
                report[us.id] = ourOutput;
                report[them.id] = theirOutput;
                return report;
                function _mapMemberToOutput(index, member, oppo) {
                    var memberTsv = mapMemberToOutput(member, index), battleData = calculateBattleData(war, member);
                    return memberTsv + "\t" + battleData.winCount + "\t" + battleData.lossCount + "\t" + battleData.dwCount + "\t" + battleData.brags +"\t" + battleData.score;
                }
            }
        })(reports = data.reports || (data.reports = {}));
    })(data = bh.data || (bh.data = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var css;
    (function (css) {
        function addCardTypes($) {
            if ($ === void 0) { $ = bh.$(); }
            var style = $("<style type='text/css' id='bh-hud-cardtypes'/>").appendTo($("head"));
            style.append("div.bh-hud-image.img-Attack { background-image:url('" + bh.getSrc("cardtypes", "Attack") + "'); }");
            style.append("div.bh-hud-image.img-Brag { background-image:url('" + bh.getSrc("cardtypes", "Brag") + "'); }");
            style.append("div.bh-hud-image.img-BattleCard { background-image:url('" + bh.getSrc("cardtypes", "BattleCard") + "'); }");
            style.append("div.bh-hud-image.img-Heal { background-image:url('" + bh.getSrc("cardtypes", "Heal") + "'); }");
            style.append("div.bh-hud-image.img-Shield { background-image:url('" + bh.getSrc("cardtypes", "Shield") + "'); }");
            style.append("div.bh-hud-image.img-WildCard { background-image:url('" + bh.getSrc("cardtypes", "WildCard") + "'); }");
        }
        css.addCardTypes = addCardTypes;
        function addEffects($) {
            if ($ === void 0) { $ = bh.$(); }
            var style = $("<style type='text/css' id='bh-hud-effects'/>").appendTo($("head"));
            bh.data.EffectRepo.all.forEach(function (effect) { return style.append("div.bh-hud-image.img-" + effect.guid + " { background-image:url('" + bh.EffectRepo.toImageSrc(effect) + "'); }"); });
        }
        css.addEffects = addEffects;
        function addElements($) {
            if ($ === void 0) { $ = bh.$(); }
            var style = $("<style type='text/css' id='bh-hud-elements'/>").appendTo($("head"));
            bh.ElementRepo.allTypes.forEach(function (elementType) { return elementType == bh.ElementType.Neutral ? void 0 : style.append("div.bh-hud-image.img-" + bh.ElementType[elementType] + " { background-image:url('" + bh.ElementRepo.toImageSrc(elementType) + "'); }"); });
        }
        css.addElements = addElements;
        function addHeroes($) {
            if ($ === void 0) { $ = bh.$(); }
            var style = $("<style type='text/css' id='bh-hud-heroes'/>").appendTo($("head"));
            bh.data.HeroRepo.all.forEach(function (hero) { return style.append("div.bh-hud-image.img-" + hero.guid + " { background-image:url('" + bh.HeroRepo.toImageSrc(hero) + "'); }"); });
        }
        css.addHeroes = addHeroes;
        function addItems($) {
            if ($ === void 0) { $ = bh.$(); }
            var style = $("<style type='text/css' id='bh-hud-items'/>").appendTo($("head"));
            bh.data.ItemRepo.all.forEach(function (item) { return style.append("div.bh-hud-image.img-" + item.guid + " { background-image:url('" + bh.ItemRepo.toImageSrc(item) + "'); }"); });
        }
        css.addItems = addItems;
        function addKlasses($) {
            if ($ === void 0) { $ = bh.$(); }
            var style = $("<style type='text/css' id='bh-hud-klasses'/>").appendTo($("head")), widths = [16, 12, 12];
            bh.KlassRepo.allTypes.forEach(function (klassType) { return style.append("div.bh-hud-image.img-" + bh.KlassType[klassType] + " { width:16px; background-size:" + widths[klassType] + "px 20px; background-image:url('" + bh.KlassRepo.toImageSrc(klassType) + "'); }"); });
        }
        css.addKlasses = addKlasses;
    })(css = bh.css || (bh.css = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var _win, funcs = [], resolved = false, tries = 0, promise;
    function loaded(win) {
        _win = _win || win;
        return promise || (promise = new Promise(function (res, rej) {
            wait(res, rej);
            $(function () { res(); });
        }));
    }
    bh.loaded = loaded;
    function wait(res, rej) {
        if (resolved)
            return;
        if (++tries > 60) {
            return rej("60 tries");
        }
        if (!_win || !_win.jQuery || !_win.document || !_win.document.body) {
            if (!resolved)
                setTimeout(wait, 1500, res, rej);
            return;
        }
        _win.jQuery(function () {
            funcs.forEach(function (fn) { return fn(); });
        });
        res();
    }
    function jqFN() { return jqObj; }
    var jqObj = { on: jqFN, val: jqFN };
    function $(selector) {
        if (!selector)
            return _win ? _win.jQuery || jqFN : jqFN;
        if (typeof (selector) == "function" && !(_win && _win.jQuery))
            return funcs.push(selector);
        return (_win && _win.jQuery || jqFN)(selector);
    }
    bh.$ = $;
    var events;
    (function (events) {
        var heroStack = [];
        function init() {
            bh.data.init().then(function () {
                $("body").on("click change", "[data-action]", onAction);
            });
        }
        events.init = init;
        function toggle(key, value) {
            if (key && String(value).length) {
                $(".brain-hud-inventory-buttons > button[data-action=\"toggle-" + key + "\"][data-" + key + "=\"" + value + "\"]").toggleClass("active");
            }
            var elements = $(".brain-hud-inventory-buttons > [data-action=\"toggle-element\"].active").toArray().map(function (el) { return el.getAttribute("data-element"); }), klasses = $(".brain-hud-inventory-buttons > [data-action=\"toggle-klass\"].active").toArray().map(function (el) { return el.getAttribute("data-klass"); }), types = $(".brain-hud-inventory-buttons > [data-action=\"toggle-type\"].active").toArray().map(function (el) { return el.getAttribute("data-type"); });
            $("#brain-hud-inventory-items-container > div").hide();
            if (!elements.length && !klasses.length && !types.length) {
                $("#brain-hud-inventory-items-container > div[data-hud=\"true\"]").show();
            }
            else {
                $("#brain-hud-inventory-items-container > div").each(function (i, elem) {
                    var el = $(elem), element = !elements.length || elements.includes(String(el.data("elementType"))), klass = !klasses.length || klasses.includes(String(el.data("klassType"))) || klasses.includes(el.data("brag")), type = !types.length || types.includes(el.data("type")) || types.includes(String(el.data("itemType")));
                    if (element && klass && type) {
                        el.show();
                    }
                });
            }
        }
        events.toggle = toggle;
        function sortHeroes(playerGuid) {
            var container = $("div.brain-hud-scouter-player" + (playerGuid ? "[data-guid=\"" + playerGuid + "\"]" : ".active")), sortTags = ["element-klass", "power-percent-asc", "power-asc", "hp-asc", "name"], oldSortIndex = sortTags.indexOf(container.data("sort") || "element-klass"), newSort = sortTags[oldSortIndex + 1] || "element-klass";
            container.data("sort", newSort);
            if (!playerGuid) {
                playerGuid = container.data("guid");
            }
            var player = bh.data.PlayerRepo.find(playerGuid), heroes = player.heroes.sort(function (a, b) {
                if (newSort == "power-percent-asc") {
                    var aP = a.powerPercent, bP = b.powerPercent;
                    if (aP != bP)
                        return aP < bP ? -1 : 1;
                }
                if (newSort == "power-asc") {
                    var aP = a.powerRating, bP = b.powerRating;
                    if (aP != bP)
                        return aP < bP ? -1 : 1;
                }
                if (newSort == "hp-asc") {
                    var aHP = a.hitPoints, bHP = b.hitPoints;
                    if (aHP != bHP)
                        return aHP < bHP ? -1 : 1;
                }
                if (newSort == "name") {
                    return bh.utils.sort.byName(a, b);
                }
                return bh.utils.sort.byElementThenKlass(a, b);
            });
            heroes.forEach(function (hero) { return container.find("[data-guid=\"" + playerGuid + "-" + hero.guid + "\"]").appendTo(container); });
        }
        function onAction(ev) {
            var el = $(ev.target).closest("[data-action]"), action = el.data("action"), guid;
            switch (action) {
                case "hud-to-library":
                    bh.library.openLibraryFromHud();
                    break;
                case "sort-heroes":
                    sortHeroes();
                    break;
                case "refresh-guild":
                    bh.Messenger.instance.postMessage(bh.Messenger.createMessage("refresh-guild", $("#brain-hud-scouter-guild-target").val()));
                    break;
                case "refresh-player":
                    bh.Messenger.instance.postMessage(bh.Messenger.createMessage("refresh-player", $("#brain-hud-scouter-player-target").val()));
                    break;
                case "toggle-child":
                    guid = el.data("guid");
                    var active = $("div[data-parent-guid=\"" + guid + "\"]").toggleClass("active").hasClass("active");
                    $("button[data-action=\"toggle-child\"][data-guid=\"" + guid + "\"]").text(active ? "[-]" : "[+]");
                    break;
                case "toggle-element":
                    toggle("element", el.data("element"));
                    break;
                case "toggle-klass":
                    toggle("klass", el.data("klass"));
                    break;
                case "toggle-type":
                    toggle("type", el.data("type"));
                    break;
                case "toggle-scouter-guild":
                    bh.hud.guild.selectGuildReport();
                    break;
                case "toggle-scouter-player":
                    bh.hud.player.selectPlayerReport();
                    break;
                case "toggle-scouter-hero":
                    var panel = el.closest("[data-guid]"), content = panel.find(".brain-hud-scouter-panel-content");
                    content.toggleClass("active");
                    break;
                case "toggle-hud-bigger":
                    bh.hud.resize(true);
                    break;
                case "toggle-hud-smaller":
                    bh.hud.resize(false);
                    break;
                case "toggle-guild-scouter":
                    var visible = $("textarea#brain-hud-scouter-guild-report").toggleClass("active").hasClass("active");
                    $("button.brain-hud-toggle[data-action=\"toggle-guild-scouter\"]").text(visible ? "[-]" : "[+]");
                    break;
                case "toggle-player-scouter":
                    var visible = $("div#brain-hud-scouter-player-report").toggleClass("active").hasClass("active");
                    $("button.brain-hud-toggle[data-action=\"toggle-player-scouter\"]").text(visible ? "[-]" : "[+]");
                    break;
                case "toggle-inventory":
                    var visible = $("div.brain-hud-inventory-container").toggleClass("active").hasClass("active");
                    $("button.brain-hud-toggle[data-action=\"toggle-inventory\"]").text(visible ? "[-]" : "[+]");
                    break;
                default:
                    console.log(action);
                    break;
            }
        }
    })(events = bh.events || (bh.events = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var root;
    function getRoot() {
        if (!root) {
            root = String(location.href).toLowerCase().includes("battlehand-hud/") ? "." : bh.host;
        }
        return root;
    }
    function img(src, css, style) {
        var onerror = "", klass = css ? "class=\"" + css + "\"" : "", style = style ? "style=\"" + style + "\"" : "";
        if (src.includes("glyphicons-82-refresh")) {
            onerror = "onerror=\"bh.$(this).replaceWith('&#8634;')\"";
        }
        return "<img src=\"" + src + "\" " + klass + " " + style + " " + onerror + "/>";
    }
    function getImg() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return img(getSrc.apply(void 0, parts));
    }
    bh.getImg = getImg;
    function getImg12() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return img(getSrc.apply(void 0, parts), "icon-12");
    }
    bh.getImg12 = getImg12;
    function getImg20() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return img(getSrc.apply(void 0, parts), "icon-20");
    }
    bh.getImg20 = getImg20;
    function getImgG() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return img(getSrc.apply(void 0, parts), "grayscale");
    }
    bh.getImgG = getImgG;
    function getSrc() {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return getRoot() + "/images/" + parts.join("/") + ".png";
    }
    bh.getSrc = getSrc;
})(bh || (bh = {}));
var bh;
(function (bh) {
    bh.isHud = false;
    bh.isListener = false;
    bh.isLocal = false;
    var hud;
    (function (hud) {
        var listener;
        (function (listener) {
            var resolution;
            (function (resolution) {
                var _win, _resolve, _hud = false, _listener = false, resolved = false;
                function setResolve(win, resolve) { _win = win; _resolve = resolve; }
                resolution.setResolve = setResolve;
                function resolveHud() { _hud = true; resolve(); }
                resolution.resolveHud = resolveHud;
                function resolveListener() { _listener = true; resolve(); }
                resolution.resolveListener = resolveListener;
                function resolve() { if (!resolved) {
                    if (_hud && _listener) {
                        _resolve(_win);
                        resolved = true;
                    }
                } }
            })(resolution || (resolution = {}));
            function handleMessage(message) {
                if (bh.Messenger.isValidMessage(message)) {
                    actionItems.forEach(function (item) {
                        if (item && item.action == message.action && item.callbackfn) {
                            try {
                                item.callbackfn(message);
                            }
                            catch (ex) {
                                console.error(message.action, ex);
                            }
                        }
                    });
                }
                else {
                    console.log("invalid message", message);
                }
            }
            ;
            var actionItems = [
                { action: "hud-init", url: null, callbackfn: resolution.resolveHud }
            ];
            function addAction(action, url, callbackfn) {
                actionItems.push({ action: action, url: url, callbackfn: callbackfn });
            }
            listener.addAction = addAction;
            function init(win, host) {
                if (host === void 0) { host = "http://bh.elvenintrigue.com/"; }
                return new Promise(function (res, rej) {
                    var href = String(win && win.location && win.location.href || "").toLowerCase();
                    bh.isLocal = href.includes("battlehand-hud/default.htm") || href.includes("battlehand-hud/iframe.htm");
                    bh.isHud = href.includes("battlehand-hud/default.htm") || href.startsWith("http://www.kongregate.com/games/anotherplaceprod/battlehand-web"),
                        bh.isListener = href.includes("battlehand-hud/iframe.htm") || href.startsWith("http://game261051.konggames.com/gamez/");
                    bh.host = host;
                    if (bh.isHud) {
                        win.bh = bh;
                        XmlHttpRequest.attach(win);
                        bh.loaded(win).then(function () {
                            bh.Messenger.initialize(win, handleMessage);
                            bh.data.init().then(function () {
                                hud.render();
                                bh.Messenger.instance.postMessage(bh.Messenger.createMessage("hud-init", "hud-init"));
                                res(win);
                            }, function () { return rej("data.init rejected"); });
                        }, function (reason) { return rej("loaded(win) rejected: " + reason); });
                    }
                    else if (bh.isListener) {
                        resolution.setResolve(win, res);
                        XmlHttpRequest.attach(win, readyStateChangeListener);
                        bh.Messenger.initialize(win, handleMessage);
                    }
                    else {
                        rej("not hud nor listener");
                    }
                });
            }
            listener.init = init;
            function readyStateChangeListener() { handleReadyStateChange(this); }
            function urlToAction(url) {
                var actionItem = actionItems.find(function (item) { return url.includes(item.url); });
                return actionItem && actionItem.action || null;
            }
            function handleReadyStateChange(xhr) {
                if (xhr.readyState == XmlHttpRequest.DONE) {
                    var match = xhr.requestUrl.match(/\?player=([a-z0-9]{8}(?:\-[a-z0-9]{4}){3}\-[a-z0-9]{12})&sessionKey=([a-z0-9]{32})(?:&guild(?:Id)?=([a-z0-9]{8}(?:\-[a-z0-9]{4}){3}\-[a-z0-9]{12}))?/);
                    if (match) {
                        var action = urlToAction(xhr.requestUrl), playerGuid = match[1], sessionKey = match[2], guildGuid = match[3], message = { action: action, playerGuid: playerGuid, sessionKey: sessionKey, guildGuid: guildGuid, data: xhr.responseJSON };
                        if (!action)
                            return;
                        resolution.resolveListener();
                        bh.Messenger.instance.postMessage(message);
                    }
                }
            }
            listener.handleReadyStateChange = handleReadyStateChange;
        })(listener = hud.listener || (hud.listener = {}));
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var hud;
    (function (hud) {
        var arena;
        (function (arena) {
            function selectArenaMatches(message) {
                if (!bh.$("#brain-hud-scouter-player-target > option[value=\"arena\"]").length) {
                    bh.$("#brain-hud-scouter-player-target").children().first().after("<option value='arena'>Arena Opponents</option>");
                }
                var matches = message.data;
                var players = bh.data.arenaToPlayers(matches);
                players.forEach(function (player, i) { return hud.scouter.loadPlayer(new bh.Player(player, true), i); });
                bh.$("#brain-hud-scouter-player-target").val("arena");
                hud.player.selectPlayerReport();
            }
            hud.listener.addAction("get-arena-matches", "/v1/matchmaking/getmatches?", selectArenaMatches);
        })(arena = hud.arena || (hud.arena = {}));
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var hud;
    (function (hud) {
        var guild;
        (function (guild_1) {
            function showContainer() {
                var container = bh.$("div.brain-hud-scouter-guild-container");
                if (!container.length) {
                    var textarea = bh.Player.me.canScout ? "<textarea id=\"brain-hud-scouter-guild-report\" rows=\"1\" type=\"text\" class=\"active\"></textarea>" : "";
                    bh.$("div.brain-hud-scouter-player-container").before("<div class=\"brain-hud-scouter-guild-container\"><button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right\" data-action=\"toggle-guild-scouter\">[-]</button><button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right\" data-action=\"refresh-guild\">" + bh.getImg12("icons", "glyphicons-82-refresh") + "</button><select id=\"brain-hud-scouter-guild-target\" data-action=\"toggle-scouter-guild\"></select>" + textarea + "</div>");
                }
                bh.$("div.brain-hud-scouter-guild-container").addClass("active");
            }
            function addGuild(message) {
                var guild = message.data, guid = guild && guild.playerGuild && guild.playerGuild.id, name = guild && guild.playerGuild && guild.playerGuild.name;
                if (guid && name) {
                    bh.data.guilds.put(guid, name);
                    bh.data.reports.putGuild(guild);
                    addGuildReport(guid);
                }
            }
            function addGuildSearchResults(message) {
                var results = message.data;
                results.forEach(function (guild) { return bh.data.guilds.put(guild.id, guild.name); });
            }
            function addGuildMembers(message) {
                var members = message.data, guid = members[0].guildId;
                bh.data.reports.putGuildMembers(members);
                addGuildReport(guid);
            }
            function addLeaderboardGuildMembers(message) {
                addGuildReport(message.guildGuid);
            }
            function addGuildWar(message) {
                var war = message.data;
                if (war && war.guilds) {
                    war.guilds.forEach(function (guild) { return bh.data.guilds.put(guild.id, guild.name); });
                    bh.data.reports.putGuildWar(war);
                    war.guilds.forEach(function (guild) { return addGuildReport(guild.id); });
                }
            }
            function addGuildLeaderBoard(message) {
                var results = message.data;
                bh.data.guilds.updateLeaderBoard(results);
                updateGuildOptions();
            }
            function addGuildReport(guid) {
                var guildName = bh.data.guilds.findNameByGuid(guid);
                if (!guildName)
                    return console.log("guildName not found: " + guid);
                var player = bh.Player.me, playerGuildParent = player && player.guildParent || null, guilds = playerGuildParent && bh.data.guilds.filterNamesByParent(playerGuildParent) || [], canScout = player && player.canScout, isGuild = player && player.guildGuid == guid;
                if (!guilds.find(function (g) { return g.guid == guid; }) && !canScout && !isGuild)
                    return;
                showContainer();
                var select = bh.$("#brain-hud-scouter-guild-target");
                if (!select.find("option[value=\"" + guid + "\"]").length) {
                    select.append("<option value=\"" + guid + "\">" + guildName.name + "</option>");
                    select.children().toArray().filter(function (opt) { return opt.value != player.guildGuid; })
                        .sort(function (a, b) { return a.text < b.text ? -1 : a.text == b.text ? 0 : 1; })
                        .forEach(function (el) { return select.append(el); });
                }
                select.val(guid);
                selectGuildReport();
            }
            guild_1.addGuildReport = addGuildReport;
            function updateGuildOptions() {
                bh.$("#brain-hud-scouter-guild-target").children().toArray().forEach(updateGuildOption);
            }
            function updateGuildOption(opt) {
                if (!opt || !opt.value)
                    return;
                var guid = opt.value, guildName = bh.data.guilds.findNameByGuid(guid), leaderBoardEntry = guildName && guildName.leaderBoardEntry || null, rankText = leaderBoardEntry && "#" + (leaderBoardEntry.rank + 1) + " " || "", winLossText = leaderBoardEntry && (leaderBoardEntry.wins || leaderBoardEntry.losses) && "(" + guildName.leaderBoardEntry.wins + "/" + guildName.leaderBoardEntry.losses + ") " || "", text = "" + rankText + winLossText + guildName.name;
                opt.text = text;
            }
            function selectGuildReport() {
                var guid = bh.$("#brain-hud-scouter-guild-target").val();
                updateGuildOption(bh.$("#brain-hud-scouter-guild-target > option[value=\"" + guid + "\"]")[0]);
                bh.$("#brain-hud-scouter-guild-report").val(bh.data.reports.getReport(guid)[guid] || "");
            }
            guild_1.selectGuildReport = selectGuildReport;
            hud.listener.addAction("get-guild", "/v1/guild/get?", addGuild);
            hud.listener.addAction("get-guild-members", "/v1/guild/getmembers?", addGuildMembers);
            hud.listener.addAction("get-guild-war", "/v1/guildwars/get?", addGuildWar);
            hud.listener.addAction("get-leaderboard", "/v1/guildwars/getrange?", addGuildLeaderBoard);
            hud.listener.addAction("get-guildsearch", "/v1/guild/getguilds?", addGuildSearchResults);
            hud.listener.addAction("get-leaderboard-members", "/v1/guildwars/getguildmembersrange?", addLeaderboardGuildMembers);
            function searchGuilds(filter, deep) {
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/guild/getguilds?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&name=" + filter + "&joinableonly=False&language=&minfamelevel=2&maxfamelevel=44";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json || !Array.isArray(json))
                            return rej("invalid json");
                        guildsGetMembers(json, deep).then(res, rej);
                    }, rej);
                });
            }
            guild_1.searchGuilds = searchGuilds;
            function guildsGetMembers(guilds, deep) {
                return new Promise(function (res, rej) {
                    var _guilds = guilds.slice(), guild;
                    function fetch() {
                        if (guild = _guilds.shift()) {
                            setTimeout(function () { return guildGetMembers(guild.id, deep).then(fetch, fetch); }, hud._delayMS);
                        }
                        else {
                            res();
                        }
                    }
                    fetch();
                });
            }
            guild_1.guildsGetMembers = guildsGetMembers;
            function guildGetMembers(guid, deep) {
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/guild/getmembers?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&guild=" + guid;
                if (bh.isLocal)
                    url = "./json/" + guid + ".json";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    if (!guid)
                        return rej("no guild id");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json || !Array.isArray(json))
                            return rej("invalid json");
                        bh.Messenger.instance.postMessage(bh.Messenger.createMessage("get-guild-members", json));
                        if (deep) {
                            var memberGuids = json.map(function (member) { return member.playerId; });
                            hud.player.playersGet(memberGuids).then(res, res);
                        }
                        else {
                            res(json);
                        }
                    }, rej);
                });
            }
            guild_1.guildGetMembers = guildGetMembers;
            function leaderBoardGet(start, count) {
                if (start === void 0) { start = 0; }
                if (count === void 0) { count = 13; }
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/guildwars/getrange?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&start=" + start + "&count=" + count;
                if (bh.isLocal)
                    url = "./json/top_guilds.json";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json || !json.leaderboardEntries)
                            return rej("invalid json");
                        bh.Messenger.instance.postMessage(bh.Messenger.createMessage("get-leaderboard", json));
                        res(json);
                    }, rej);
                });
            }
            guild_1.leaderBoardGet = leaderBoardGet;
            hud.listener.addAction("refresh-guild", null, function (message) {
                guildGetMembers(message.data, true);
            });
        })(guild = hud.guild || (hud.guild = {}));
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var hud;
    (function (hud) {
        hud._delayMS = 500;
        var player;
        (function (player_1) {
            function loadPlayer(player) {
                if (player.isExtended) {
                    bh.$("#brain-hud-inventory").addClass("active");
                    bh.data.PlayerRepo.put(player);
                    bh.$("#brain-hud-inventory-items-container")
                        .html("")
                        .append(player.boosterCards.map(function (card) { return card.rowHtml; }))
                        .append(player.battleCards.map(function (card) { return card.rowHtml; }))
                        .append(player.inventory.sort(bh.utils.sort.byName).map(function (item) { return item.rowHtml; }))
                        .append(player.wildCards.map(function (card) { return card.rowHtml; }))
                        .append(player.boosterRowHtml)
                        .append(player.fragmentsRowHtml)
                        .append(player.gemsRowHtml)
                        .append(player.goldRowHtml)
                        .append(player.raidRowHtml)
                        .append(player.wildCardRowHtml);
                    bh.events.toggle();
                }
            }
            player_1.loadPlayer = loadPlayer;
            function addPlayerReport(message) {
                var json = message.data;
                var player = new bh.Player(json), select = bh.$("#brain-hud-scouter-player-target");
                if (!bh.$("#brain-hud-scouter-player-target > option[value=\"" + player.guid + "\"]").length) {
                    select.append("<option value=\"" + player.guid + "\">" + (player.isFullMeat ? "&#9734; " : "") + bh.utils.htmlFriendly(player.name) + "</option>");
                    select.children().toArray().slice(1)
                        .sort(function (a, b) { return a.text < b.text ? -1 : a.text == b.text ? 0 : 1; })
                        .forEach(function (el) { return select.append(el); });
                }
                if (!player.isMe || player.isExtended) {
                    bh.data.PlayerRepo.put(player);
                }
                hud.scouter.loadPlayer(player);
                if (player.isMe) {
                    loadPlayer(player);
                    var guilds = player.guilds;
                    if (guilds.length && hud.guild.addGuildReport) {
                        guilds.forEach(function (g) { return hud.guild.addGuildReport(g.guid); });
                    }
                }
                select.val(json.id);
                selectPlayerReport();
                hud.guild.selectGuildReport();
            }
            player_1.addPlayerReport = addPlayerReport;
            function selectPlayerReport() {
                bh.$("div.brain-hud-scouter-player-container").addClass("active");
                bh.$("#brain-hud-scouter-player-report").show();
                bh.$("div.brain-hud-scouter-player").removeClass("active");
                var guid = bh.$("#brain-hud-scouter-player-target").val();
                if (guid == "arena") {
                    bh.$("div.brain-hud-scouter-player[data-guid=\"arena-0\"]").addClass("active");
                    bh.$("div.brain-hud-scouter-player[data-guid=\"arena-1\"]").addClass("active");
                    bh.$("div.brain-hud-scouter-player[data-guid=\"arena-2\"]").addClass("active");
                }
                else {
                    bh.$("div.brain-hud-scouter-player[data-guid=\"" + guid + "\"]").addClass("active");
                }
            }
            player_1.selectPlayerReport = selectPlayerReport;
            hud.listener.addAction("get-player", "/v1/player/get?", addPlayerReport);
            hud.listener.addAction("get-player", "/v1/player/getplayerinfo?", addPlayerReport);
            function playersGet(playerGuids) {
                return new Promise(function (res, rej) {
                    var guids = playerGuids.slice(), guid;
                    function fetch() {
                        if (guid = guids.shift()) {
                            setTimeout(function () { return playerGet(guid).then(fetch, fetch); }, hud._delayMS);
                        }
                        else {
                            res();
                        }
                    }
                    fetch();
                });
            }
            player_1.playersGet = playersGet;
            function playerGet(guid) {
                var url = "https://battlehand-game-kong.anotherplacegames.com/v1/player/getplayerinfo?player=" + bh.Messenger.ActivePlayerGuid + "&sessionKey=" + bh.Messenger.ActiveSessionKey + "&id_requested_player=" + guid;
                if (bh.isLocal)
                    url = "./json/" + guid + ".json";
                return new Promise(function (res, rej) {
                    if (!bh.Messenger.ActivePlayerGuid || !bh.Messenger.ActiveSessionKey)
                        return rej("not initialized");
                    if (!guid)
                        return rej("no player id");
                    XmlHttpRequest.getJSON(url).then(function (json) {
                        if (!json)
                            return rej("invalid json");
                        bh.Messenger.instance.postMessage(bh.Messenger.createMessage("get-player", json));
                        res(json);
                    }, rej);
                });
            }
            player_1.playerGet = playerGet;
            hud.listener.addAction("refresh-player", null, function (message) { playerGet(message.data); });
        })(player = hud.player || (hud.player = {}));
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var utils;
    (function (utils) {
        function getFromStorage(key) {
            var output;
            try {
                output = localStorage.getItem(key);
            }
            catch (ex) {
                output = null;
            }
            return output;
        }
        utils.getFromStorage = getFromStorage;
        function setToStorage(key, data) {
            var success = false;
            try {
                localStorage.setItem(key, data);
                success = true;
            }
            catch (ex) { }
            return success;
        }
        utils.setToStorage = setToStorage;
        function formatString(value, args) {
            var keyRegex = new RegExp("\\w+");
            var keys = value.match(new RegExp("#{\\w+}", "g"));
            for (var i = 0, l = keys.length; i < l; i++) {
                keys[i] = keys[i].match(keyRegex)[0];
            }
            var result = value;
            for (i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                for (var j = 0, m = args.length; j < m; j++) {
                    var obj = args[j];
                    if (key in obj) {
                        result = result.replace("#{" + key + "}", obj[key]);
                        break;
                    }
                }
            }
            return result;
        }
        utils.formatString = formatString;
        function htmlFriendly(value) {
            return String(value).replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        }
        utils.htmlFriendly = htmlFriendly;
        function unique(array) {
            return array.reduce(function (out, curr) { return out.includes(curr) ? out : out.concat([curr]); }, []);
        }
        utils.unique = unique;
        function formatNumber(value) {
            var num = String(value).split(""), out = [], o = 0;
            for (var i = num.length; i--;) {
                if (out.length && o % 3 == 0)
                    out.unshift(",");
                out.unshift(num.pop());
                o++;
            }
            return out.join("");
        }
        utils.formatNumber = formatNumber;
        function round(value, places) {
            var shifter = (10 ^ places), bigger = value * shifter, biggerRounded = Math.round(bigger), rounded = biggerRounded / shifter;
            return rounded;
        }
        utils.round = round;
        function truncateNumber(value) {
            var out = utils.formatNumber(value), parts = out.split(",");
            return parts.length == 1 ? out : parts[0].length == 1 ? parts[0] + "." + parts[1][0] + "k" : parts[0] + "k";
        }
        utils.truncateNumber = truncateNumber;
        function parseBoolean(value) {
            var string = String(value), char = string.substring(0, 1).toLowerCase();
            return char === "y" || char === "t" || string === "1";
        }
        utils.parseBoolean = parseBoolean;
        function evoToStars(rarityType, evoLevel) {
            if (evoLevel === void 0) { evoLevel = String(rarityType + 1); }
            var evo = +evoLevel.split(".")[0], stars = rarityType + 1, count = 0, value = "";
            while (evo--) {
                count++;
                value += "<span class='evo-star'>&#9733;</span>";
            }
            while (count < stars) {
                count++;
                value += "<span class='star'>&#9734;</span>";
            }
            return value;
        }
        utils.evoToStars = evoToStars;
        function getBase64Image(src) {
            var img = document.createElement("img");
            img.setAttribute('src', src);
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL;
        }
        utils.getBase64Image = getBase64Image;
        var loggedCards = {};
        function logMissingCard(playerBattleCard) {
            if (!loggedCards[playerBattleCard.playerCard.id]) {
                console.log("Missing BattleCard:", playerBattleCard.name + ": " + playerBattleCard.playerCard.id + " (" + playerBattleCard.evoLevel + ")");
                loggedCards[playerBattleCard.playerCard.id] = true;
            }
        }
        utils.logMissingCard = logMissingCard;
        function asyncForEach(array, callbackfn, thisArg) {
            return new Promise(function (resolvefn, rejectfn) {
                var functions = array.map(function (value, index, array) {
                    return function (value, index, array) {
                        setTimeout(function (thisArg, value, index, array) {
                            try {
                                var retVal = callbackfn.call(thisArg, value, index, array);
                                retVal instanceof Promise ? retVal.then(process, rejectfn) : process();
                            }
                            catch (ex) {
                                rejectfn(ex);
                            }
                        }, 0, thisArg, value, index, array);
                    }.bind(thisArg, value, index, array);
                });
                var process = function () {
                    if (functions.length) {
                        var fn = functions.shift();
                        fn ? fn() : process();
                    }
                    else {
                        resolvefn(array);
                    }
                };
                process();
            });
        }
        utils.asyncForEach = asyncForEach;
        function clone(obj) {
            var clone = {};
            Object.keys(obj).forEach(function (key) { return clone[key] = obj[key]; });
            return clone;
        }
        utils.clone = clone;
        function isNullOrUndefined(obj) {
            return obj === null || obj === undefined;
        }
        utils.isNullOrUndefined = isNullOrUndefined;
    })(utils = bh.utils || (bh.utils = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var hud;
    (function (hud) {
        hud.WidthDefault = 275;
        hud.WidthCurrent = +bh.utils.getFromStorage("BH-HUD-WidthCurrent") || hud.WidthDefault;
        hud.WidthMinimum = 200;
        hud.WidthDelta = 25;
        hud.WidthCollapsed = 25;
        function render() {
            renderBootstrapCss();
            renderHtml();
            postResize();
            bh.events.init();
        }
        hud.render = render;
        function resize(bigger) {
            if (bigger) {
                hud.WidthCurrent += hud.WidthDelta;
                if (hud.WidthCurrent < hud.WidthMinimum) {
                    hud.WidthCurrent = hud.WidthMinimum;
                }
            }
            else if (!bigger) {
                hud.WidthCurrent -= hud.WidthDelta;
                if (hud.WidthCurrent && hud.WidthCurrent < hud.WidthMinimum) {
                    hud.WidthCurrent = hud.WidthCollapsed;
                }
                if (!hud.WidthCurrent) {
                    hud.WidthCurrent = hud.WidthCollapsed;
                }
            }
            bh.utils.setToStorage("BH-HUD-WidthCurrent", String(hud.WidthCurrent));
            postResize();
        }
        hud.resize = resize;
        function postResize() {
            var visible = hud.WidthCurrent != hud.WidthCollapsed;
            bh.$("div#brain-hud-container").css("width", hud.WidthCurrent);
            bh.$("div.brain-hud-main-container")[visible ? "addClass" : "removeClass"]("active");
            bh.$("div.brain-hud-header>span.header")[visible ? "show" : "hide"]();
            bh.$("div.brain-hud-header>span[data-action=\"toggle-hud-smaller\"]")[visible ? "show" : "hide"]();
            bh.$("div#brain-hud-container").css("width", hud.WidthCurrent);
            bh.$("div#brain-hud-container").css("max-height", jQuery(window).height() - 10);
            bh.$("div.brain-hud-container select").css("width", hud.WidthCurrent - 70);
            bh.$("div.brain-hud-container textarea").css("width", hud.WidthCurrent - 10);
            bh.$("div.brain-hud-scouter-panel-header > button").css("width", hud.WidthCurrent - 10);
            bh.$("div.brain-hud-scouter-panel-header > button > span.hero-rating-bar").css("width", hud.WidthCurrent - 205);
        }
        function renderCss() {
            var css = "<style id=\"brain-hud-styles\" type=\"text/css\">\ndiv.brain-hud-container { font-size:8pt; position:fixed; top:0; right:0; width:" + hud.WidthCurrent + "px; background:#FFF; color:#000; border:2px solid #000; z-index:9999; padding:2px; max-height:" + (jQuery(window).height() - 10) + "px; overflow:auto; }\ndiv.brain-hud-container div { clear:both; }\ndiv.brain-hud-container table { width:100%; margin:0; padding:0; border:0; }\ndiv.brain-hud-container td { padding:0; margin:0; border:0; }\ndiv.brain-hud-container select { width:" + (hud.WidthCurrent - 70) + "px; }\ndiv.brain-hud-container textarea { width:" + (hud.WidthCurrent - 10) + "px; font-size:8pt; display:none; }\n\ndiv.brain-hud-container .Air { background-color:#f3f3f3; }\ndiv.brain-hud-container .Earth { background-color:#e0eed5; }\ndiv.brain-hud-container .Fire { background-color:#fce5cd; }\ndiv.brain-hud-container .Spirit { background-color:#f3e2f6; }\ndiv.brain-hud-container .Water { background-color:#deeaf4; }\ndiv.brain-hud-container .grayscale { filter: grayscale(100%); }\n\ndiv.brain-hud-header { text-align:center; font-weight:bold; }\n\ndiv.brain-hud-main-container,\ndiv.brain-hud-scouter-guild-container,\ndiv.brain-hud-scouter-player-container,\ndiv.brain-hud-scouter-player,\ndiv.brain-hud-scouter-panel-content,\ndiv.brain-hud-inventory,\ndiv.brain-hud-inventory-container,\ndiv.brain-hud-child-scroller { display:none; }\n\ndiv.brain-hud-scouter-panel-content,\ndiv.brain-hud-child-scroller { padding-left:10px; }\n\ndiv.brain-hud-scouter-player-report { display:none; padding:0 2px; text-align:left; }\ndiv.brain-hud-scouter-player > div.player-name { font-size:10pt; font-weight:bold; text-align:center; }\n\ndiv.brain-hud-scouter-panel-header { padding:2px 0 0 0; }\ndiv.brain-hud-scouter-panel-header > button { cursor:default; border:0; width:" + (hud.WidthCurrent - 10) + "px; text-align:left; padding:0; margin:0; }\ndiv.brain-hud-scouter-panel-header > button[data-action] { cursor:pointer; }\ndiv.brain-hud-scouter-panel-header > button > span.hero-icon { display:inline-block; width:20px; text-align:center; }\ndiv.brain-hud-scouter-panel-header > button > span.hero-level { display:inline-block; width:30px; text-align:right; }\ndiv.brain-hud-scouter-panel-header > button > span.hero-name { display:inline-block; width:60px; }\ndiv.brain-hud-scouter-panel-header > button > span.hero-hp { display:inline-block; width:50px; text-align:center; overflow:hidden; vertical-align: bottom; }\ndiv.brain-hud-scouter-panel-header > button > span.hero-rating-bar { display:inline-block; width:" + (hud.WidthCurrent - 205) + "px; }\ndiv.brain-hud-scouter-panel-header > button > span.hero-rating { display:inline-block; width:30px; text-align:right; font-size:8pt; vertical-align:top; }\n\ndiv.brain-hud-inventory-buttons { text-align:center; }\n\ndiv.brain-hud-container .active { display:block; }\n\ndiv.brain-hud-container .star { color: darkgoldenrod; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; }\ndiv.brain-hud-container .evo-star { color: gold; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; }\n\ndiv.brain-hud-container img { height:16px; width:16px; }\ndiv.brain-hud-container img.icon-12 { height:12px; width:12px; }\ndiv.brain-hud-container img.icon-20 { height:20px; width:20px; }\n\ndiv.brain-hud-child-scroller { max-height:180px; overflow:auto; }\ndiv.brain-hud-scouter-panel-content.active,\ndiv.brain-hud-child-scroller.active { border:1px solid #aaa; border-radius:10px; }\n\ndiv.progress { margin-bottom:0; height:10px; }\ndiv.progress > div.progress-bar { line-height:10px; font-size:8px; font-weight:bold; clear:none; }\n\ndiv.brain-hud-container .badge,\ndiv.brain-hud-container .bs-btn-group-xs > .bs-btn,\ndiv.brain-hud-container .bs-btn-xs { font-size:11px; }\n\ndiv.brain-hud-container .badge.bg-success { background-color:#3c763d; }\ndiv.brain-hud-container .badge.bg-danger { background-color:#a94442; }\ndiv.brain-hud-container [data-action=\"sort-heroes\"] { cursor:pointer; }\n</style>";
            bh.$("head").append(css);
        }
        function renderBootstrapCss() {
            bh.$().get("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css").then(function (css) {
                bh.$("head").append("<style type=\"text/css\">" + css.replace(/\.btn/g, ".bs-btn") + "</style>");
                renderCss();
            });
        }
        function inventoryButton(type, typeValue, imgType, imgName) {
            return "<button class=\"bs-btn bs-btn-default brain-hud-button\" type=\"button\" data-action=\"toggle-" + type + "\" data-" + type + "=\"" + typeValue + "\">" + bh.getImg(imgType, imgName || typeValue) + "</button>";
        }
        function renderHtml() {
            var html = "<div class=\"brain-hud-header\">\n\t<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-left\" data-action=\"toggle-hud-bigger\">[+]</button>\n\t<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right\" data-action=\"toggle-hud-smaller\">[-]</button>\n\t<span class=\"header\">The Brain BattleHand HUD</span>\n</div>\n<div class=\"brain-hud-main-container active\">\n\t<div class=\"brain-hud-scouter-player-container\">\n\t\t<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right\" data-action=\"toggle-player-scouter\">[-]</button>\n\t\t<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right\" data-action=\"refresh-player\">" + bh.getImg12("icons", "glyphicons-82-refresh") + "</button>\n\t\t<select id=\"brain-hud-scouter-player-target\" data-action=\"toggle-scouter-player\"></select>\n\t\t<div id=\"brain-hud-scouter-player-report\" class=\"brain-hud-scouter-player-report active\"></div>\n\t</div>\n\t<div id=\"brain-hud-inventory\" class=\"brain-hud-inventory\">\n\t\t<strong>Inventory</strong>\n\t\t<button class=\"bs-btn bs-btn-link bs-btn-xs\" style=\"float:center;\" data-action=\"hud-to-library\">[library]</button>\n\t\t<button class=\"bs-btn bs-btn-link bs-btn-xs brain-hud-toggle pull-right\" data-action=\"toggle-inventory\">[-]</button>\n\t\t<div class=\"brain-hud-inventory-container active\">\n\t\t\t<div class=\"text-center\">\n\t\t\t\t<div class=\"bs-btn-group bs-btn-group-xs brain-hud-inventory-buttons\" role=\"group\">\n\t\t\t\t\t" + inventoryButton("element", bh.ElementType.Air, "elements", "Air") + "\n\t\t\t\t\t" + inventoryButton("element", bh.ElementType.Earth, "elements", "Earth") + "\n\t\t\t\t\t" + inventoryButton("element", bh.ElementType.Fire, "elements", "Fire") + "\n\t\t\t\t\t" + inventoryButton("element", bh.ElementType.Spirit, "elements", "Spirit") + "\n\t\t\t\t\t" + inventoryButton("element", bh.ElementType.Water, "elements", "Water") + "\n\t\t\t\t\t" + inventoryButton("element", bh.ElementType.Neutral, "elements", "Loop") + "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"bs-btn-group bs-btn-group-xs brain-hud-inventory-buttons\">\n\t\t\t\t\t" + inventoryButton("klass", bh.KlassType.Magic, "classes", "Magic") + "\n\t\t\t\t\t" + inventoryButton("klass", bh.KlassType.Might, "classes", "Might") + "\n\t\t\t\t\t" + inventoryButton("klass", bh.KlassType.Skill, "classes", "Skill") + "\n\t\t\t\t\t" + inventoryButton("klass", "Brag", "cardtypes") + "\n\t\t\t\t\t" + inventoryButton("type", bh.ItemType.Rune, "runes", "Meteor") + "\n\t\t\t\t\t" + inventoryButton("type", bh.ItemType.Crystal, "crystals", "Neutral") + "\n\t\t\t\t</div><br/>\n\t\t\t\t<div class=\"bs-btn-group bs-btn-group-xs brain-hud-inventory-buttons\">\n\t\t\t\t\t" + inventoryButton("type", "BoosterCard", "misc", "Boosters") + "\n\t\t\t\t\t" + inventoryButton("type", "WildCard", "cardtypes", "WildCard") + "\n\t\t\t\t\t" + inventoryButton("type", bh.ItemType.EvoJar, "misc", "EvoJars") + "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div id=\"brain-hud-inventory-items-container\" class=\"brain-hud-inventory-items-container\"></div>\n\t\t</div>\n\t</div>\n</div>";
            bh.$("body").append("<div id=\"brain-hud-container\" class=\"brain-hud-container\">" + html + "</div>");
        }
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var hud;
    (function (hud) {
        var scouter;
        (function (scouter) {
            function getOrCreateContainer(guid) {
                if (!bh.$("div.brain-hud-scouter-player[data-guid=\"" + guid + "\"]").length) {
                    bh.$("div#brain-hud-scouter-player-report").append("<div class=\"brain-hud-scouter-player\" data-guid=\"" + guid + "\"></div>");
                }
                return bh.$("div.brain-hud-scouter-player[data-guid=\"" + guid + "\"]");
            }
            function loadPlayers(arenaPlayers) {
                arenaPlayers.forEach(function (arenaPlayer, arenaIndex) {
                    var indexKey = Object.keys(arenaPlayer)[0], indexPlayer = arenaPlayer[indexKey], guid = Object.keys(indexPlayer)[0], player = indexPlayer[guid];
                    loadPlayer(new bh.Player(player, true), arenaIndex);
                });
            }
            function loadPlayer(player, arenaIndex) {
                if (arenaIndex === void 0) { arenaIndex = -1; }
                var fullMeat = player.isFullMeat, star = fullMeat ? "&#9734;" : "", percentText = player.isArena || fullMeat ? "" : " <span style=\"white-space:nowrap;\">(" + player.completionPercent + "%)</span>", html = "<div class=\"player-name\" data-action=\"sort-heroes\">" + star + " " + bh.utils.htmlFriendly(player.name) + " " + percentText + "</div>", playerHeroes = player.heroes.sort(bh.utils.sort.byElementThenKlass);
                playerHeroes.forEach(function (hero) {
                    if (!player.isMe && hero.isLocked)
                        return;
                    var id = player.guid + "-" + hero.guid, icon = hero.isLocked ? bh.getImg("misc", "Lock") : bh.getImg("heroes", hero.name), level = hero.isLocked ? "" : hero.level == bh.HeroRepo.MaxLevel ? hero.isMeat ? "<span class=\"evo-star\">&#9734;</span>" : "<span class=\"star\">&#9734;</span>" : "(" + hero.level + ")", hitPoints = hero.isLocked ? "" : bh.utils.truncateNumber(hero.hitPoints) + " HP", powerThresholds = hero.hero.maxPowerThresholds, powerRating = hero.powerRating, powerPercent = Math.round(100 * powerRating / powerThresholds[powerRating < powerThresholds[3] ? 3 : 4]), color = powerRating <= powerThresholds[0] ? "progress-bar-info" : powerRating <= powerThresholds[1] ? "progress-bar-success" : powerRating <= powerThresholds[2] ? "progress-bar-warning" : "progress-bar-danger", progressBG = hero.isOp ? "background-color:pink;" : "", progressBar = hero.isLocked ? "" : "<div class=\"progress\"><div class=\"progress-bar " + color + "\" style=\"width:" + powerPercent + "%;\"><span></span></div></div>", powerRatingText = hero.isLocked ? "" : powerRating, title = "<span class=\"hero-icon\">" + icon + "</span>"
                        + ("<span class=\"hero-name\">" + hero.name + "</span>")
                        + ("<span class=\"hero-level\">" + level + "</span>")
                        + ("<span class=\"hero-hp\">" + hitPoints + "</span>")
                        + ("<span class=\"hero-rating-bar\">" + progressBar + "</span>")
                        + ("<span class=\"hero-rating\">" + powerRatingText + "</span>"), content = "";
                    if (player.isMe || player.isAlly) {
                        var abilities = hero.playerHeroAbilities
                            .map(function (playerHeroAbility) {
                            var cappedOrMaxed = playerHeroAbility.isMaxed ? "; maxed" : playerHeroAbility.isCapped ? "; capped" : "", levelText = playerHeroAbility.isLocked ? bh.getImg("misc", "Lock") : "(" + playerHeroAbility.level + " / " + playerHeroAbility.levelMax + cappedOrMaxed + ")", text = playerHeroAbility.img + " " + playerHeroAbility.name + " " + levelText, children = "";
                            if (!playerHeroAbility.isMaxed) {
                                children += playerHeroAbility.materialHtml;
                                children += playerHeroAbility.goldHtml;
                            }
                            return bh.renderExpandable(hero.guid + playerHeroAbility.guid, text, children);
                        }), cardsHtml = hero.deck.map(function (card) { return card.rowHtml; }).join("");
                        content = "" + abilities.join("") + cardsHtml;
                    }
                    html += buildPanel(id, hero.elementType, title, content, player.isMe || player.isAlly);
                });
                getOrCreateContainer(arenaIndex == -1 ? player.guid : "arena-" + arenaIndex).html(html);
            }
            scouter.loadPlayer = loadPlayer;
            function buildPanel(id, elementType, title, html, isMe) {
                var header = "<button class=\"bs-btn bs-btn-link bs-btn-sm " + bh.ElementType[elementType] + "\" " + (isMe ? "data-action=\"toggle-scouter-hero\"" : "") + ">" + title + "</button>";
                return "<div class=\"brain-hud-scouter-panel\" data-guid=\"" + id + "\"><div class=\"brain-hud-scouter-panel-header\">" + header + "</div><div class=\"brain-hud-scouter-panel-content\">" + html + "</div></div>";
            }
        })(scouter = hud.scouter || (hud.scouter = {}));
    })(hud = bh.hud || (bh.hud = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var library;
    (function (library) {
        var $ = window["jQuery"];
        var player = null;
        function cleanImageName(value) {
            return value.trim().replace(/\W/g, "");
        }
        var messenger;
        function openLibraryFromHud() {
            messenger = new bh.Messenger(window, handleLibraryMessage, window.open(bh.host + "/cards.html?hud,complete", "bh-hud-library", "", true));
        }
        library.openLibraryFromHud = openLibraryFromHud;
        function postMessage(action, data) {
            if (data === void 0) { data = null; }
            var message = bh.Messenger.createMessage(action, { action: action, data: data });
            message.playerGuid = action;
            message.sessionKey = action;
            messenger.postMessage(message);
        }
        function init() {
            var hud = location.search.includes("hud");
            if (hud) {
                messenger = new bh.Messenger(window, handleLibraryMessage, window.opener);
                postMessage("library-requesting-player");
            }
            else {
                _init();
            }
        }
        library.init = init;
        function handleLibraryMessage(ev) {
            var message = ev.data || (ev.originalEvent && ev.originalEvent.data) || null;
            if (message) {
                if (message.action == "hud-sending-player" && message.data) {
                    player = new bh.Player(message.data);
                    _init();
                }
                if (message.action == "library-requesting-player") {
                    postMessage("hud-sending-player", bh.Player.me._pp);
                }
            }
        }
        library.handleLibraryMessage = handleLibraryMessage;
        function _init() {
            bh.host = "http://bh.elvenintrigue.com";
            bh.data.init().then(render);
            $("body").on("click", "[data-action=\"show-card\"]", onShowCard);
            $("body").on("click", "[data-action=\"show-item\"]", onShowItem);
            $("body").on("click", "[data-search-term]", onSearchImage);
            $("input.library-search").on("change keyup", onSearch);
            $("button.library-search-clear").on("click", onSearchClear);
            $("input[type='range']").on("change input", onSliderChange);
            var evoTabs = $("#card-evolution div.tab-pane"), template = evoTabs.html();
            evoTabs.html(template).toArray().forEach(function (div, i) { return $(div).find("h3").text("Evolution from " + i + " to " + (i + 1)); });
        }
        function onSearchImage(ev) {
            var el = $(ev.target).closest("[data-search-term]"), newValue = el.attr("data-search-term"), lowerValue = newValue.toLowerCase(), input = $("input.library-search"), currentValue = input.val(), lowerValues = currentValue.trim().toLowerCase().split(/\s+/);
            if (!lowerValues.includes(lowerValue)) {
                input.focus().val((currentValue + " " + newValue).trim()).blur();
                performSearch((currentValue + " " + newValue).trim().toLowerCase());
            }
        }
        function onSearchClear() {
            searching = null;
            $("input.library-search").val("");
            $("a[href=\"#card-table\"] > span.badge").text(String(bh.data.BattleCardRepo.length));
            $("a[href=\"#effect-table\"] > span.badge").text(String(bh.data.EffectRepo.length));
            $("a[href=\"#item-table\"] > span.badge").text(String(bh.data.ItemRepo.length));
            $("tbody > tr[id]").show();
        }
        function onSliderChange(ev) {
            var evo = $("#card-slider-evo").val(), level = $("#card-slider-level").val(), action = $(ev.target).closest("input[data-action]").data("action");
            $("#card-slider-types").html("<span style=\"padding-left:25px;\">" + evo + "." + ("0" + level).substr(-2) + "</span><br/>" + activeCard.typesTargets.map(function (type, typeIndex) { return bh.getImg20("cardtypes", type.split(" ")[0].replace("Damage", "Attack")) + (" " + type + " (" + bh.utils.formatNumber(getValue(typeIndex, evo, level)) + ")"); }).join("<br/>"));
        }
        function getValue(typeIndex, evolutionLevel, level) {
            var playerCard = { configId: activeCard.guid, evolutionLevel: evolutionLevel, level: level };
            return bh.BattleCardRepo.calculateValue(playerCard, typeIndex);
        }
        function getMinValue(typeIndex) { return getValue(typeIndex, 0, 0); }
        function getMaxValue(typeIndex) {
            var maxEvo = activeCard.rarityType + 1, maxLevel = bh.BattleCardRepo.getLevelsForRarity(activeCard.rarityType) - 1;
            return getValue(typeIndex, maxEvo, maxLevel);
        }
        var activeItem;
        function onShowItem(ev) {
            var link = $(ev.target), tr = link.closest("tr"), guid = tr.attr("id"), item = bh.data.ItemRepo.find(guid);
            activeItem = item;
            $("div.modal-item").modal("show");
            $("#item-name").html(item.name + " &nbsp; " + mapMatsToImages([item.name]).join(" "));
            $("#item-rarity").html(bh.utils.evoToStars(item.rarityType) + " " + bh.RarityType[item.rarityType]);
            $("#item-element").html(bh.ElementRepo.toImage(item.elementType) + " " + bh.ElementType[item.elementType]);
            var html = bh.data.DungeonRepo.getDropRates(item.name)
                .map(function (dropRate) { return "<tr><td>" + dropRate.dungeon.name + "</td><td>" + dropRate.dungeon.keys + " keys</td><td>" + Math.round(1000 * dropRate.dropRate.averagePerKey) / 10 + "% / key</td></tr>"; })
                .join("");
            $("#item-dungeons").html("<table class=\"table table-striped table-condensed\"><tbody>" + html + "</tbody></table>");
        }
        var activeCard;
        function onShowCard(ev) {
            var link = $(ev.target), tr = link.closest("tr"), guid = tr.attr("id"), card = bh.data.BattleCardRepo.find(guid);
            activeCard = card;
            $("div.modal-card").modal("show");
            $("#card-name").html(card.name + " &nbsp; " + mapHeroesToImages(card).join(" "));
            $("#card-image").attr("src", bh.getSrc("battlecards", "blank", cleanImageName(card.name)));
            $("#card-element").html(bh.ElementRepo.toImage(card.elementType) + " " + bh.ElementType[card.elementType]);
            $("#card-klass").html(bh.KlassRepo.toImage(card.klassType) + " " + bh.KlassType[card.klassType]);
            $("#card-klass").removeClass("Magic Might Skill").addClass(bh.KlassType[card.klassType]);
            $("#card-rarity").html(bh.utils.evoToStars(card.rarityType) + " " + bh.RarityType[card.rarityType]);
            $("#card-types").html(card.typesTargets.map(function (type, typeIndex) { return bh.getImg20("cardtypes", type.split(" ")[0].replace("Damage", "Attack")) + (" " + type.split(" ")[0].replace("Damage", "Attack") + " (" + bh.utils.formatNumber(getMinValue(typeIndex)) + " - " + bh.utils.formatNumber(getMaxValue(typeIndex)) + ")"); }).join("<br/>"));
            $("#card-turns").html(String(card.turns));
            $("div.panel-card span.card-brag").html(String(card.brag));
            $("div.panel-card span.card-min").html(card.minValues.map(function (v) { return v.join(); }).join(" :: "));
            $("div.panel-card span.card-max").html(card.maxValues.join(" :: "));
            $("div.panel-card span.card-mats").html(card.mats.join());
            $("#card-targets").html(bh.EffectRepo.mapTargets(card).map(function (target) { return bh.EffectRepo.toImage(target) + " " + target.name + "<br/>"; }).join(""));
            $("#card-effects").html(bh.EffectRepo.mapEffects(card).map(function (effect) { return bh.EffectRepo.toImage(effect) + " " + effect.name + "<br/>"; }).join(""));
            $("#card-perks").html(bh.EffectRepo.mapPerks(card).map(function (perk) { return bh.EffectRepo.toImage(perk) + " " + perk.name; }).join("<br/>"));
            $("div.panel-card span.card-perk").html(card.perkBase + "%");
            $("#card-mats").html(card.mats.map(function (mat) { return bh.data.ItemRepo.find(mat); }).map(function (mat) { return bh.ItemRepo.toImage(mat) + " " + mat.name; }).join("<br/>"));
            var recipe = new bh.Recipe(card), minGold = 0, maxGold = 0, tabs = $("#card-evolution > ul.nav > li").toArray();
            [0, 1, 2, 3, 4].forEach(function (index) {
                var evo = recipe.evos[index], target = "#evo-" + index + "-" + (index + 1), tab = $(tabs[index]).removeClass("disabled");
                if (!evo) {
                    $(target + " tbody").html("");
                    tab.addClass("disabled");
                    return;
                }
                var html = "", minGp = bh.data.getMinGoldNeeded(card.rarityType, evo.evoFrom), maxGp = bh.data.getMaxGoldNeeded(card.rarityType, evo.evoFrom);
                minGold += minGp;
                maxGold += maxGp;
                html += evoRow(bh.getImg("misc", "Coin"), "Gold", minGp, maxGp);
                evo.items.filter(function (item) { return !!item.max; })
                    .forEach(function (item) { return html += evoRow(bh.getImg20("evojars", cleanImageName(item.item.name)), item.item.name, item.min, item.max); });
                if (evo.evoTo == 5) {
                    var crystal = bh.data.ItemRepo.crystals.find(function (item) { return item.elementType == card.elementType; }), hero = bh.data.HeroRepo.all.find(function (hero) { return hero.elementType == card.elementType && hero.klassType == card.klassType; }), rune = bh.data.ItemRepo.runes.find(function (item) { return item.name.startsWith(hero.name); });
                    html += evoRow(bh.getImg20("crystals", bh.ElementType[card.elementType]), crystal.name, bh.data.getMinCrystalsNeeded(card.rarityType, evo.evoFrom), bh.data.getMaxCrystalsNeeded(card.rarityType, evo.evoFrom));
                    html += evoRow(bh.getImg20("runes", cleanImageName(hero.trait.name)), rune.name, bh.data.getMinRunesNeeded(card.rarityType, evo.evoFrom), bh.data.getMaxRunesNeeded(card.rarityType, evo.evoFrom));
                }
                $(target + " tbody").html(html);
            });
            var allEvos = recipe.all, allTBody = $("#evo-all tbody").html("");
            allTBody.append(evoRow(bh.getImg("misc", "Coin"), "Gold", minGold, maxGold));
            recipe.all.forEach(function (item) {
                allTBody.append(evoRow(bh.getImg20("evojars", cleanImageName(item.item.name)), item.item.name, item.min, item.max));
            });
            if (card.rarityType == bh.RarityType.Legendary) {
                var crystal = bh.data.ItemRepo.crystals.find(function (item) { return item.elementType == card.elementType; }), hero = bh.data.HeroRepo.all.find(function (hero) { return hero.elementType == card.elementType && hero.klassType == card.klassType; }), rune = bh.data.ItemRepo.runes.find(function (item) { return item.name.startsWith(hero.name); });
                allTBody.append(evoRow(bh.getImg20("crystals", bh.ElementType[card.elementType]), crystal.name, bh.data.getMinCrystalsNeeded(card.rarityType, 0), bh.data.getMaxCrystalsNeeded(card.rarityType, 4)));
                allTBody.append(evoRow(bh.getImg20("runes", cleanImageName(hero.trait.name)), rune.name, bh.data.getMinRunesNeeded(card.rarityType, 0), bh.data.getMaxRunesNeeded(card.rarityType, 4)));
            }
            $("#card-evolution .active").removeClass("active");
            $("#card-evolution > ul.nav > li").first().addClass("active");
            $("#card-evolution > div.tab-content > div.tab-pane").first().addClass("active");
            $("#card-slider-evo").val(0).attr("max", card.rarityType + 1);
            $("#card-slider-evo-labels-table tbody").html((new Array(card.rarityType + 2)).fill(1).map(function (_, evo) { return "<td class=\"text-" + (evo ? evo == card.rarityType + 1 ? "right" : "center" : "left") + "\">" + evo + "</td>"; }).join(""));
            var levelsForRarity = bh.BattleCardRepo.getLevelsForRarity(card.rarityType), levelSliderLevels = levelsForRarity == 10 ? [1, 5, 10] : levelsForRarity == 20 ? [1, 5, 10, 15, 20] : levelsForRarity == 35 ? [1, 5, 10, 15, 20, 25, 30, 35] : [1, 10, 20, 30, 40, 50];
            $("#card-slider-level").val(1).attr("max", levelsForRarity);
            $("#card-slider-level-labels-table tbody").html(levelSliderLevels.map(function (level, index) { return "<td class=\"text-" + (index ? index == levelSliderLevels.length - 1 ? "right" : "center" : "left") + "\">" + level + "</td>"; }).join(""));
            $("#card-slider-types").html("<span style=\"padding-left:25px;\">0.01</span><br/>" + card.typesTargets.map(function (type, typeIndex) { return bh.getImg20("cardtypes", type.split(" ")[0].replace("Damage", "Attack")) + (" " + type + " (" + bh.utils.formatNumber(getMinValue(typeIndex)) + ")"); }).join("<br/>"));
        }
        function evoRow(image, name, min, max) {
            return "<tr><td class=\"icon\">" + image + "</td><td class=\"name\">" + name + "</td><td class=\"min\">" + bh.utils.formatNumber(min) + "</td><td class=\"max\">" + bh.utils.formatNumber(max) + "</td></tr>";
        }
        var filtered = { card: {}, effect: {}, item: {}, dungeon: {} };
        var searching;
        function onSearch(ev) {
            performSearch($(ev.target).val().trim().toLowerCase());
        }
        function performSearch(lower) {
            if (!lower)
                return onSearchClear();
            searching = lower;
            ["card", "effect", "item", "dungeon"].forEach(function (which) { return setTimeout(function (lower) { matchAndToggle(which, lower); }, 0, lower); });
        }
        function getAll(which) {
            switch (which) {
                case "card": return bh.data.BattleCardRepo.all;
                case "effect": return bh.data.EffectRepo.all;
                case "item": return bh.data.ItemRepo.all;
                case "dungeon": return bh.data.DungeonRepo.all;
                default: return [];
            }
        }
        var tests = {};
        function setCardTests(card) {
            if (!tests[card.guid]) {
                var list = tests[card.guid] = [];
                if (card.brag)
                    list.push("brag");
                card.effects.forEach(function (s) { return list.push(s.toLowerCase().replace(/shield break(er)?/, "crush")); });
                list.push(bh.ElementType[card.elementType].toLowerCase());
                list.push(bh.KlassType[card.klassType].toLowerCase());
                list.push(card.lower);
                card.mats.forEach(function (s) { return list.push(s.toLowerCase()); });
                card.perks.forEach(function (s) { return list.push(s.toLowerCase()); });
                list.push(bh.RarityType[card.rarityType].toLowerCase());
                list.push(String(card.turns));
                card.typesTargets.forEach(function (s) { return list.push(s.toLowerCase().split(" (")[0]); });
                bh.data.HeroRepo.all.filter(function (hero) { return hero.klassType == card.klassType && (card.elementType == bh.ElementType.Neutral || hero.elementType == card.elementType); }).forEach(function (hero) { return list.push(hero.lower); });
                if (player)
                    list.push(player.battleCards.find(function (playerBattleCard) { return playerBattleCard.guid == card.guid; }) ? "have" : "need");
            }
            return tests[card.guid] || [];
        }
        function setEffectTests(effect) {
            if (!tests[effect.guid]) {
                var list = tests[effect.guid] = [];
                list.push(effect.description.toLowerCase());
                list.push(effect.lower);
            }
            return tests[effect.guid] || [];
        }
        function setItemTests(item) {
            if (!tests[item.guid]) {
                var list = tests[item.guid] = [];
                list.push(bh.ElementType[item.elementType].toLowerCase());
                list.push(bh.ItemType[item.itemType].toLowerCase());
                list.push(item.lower);
                list.push(bh.RarityType[item.rarityType].toLowerCase());
            }
            return tests[item.guid] || [];
        }
        function setDungeonTests(dungeon) {
            if (!tests[dungeon.guid]) {
                var list = tests[dungeon.guid] = [];
                list.push(dungeon.lower);
                dungeon.mats.forEach(function (s) { return list.push(s.name.toLowerCase()); });
            }
            return tests[dungeon.guid] || [];
        }
        var elementLowers = bh.ElementRepo.allTypes.map(function (type) { return bh.ElementType[type].toLowerCase(); });
        var rarityLowers = bh.RarityRepo.allTypes.map(function (type) { return bh.RarityType[type].toLowerCase(); });
        var heroNameLowers = null;
        function matchTests(which, tests, word) {
            if (which == "effect")
                return matchTestsIncludes(tests, word);
            if (!heroNameLowers)
                heroNameLowers = bh.data.HeroRepo.all.map(function (hero) { return hero.lower; });
            return elementLowers.includes(word) || rarityLowers.includes(word) || heroNameLowers.includes(word) ? matchTestsEquals(tests, word) : matchTestsIncludes(tests, word);
        }
        function matchTestsEquals(tests, word) {
            return tests.find(function (test) { return test == word; });
        }
        function matchTestsIncludes(tests, word) {
            return tests.find(function (test) { return test.includes(word); });
        }
        function matchAndToggle(which, search) {
            if (!filtered[which][search]) {
                var words = search.split(/\s+/);
                filtered[which][search] = getAll(which)
                    .filter(function (item) { return !words.find(function (word) { return !matchTests(which, tests[item.guid] || [], word); }); })
                    .map(function (item) { return item.guid; });
            }
            var badge = $("a[href=\"#" + which + "-table\"] > span.badge"), show = filtered[which][search] || [], hide = getAll(which).map(function (item) { return item.guid; }).filter(function (guid) { return !show.includes(guid); });
            if (search != searching)
                return;
            $("#" + show.join(",#")).show();
            $("#" + hide.join(",#")).hide();
            badge.text(String(show.length));
        }
        function mapPerksEffects(card) {
            var list = [];
            bh.EffectRepo.mapTargets(card).forEach(function (target) { return !list.includes(target) ? list.push(target) : void 0; });
            bh.EffectRepo.mapEffects(card).forEach(function (effect) { return !list.includes(effect) ? list.push(effect) : void 0; });
            bh.EffectRepo.mapPerks(card).forEach(function (perk) { return !list.includes(perk) ? list.push(perk) : void 0; });
            return list.reduce(function (out, item) { return ["Self", "Single"].includes(item.name) ? out : out.concat([item]); }, []);
        }
        function cleanPerkEffectSearchTerm(term) {
            return term
                .replace("Splash Damage", "Splash")
                .replace("Multi-Target (Ally)", "Multi")
                .replace("Multi-Target (Enemy)", "Multi");
        }
        function mapPerksEffectsToImages(card) {
            return mapPerksEffects(card)
                .map(function (item) { return renderIcon(item.guid, cleanPerkEffectSearchTerm(item.name), item.name + ": " + item.description); });
        }
        function mapMatsToImages(mats) {
            return mats.map(function (mat) { return bh.data.ItemRepo.find(mat); })
                .map(function (item) { return renderIcon(item.guid, item.name, item.name + ": " + bh.RarityType[item.rarityType] + " " + bh.ElementType[item.elementType] + " " + bh.ItemType[item.itemType] + " (" + bh.utils.formatNumber(bh.ItemRepo.getValue(item.itemType, item.rarityType)) + " gold)"); });
        }
        function mapHeroesToImages(card) {
            return bh.data.HeroRepo.all
                .filter(function (hero) { return (card.elementType == bh.ElementType.Neutral || hero.elementType == card.elementType) && hero.klassType == card.klassType; })
                .map(function (hero) { return renderIcon(hero.guid, hero.name, hero.name + ": " + bh.ElementType[hero.elementType] + " " + bh.KlassType[hero.klassType] + " Hero"); });
        }
        function mapRarityToStars(rarityType) {
            return "<span class=\"stars\" title=\"" + bh.RarityType[rarityType] + "\" data-toggle=\"tooltip\" data-placement=\"top\">" + bh.utils.evoToStars(rarityType) + "</span>";
        }
        function render() {
            bh.css.addCardTypes($);
            bh.css.addEffects($);
            bh.css.addElements($);
            bh.css.addHeroes($);
            bh.css.addItems($);
            bh.css.addKlasses($);
            renderEffects();
            renderItems();
            renderCards();
            renderDungeons();
            $("div.row.alert-row").remove();
            $("div.row.table-row").show();
            $('[data-toggle="tooltip"]').tooltip();
        }
        function renderIcon(guid, term, title, hiddenXs) {
            if (term === void 0) { term = guid; }
            if (title === void 0) { title = term; }
            if (hiddenXs === void 0) { hiddenXs = false; }
            return "<div class=\"" + (hiddenXs ? "hidden-xs" : "") + " bh-hud-image img-" + guid + "\" title=\"" + title + "\" data-toggle=\"tooltip\" data-placement=\"top\" data-search-term=\"" + term + "\"></div>";
        }
        function renderCards() {
            var complete = location.search.includes("complete");
            var cards = bh.data.BattleCardRepo.all;
            $("a[href=\"#card-table\"] > span.badge").text(String(cards.length));
            var tbody = $("table.card-list > tbody").html("");
            cards.forEach(function (card) {
                setCardTests(card);
                var owned = player && player.battleCards.find(function (bc) { return card.guid == bc.guid; });
                var html = "<tr id=\"" + card.guid + "\">";
                if (player)
                    html += "<td><span class=\"card-owned glyphicon " + (owned ? "glyphicon-ok text-success" : "glyphicon-remove text-danger") + "\" title=\"" + (owned ? "Have" : "Need") + "\" data-toggle=\"tooltip\" data-placement=\"top\"></span></td>";
                html += "<td><div class=\"bh-hud-image img-" + (card.brag ? "Brag" : "BattleCard") + "\" title=\"" + (card.brag ? "Brag" : "BattleCard") + "\" data-toggle=\"tooltip\" data-placement=\"top\"></div></td>";
                html += "<td><span class=\"card-name\"><a class=\"btn btn-link\" data-action=\"show-card\" style=\"padding:0;\">" + card.name + "</a></span></td>";
                html += "<td class=\"text-center\"><span class=\"card-rating\">" + bh.utils.formatNumber(bh.PowerRating.rateBattleCard(card, bh.MinMaxType.Max)) + "</span></td>";
                if (complete)
                    html += "<td class=\"text-center\" data-search-term=\"" + bh.RarityType[card.rarityType] + "\">" + mapRarityToStars(card.rarityType) + "</td>";
                if (complete)
                    html += "<td>" + renderIcon(bh.ElementType[card.elementType]) + "</td>";
                if (complete)
                    html += "<td>" + renderIcon(bh.KlassType[card.klassType], undefined, undefined, true) + "</td>";
                html += "<td>" + mapHeroesToImages(card).join("") + "</td>";
                if (complete)
                    html += "<td class=\"hidden-xs\">" + mapPerksEffectsToImages(card).join("") + "</td>";
                if (complete)
                    html += "<td class=\"hidden-xs\">" + mapMatsToImages(card.mats).join("") + "</td>";
                html += "<td class=\"hidden-xs\" style=\"width:100%;\"></td>";
                html += "</td></tr>";
                tbody.append(html);
            });
        }
        function renderEffects() {
            var effects = bh.data.EffectRepo.all;
            $("a[href=\"#effect-table\"] > span.badge").text(String(effects.length));
            var tbody = $("table.effect-list > tbody");
            effects.forEach(function (effect) {
                setEffectTests(effect);
                var html = "<tr id=\"" + effect.guid + "\">";
                html += "<td><div class=\"bh-hud-image img-" + effect.guid + "\"></div></td>";
                html += "<td><span class=\"card-name\">" + effect.name + "</span><div class=\"visible-xs-block\" style=\"border-top:1px dotted #666;\">" + effect.description + "</div></td>";
                html += "<td class=\"hidden-xs\" style=\"width:100%;\"><span class=\"card-description\">" + effect.description + "</span></td>";
                html += "</td></tr>";
                tbody.append(html);
            });
        }
        function renderItems() {
            var items = bh.data.ItemRepo.all;
            $("a[href=\"#item-table\"] > span.badge").text(String(items.length));
            var tbody = $("table.mat-list > tbody");
            items.forEach(function (item) {
                var owned = player && player.inventory.find(function (playerInventoryItem) { return playerInventoryItem.guid == item.guid; });
                setItemTests(item);
                var html = "<tr id=\"" + item.guid + "\">";
                html += "<td><div class=\"bh-hud-image img-" + item.guid + "\"></div></td>";
                html += "<td><span class=\"card-name\"><a class=\"btn btn-link\" data-action=\"show-item\" style=\"padding:0;\">" + item.name + "</a></span></td>";
                html += "<td>" + mapRarityToStars(item.rarityType) + "</td>";
                if (player) {
                    html += "<td><span class=\"badge\">" + bh.utils.formatNumber(owned && owned.count || 0) + "</span></td>";
                }
                html += "<td class=\"hidden-xs\" style=\"width:100%;\"></td>";
                html += "</td></tr>";
                tbody.append(html);
            });
        }
        function renderDungeons() {
            var dungeons = bh.data.DungeonRepo.all;
            $("a[href=\"#dungeon-table\"] > span.badge").text(String(dungeons.length));
            var tbody = $("table.dungeon-list > tbody");
            dungeons.forEach(function (dungeon) {
                setDungeonTests(dungeon);
                var html = "<tr id=\"" + dungeon.guid + "\">";
                html += "<td><span class=\"\">" + dungeon.name + "</span></td>";
                html += "<td><span class=\"\">" + bh.getImg20("keys", "SilverKey") + " " + dungeon.keys + "</span></td>";
                html += "<td><span class=\"\">" + bh.getImg20("misc", "Fame") + " " + bh.utils.formatNumber(dungeon.fame) + "</span></td>";
                html += "<td><span class=\"\">" + bh.getImg20("keys", "RaidTicket") + "</span></td>";
                html += "<td><span class=\"\">" + bh.getImg20("misc", "Coin") + " " + bh.utils.formatNumber(dungeon.gold) + " <small>(" + bh.utils.formatNumber(Math.round(dungeon.gold / dungeon.keys)) + " / key)</small></span></td>";
                try {
                    html += "<td><span class=\"\">" + dungeon.elementTypes.map(function (elementType) { return "<div class=\"bh-hud-image img-" + bh.ElementType[elementType] + "\"></div>"; }).join("") + "</span></td>";
                    html += "<td/>";
                    html += "<td/>";
                    html += "<td><span>" + mapMatsToImages(dungeon.mats.map(function (m) { return m.name; })).join("") + "</span></td>";
                    html += "<td><span class=\"\">" + dungeon.randomMats.map(function (count, rarityType) { return count ? bh.getImg20("evojars", "random", bh.RarityType[rarityType] + "_Neutral_Small") + count : ""; }).join(" ") + "</span></td>";
                }
                catch (ex) {
                    console.error(ex);
                }
                html += "<td class=\"hidden-xs\" style=\"width:100%;\"></td>";
                html += "</td></tr>";
                tbody.append(html);
            });
        }
    })(library = bh.library || (bh.library = {}));
})(bh || (bh = {}));
var bh;
(function (bh) {
    var utils;
    (function (utils) {
        var sort;
        (function (sort) {
            function byElement(a, b) {
                return a.elementType == b.elementType ? 0 : a.elementType < b.elementType ? -1 : 1;
            }
            sort.byElement = byElement;
            function byElementThenKlass(a, b) {
                return byElement(a, b) || byKlass(a, b);
            }
            sort.byElementThenKlass = byElementThenKlass;
            function byElementThenName(a, b) {
                return byElement(a, b) || byName(a, b);
            }
            sort.byElementThenName = byElementThenName;
            function byElementThenRarityThenName(a, b) {
                return byElement(a, b) || byRarityThenName(a, b);
            }
            sort.byElementThenRarityThenName = byElementThenRarityThenName;
            function byKlass(a, b) {
                return a.klassType == b.klassType ? 0 : a.klassType < b.klassType ? -1 : 1;
            }
            sort.byKlass = byKlass;
            function byEvoLevel(a, b) {
                return a.evoLevel == b.evoLevel ? 0 : +a.evoLevel < +b.evoLevel ? -1 : 1;
            }
            sort.byEvoLevel = byEvoLevel;
            function byEvoLevelThenName(a, b) {
                return byEvoLevel(a, b) || byName(a, b);
            }
            sort.byEvoLevelThenName = byEvoLevelThenName;
            function byName(a, b) {
                var an = a.lower || a.name.toLowerCase(), bn = a.lower || b.name.toLowerCase();
                if (an == "sands of time")
                    return -1;
                if (bn == "sands of time")
                    return 1;
                return an == bn ? 0 : an < bn ? -1 : 1;
            }
            sort.byName = byName;
            function byPosition(a, b) {
                var ap = bh.PositionType[a.position], bp = bh.PositionType[b.position];
                return ap == bp ? 0 : ap > bp ? -1 : 1;
            }
            sort.byPosition = byPosition;
            function byPositionThenName(a, b) {
                return byPosition(a, b) || byName(a, b);
            }
            sort.byPositionThenName = byPositionThenName;
            function byRarity(a, b) {
                return a.rarityType == b.rarityType ? 0 : a.rarityType < b.rarityType ? -1 : 1;
            }
            sort.byRarity = byRarity;
            function byRarityThenName(a, b) {
                return byRarity(a, b) || byName(a, b);
            }
            sort.byRarityThenName = byRarityThenName;
            function byRarityThenNameThenEvoLevel(a, b) {
                return byRarity(a, b) || byName(a, b) || byEvoLevel(a, b);
            }
            sort.byRarityThenNameThenEvoLevel = byRarityThenNameThenEvoLevel;
        })(sort = utils.sort || (utils.sort = {}));
    })(utils = bh.utils || (bh.utils = {}));
})(bh || (bh = {}));
var XmlHttpRequest = (function () {
    function XmlHttpRequest() {
        var _this = this;
        this.responseFilter = null;
        var original = XmlHttpRequest.original || XMLHttpRequest;
        this.xmlHttpRequest = new original();
        XmlHttpRequest.globalListeners.forEach(function (args) {
            try {
                var sliced = args.slice(), fn = sliced[1];
                sliced[1] = function () {
                    var evArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        evArgs[_i] = arguments[_i];
                    }
                    try {
                        fn.apply(_this, evArgs);
                    }
                    catch (e) {
                        console.error("XmlHttpRequest: Firing Global EventListener", e);
                    }
                };
                _this.addEventListener.apply(_this, sliced);
            }
            catch (ex) {
                console.error("XmlHttpRequest: Adding Global EventListeners", ex);
            }
        });
    }
    Object.defineProperty(XmlHttpRequest.prototype, "onabort", {
        get: function () { return this.xmlHttpRequest.onabort; },
        set: function (fn) { this.xmlHttpRequest.onabort = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "onerror", {
        get: function () { return this.xmlHttpRequest.onerror; },
        set: function (fn) { this.xmlHttpRequest.onerror = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "onload", {
        get: function () { return this.xmlHttpRequest.onload; },
        set: function (fn) { this.xmlHttpRequest.onload = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "onloadend", {
        get: function () { return this.xmlHttpRequest.onloadend; },
        set: function (fn) { this.xmlHttpRequest.onloadend = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "onloadstart", {
        get: function () { return this.xmlHttpRequest.onloadstart; },
        set: function (fn) { this.xmlHttpRequest.onloadstart = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "onreadystatechange", {
        get: function () { return this.xmlHttpRequest.onreadystatechange; },
        set: function (fn) { this.xmlHttpRequest.onreadystatechange = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "onprogress", {
        get: function () { return this.xmlHttpRequest.onprogress; },
        set: function (fn) { this.xmlHttpRequest.onprogress = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "ontimeout", {
        get: function () { return this.xmlHttpRequest.ontimeout; },
        set: function (fn) { this.xmlHttpRequest.ontimeout = fn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "readyState", {
        get: function () { return this.xmlHttpRequest.readyState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "response", {
        get: function () { return this.xmlHttpRequest.response; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "responseJSON", {
        get: function () {
            if (this.responseType == "json") {
                return this.xmlHttpRequest.response;
            }
            try {
                return JSON.parse(this.responseText);
            }
            catch (ex) {
                console.error("XmlHttpRequest.responseJSON", ex);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "responseText", {
        get: function () {
            var responseType = this.responseType;
            if (responseType == "arraybuffer") {
                var contentType = this.getResponseHeader("Content-Type"), uaConstructor = contentType.match(/UTF\-32/i) ? Uint32Array : contentType.match(/UTF\-16/i) ? Uint16Array : Uint8Array;
                return XmlHttpRequest.arrayBufferToString(this.xmlHttpRequest.response, uaConstructor);
            }
            else if (responseType == "json") {
                return JSON.stringify(this.xmlHttpRequest.response);
            }
            else {
                return this.xmlHttpRequest.responseText;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "responseType", {
        get: function () { return this.xmlHttpRequest.responseType; },
        set: function (type) { this.xmlHttpRequest.responseType = type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "responseXML", {
        get: function () { return this.xmlHttpRequest.responseXML; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "status", {
        get: function () { return this.xmlHttpRequest.status; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "statusText", {
        get: function () { return this.xmlHttpRequest.statusText; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "timeout", {
        get: function () { return this.xmlHttpRequest.timeout; },
        set: function (value) { this.xmlHttpRequest.timeout = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "withCredentials", {
        get: function () { return this.xmlHttpRequest.withCredentials; },
        set: function (value) { this.xmlHttpRequest.withCredentials = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlHttpRequest.prototype, "upload", {
        get: function () { return this.xmlHttpRequest.upload; },
        enumerable: true,
        configurable: true
    });
    XmlHttpRequest.prototype.abort = function () { this.xmlHttpRequest.abort(); };
    XmlHttpRequest.prototype.addEventListener = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.xmlHttpRequest.addEventListener.apply(this.xmlHttpRequest, args);
    };
    XmlHttpRequest.prototype.getAllResponseHeaders = function () { return this.xmlHttpRequest.getAllResponseHeaders(); };
    XmlHttpRequest.prototype.getResponseHeader = function (header) { return this.xmlHttpRequest.getResponseHeader(header); };
    XmlHttpRequest.prototype.open = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.method = args[0] || "";
        this.requestUrl = args[1] || "";
        this.xmlHttpRequest.open.apply(this.xmlHttpRequest, args);
    };
    XmlHttpRequest.prototype.overrideMimeType = function (mime) { this.xmlHttpRequest.overrideMimeType(mime); };
    XmlHttpRequest.prototype.send = function (data) { this.xmlHttpRequest.send(data); };
    XmlHttpRequest.prototype.setRequestHeader = function (header, value) { this.xmlHttpRequest.setRequestHeader(header, value); };
    XmlHttpRequest.addEventListener = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        XmlHttpRequest.globalListeners.push(args);
    };
    XmlHttpRequest.attach = function (win, listener) {
        XmlHttpRequest.original = win.XMLHttpRequest;
        win.XMLHttpRequest = XmlHttpRequest;
        if (listener) {
            XmlHttpRequest.addEventListener("readystatechange", listener);
        }
    };
    XmlHttpRequest.uintArrayToString = function (uintArray) {
        try {
            var CHUNK_SZ = 0x8000, characters = [];
            for (var i = 0, l = uintArray.length; i < l; i += CHUNK_SZ) {
                characters.push(String.fromCharCode.apply(null, uintArray.subarray(i, i + CHUNK_SZ)));
            }
            return decodeURIComponent(escape(characters.join("")));
        }
        catch (ex) {
            console.error("XmlHttpRequest.uintArrayToString", ex);
        }
    };
    XmlHttpRequest.stringToUintArray = function (string, uintArrayConstructor) {
        try {
            var encoded = unescape(encodeURIComponent(string)), charList = encoded.split(''), uintArray = [];
            for (var i = charList.length; i--;) {
                uintArray[i] = charList[i].charCodeAt(0);
            }
            return new uintArrayConstructor(uintArray);
        }
        catch (ex) {
            console.error("XmlHttpRequest.stringToUintArray", ex);
        }
    };
    XmlHttpRequest.arrayBufferToString = function (arrayBuffer, uintArrayConstructor) {
        try {
            if (!uintArrayConstructor) {
                uintArrayConstructor = arrayBuffer instanceof Uint32Array ? Uint32Array : arrayBuffer instanceof Uint16Array ? Uint16Array : Uint8Array;
            }
            var uintArray = new uintArrayConstructor(arrayBuffer);
            return XmlHttpRequest.uintArrayToString(uintArray);
        }
        catch (ex) {
            console.error("XmlHttpRequest.arrayBufferToString", ex);
        }
        return null;
    };
    XmlHttpRequest.get = function (url) {
        return new Promise(function (res, rej) {
            var xhr = new XmlHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (xhr.readyState == XmlHttpRequest.DONE) {
                    res(xhr.responseText);
                }
            });
            xhr.open("GET", url, true);
            xhr.send(null);
        });
    };
    XmlHttpRequest.getJSON = function (url) {
        return new Promise(function (res, rej) {
            var xhr = new XmlHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (xhr.readyState == XmlHttpRequest.DONE) {
                    res(xhr.responseJSON);
                }
            });
            xhr.open("GET", url, true);
            xhr.send(null);
        });
    };
    XmlHttpRequest.post = function (url, data, contentType) {
        return new Promise(function (res, rej) {
            var xhr = new XmlHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (xhr.readyState == XmlHttpRequest.DONE) {
                    res(xhr);
                }
            });
            xhr.open("POST", url, true);
            if (contentType) {
                xhr.setRequestHeader("Content-Type", contentType);
            }
            xhr.send(data);
        });
    };
    XmlHttpRequest.DONE = XMLHttpRequest.DONE;
    XmlHttpRequest.HEADERS_RECEIVED = XMLHttpRequest.HEADERS_RECEIVED;
    XmlHttpRequest.LOADING = XMLHttpRequest.LOADING;
    XmlHttpRequest.OPENED = XMLHttpRequest.OPENED;
    XmlHttpRequest.UNSENT = XMLHttpRequest.UNSENT;
    XmlHttpRequest.globalListeners = [];
    return XmlHttpRequest;
}());
