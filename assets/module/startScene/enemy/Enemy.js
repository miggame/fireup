let GameCfg = require('GameCfg');
let GameData = require('GameData');
let Util = require('Util');
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [

        ];
    },

    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();

    },

    start() {

    },

    update(dt) {
        this.node.y -= dt * GameCfg.enemySpeed;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y < -h) {
            this.node.destroy();
        }
    },

    initHpByType(type) {
        let baseHp = Util.getEnemyHpByType(type, GameData.enemy);
        // this._hp = parseInt(baseHp * cc.random0To1() + baseHp);
        for (const item of this.node.children) {
            let data = parseInt(baseHp * cc.random0To1() + baseHp);
            item.getComponent('EnemyItem').initHp(data);
        }
    },


});
