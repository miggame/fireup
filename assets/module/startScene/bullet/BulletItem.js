let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let GameCfg = require('GameCfg');
let GameData = require('GameData');
let Util = require('Util');

cc.Class({
    extends: Observer,

    properties: {
        spBullet: { displayName: 'spBullet', default: null, type: cc.Sprite },
        spMask: { displayName: 'spMask', default: null, type: cc.Sprite },
        checkToggle: { displayName: 'checkToggle', default: null, type: cc.Toggle },
        _data: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.ChooseBall
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.ChooseBall) {
            if (this._data.index === data.index) {
                this.checkToggle.isChecked = true;
                GameData.ball[data.index].locked = 1;
                Util.updateGameCfgOfBall(data.index);
                console.log('GameCfg.ball: ', GameCfg.ball);
            } else {
                this.checkToggle.isChecked = false;
            }
        }
    },

    onLoad() {
        this._initMsg();
        this.spMask.node.active = true;
    },

    start() {

    },

    // update (dt) {},

    initView(data) {
        this._data = data;
        let tempColor = new cc.color(data.color);
        this.spBullet.node.color = tempColor;
        let locked = data.locked;
        this.spMask.node.active = this._data.locked === 1 ? false : true;
        if (GameCfg.ball.index === this._data.index) {
            this.checkToggle.isChecked = true;
        }
    },

    onToggleClickToCheck() {
        if (this.checkToggle.isChecked === false) {
            this.checkToggle.isChecked = true;
            return;
        }
        let data = this._data;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChooseBall, data);
    }
});
