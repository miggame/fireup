let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let GameCfg = require('GameCfg');
let GameData = require('GameData');
let Util = require('Util');
cc.Class({
    extends: Observer,

    properties: {
        playerPre: { displayName: 'playerPre', default: null, type: cc.Prefab },
        playerLayer: { displayName: 'playerLayer', default: null, type: cc.Node },
        tutorLayer: { displayName: 'tutorLayer', default: null, type: cc.Node },
        _startFlag: false,
        _player: null,
        enemyLayer: { displayName: 'enemyLayer', default: null, type: cc.Node },
        enemyPre: { displayName: 'enemyPre', default: null, type: cc.Prefab },
        _level: [],
        // _enemyPool: null
        enemyPreArr: [cc.Prefab]
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            // this._enemyPool = new cc.NodePool('EnemyPool');
            this._startEnemy();
        }
    },
    onLoad() {

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
            ;

        this._initMsg();
        this._initView();
        this._level = Util.convertObjPropertyValueToArray(GameData.level);
    },

    start() {

    },

    // update (dt) {},

    _initView() {
        this._initPlayer();
        this._initTutor();
    },

    _initPlayer() {
        this._player = cc.instantiate(this.playerPre);
        this.playerLayer.addChild(this._player);
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;

        this._player.y = -h / 3;

        this.playerLayer.on('touchstart', function (event) {
            if (this._startFlag === true) {
                return true;
            }
        }.bind(this));
        this.playerLayer.on('touchmove', function (event) {
            if (this._startFlag === true) {
                this._player.x += event.getDelta().x;
                let w = cc.view.getVisibleSize().width;
                let minX = -w / 2 + this._player.width / 2;
                let maxX = w / 2 - this._player.width / 2;
                if (this._player.x > maxX) {
                    this._player.x = maxX;
                }
                if (this._player.x < minX) {
                    this._player.x = minX;
                }
            }
        }.bind(this));
        this.playerLayer.on('touchend', function (event) {

        }.bind(this));
        this.playerLayer.on('touchcancel', function (event) {

        }.bind(this));
    },

    _initTutor() {
        this.tutorLayer.on('touchend', function (event) {
            this.tutorLayer.destroy();
            this._startFlag = true;
            // this._startEnemy();
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GameStart, null);
        }.bind(this));
    },

    _startEnemy() {
        this.schedule(this._createEnemy, GameCfg.refreshTime);
    },

    _createEnemy() {

        // let enemyPre = this._enemyPool.get();
        // if (!enemyPre) {
        //     enemyPre = cc.instantiate(this.enemyPre);
        // }

        // let enemyPre = cc.instantiate(this.enemyPre);
        // this.enemyLayer.addChild(enemyPre);
        // let w = cc.view.getVisibleSize().width;
        // let h = cc.view.getVisibleSize().height;

        // // enemyPre.h = h;
        // enemyPre.y = h;
        // enemyPre.getComponent('Enemy').initView(10);

        if (this._level.length > 0) {
            let type = this._level.shift().type;
            // let enemyTypePre = cc.instantiate(this.enemyPreArr[type]);
            // this.enemyLayer.addChild(enemyTypePre);
            // let w = cc.view.getVisibleSize().width;
            // let h = cc.view.getVisibleSize().height;
            // enemyTypePre.y = h;
            // enemyTypePre.getComponent('EnemyType').initHpByType(type);
            let baseHp = Util.getEnemyHpByType(type, GameData.enemy);
            // let num = Util.getEnemyNumByType(type, GameData.enemy);
            // for (let i = 0; i < num; ++i) {
            //     for (let i = 0; i < num; ++i) {
            //         let enemyPre = cc.instantiate(this.enemyPre);
            //         this.enemyLayer.addChild(enemyPre);
            //         let w = cc.view.getVisibleSize().width;
            //         let h = cc.view.getVisibleSize().height;

            //         // enemyPre.h = h;
            //         enemyPre.y = h;
            //         enemyPre.x = Util.getItemPosX(i, num, w);
            //         let hp = parseInt(baseHp * cc.random0To1() + baseHp);
            //         enemyPre.getComponent('Enemy').initHp(hp);
            //     }
            // }
            if (type === 0) {
                let num = 4;
                for (let i = 0; i < num; ++i) {
                    let enemyPre = cc.instantiate(this.enemyPre);
                    this.enemyLayer.addChild(enemyPre);
                    let w = cc.view.getVisibleSize().width;
                    let h = cc.view.getVisibleSize().height;

                    // enemyPre.h = h;
                    enemyPre.y = h;
                    enemyPre.x = Util.getItemPosX(i, num, w);
                    let hp = parseInt(baseHp * cc.random0To1() + baseHp);
                    enemyPre.getComponent('Enemy').initHp(hp);
                }
            } else if (type === 1) {
                let num = 5;
                for (let i = 0; i < num; ++i) {
                    let enemyPre = cc.instantiate(this.enemyPre);
                    this.enemyLayer.addChild(enemyPre);
                    let w = cc.view.getVisibleSize().width;
                    let h = cc.view.getVisibleSize().height;

                    // enemyPre.h = h;
                    enemyPre.y = h;
                    enemyPre.x = Util.getItemPosX(i, num, w);
                    let hp = parseInt(baseHp * cc.random0To1() + baseHp);
                    enemyPre.getComponent('Enemy').initHp(hp);
                }
            }
        } else {
            this.unschedule(this._createEnemy);
        }
    }
});
