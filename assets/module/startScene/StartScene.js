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
        enemyPreArr: [cc.Prefab],
        enemyLayer: { displayName: 'enemyLayer', default: null, type: cc.Node },
        _level: [],
        _enemyPool0: null,
        _enemyPool1: null,
        _enemyPool2: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            this._startEnemy();
        }
    },
    onLoad() {
        this._initMsg();
        this._initView();

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this._level = Util.convertObjPropertyValueToArray(GameData.level);

        this._enemyPool0 = new cc.NodePool('EnemyPool0');
        this._enemyPool1 = new cc.NodePool('EnemyPool1');
        this._enemyPool2 = new cc.NodePool('EnemyPool2');
        for (let i = 0; i < 4; ++i) {
            let enemy0 = cc.instantiate(this.enemyPreArr[0]);
            this._enemyPool0.put(enemy0);
        }
        for (let j = 0; j < 4; ++j) {
            let enemy1 = cc.instantiate(this.enemyPreArr[1]);
            this._enemyPool1.put(enemy1);
        }
        for (let k = 0; k < 4; ++k) {
            let enemy2 = cc.instantiate(this.enemyPreArr[2]);
            this._enemyPool2.put(enemy2);
        }
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
        // if (this._level.length > 0) {
        //     let type = this._level.shift().type;
        //     let enemyPre = cc.instantiate(this.enemyPreArr[type]);
        //     this.enemyLayer.addChild(enemyPre);
        //     let h = cc.view.getVisibleSize().height;
        //     enemyPre.y = h;
        //     enemyPre.getComponent('Enemy').initHpByType(type);
        // } else {
        //     this.unschedule(this._createEnemy);
        // }

        if (this._level.length > 0) {
            let enemyPre = null;
            let type = this._level.shift().type;
            if (this['_enemyPool' + type].size > 0) {
                enemyPre = this['_enemyPool' + type].get();
            } else {
                enemyPre = cc.instantiate(this.enemyPreArr[type]);
            }
            this.enemyLayer.addChild(enemyPre);
            let h = cc.view.getVisibleSize().height;
            enemyPre.y = h;
            enemyPre.getComponent('Enemy').initView(this['_enemyPool' + type]);
            enemyPre.getComponent('Enemy').initHpByType(type);
        }
    }
});
