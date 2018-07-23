let Observer = require('Observer');
let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        playerPre: { displayName: 'playerPre', default: null, type: cc.Prefab },
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
        for (let i = 0; i < len; ++i) {
            let node = cc.instantiate(this.playerPre);
            this.scrollView.content.addChild(node);
        }
    }
});
