let GameCfg = require('GameCfg');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let UIMgr = require('UIMgr');
let GameData = require('GameData');
let Util = require('Util');
let AudioMgr = require('AudioMgr');

cc.Class({
    extends: Observer,

    properties: {
        bulletPre: { displayName: 'bulletPre', default: null, type: cc.Prefab },
        _bulletPool: null,
        spPlayer: { displayName: 'spPlayer', default: null, type: cc.Sprite },
        _data: null,
        _rewardTimer: null,
        _bulletOriNum: null,
        _keepFlag: false
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart,
            GameLocalMsg.Msg.Reward,
            GameLocalMsg.Msg.GameOver
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            let _refreshTime = parseFloat(100 / (GameCfg.player.bulletSpeed * GameCfg.player.bulletSpeedLevel));
            this.schedule(this._createBullet, _refreshTime);
        } else if (msg === GameLocalMsg.Msg.Reward) {
            AudioMgr.playRewardEffectMusic();
            this.unschedule(this._countDown);
            this._rewardTimer = data.time;
            GameCfg.player.bulletNum = data.type;
            this.schedule(this._countDown, 1);
        } else if (msg === GameLocalMsg.Msg.GameOver) {
            this.unschedule(this._countDown);
            GameCfg.player.bulletNum = this._bulletOriNum;
            this.node.removeFromParent();
        }
    },
    onLoad() {
        this._initMsg();
        this._keepFlag = false;
        this._bulletPool = new cc.NodePool('BulletPool');
        for (let i = 0; i < 10; ++i) {
            let bulletPreTemp = cc.instantiate(this.bulletPre);
            this._bulletPool.put(bulletPreTemp);
        }
        // this._bulletOriNum = Util.getBulletNumOfPlayerByPlayerIndex();
    },

    initView(data) {
        this._data = data;
        let index = data.index;
        let path = 'uiModule/player/player' + index;
        UIMgr.changeSpriteImg(path, this.spPlayer);
        this._bulletOriNum = Util.getBulletNumOfPlayerByPlayerIndex();
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
            AudioMgr.playBulletEffectMusic();
        }
    },

    onCollisionEnter(other, self) {
        // if (other.node.name === 'Enemy') {
        //     if (self.tag === 0) {
        //         this.node.removeAllChildren();
        //         ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GameOver, null);

        //         return;
        //     } else if (self.tag === 1) {

        //         self.node.x = other.node.x + other.node.width / 2 + self.node.width / 2 + 5;
        //         ObserverMgr.dispatchMsg(GameLocalMsg.Msg.KeepLeft, null);
        //         this._keepFlag = true;
        //         return;
        //     } else if (self.tag === 2) {

        //         this._keepFlag = true;
        //         self.node.x = other.node.x - other.node.width / 2 - self.node.width / 2 - 5;
        //         ObserverMgr.dispatchMsg(GameLocalMsg.Msg.KeepRight, null);
        //         return;
        //     }
        // }
    },

    onCollisionExit(other, self) {
        this._keepFlag = false;
    },

    _countDown() {
        if (this._rewardTimer === null) {
            return;
        }
        this._rewardTimer--;
        if (this._rewardTimer <= 0) {
            this._rewardTimer = 0;
            GameCfg.player.bulletNum = this._bulletOriNum;
            this.unschedule(this._countDown);
        }
    }
});
