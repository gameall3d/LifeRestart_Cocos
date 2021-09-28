
import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc';
import { ITalentInfo } from '../Talent';
const { ccclass, property } = _decorator;

const gradeColor = [
    new Color().fromHEX('#464646'),
    new Color().fromHEX('#6495ed'),
    new Color().fromHEX('#e2a7ff'),
    new Color().fromHEX('#ffa07a'),
]

@ccclass('TalentItem')
export class TalentItem extends Component {
    @property({type: Label})
    public nameLbl: Label;
    
    @property({type: Sprite})
    public frame: Sprite;
    @property({type: Button})
    public ItemButton: Button;

    public index: number = 0;
    public onItemClick: (index: number)=>void = null;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public setData(data: ITalentInfo) {
        this.nameLbl.string = data.name + `(${data.description})`;
        this.ItemButton.normalColor = gradeColor[data.grade];
    }

    public onButtonClick() {
        this.onItemClick?.(this.index);
    }

    public setSelected(selected: boolean) {
        if (selected) {
            this.frame.color = Color.GREEN;
        } else {
            this.frame.color = Color.WHITE;
        }
    }
}