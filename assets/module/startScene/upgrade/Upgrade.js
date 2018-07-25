let Observer = require('Observer');
let UIMgr = require('UIMgr');

cc.Class({
    extends: Observer,

    properties: {
        touchLayer: { displayName: 'touchLayer', default: null, type: cc.Node },
        lblSpeedLevel: { displayName: 'lblSpeedLevel', default: null, type: cc.Label },
        lblSpeedCost: { displayName: 'lblSpeedCost', default: null, type: cc.Label },
        lblPowerLevel: { displayName: 'lblPowerLevel', default: null, type: cc.Label },
        lblPowerCost: { displayName: 'lblPowerCost', default: null, type: cc.Label },
        lblOwnedScore: { displayName: 'lblOwnedScore', default: null, type: cc.Label },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },

    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
        this.touchLayer.on('touchstart', function (event) {
            return true;
        }.bind(this));

        this.touchLayer.on('touchend', function (event) {
            UIMgr.destroyUI(this);
        }.bind(this));
    },

    start() {

    },

    // update (dt) {},

    onBtnClickToUpgradeSpeed() {

    },

    onBtnClickToUpgradePower() {

    },

    initView(data) {

    }
});
