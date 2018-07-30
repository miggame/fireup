let Observer = require('Observer');
let GameCfg = require('GameCfg');
let Util = require('Util');
let ObserverMgr = require('ObserverMgr');
let UIMgr = require('UIMgr');
cc.Class({
    extends: Observer,

    properties: {
        lblHp: { displayName: 'lblHp', default: null, type: cc.Label },
        _enemyPool: null,
        // explodePre: { displayName: 'explodePre', default: null, type: cc.Prefab },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },

    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
        // this.explodeNode.active = false;
    },

    start() {

    },

    initView(pool) {
        this._enemyPool = pool;
    },

    update(dt) {
        this.node.y += -dt * GameCfg.enemySpeed;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y < -h) {
            this._enemyPool.put(this.node);
        }
    },

    initHp(hp) {
        this._hp = hp;
        this._refresh(this._hp);
    },

    minusHp() {

        this._hp -= parseInt(GameCfg.player.demage) * parseInt(GameCfg.player.bulletPowerLevel);
        this._refresh(this._hp);
        let data = {
            demage: parseInt(GameCfg.player.demage) * parseInt(GameCfg.player.bulletPowerLevel)
        };
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshScore, data);
    },

    _refresh(data) {
        if (data <= 0) {
            let pos = {
                pos: this.node.position
            };
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ExplodePos, pos);

            this._enemyPool.put(this.node);
            return;
        }
        let colorStr = Util.getColorByData(data, GameCfg.enemyColor);
        this.node.color = new cc.color(colorStr);
        this.lblHp.string = data;
        // if (data <= 0) {
        //     let pos = {
        //         pos: this.node.position
        //     };
        //     ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ExplodePos, pos);
        //     this._enemyPool.put(this.node);
        // }
    },
});
