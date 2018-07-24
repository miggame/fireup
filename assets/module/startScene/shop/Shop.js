let Observer = require('Observer');
let UIMgr = require('UIMgr');
let Util = require('Util');

cc.Class({
    extends: cc.Component,

    properties: {
        shopItemPre: { displayName: 'shopItemPre', default: null, type: cc.Prefab },
        scrollView: { displayName: 'scrollView', default: null, type: cc.ScrollView },
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
        let len = data.len;
        this.scrollView.content.destroyAllChildren();

        let playerTypeArr = Util.getPlayerTypeArrOfPlayer();
        for (const item of playerTypeArr) {
            let playerArr = Util.getArrOfPlayerByType(item);
            let playerLen = playerArr.length;
            let left = parseInt(playerLen % 3);
            for (let j = 0; j < playerLen + left; ++j) {
                let shopItem = cc.instantiate(this.shopItemPre);
                this.scrollView.content.addChild(shopItem);
                shopItem.getComponent('ShopItem').initView(playerArr[j]);
            }
        }
    }
});
