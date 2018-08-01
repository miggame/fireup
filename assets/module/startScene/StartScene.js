let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let GameCfg = require('GameCfg');
let GameData = require('GameData');
let Util = require('Util');
let UIMgr = require('UIMgr');
let AudioMgr = require('AudioMgr');
let AudioPlayer = require('AudioPlayer');

cc.Class({
    extends: Observer,

    properties: {
        playerPre: {
            displayName: 'playerPre',
            default: null,
            type: cc.Prefab
        },
        playerLayer: {
            displayName: 'playerLayer',
            default: null,
            type: cc.Node
        },
        tutorLayer: {
            displayName: 'tutorLayer',
            default: null,
            type: cc.Node
        },
        _startFlag: false,
        _player: null,
        enemyLayer: {
            displayName: 'enemyLayer',
            default: null,
            type: cc.Node
        },
        _level: [],
        enemyPre: {
            displayName: 'enemyPre',
            default: null,
            type: cc.Prefab
        },
        _enemyPool: null,
        lblOwnedScore: {
            displayName: 'lblOwnedScore',
            default: null,
            type: cc.Label
        },
        uiLayer: {
            displayName: 'uiLayer',
            default: null,
            type: cc.Node
        },
        _totalScore: null,
        _ownedScore: null,
        lblTotalScore: {
            displayName: 'lblTotalScore',
            default: null,
            type: cc.Label
        },
        overPre: {
            displayName: 'overPre',
            default: null,
            type: cc.Prefab
        },
        addNode: {
            displayName: 'addNode',
            default: null,
            type: cc.Node
        },
        particleLayer: {
            displayName: 'particleLayer',
            default: null,
            type: cc.Node
        },
        _explodePool: null,
        explodeParticle: {
            displayName: 'explodeParticle',
            default: null,
            url: cc.ParticleAsset
        },
        explodePre: {
            displayName: 'explodePre',
            default: null,
            type: cc.Prefab
        },
        shopPre: {
            displayName: 'shopPre',
            default: null,
            type: cc.Prefab
        },
        rewardPre: {
            displayName: 'rewardPre',
            default: null,
            type: cc.Prefab
        },
        rewardLayer: {
            displayName: 'rewardLayer',
            default: null,
            type: cc.Node
        },
        upgradePre: {
            displayName: 'upgradePre',
            default: null,
            type: cc.Prefab
        },
        lblBulletPower: {
            displayName: 'lblBulletPower',
            default: null,
            type: cc.Label
        },
        lblBulletSpeed: {
            displayName: 'lblBulletSpeed',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GameStart,
            GameLocalMsg.Msg.RefreshScore,
            GameLocalMsg.Msg.GameOver,
            GameLocalMsg.Msg.ExplodePos,
            GameLocalMsg.Msg.KeepLeft,
            GameLocalMsg.Msg.KeepRight
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
            AudioMgr.playScoreEffectMusic();
        } else if (msg === GameLocalMsg.Msg.GameOver) {
            if (this._ownedScore !== null || this._ownedScore !== undefined) {
                this._ownedScore = parseInt(this._totalScore) + parseInt(this._ownedScore);
                Util.saveOwnedScore(this._ownedScore);
                // Util.updatePlayerLockedStatus(this._ownedScore);
            }
            this.showOver();
        } else if (msg === GameLocalMsg.Msg.ExplodePos) {
            let pos = data.pos;

            let explodeNode = new cc.Node();
            let particleSystem = explodeNode.addComponent(cc.ParticleSystem);
            particleSystem.playOnLoad = true;
            particleSystem.autoRemoveOnFinish = true;
            particleSystem.file = this.explodeParticle;
            explodeNode.position = pos;
            this.particleLayer.addChild(explodeNode);
            AudioMgr.playExplodeEffectMusic();
        } else if (msg === GameLocalMsg.Msg.KeepLeft) {

        }
    },
    onLoad() {
        this._initMsg();
        this._initView();

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        this._level = Util.convertObjPropertyValueToArray(GameData.level);

        this._enemyPool = new cc.NodePool('EnemyPool');
        for (let i = 0; i < 20; ++i) {
            let enemyPreTemp = cc.instantiate(this.enemyPre);
            this._enemyPool.put(enemyPreTemp);
        }

        this._explodePool = new cc.NodePool('ExplodePool');
        for (let j = 0; j < 5; ++j) {
            let explodePreTemp = cc.instantiate(this.explodePre);
            this._explodePool.put(explodePreTemp);
        }

        // AudioPlayer.stopCurrentBackgroundMusic();
        cc.audioEngine.stopAll();
        AudioMgr.playMainMusic();
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
        this._ownedScore = cc.sys.localStorage.getItem('ownedScore');
        console.log('this._ownedScore: ', this._ownedScore);
        this.lblOwnedScore.string = this._ownedScore;
        if (this._ownedScore === null || this._ownedScore === undefined) {
            this._ownedScore = 0;
            Util.saveOwnedScore(this._ownedScore);
            this.uiLayer.active = false;
        } else {
            this.uiLayer.active = true;
            this.lblOwnedScore.string = this._ownedScore;
        }

        this.lblBulletPower.string = parseInt(GameCfg.player.bulletPowerLevel) * parseInt(GameCfg.player.demage);
        this.lblBulletSpeed.string = parseInt(GameCfg.player.bulletSpeedLevel) * parseInt(GameCfg.player.bulletSpeed);
    },

    _initPlayer() {
        this._player = cc.instantiate(this.playerPre);

        // Util.updateGameDataOfPlayer(GameCfg.player);

        // Util.updateGameDataOfBall(GameCfg.ball);
        this._player.getComponent('Player').initView(GameCfg.player);

        this.playerLayer.addChild(this._player);
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;

        this._player.y = -h / 3;
        this._player.width = w / 8;
        this._player.height = w / 8;
        // this._player.getComponent(cc.BoxCollider).size = this._player.getContentSize();
        let comArr = this._player.getComponents(cc.BoxCollider);
        for (const item of comArr) {
            if (item.tag === 0) {
                item.size = cc.size(this._player.width * 0.7, 1);
                item.offset = new cc.Vec2(0, this._player.height / 2);
            } else if (item.tag === 1) {
                item.size = cc.size(1, this._player.width);
                item.offset = new cc.Vec2(-this._player.width / 2, 0);
            } else if (item.tag === 2) {
                item.size = cc.size(1, this._player.width);
                item.offset = new cc.Vec2(this._player.width / 2, 0);
            }
        }

        this.playerLayer.on('touchstart', function (event) {
            if (this._startFlag === true) {
                return true;
            }
        }.bind(this));
        this.playerLayer.on('touchmove', function (event) {
            if (this._startFlag === true) {
                if (this._player.getComponent('Player')._keepFlag === true) {
                    return;
                }
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
            if (type === 0) {
                let perRow = parseInt(num / 3);
                for (let m = 0; m < 3; ++m) {
                    for (let n = 0; n < perRow; ++n) {
                        let enemyPre0 = this._enemyPool.get();
                        if (!enemyPre0) {
                            enemyPre0 = cc.instantiate(this.enemyPre);
                        }
                        this.enemyLayer.addChild(enemyPre0);
                        enemyPre0.width = w / perRow;
                        enemyPre0.height = w / perRow;
                        enemyPre0.y = h + m * enemyPre0.height;
                        enemyPre0.x = enemyPre0.width * (n - parseInt(perRow * 0.5)) + enemyPre0.width * 0.5;

                        enemyPre0.getComponent(cc.BoxCollider).size = enemyPre0.getContentSize();
                        let hp0 = parseInt(baseHp * cc.random0To1() + baseHp);
                        enemyPre0.getComponent('Enemy').initView(this._enemyPool);
                        enemyPre0.getComponent('Enemy').initHp(hp0);
                    }
                }
            } else if (type === 1 || type === 2) {
                // let baseHp = Util.getEnemyHpByType(type, GameData.enemy);
                // let num = Util.getEnemyNumByType(type, GameData.enemy);
                // let w = cc.view.getVisibleSize().width;
                // let h = cc.view.getVisibleSize().height;
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
            } else if (type === 3) {
                let index = 0;
                for (let k = 0; k < 3; ++k) {
                    for (let j = 0; j < 5; ++j) {
                        if (index % 2 === 0) {
                            index++;
                            let enemyPre3 = this._enemyPool.get();
                            if (!enemyPre3) {
                                enemyPre3 = cc.instantiate(this.enemyPre);
                            }
                            this.enemyLayer.addChild(enemyPre3);
                            enemyPre3.width = w / 5;
                            enemyPre3.height = w / 5;
                            enemyPre3.x = (j - 2.5) * enemyPre3.width + enemyPre3.width * 0.5;
                            enemyPre3.y = enemyPre3.y = h + k * enemyPre3.height;
                            enemyPre3.getComponent(cc.BoxCollider).size = enemyPre3.getContentSize();
                            let hp3 = parseInt(baseHp * cc.random0To1() + baseHp);
                            enemyPre3.getComponent('Enemy').initView(this._enemyPool);
                            enemyPre3.getComponent('Enemy').initHp(hp3);
                        } else {
                            index++;
                            continue;
                        }
                    }
                }
            } else if (type === 4) {
                let doubleArr = GameData.type4;
                let index = 0;
                for (let p = 0; p < 3; ++p) {
                    for (let q = 0; q < 5; ++q) {
                        if (doubleArr[index].visible === 0) {
                            index++;
                            continue;
                        } else {
                            let enemyPre4 = this._enemyPool.get();
                            if (!enemyPre4) {
                                enemyPre4 = cc.instantiate(this.enemyPre);
                            }
                            this.enemyLayer.addChild(enemyPre4);
                            enemyPre4.width = w / 5;
                            enemyPre4.height = w / 5;
                            enemyPre4.x = (q - 2.5) * enemyPre4.width + enemyPre4.width * 0.5;
                            enemyPre4.y = enemyPre4.y = h + p * enemyPre4.height;
                            enemyPre4.getComponent(cc.BoxCollider).size = enemyPre4.getContentSize();
                            let hp4 = parseInt(baseHp * cc.random0To1() + baseHp);
                            enemyPre4.getComponent('Enemy').initView(this._enemyPool);
                            enemyPre4.getComponent('Enemy').initHp(hp4);
                            if (doubleArr[index].static !== 0) {
                                let moveLeftAct = cc.moveBy(1, cc.p(-enemyPre4.width, 0));
                                let moveRightAct = moveLeftAct.reverse();
                                enemyPre4.runAction(cc.repeatForever(cc.sequence(moveLeftAct, moveRightAct)));
                            }
                            index++;
                        }
                    }
                }



                // let doubleArr = [
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                //     {
                //         visilbe: 0,
                //         value: false
                //     },
                // ]
            }
        }
        this._createReward();
    },

    showOver() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = false;
        UIMgr.createPrefab(this.overPre, function (root, ui) {
            this.addNode.addChild(root);
            let script = ui.getComponent('Over');
            script.showTotalAndOwnedScore(this._totalScore, this._ownedScore);
        }.bind(this));
        AudioMgr.playOverEffectMusic();
        AudioMgr.playOver1EffectMusic();
    },

    onBtnClickToShop() {
        UIMgr.createPrefab(this.shopPre, function (root, ui) {
            this.addNode.addChild(root);
            let script = ui.getComponent('Shop');
            let data = GameCfg.player;
            script.initView(data);
        }.bind(this));
    },

    onBtnClickToUpgrade() {
        UIMgr.createPrefab(this.upgradePre, function (root, ui) {
            this.addNode.addChild(root);
            let script = ui.getComponent('Upgrade');
            let data = GameCfg.player;
            script.initView(data);
        }.bind(this));
    },

    _createReward() {
        let rewardArr = _.values(GameData.reward);
        let tempReward = _.sample(rewardArr);
        let reward = tempReward.type;

        if (reward === 0) {
            return;
        }
        let rewardPre = cc.instantiate(this.rewardPre);
        this.rewardLayer.addChild(rewardPre);
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;

        rewardPre.y = h * 0.8;
        rewardPre.x = cc.randomMinus1To1() * w / 2 * 0.8;
        rewardPre.getComponent('Reward').initView(tempReward);
    }
});