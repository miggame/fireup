let GameCfg = require('GameCfg');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let UIMgr = require('UIMgr');
cc.Class({
    extends: Observer,

    properties: {
        bulletPre: { displayName: 'bulletPre', default: null, type: cc.Prefab },
        _bulletPool: null,
        spPlayer: { displayName: 'spPlayer', default: null, type: cc.Sprite },
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

    initView(data) {
        let index = data.index;
        let type = data.type;
        let demage = data.demage;
        let bulletSpeed = data.bulletSpeed;
        let bulletNum = data.bulletNum;

        let path = 'uiModule/player/player' + index;
        UIMgr.changeSpriteImg(path, this.spPlayer);
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
        // this._bulletPool.put(this.node);
        if (other.node.name === 'Enemy') {
            this.node.removeAllChildren();
            this.node.removeFromParent();
            // cc.game.pause();
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GameOver, null);
        }
    }
});
