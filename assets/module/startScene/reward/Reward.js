let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');
let ObserverMgr = require('ObserverMgr');

cc.Class({
    extends: Observer,

    properties: {
        spReward: { displayName: 'spReward', default: null, type: cc.Sprite },
        _rewardData: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [

        ];
    },
    _onMsg(msg, data) {

    },

    onLoad() {
        this._initMsg();
    },

    start() {

    },

    update(dt) {
        this.node.y += -dt * GameCfg.enemySpeed;
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        if (this.node.y < -h) {
            // console.log('this.node.y: ', this.node.y);
            // this._enemyPool.put(this.node);
            this.node.destroy();
        }
    },

    initView(reward) {
        this._rewardData = reward;
        let path = 'uiModule/reward/reward' + reward.type;
        UIMgr.changeSpriteImg(path, this.spReward);
    },

    onCollisionEnter(other, self) {
        console.log('reward');
        if (other.node.name === 'Player') {
            let data = this._rewardData;
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.Reward, data);
            this.node.destroy();
        }
    }
});
