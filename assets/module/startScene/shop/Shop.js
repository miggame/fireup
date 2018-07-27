let Observer = require('Observer');
let UIMgr = require('UIMgr');
let Util = require('Util');
let GameData = require('GameData');
let AudioPlayer = require('AudioPlayer');

cc.Class({
    extends: Observer,

    properties: {
        shopItemPre: { displayName: 'shopItemPre', default: null, type: cc.Prefab },
        scrollView: { displayName: 'scrollView', default: null, type: cc.ScrollView },
        bulletItemPre: { displayName: 'bulletItemPre', default: null, type: cc.Prefab },
        shooterToggle: { displayName: 'shooterToggle', default: null, type: cc.Toggle },
        ballToggle: { displayName: 'ballToggle', default: null, type: cc.Toggle },
        lblOwnedScore: { displayName: 'lblOwnedScore', default: null, type: cc.Label },
        _shopItemPool: null,
        // _bulletItemPool: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.BuyPlayer,
            GameLocalMsg.Msg.BuyBall
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.BuyPlayer) {
            let _ownScore = Util.getOwnedScore();
            this.lblOwnedScore.string = _ownScore;
        } else if (msg === GameLocalMsg.Msg.BuyBall) {
            let _ownScore = Util.getOwnedScore();
            this.lblOwnedScore.string = _ownScore;
        }
    },
    onLoad() {
        this._initMsg();
        this._shopItemPool = new cc.NodePool('ShopItemPool');
        // this._bulletItemPool = new cc.NodePool('BulletItemPool');
        for (let i = 0; i < 5; ++i) {
            let tempShopItemPre = cc.instantiate(this.shopItemPre);
            this._shopItemPool.put(tempShopItemPre);
            // let tempBulletItemPre = cc.instantiate(this.bulletItemPre);
            // this._bulletItemPool.put(tempBulletItemPre);
        }
    },

    start() {

    },

    // update (dt) {},
    onBtnClickToBack() {
        // AudioPlayer.stopCurrentBackgroundMusic();
        this.scrollView.content.destroyAllChildren();
        cc.audioEngine.stopAll();
        UIMgr.destroyUI(this);
        cc.director.loadScene('StartScene');
    },

    initView(data) {
        let _ownScore = Util.getOwnedScore();
        this.lblOwnedScore.string = _ownScore;
        Util.updatePlayerLockedStatus(parseInt(_ownScore));
        this.scrollView.content.destroyAllChildren();
        let playerTypeArr = Util.getPlayerTypeArrOfPlayer();
        for (const item of playerTypeArr) {
            let playerArr = Util.getArrOfPlayerByType(item);
            let playerLen = playerArr.length;
            let left = 0;
            if (parseInt(playerLen % 3) === 0) {
                left = 0;
            } else {
                left = 3 - parseInt(playerLen % 3);
            }
            // for (let j = 0; j < playerLen + left; ++j) {
            //     let shopItem = cc.instantiate(this.shopItemPre);
            //     this.scrollView.content.addChild(shopItem);
            //     shopItem.getComponent('ShopItem').initView(playerArr[j], j, data);
            // }
            for (let j = 0; j < playerLen + left; ++j) {
                let shopItem = this._shopItemPool.get();
                if (!shopItem) {
                    shopItem = cc.instantiate(this.shopItemPre);
                }
                this.scrollView.content.addChild(shopItem);
                shopItem.getComponent('ShopItem').initView(playerArr[j], j, data);
            }
        }
    },

    onToggleClickToShooter() {
        this.shooterToggle.isChecked = true;
        this.ballToggle.isChecked = false;
        this.initView(GameData.player);
    },

    onToggleClickToBall() {
        this.ballToggle.isChecked = true;
        this.shooterToggle.isChecked = false;
        this._initViewBall();
    },

    _initViewBall() {
        this.scrollView.content.destroyAllChildren();
        for (const key in GameData.ball) {
            if (GameData.ball.hasOwnProperty(key)) {
                const element = GameData.ball[key];
                let bulletItemPre = cc.instantiate(this.bulletItemPre);
                this.scrollView.content.addChild(bulletItemPre);
                bulletItemPre.getComponent('BulletItem').initView(element);
            }
        }
    }

});
