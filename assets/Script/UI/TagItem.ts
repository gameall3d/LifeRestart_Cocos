
import { _decorator, Component, Node, Label, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('TagItem')
export class TagItem extends Component {
    @property({type: Label})
    public tagName: Label;

    @property({type: UIOpacity})
    public uiOpacity: UIOpacity;

    start () {
        // [3]
    }

    public setFontSize(size:number) {
        this.tagName.fontSize = size;
    }

    public setOpacity(op: number) {
        this.uiOpacity.opacity = op;
    }

    public setTagName(name: string) {
        this.tagName.string = name;
    }

    public refresh(fallLength: number, radius: number) {
        const pos = this.node.position;
        const scale = fallLength / (fallLength - pos.z);
        const alpha = (pos.z + radius) / (radius * 2);
        this.tagName.fontSize = 15 * scale;
        this.uiOpacity.opacity = (alpha + 0.5) * 255;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

