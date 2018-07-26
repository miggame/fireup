let GameData = require('GameData');
let GameCfg = require('GameCfg');

module.exports = {
    getEnemyHpByType(type, obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if (element.type === type) {
                    return element.hp;
                }
            }
        }
    },

    convertObjPropertyValueToArray(obj) {
        let arr = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                arr.push(element);
            }
        }
        return arr;
    },

    getColorByData(data, colorArr) {
        return colorArr[parseInt(data / 100)];
    },

    getItemPosX(index, total, w) {
        let perWidth = w / total;
        return -w / 2 + w / total * 0.5 + w / total * index;
    },

    getEnemyNumByType(type, obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if (element.type === type) {
                    return element.num;
                }
            }
        }
    },

    getArrayFromObjectByProperty(type) {
        let playerArr = _.values(GameData.player);
        let newArr = _.filter(playerArr, (item) => {
            if (item.type === type) {
                return item;
            }
        });
        return newArr;
    },

    getPlayerTypeArrOfPlayer() {
        let playerArr = _.values(GameData.player);
        let typeArr = [];
        for (const item of playerArr) {
            typeArr.push(item.type);
        }
        return _.uniq(typeArr);
    },

    getArrOfPlayerByType(type) {
        let arr = [];
        for (const key in GameData.player) {
            if (GameData.player.hasOwnProperty(key)) {
                const element = GameData.player[key];
                if (element.type === type) {
                    arr.push(element);
                }
            }
        }
        return arr;
    },

    updateGameDataOfPlayer(cfgData) {
        let index = cfgData.index;
        for (const key in GameData.player) {
            if (GameData.player.hasOwnProperty(key)) {
                let element = GameData.player[key];
                if (element.index === index) {
                    GameData.player[key] = cfgData;
                    return;
                }
            }
        }
    },

    updateGameCfgOfPlayer(data) {
        let index = data.index;
        for (const key in GameData.player) {
            if (GameData.player.hasOwnProperty(key)) {
                const element = GameData.player[key];
                if (index === element.index) {
                    GameCfg.player.type = element.type;
                    GameCfg.player.index = element.index;
                    GameCfg.player.demage = element.demage;
                    GameCfg.player.bulletSpeed = element.bulletSpeed;
                    GameCfg.player.bulletNum = element.bulletNum;
                    GameCfg.player.locked = data.locked;
                    GameCfg.player.lockedCost = element.lockedCost;
                    return;
                }
            }
        }
    },

    updateGameDataOfBall(cfgData) {
        let index = cfgData.index;
        for (const key in GameData.ball) {
            if (GameData.ball.hasOwnProperty(key)) {
                let element = GameData.ball[key];

                if (element.index === index) {
                    GameData.ball[key].locked = cfgData.locked;

                    return;
                }
            }
        }
    },

    updateGameCfgOfBall(index) {
        for (const key in GameData.ball) {
            if (GameData.ball.hasOwnProperty(key)) {
                const element = GameData.ball[key];
                if (index === element.index) {
                    GameCfg.ball = element;
                    return;
                }
            }
        }
    },

    upgradeSpeedLevelGameCfgOfPlayer() {
        GameCfg.player.bulletSpeedLevel++;
    },

    upgradePowerLevelGameCfgOfPlayer() {
        GameCfg.player.bulletPowerLevel++;
    },

    getBulletNumOfPlayerByPlayerIndex() {
        let index = GameCfg.player.index;

        let tempArr = _.values(GameData.player);
        for (const item of tempArr) {
            if (item.index === index) {

                return item.bulletNum;
            }
        }
    },

    getBulletSpeedOfPlayerByPlayerIndex() {
        let index = GameCfg.player.index;
        let tempArr = _.values(GameData.player);
        for (const item of tempArr) {
            if (item.index === index) {
                return item.bulletSpeed;
            }
        }
    },

    getBulletPowerOfPlayerByPlayerIndex() {
        let index = GameCfg.player.index;
        let tempArr = _.values(GameData.player);
        for (const item of tempArr) {
            if (item.index === index) {
                return item.demage;
            }
        }
    },

    saveOwnedScore(score) {
        cc.sys.localStorage.setItem('ownedScore', score);
        this.updatePlayerLockedStatus(score);
    },

    getOwnedScore() {
        return cc.sys.localStorage.getItem('ownedScore');
    },

    getSpeedCost(level) {
        let cost = null;
        let upgradeArr = _.values(GameData.upgrade);
        for (const item of upgradeArr) {
            if (item.bulletSpeedLevel === level) {
                cost = item.bulletSpeedCost;
                return cost;
            }
        }
    },
    getPowerCost(level) {
        let cost = null;
        let upgradeArr = _.values(GameData.upgrade);
        for (const item of upgradeArr) {
            if (item.bulletPowerLevel === level) {
                cost = item.bulletPowerCost;
                return cost;
            }
        }
    },

    updatePlayerLockedStatus(data) {
        console.log('>>>>>>>>');
        let _tempPlayerArr = _.values(GameData.player);
        for (const item of _tempPlayerArr) {
            if (item.lockedCost <= parseInt(data)) {
                item.locked = 1;
            }
        }
        let _tempBallArr = _.values(GameData.ball);
        for (const item of _tempBallArr) {
            if (item.lockedCost <= parseInt(data)) {
                item.locked = 1;
            }
        }
    }
}