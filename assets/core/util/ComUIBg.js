
cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: { displayName: 'bgNode', default: null, type: cc.Node },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        this.bgNode.width = w;
        this.bgNode.height = h;

        // this.bgNode.on(cc.Node.EventType.TOUCH_START, function (event) {
        //     cc.log("1");
        //     event.stopPropagation();
        //     event.stopPropagationImmediate();

        //     return false;
        // }.bind(this));

        // this.bgNode.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     cc.log("2");
        //     event.stopPropagation();
        //     event.stopPropagationImmediate();
        //     return false;
        // }.bind(this));

        // this.bgNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //     cc.log("3");
        //     event.stopPropagation();
        //     event.stopPropagationImmediate();
        //     return false;
        // }.bind(this));
    },

    start() {

    },

    // update (dt) {},

    addUI(ui) {
        let node = cc.instantiate(ui);
        node.x = node.y = 0;
        this.node.addChild(node);
        return node;
    }
});
