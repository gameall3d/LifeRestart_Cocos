
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('PropItem')
export class PropItem extends Component {
    @property({type: Label})
    public nameLbl: Label;
    @property({type: Label})
    public valueLbl: Label;

    start () {
        // [3]
    }

    public setData(name: string, value: number) {
        this.nameLbl.string = name;
        this.updateValue(value);
    }

    public updateValue(value: number) {
        this.valueLbl.string = value.toString();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

