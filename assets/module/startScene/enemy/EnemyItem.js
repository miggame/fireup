let Util = require('Util');
let GameCfg = require('GameCfg');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
cc.Class({
    extends: Observer,

    properties: {
        lblHp: { displayName: 'lblHp', default: null, type: cc.Label },
        _hp: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.Hit
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.Hit) {
            if (this.node.uuid === data.selfUuid) {
                this._hp--;
                this._refresh(this._hp);
            }
        }
    },

    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},

    initHp(data) {
        this._hp = data;
        this._refresh(this._hp);
    },

    _refresh(data) {
        let colorStr = Util.getColorByData(data, GameCfg.enemyColor);
        this.node.color = new cc.color(colorStr);
        this.lblHp.string = data;
    },

    // onCollisionEnter(other, self) {
    //     console.log('other: ', other.node);
    //     let data = {
    //         otherUuid: other.node.uuid,
    //         selfUuid: self.node.uuid
    //     };
    //     ObserverMgr.dispatchMsg(GameLocalMsg.Msg.Hit, data);
    // }

});
