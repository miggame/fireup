let AudioMgr = require('AudioMgr');
let AudioPlayer = require('AudioPlayer');

cc.Class({
    extends: cc.Component,

    properties: {
        clickSound: { displayName: 'clickSound', default: null, url: cc.AudioClip },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('touchstart', function () {
            if (this.clickSound) {
                AudioPlayer.playEffectMusic(this.clickSound, false);
            } else {
                AudioMgr.playButtonSound();
            }
            return;
        }.bind(this), this);

        this.node.on('touchmove', function () {

        }, this);
        this.node.on('touchcancel', function () {

        }, this);
        this.node.on('touchend', function () {

        }, this);
    },

    start() {

    },

    // update (dt) {},
});
