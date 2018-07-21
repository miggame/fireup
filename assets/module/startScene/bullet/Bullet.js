let GameCfg = require('GameCfg');
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        spBullet: { displayName: 'spBullet', default: null, type: cc.Sprite },
        _bulletPool: null,
        _removeFlag: false
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
        this._removeFlag = false;
    },

    initView(pool) {
        this._bulletPool = pool;
        // this.schedule(this._refreshBullet, 0.1);
    },

    start() {

    },

    update(dt) {
        // let body = this.node.getComponent(cc.RigidBody);
        // let speed = body.linearVelocity;
        // speed.y = dt * GameCfg.bulletSpeed;
        // body.linearVelocity = speed;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y > h) {
            if (this._removeFlag === false) {
                this._removeFlag = true;
                // this.node.removeComponent(cc.RigidBody);
                // this.node.removeComponent(cc.PhysicsCircleCollider);
                // this._bulletPool.put(this.node);
                this.node.destroy();
            }
        }
    },

});
