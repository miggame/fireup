let UIMgr = require('UIMgr');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let Util = require('Util');

cc.Class({
    extends: Observer,

    properties: {
        spPlayer: { displayName: 'spPlayer', default: null, type: cc.Sprite },
        lblTypeName: { displayName: 'lblTypeName', default: null, type: cc.Label },
        spBg: { displayName: 'spBg', default: null, type: cc.Sprite },
        spMask: { displayName: 'spMask', default: null, type: cc.Sprite },
        checkToggle: { displayName: 'checkToggle', default: null, type: cc.Toggle },
        _data: null
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
                    this.checkToggle.isChecked = true;
                    Util.updateGameCfgOfPlayer(data);
                } else {
                    this.checkToggle.isChecked = false;
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
            // cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            //     this.spPlayer.spriteFrame = spriteFrame;
            // }.bind(this));
            this.spBg.node.active = true;//解锁
            this.spMask.node.active = locked === 0 ? true : false;
            this.checkToggle.isChecked = curPlayerData.index === index ? true : false;
        } else {
            UIMgr.changeSpriteImg('uiModule/player/defaultPlayer', this.spPlayer);
            this.lblTypeName.node.active = true;
            this.spBg.node.active = false;
        }
    },

    onToggleClick(e) {

        if (this._data === null || this._data === undefined) {
            return;
        }
        if (this.checkToggle.isChecked === false) {
            this.checkToggle.isChecked = true;
            return;
        }
        let data = {
            index: this._data.index,
            locked: 1
        };
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ChoosePlayer, data);
    }
});
