let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let GameCfg = require('GameCfg');
let GameData = require('GameData');
let Util = require('Util');
let UIMgr = require('UIMgr');
cc.Class({
    extends: Observer,

    properties: {
        playerPre: { displayName: 'playerPre', default: null, type: cc.Prefab },
        playerLayer: { displayName: 'playerLayer', default: null, type: cc.Node },
        tutorLayer: { displayName: 'tutorLayer', default: null, type: cc.Node },
        _startFlag: false,
        _player: null,
        enemyLayer: { displayName: 'enemyLayer', default: null, type: cc.Node },
        _level: [],
        enemyPre: { displayName: 'enemyPre', default: null, type: cc.Prefab },
        _enemyPool: null,
        lblBestScore: { displayName: 'lblBestScore', default: null, type: cc.Label },
        uiLayer: { displayName: 'uiLayer', default: null, type: cc.Node },
        _totalScore: null,
        _bestScore: null,
        lblTotalScore: { displayName: 'lblTotalScore', default: null, type: cc.Label },
        overPre: { displayName: 'overPre', default: null, type: cc.Prefab },
        addNode: { displayName: 'addNode', default: null, type: cc.Node },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart,
            GameLocalMsg.Msg.RefreshScore,
            GameLocalMsg.Msg.GameOver
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GameStart) {
            this.lblTotalScore.node.active = true;
            this._totalScore = 0;
            this.lblTotalScore.string = this._totalScore;
            this.uiLayer.active = false;
            this._startEnemy();
        } else if (msg === GameLocalMsg.Msg.RefreshScore) {
            let tempScore = data.demage;
            this._totalScore = this._totalScore + tempScore;
            this.lblTotalScore.string = this._totalScore;
        } else if (msg === GameLocalMsg.Msg.GameOver) {
            if (this._bestScore <= this._totalScore) {
                this._bestScore = this._totalScore;
                cc.sys.localStorage.setItem('bestScore', this._totalScore);
            }
            this.showOver();
        }
    },
    onLoad() {
        this._initMsg();
        this._initView();

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;


        this._level = Util.convertObjPropertyValueToArray(GameData.level);

        this._enemyPool = new cc.NodePool('EnemyPool');
        for (let i = 0; i < 12; ++i) {
            let enemyPreTemp = cc.instantiate(this.enemyPre);
            this._enemyPool.put(enemyPreTemp);
        }
    },

    start() {

    },

    // update (dt) {},

    _initView() {
        this._initPlayer();
        this._initTutor();
        this._initUI();
    },

    _initUI() {
        this.lblTotalScore.node.active = false;
        this._bestScore = cc.sys.localStorage.getItem('bestScore');
        console.log(this._bestScore);
        if (this._bestScore === null || this._bestScore === undefined) {
            this._bestScore = 0;
            this.uiLayer.active = false;
        } else {
            this.uiLayer.active = true;
            this.lblBestScore.string = this._bestScore;
        }
    },

    _initPlayer() {
        this._player = cc.instantiate(this.playerPre);
        this.playerLayer.addChild(this._player);
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;

        this._player.y = -h / 3;
        this._player.width = w / 8;
        this._player.height = w / 8;
        this._player.getComponent(cc.BoxCollider).size = this._player.getContentSize();
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
        if (this._level.length <= 0) {
            this.unschedule(this._createEnemy);
            return;
        } else {

            let type = this._level.shift().type;
            let baseHp = Util.getEnemyHpByType(type, GameData.enemy);
            let num = Util.getEnemyNumByType(type, GameData.enemy);
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            for (let i = 0; i < num; ++i) {
                let enemyPre = this._enemyPool.get();
                if (!enemyPre) {
                    enemyPre = cc.instantiate(this.enemyPre);
                }
                this.enemyLayer.addChild(enemyPre);
                enemyPre.width = w / num;
                enemyPre.height = w / num;
                enemyPre.y = h;
                enemyPre.x = Util.getItemPosX(i, num, w);
                enemyPre.getComponent(cc.BoxCollider).size = enemyPre.getContentSize();
                let hp = parseInt(baseHp * cc.random0To1() + baseHp);
                enemyPre.getComponent('Enemy').initView(this._enemyPool);
                enemyPre.getComponent('Enemy').initHp(hp);
            }
        }
    },

    showOver() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = false;
        UIMgr.createPrefab(this.overPre, function (root, ui) {
            this.addNode.addChild(root);
            let script = ui.getComponent('Over');
            script.showTotalAndBestScore(this._totalScore, this._bestScore);
        }.bind(this));
    }
});
