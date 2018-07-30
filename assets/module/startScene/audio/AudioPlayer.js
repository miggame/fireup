module.exports = {
    _bgMusic: null,//背景音乐只存在一个
    _guideMusic: null,

    //播放背景音乐
    playBackgroundMusic(url, isLoop) {
        if (this._bgMusic !== null) {
            cc.audioEngine.stopMusic(this._bgMusic);
            this._bgMusic = null;
        }
        this._bgMusic = cc.audioEngine.play(url, isLoop);
        return this._bgMusic;
    },

    //停止当前正在播放的背景音乐
    stopCurrentBackgroundMusic() {
        if (this._bgMusic !== null) {
            cc.audioEngine.stopMusic(this._bgMusic);
            this._bgMusic = null;
        }
    },

    //播放声效
    playEffectMusic(url, isLoop) {
        if (typeof (isLoop) === 'undefined') {
            isLoop = false;
        }
        return cc.audioEngine.play(url, isLoop);
    },

    playGuideMusic(url, isLoop) {
        if (this._bgMusic !== null) {
            cc.audioEngine.stopMusic(this._guideMusic);
            this._guideMusic = null;
        }
        this._guideMusic = this.playEffectMusic(url, isLoop);
    },

    stopCurrentGuideMusic() {
        if (this._guideMusic) {
            cc.audioEngine.stop(this._guideMusic);
            this._guideMusic = null;
        }
    }
};