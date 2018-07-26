let UIMgr = require('UIMgr');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let Util = require('Util');
let GameCfg = require('GameCfg');
let GameData = require('GameData');

cc.Class({
    extends: Observer,

    properties: {
        spPlayer: { displayName: 'spPlayer', default: null, type: cc.Sprite },
        lblTypeName: { displayName: 'lblTypeName', default: null, type: cc.Label },
        spBg: { displayName: 'spBg', default: null, type: cc.Sprite },
        spMask: { displayName: 'spMask', default: null, type: cc.Sprite },
        checkToggle: { displayName: 'checkToggle', default: null, type: cc.Toggle },
        _data: null,
        spCheck: { displayName: 'spCheck', default: null, type: cc.Sprite },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.ChoosePlayer
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.ChoosePlayer) {
            if (this._data !== undefined) {
                if (this._data.index === data.index) {
                    this.spCheck.node.active = true;
                    Util.updateGameCfgOfPlayer(data);
                } else {
                    this.spCheck.node.active = false;
                }
            } else {
                return;
            }

        }
    },

    onLoad() {
        this._initMsg();
        this.lblTypeName.node.active = false;
    },

    start() {

    },

    // update (dt) {},

    initView(data, index, curPlayerData) {
        this._data = data;

        if (index === 0) {
            this.lblTypeName.node.active = true;
            this.lblTypeName.string = data.type;
        }
        if (data !== undefined) {
            let index = data.index;
            let locked = data.locked;
            let path = 'uiModule/player/player' + index;
            UIMgr.changeSpriteImg(path, this.spPlayer);

            this.spBg.node.active = true;//不存在补空
            this.spMask.node.active = locked === 0 ? true : false;
            if (GameCfg.player.index === this._data.index) {
                this.spCheck.node.active = true;
            } else {
                this.spCheck.node.active = false;
            }

        } else {
            UIMgr.changeSpriteImg('uiModule/player/defaultPlayer', this.spPlayer);
            this.lblTypeName.node.active = true;
            this.spBg.node.active = false;
        }
    },

    onBtnClickToShop() {
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
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BuyPlayer, null);
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChoosePlayer, this._data);
            return;
        }

        let _ownedScore = Util.getOwnedScore();
        if (parseInt(_ownedScore) < parseInt(this._data.lockedCost)) {
            return;
        }
        let left = parseInt(_ownedScore) - parseInt(this._data.lockedCost)
        Util.saveOwnedScore(left);
        GameData.player[this._data.index + 1].owned = 1;
        this._data.owned = 1;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BuyPlayer, null);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChoosePlayer, this._data);
    }
});
