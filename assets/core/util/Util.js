let GameData = require('GameData');

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
    }
}