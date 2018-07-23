let Observer = require('Observer');
let GameCfg = require('GameCfg');
let Util = require('Util');
cc.Class({
    extends: Observer,

    properties: {
        lblHp: { displayName: 'lblHp', default: null, type: cc.Label },
        _enemyPool: null
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

    initView(pool) {
        this._enemyPool = pool;
    },

    update(dt) {
        this.node.y += -dt * GameCfg.enemySpeed;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y < -h) {
            console.log('this.node.y: ', this.node.y);
            this._enemyPool.put(this.node);
        }
    },

    initHp(hp) {
        this._hp = hp;
        this._refresh(this._hp);
    },

    minusHp() {
        this._hp--;
        this._refresh(this._hp);
    },

    _refresh(data) {
        let colorStr = Util.getColorByData(data, GameCfg.enemyColor);
        this.node.color = new cc.color(colorStr);
        this.lblHp.string = data;
        if (data <= 0) {
            this._enemyPool.put(this.node);
        }
    },

    // onCollisionEnter(other, self) {

    // }
});
