
import { _decorator, Component, Node, Label, Widget, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AchievementHint')
export class AchievementHint extends Component {
    @property({type: Label})
    public contentLbl: Label;
    @property({type: Widget})
    public widget: Widget;

    private _isShowing = false;
    private _timer = null;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }


    public show(content: string, time: number = 1)  {
        if (!this._isShowing) {
            this._isShowing;
            this.node.active = true;
            this.contentLbl.string = content;
            this.widget.top = -100;
            tween(this.widget).to(0.5, {top: 0}).start();
            //tween(this.node).to(0.5, {position: new Vec3(0, 560, 0)});
            this._timer = setTimeout(()=> {
                this.node.active = false;
                this._isShowing = false;
            }, time*1000);
        } else {
            this.contentLbl.string = content;
            clearTimeout(this._timer);
            this._timer = setTimeout(()=> {
                this.node.active = false;
                this._isShowing = false;
            }, time*1000);
        }
    }
}
