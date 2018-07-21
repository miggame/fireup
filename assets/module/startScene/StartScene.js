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
        _enemyPool: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            this._enemyPool = new cc.NodePool('EnemyPool');
            this._startEnemy();
        }
    },
    onLoad() {
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
        if (this._level.length > 0) {
            let type = this._level.shift().type;
            let enemyPre = this._enemyPool.get();
            if (!enemyPre) {
                enemyPre = cc.instantiate(this.enemyPreArr[type]);
            }
            // let enemyPre = cc.instantiate(this.enemyPreArr[type]);
            this.enemyLayer.addChild(enemyPre);
            let h = cc.view.getVisibleSize().height;
            enemyPre.y = h;
            enemyPre.getComponent('Enemy').initHpByType(type);
            enemyPre.getComponent('Enemy').initView(this._enemyPool);
        } else {
            this.unschedule(this._createEnemy);
        }
    }
});
