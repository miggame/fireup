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
    }
}