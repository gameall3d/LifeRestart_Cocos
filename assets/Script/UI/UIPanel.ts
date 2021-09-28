
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('UIPanel')
export class UIPanel extends Component {

    // update (deltaTime: number) {
    //     // [4]
    // }

    public show(...args: any[]) {
        this.node.active = true;
        this.onShow(...args);
    }

    protected onShow(...args: any[]) {

    }

    public hide() {
        this.node.active = false;
    }

}

