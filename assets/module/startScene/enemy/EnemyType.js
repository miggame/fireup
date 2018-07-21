let Observer = require('Observer');
let Util = require('Util');
let GameData = require('GameData');
cc.Class({
    extends: Observer,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    _getMsgList() {
        return [];
    },

    _onMsg(msg, data) {

    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},

    initHpByType(type) {
        let baseHp = Util.getEnemyHpByType(type, GameData.enemy);
        for (const item of this.node.children) {
            let data = parseInt(baseHp * cc.random0To1() + baseHp);
            item.getComponent('Enemy').initHp(data);
        }
    }
});
