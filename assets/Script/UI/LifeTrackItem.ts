
import { _decorator, Component, Node, RichText, UITransform, Size, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LifeTrackItem')
export class LifeTrackItem extends Component {
    @property({type: Label})
    public agaLabel: Label;
    @property({type: RichText})
    public descriptionText: RichText;
    @property({type: Node})
    public descriptionBG: Node;
    @property({type: Node})
    public lineNode: Node;

    start () {
        // [3]
    }

    public setData(age:string, description: string) {
        this.agaLabel.string = age;
        this.descriptionText.string = description;

        const height = this.getHeight();

        const descriptionBGTrans = this.descriptionBG.getComponent(UITransform);
        const size = descriptionBGTrans.contentSize;
        descriptionBGTrans.contentSize = new Size(size.width, height);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public getHeight() {
        const size = this.descriptionText.getComponent(UITransform).contentSize;
        return size.height;
    }

    public setLineLength(length: number) {
        const lineNodeTrans = this.lineNode.getComponent(UITransform);
        const size = lineNodeTrans.contentSize;
        lineNodeTrans.contentSize = new Size(size.width, length);
    }
}
