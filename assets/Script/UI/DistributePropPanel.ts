
import { _decorator, Component, Node, Prefab, Label, instantiate } from 'cc';
import { ConfigProp, Message, PropNameMap } from '../Defines';
import { lifeMgr } from '../Life';
import { ITalentInfo } from '../Talent';
import { eventMsg } from '../Utils/EventMessage';
import { DistributePropItem } from './DistributePropItem';
import { UIPanel } from './UIPanel';
const { ccclass, property } = _decorator;

const distributePropKeys = [
    'CHR',
    'INT',
    'STR',
    'MNY'
]

@ccclass('DistributePropPanel')
export class DistributePropPanel extends UIPanel {
    @property({type: Node})
    public propGroup: Node;
    @property({type: Prefab})
    public distributePropItemPrfb: Prefab;
    @property({type: Label})
    public totalPointsLbl: Label;

    private totalPoints: number = 20;
    private distributePropItemsMap: Map<string, DistributePropItem> = new Map<string, DistributePropItem>();
    start () {
        // [3]
    }

    public init(selectedTalentList: ITalentInfo[]) {
        this.propGroup.removeAllChildren();
        this.distributePropItemsMap.clear();
        distributePropKeys.forEach((key) => {
            this.distributePropItemsMap.set(key, this.createPropItem(key, PropNameMap[key]));
        });

        // calculate total points
        this.totalPoints += lifeMgr.getTalentAllocationAddition(selectedTalentList.map(({id}) => id));

        this.updateLeftPoints();
    }

    public createPropItem(key:string, name:string) {
        const itemNode = instantiate(this.distributePropItemPrfb);
        itemNode.setParent(this.propGroup);
        const item = itemNode.getComponent(DistributePropItem);
        item.setTitle(name);
        item.key = key;
        item.point = 0;
        item.onAddButtonClick = this.onItemAddButtonClick.bind(this);
        item.onReduceButtonClick = this.onItemReduceButtonClick.bind(this);
        return item;
    }

    public getLeftPoints() {
        const usedPoints = Array.from(this.distributePropItemsMap.values()).reduce((pre, cur)=> {
            return pre + cur.point;
        }, 0);

        return this.totalPoints - usedPoints;
    }

    public onItemAddButtonClick(item: DistributePropItem) {
        if (this.getLeftPoints() > 0) {
            item.point += 1;
            this.updateLeftPoints()
        }
    }

    public onItemReduceButtonClick(item: DistributePropItem) {
        if(item.point > 0) {
            item.point -= 1;
            this.updateLeftPoints();
        }
    }

    public updateLeftPoints() {
        this.totalPointsLbl.string = this.getLeftPoints().toString();
    }

    public onCheckButtonClicked() {
        const propData = {
            SPR: 5
        }
        distributePropKeys.forEach((key) => {
            propData[key] = this.distributePropItemsMap.get(key).point;
        });
        eventMsg.emit(Message.DistributePropEnd, propData);
    }

    public onRandomDistributeButtonClicked() {
        let t = this.totalPoints;
        const arr = [10, 10, 10, 10];
        while(t>0) {
            const sub = Math.round(Math.random() * (Math.min(t, 10) - 1)) + 1;
            while(true) {
                const select = Math.floor(Math.random() * 4) % 4;
                if(arr[select] - sub <0) continue;
                arr[select] -= sub;
                t -= sub;
                break;
            }
        }

        Array.from(this.distributePropItemsMap.keys()).forEach((key, index) => {
            const item = this.distributePropItemsMap.get(key);
            item.point = 10 - arr[index];
        })

        this.updateLeftPoints();
    }

    public onShow(selectedTalentList: ITalentInfo[]) {
        this.init(selectedTalentList);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
