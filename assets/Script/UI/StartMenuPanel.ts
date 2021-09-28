import { _decorator, Component, Node, Prefab, instantiate, Vec3, Label, UIOpacity } from 'cc';
import { eventMsg } from '../Utils/EventMessage';
import { TagItem } from './TagItem';
import { UIPanel } from './UIPanel';
const { ccclass, property } = _decorator;

const fallLength = 400;
const RADIUS: number = 200;
const oneRadian = Math.PI / 180;

@ccclass('StartMenuPanel')
export class StartMenuPanel extends UIPanel {
    @property({type: Prefab})
    public tagLabelPrfb: Prefab;

    @property({type: Node})
    public tagCloud: Node;


    private _tagItems: TagItem[] = [];
    private _angleX = 0;
    private _angleY = 0;
    private _isAutoRotY = true;

    public onStartButtonClicked(){
        eventMsg.emit('StartGame');
    }

    protected onShow(tagList: string[]) {
        this.createTagCloud(tagList);
    }

    public createTagCloud(tagList: string[]) {
        this._tagItems = [];
        this.tagCloud.removeAllChildren();
        const tagLength = tagList.length;
        for (let i = 0; i < tagLength; i++) {  
            const k = (2*(i+1)-1)/tagLength - 1;
            const a = Math.acos(k);
            const b = a*Math.sqrt(tagLength*Math.PI);
            // var a = Math.random()*2*Math.PI;
            // var b = Math.random()*2*Math.PI;
            var x = RADIUS * Math.sin(a) * Math.cos(b);
            var y = RADIUS * Math.sin(a) * Math.sin(b); 
            var z = RADIUS * Math.cos(a);

            const labelNode = instantiate(this.tagLabelPrfb);
            labelNode.setParent(this.tagCloud);
            labelNode.setPosition(x, y, z);
            const tagItem = labelNode.getComponent(TagItem);
            this._tagItems.push(tagItem);

            tagItem.setTagName(tagList[i]);
            tagItem.refresh(fallLength, RADIUS);
        }
    }

    rotateX(){
        const cos = Math.cos(this._angleX);
        const sin = Math.sin(this._angleX);

        this._tagItems.forEach((tagItem)=>{
            const pos = tagItem.node.position;
            var y1 = pos.y * cos - pos.z * sin;
            var z1 = pos.z * cos + pos.y * sin;
            tagItem.node.setPosition(pos.x, y1, z1);
        });
    }
    rotateY(){
        var cos = Math.cos(this._angleY);
        var sin = Math.sin(this._angleY);

        this._tagItems.forEach((tagItem)=>{
            const pos = tagItem.node.position;
            var x1 = pos.x * cos - pos.z * sin;
            var z1 = pos.z * cos + pos.x * sin;
            tagItem.node.setPosition(x1, pos.y, z1);
        });
    }

    rotateItems() {
        this.rotateX();
        this.rotateY();

        this._tagItems.forEach((tagItem)=>{
            tagItem.refresh(fallLength, RADIUS);
        });
    }

    update (deltaTime: number) {
        // [4]
        if (this._isAutoRotY) {
            this._angleY = deltaTime * oneRadian * 5;
            this.rotateItems();
        }
    }
}