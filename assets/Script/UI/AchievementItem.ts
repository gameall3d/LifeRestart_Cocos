
import { _decorator, Component, Node, Label, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

export interface IAchievementItemData {
    name: string;
    description: string;
    grade: number;
    hide: number;
    isAchieved: boolean;
}

const gradeColor = [
    new Color().fromHEX('#464646'),
    new Color().fromHEX('#7ea5ec'),
    new Color().fromHEX('#e2a7ff'),
    new Color().fromHEX('#ffa07a'),
]

@ccclass('AchievementItem')
export class AchievementItem extends Component {
    @property({type: Sprite})
    public BG: Sprite;

    @property({type: Label})
    public titleLbl: Label;

    @property({type: Label})
    public descLbl: Label;

    @property({type: Sprite})
    public flowerTag: Sprite;
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public setData(data: IAchievementItemData) {
        if (data.hide && !data.isAchieved) {
            this.titleLbl.string = "???";
            this.descLbl.string = "???";
        } else {
            this.titleLbl.string = data.name;
            this.descLbl.string = data.description;
        }

        this.BG.color = gradeColor[data.grade];

        if (data.isAchieved) {
            this.flowerTag.node.active = true;
        } else {
            this.flowerTag.node.active = false;
        }
    }
}
