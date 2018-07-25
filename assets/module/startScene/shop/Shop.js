let Observer = require('Observer');
let UIMgr = require('UIMgr');
let Util = require('Util');
let GameData = require('GameData');
cc.Class({
    extends: cc.Component,

    properties: {
        shopItemPre: { displayName: 'shopItemPre', default: null, type: cc.Prefab },
        scrollView: { displayName: 'scrollView', default: null, type: cc.ScrollView },
        bulletItemPre: { displayName: 'bulletItemPre', default: null, type: cc.Prefab },
        shooterToggle: { displayName: 'shooterToggle', default: null, type: cc.Toggle },
        ballToggle: { displayName: 'ballToggle', default: null, type: cc.Toggle },
        lblOwnedScore: { displayName: 'lblOwnedScore', default: null, type: cc.Label },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    onBtnClickToBack() {
        UIMgr.destroyUI(this);
    },

    initView(data) {
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
            for (let j = 0; j < playerLen + left; ++j) {
                let shopItem = cc.instantiate(this.shopItemPre);
                this.scrollView.content.addChild(shopItem);
                shopItem.getComponent('ShopItem').initView(playerArr[j], j, data);
            }
        }
        this.lblOwnedScore.string = Util.getOwnedScore();
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
