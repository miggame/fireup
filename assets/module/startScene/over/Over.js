let Observer = require('Observer');
let UIMgr = require('UIMgr');

cc.Class({
    extends: Observer,

    properties: {
        lblBestScore: { displayName: 'lblBestScore', default: null, type: cc.Label },
        lblTotalScore: { displayName: 'lblTotalScore', default: null, type: cc.Label },
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

    showTotalAndBestScore(totalScore, bestScore) {
        this.lblBestScore.string = bestScore;
        this.lblTotalScore.string = "+" + totalScore;
    }
});