// ==UserScript==
// @name         BattleHand HUD
// @namespace    http://bh.elvenintrigue.com
// @version      4.0.0
// @description  BattleHand QoL HUD / Scout interface; Donations may be sent via paypal to randal.t.meyer@gmail.com
// @author       Jai (feat. SyntheeR)
// @updateURL    http://bh.elvenintrigue.com/hud/BattleHandHUD.js
// @require      http://bh.elvenintrigue.com/hud/4.0.0/default.min.js
// @include      http://game261051.konggames.com/*
// @include      http://www.kongregate.com/games/AnotherPlaceProd/*
// @grant        unsafeWindow
// ==/UserScript==

var DataSheetID = "1uXkC_xua7KhhWQsfX_CZNa6fyl9CJlV9E7KNDO4_1T4";
var BattleCardRepoGID = 1013492615;
var BoosterCardRepoGID = 1070164839;
var DungeonRepoGID = 1980099142;
var EffectRepoGID = 1091073205;
var HeroRepoGID = 1755919442;
var ItemRepoGID = 1250310062;
var WildCardRepoGID = 2106503523;
var GuildsGID = 496437953;
var MaxHeroCount = 13;
var MaxFameLevel = 45;
var AttackDivisor = 750;
var ShieldDivisor = 1500;
var HealDivisor = 1500;
bh.hud.listener.init(unsafeWindow);
