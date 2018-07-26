let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');
let Util = require('Util');

cc.Class({
    extends: Observer,

    properties: {
        lblOwnedScore: { displayName: 'lblOwnedScore', default: null, type: cc.Label },
        lblTotalScore: { displayName: 'lblTotalScore', default: null, type: cc.Label },
        lblSpeedLevel: { displayName: 'lblSpeedLevel', default: null, type: cc.Label },
        lblSpeedCost: { displayName: 'lblSpeedCost', default: null, type: cc.Label },
        lblPowerLevel: { displayName: 'lblPowerLevel', default: null, type: cc.Label },
        lblPowerCost: { displayName: 'lblPowerCost', default: null, type: cc.Label },
        _data: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },

    _onMsg(msg, data) {

    },

    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},

    onBtnClickToReplay() {
        UIMgr.destroyUI(this);
        cc.director.loadScene('StartScene');
    },

    showTotalAndOwnedScore(totalScore, ownedScore) {
        this.lblOwnedScore.string = ownedScore;
        this.lblTotalScore.string = "+" + totalScore;
        this._data = GameCfg.player;

        let curBulletPowerLevel = this._data.bulletPowerLevel;
        let curBulletSpeedLevel = this._data.bulletSpeedLevel;
        let nextPowerLevel = curBulletPowerLevel + 1;
        let nextSpeedLevel = curBulletSpeedLevel + 1;
        this.lblPowerLevel.string = nextPowerLevel;
        this.lblSpeedLevel.string = nextSpeedLevel;

        let speedCost = Util.getSpeedCost(nextSpeedLevel);
        let powerCost = Util.getPowerCost(nextPowerLevel);
        this.lblSpeedCost.string = speedCost;
        this.lblPowerCost.string = powerCost;
    },

    onBtnClickToUpgradeSpeed() {
        let ownedScore = Util.getOwnedScore();
        let speedCost = Util.getSpeedCost(this._data.bulletSpeedLevel + 1);
        if (parseInt(speedCost) > parseInt(ownedScore)) {
            return;
        }
        let left = parseInt(ownedScore) - parseInt(speedCost);
        Util.saveOwnedScore(left);
        this.lblOwnedScore.string = left;
        Util.upgradeSpeedLevelGameCfgOfPlayer();
        this.lblSpeedLevel.string = this._data.bulletSpeedLevel + 1;
        this.lblSpeedCost.string = Util.getSpeedCost(this._data.bulletSpeedLevel + 1);
    },

    onBtnClickToUpgradePower() {
        let ownedScore = Util.getOwnedScore();
        let powerCost = Util.getSpeedCost(this._data.bulletPowerLevel + 1);
        if (parseInt(powerCost) > parseInt(ownedScore)) {
            return;
        }
        let left = parseInt(ownedScore) - parseInt(powerCost);
        Util.saveOwnedScore(left);
        this.lblOwnedScore.string = left;
        Util.upgradePowerLevelGameCfgOfPlayer();
        this.lblPowerLevel.string = this._data.bulletPowerLevel + 1;
        this.lblPowerCost.string = Util.getPowerCost(this._data.bulletPowerLevel + 1);
    },
});
