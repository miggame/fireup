let GameCfg = require('GameCfg');
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        spBullet: { displayName: 'spBullet', default: null, type: cc.Sprite },
        _bulletPool: null,
        // _overFlag: false
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameOver
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.Over) {
            // this._overFlag = true;
        }
    },
    onLoad() {
        this._initMsg();
        this._overFlag = false;
    },

    initView(pool) {
        this._bulletPool = pool;
        let tempColor = new cc.color(GameCfg.ball.color);
        this.spBullet.node.color = tempColor;
    },

    start() {

    },

    update(dt) {
        // this.node.y += parseInt(GameCfg.player.bulletSpeed) * parseInt(GameCfg.player.bulletSpeedLevel) * dt;
        this.node.y += GameCfg.bulletRefreshDistance * dt;
        // let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y > h / 2) {
            this._bulletPool.put(this.node);
        }
    },

    onCollisionEnter(other, self) {
        this._bulletPool.put(this.node);
        if (other.node.name === 'Enemy') {
            other.node.getComponent('Enemy').minusHp();
        }
    }
});
