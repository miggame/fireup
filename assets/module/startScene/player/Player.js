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
        _data: null,
        _rewardTimer: null,
        _bulletPreType: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart,
            GameLocalMsg.Msg.Reward
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            this.schedule(this._createBullet, GameCfg.bulletRefreshTime);
        } else if (msg === GameLocalMsg.Msg.Reward) {
            console.log('data: ', data);
            this.unschedule(this._countDown);
            this._rewardTimer = data.time;
            this._bulletPreType = GameCfg.player.bulletNum;
            GameCfg.player.bulletNum = data.type;
            this.schedule(this._countDown, 1);
        }
    },
    onLoad() {
        this._initMsg();

        this._bulletPool = new cc.NodePool('BulletPool');
        for (let i = 0; i < 10; ++i) {
            let bulletPreTemp = cc.instantiate(this.bulletPre);
            this._bulletPool.put(bulletPreTemp);
        }
    },

    initView(data) {
        this._data = data;

        let index = data.index;

        let path = 'uiModule/player/player' + index;
        UIMgr.changeSpriteImg(path, this.spPlayer);
    },

    start() {

    },

    // update (dt) {},

    _createBullet() {
        let bulletPre = null;
        let bulletNum = this._data.bulletNum;

        for (let i = 0; i < bulletNum; ++i) {
            if (this._bulletPool.size() > 0) {
                bulletPre = this._bulletPool.get();
            } else {
                bulletPre = cc.instantiate(this.bulletPre);
            }
            this.node.parent.addChild(bulletPre);
            if (bulletNum === 1) {
                bulletPre.x = this.node.x;
            } else if (bulletNum === 2) {
                if (i === 0) {
                    bulletPre.x = this.node.x - 50;
                } else if (i === 1) {
                    bulletPre.x = this.node.x + 50;
                }
            } else if (bulletNum === 3) {
                if (i === 0) {
                    bulletPre.x = this.node.x;
                } else if (i === 1) {
                    bulletPre.x = this.node.x - 50;
                } else if (i === 2) {
                    bulletPre.x = this.node.x + 50;
                }
            }
            // bulletPre.x = this.node.x;
            bulletPre.y = this.node.y + this.node.height / 2;
            bulletPre.getComponent('Bullet').initView(this._bulletPool);

        }

        // if (this._bulletPool.size() > 0) {
        //     bulletPre = this._bulletPool.get();
        // } else {
        //     bulletPre = cc.instantiate(this.bulletPre);
        // }
        // this.node.parent.addChild(bulletPre);
        // bulletPre.x = this.node.x;
        // bulletPre.y = this.node.y + this.node.height / 2;
        // bulletPre.getComponent('Bullet').initView(this._bulletPool);
    },

    onCollisionEnter(other, self) {
        console.log('player');
        if (other.node.name === 'Enemy') {
            this.node.removeAllChildren();
            this.node.removeFromParent();
            // cc.game.pause();
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GameOver, null);
        }
    },

    _countDown() {
        if (this._rewardTimer === null) {
            return;
        }
        this._rewardTimer--;
        if (this._rewardTimer <= 0) {
            this._rewardTimer = 0;
            this.unschedule(this._countDown);
            GameCfg.player.bulletNum = this._bulletPreType;
        }
    }
});
