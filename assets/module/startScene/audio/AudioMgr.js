let AudioPlayer = require('AudioPlayer');

module.exports = {
    //播放按钮声音
    playButtonSound() {
        let btnUrl = cc.url.raw('resources/music/ui.mp3');
        AudioPlayer.playEffectMusic(btnUrl, false);
    },

    playExplodeEffectMusic() {
        let url = cc.url.raw('resources/music/explode.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    playOverEffectMusic() {
        let url = cc.url.raw('resources/music/over.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    playOver1EffectMusic() {
        let url = cc.url.raw('resources/music/over1.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    playScoreEffectMusic() {
        let url = cc.url.raw('resources/music/score.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    playRewardEffectMusic() {
        let url = cc.url.raw('resources/music/reward.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    playUpgradeEffectMusic() {
        let url = cc.url.raw('resources/music/upgrade.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    playBulletEffectMusic() {
        let url = cc.url.raw('resources/music/bullet.mp3');
        AudioPlayer.playEffectMusic(url, false);
    },

    //播放游戏主场景音乐
    playMainMusic() {
        let url = cc.url.raw("resources/music/bg.mp3");
        AudioPlayer.playBackgroundMusic(url, true);
    },

    // // 播放游戏登录音乐
    // playLoginMusic() {
    //     let url = cc.url.raw("resources/music/BgMusicLogin.mp3");
    //     AudioPlayer.playBackgroundMusic(url, true);
    // },

    // // 播放收金币音乐
    // playGetGoldEffectMusic() {
    //     let url = cc.url.raw("resources/music/gold.mp3");
    //     AudioPlayer.playEffectMusic(url, false);
    // },

    // //更新音量
    // updateVolume() {
    //     let effectVolume = GameLocalStorage.getEffectVolume();
    //     let musicVolume = GameLocalStorage.getMusicVolume();
    //     cc.log("get: music=%s, effect=%s", musicVolume, effectVolume);
    //     cc.audioEngine.setEffectsVolume(effectVolume);
    //     cc.audioEngine.setMusicVolume(musicVolume);
    // }
};