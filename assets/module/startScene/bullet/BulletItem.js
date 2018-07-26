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
        // checkToggle: { displayName: 'checkToggle', default: null, type: cc.Toggle },
        _data: null,
        spCheck: { displayName: 'spCheck', default: null, type: cc.Sprite },
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
                this.spCheck.node.active = true;
                GameData.ball[data.index].locked = 1;
                Util.updateGameCfgOfBall(data.index);
            } else {
                this.spCheck.node.active = false;
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
        this.spMask.node.active = this._data.locked === 1 ? false : true;
        this.spCheck.node.active = GameCfg.ball.index === this._data.index ? true : false;
    },

    onToggleClickToCheck() {
        if (this.checkToggle.isChecked === false) {
            this.checkToggle.isChecked = true;
            return;
        }
        let data = this._data;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChooseBall, data);
    },

    onBtnClickToBall() {
        if (this._data === null || this._data === undefined) {
            return;
        }
        if (this._data.locked === 0) {
            return;
        }
        if (this.spCheck.node.active === true) {
            return;
        }
        console.log('this._data.owned: ', this._data.owned);
        if (this._data.owned === 1) {
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BuyBall, null);
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChooseBall, this._data);
            return;
        }

        let _ownedScore = Util.getOwnedScore();
        if (parseInt(_ownedScore) < parseInt(this._data.lockedCost)) {
            return;
        }
        let left = parseInt(_ownedScore) - parseInt(this._data.lockedCost)
        Util.saveOwnedScore(left);
        GameData.ball[this._data.index].owned = 1;
        this._data.owned = 1;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BuyBall, null);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChooseBall, this._data);
    }
});
