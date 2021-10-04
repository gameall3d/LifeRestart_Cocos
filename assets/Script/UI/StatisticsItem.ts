
import { _decorator, Component, Node, Label, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;
 
const gradeColor = [
    new Color().fromHEX('#464646'),
    new Color().fromHEX('#7ea5ec'),
    new Color().fromHEX('#e2a7ff'),
    new Color().fromHEX('#ffa07a'),
]

@ccclass('StatisticsItem')
export class StatisticsItem extends Component {
    @property({type: Sprite})
    public BG: Sprite;
    @property({type: Label})
    public titleLbl: Label;

    @property({type: Label})
    public descLbl: Label;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public setData(title: string, desc: string, grade: number) {
        this.titleLbl.string = title;
        this.descLbl.string = desc;
        this.BG.color = gradeColor[grade];

    }
}
