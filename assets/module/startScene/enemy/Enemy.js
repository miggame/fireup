let Observer = require('Observer');
let GameCfg = require('GameCfg');
let Util = require('Util');
cc.Class({
    extends: Observer,

    properties: {
        _removeFlag: false,
        _hp: null,
        lblHp: { displayName: 'lblHp', default: null, type: cc.Label },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgLisg() {
        return [];
    },

    _onMsg(msg, data) {

    },

    onLoad() {
        this._initMsg();
        this._removeFlag = false;
        // this.node.getComponent(cc.RigidBody).enabledContactListener = true;
    },

    start() {

    },

    initView(pool) {
        this._enemyPool = pool;

    },

    update(dt) {
        // let body = this.node.getComponent(cc.RigidBody);
        // let speed = body.linearVelocity;
        // speed.y -= GameCfg.enemySpeed * dt
        // body.linearVelocity = speed;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y < -h) {
            console.log('donw h');
            if (this._removeFlag === false) {
                this._removeFlag = true;
                // this.node.removeComponent(cc.RigidBody)
                // this.node.removeComponent(cc.PhysicsBoxCollider);
                // this.node.destroy();
                console.log('this._enemyPool: ', this._enemyPool);
                this._enemyPool.put(this.node);
            }
        }
    },

    initHp(hp) {
        this._hp = hp;
        this._refresh(this._hp);
    },

    _refresh(data) {
        let colorStr = Util.getColorByData(data, GameCfg.enemyColor);
        this.node.color = new cc.color(colorStr);
        this.lblHp.string = data;
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log('开始');

        // console.log('otherCollider: ', otherCollider.node.name);

        if (otherCollider.node.name === 'Player') {

            selfCollider.node.removeComponent(cc.RigidBody);
            selfCollider.node.removeComponent(cc.PhysicsBoxCollider);
            selfCollider.node.destroy();

            // cc.game.pause();
        } else if (otherCollider.node.name === 'Bullet') {
            this._hp--;
            this._refresh(this._hp);
            if (this._hp <= 0) {
                // selfCollider.node.removeComponent(cc.RigidBody);
                // selfCollider.node.removeComponent(cc.PhysicsBoxCollider);
                // selfCollider.node.destroy();
                // this._enemyPool.put(selfCollider.node);
            }
            otherCollider.node.removeComponent(cc.RigidBody);
            otherCollider.node.removeComponent(cc.PhysicsCircleCollider);
            otherCollider.node.destroy();
        }

    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider) {

        // console.log('结束');
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, selfCollider, otherCollider) {

    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, selfCollider, otherCollider) {

    }
});
