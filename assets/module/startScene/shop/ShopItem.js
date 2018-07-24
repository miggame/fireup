let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        spPlayer: { displayName: 'spPlayer', default: null, type: cc.Sprite },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    initView(data) {
        if (data !== undefined) {
            let index = data.index;
            let path = 'uiModule/player/player' + index;
            UIMgr.changeSpriteImg(path, this.spPlayer);
        } else {
            UIMgr.changeSpriteImg('uiModule/player/defaultPlayer', this.spPlayer);
        }
    }
});
