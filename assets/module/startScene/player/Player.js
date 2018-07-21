let GameCfg = require('GameCfg');
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        bulletPre: { displayName: 'bulletPre', default: null, type: cc.Prefab },
        _bulletPool: null
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
            this._bulletPool = new cc.NodePool('BulletPool');
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
    },

    start() {

    },

    // update (dt) {},

    _createBullet() {
        let bulletPre = this._bulletPool.get();
        if (!bulletPre) {
            bulletPre = cc.instantiate(this.bulletPre);
        }
        // bulletPre = cc.instantiate(this.bulletPre);
        this.node.parent.addChild(bulletPre);
        bulletPre.y = this.node.height / 2 + this.node.y;
        bulletPre.x = this.node.x;
        bulletPre.getComponent('Bullet').initView(this._bulletPool);
    }
});
