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
    }
}