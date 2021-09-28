
import { _decorator, Component, Node, EditBox, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DistributePropItem')
export class DistributePropItem extends Component {
    @property({type: Label})
    public titleLbl: Label;
    @property({type: EditBox})
    public pointEditBox: EditBox;

    public onAddButtonClick: (item:DistributePropItem)=>void;
    public onReduceButtonClick: (item:DistributePropItem)=>void;
    
    public key: string;
    private _point: number = 0;

    public get point() {
        return this._point;
    }

    public set point(value) {
        this._point = value;
        this.pointEditBox.string = this._point.toString();
    }

    public setTitle(title: string) {
        this.titleLbl.string = title;
    }

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public onAddButtonClicked() {
        this.onAddButtonClick?.(this);
    }

    public onReduceButtonClicked() {
        this.onReduceButtonClick?.(this);
    }
}
