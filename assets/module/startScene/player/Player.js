let GameCfg = require('GameCfg');
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        bulletPre: { displayName: 'bulletPre', default: null, type: cc.Prefab },
        _bulletPool: null,
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart,
            GameLocalMsg.Msg.Hit
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            this.schedule(this._createBullet, GameCfg.bulletRefreshTime);
        } else if (msg === GameLocalMsg.Msg.Hit) {
            console.log('hit');
            if (data.otherUuid === this.node.uuid) {
                console.log('GameOver');
            }
        }
    },
    onLoad() {
        this._initMsg();
        // this.schedule(this._createBullet, GameCfg.bulletRefreshTime);
        this._bulletPool = new cc.NodePool('BulletPool');
        for (let i = 0; i < 10; ++i) {
            let bulletPreTemp = cc.instantiate(this.bulletPre);
            this._bulletPool.put(bulletPreTemp);
        }
    },

    start() {

    },

    // update (dt) {},

    _createBullet() {
        let bulletPre = null;
        if (this._bulletPool.size() > 0) {
            bulletPre = this._bulletPool.get();
        } else {
            bulletPre = cc.instantiate(this.bulletPre);
        }
        this.node.parent.addChild(bulletPre);
        bulletPre.x = this.node.x;
        bulletPre.y = this.node.y + this.node.height / 2;
        bulletPre.getComponent('Bullet').initView(this._bulletPool);
    },

    onCollisionEnter(other, self) {
        this._bulletPool.put(this.node);
        if (other.node.name === 'Enemy') {
            this.node.destroy();
            cc.game.pause();
        }
    }
});
