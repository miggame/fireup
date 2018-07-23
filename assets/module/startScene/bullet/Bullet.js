let GameCfg = require('GameCfg');
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        spBullet: { displayName: 'spBullet', default: null, type: cc.Sprite },
        _bulletPool: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.Hit
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.Hit) {
            if (this.node.uuid === data.otherUuid) {
                this.node.destroy();
            }
        }
    },
    onLoad() {
        this._initMsg();
    },

    initView(pool) {
        this._bulletPool = pool;
    },

    start() {

    },

    update(dt) {
        this.node.y += GameCfg.bulletSpeed * dt;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y > h) {
            // this.node.destroy();
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
