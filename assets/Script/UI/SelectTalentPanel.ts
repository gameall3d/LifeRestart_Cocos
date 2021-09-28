
import { _decorator, Component, Node, Prefab, Label, instantiate, Button } from 'cc';
import { Message } from '../Defines';
import { ITalentInfo } from '../Talent';
import { eventMsg } from '../Utils/EventMessage';
import { TalentItem } from './TalentItem';
import { UIPanel } from './UIPanel';
const { ccclass, property } = _decorator;

@ccclass('SelectTalentPanel')
export class SelectTalentPanel extends UIPanel {
    @property({type: Node})
    public talentItemGroup: Node;
    @property({type: Prefab})
    public talentItemPrfb: Prefab;

    @property({type: Button})
    public checkButton: Button;
    @property({type: Label})
    public checkButtonLbl: Label;
    @property({type: Label})
    public tips: Label;

    public talentItems: TalentItem[] = [];
    public selectedTalentIndices: number[] = [];
    private _talentList: ITalentInfo[];
    private _limitSelectedTalentNum = 3;

    start () {

    }

    public init(talentList: ITalentInfo[]) {
        this._talentList = talentList;
        this.talentItemGroup.removeAllChildren();
        this.selectedTalentIndices = [];
        this.talentItems = [];
        this.tips.string = `最多选择${this._limitSelectedTalentNum}个天赋`;

        talentList.forEach((talentInfo, index) => {
            const itemNode = instantiate(this.talentItemPrfb);
            itemNode.setParent(this.talentItemGroup);
            const item = itemNode.getComponent(TalentItem);
            item.index = index;
            item.setData(talentInfo);
            this.talentItems.push(item);
            item.onItemClick = this.onTalentItemClicked.bind(this);
        });

        this.updateCheckButtonState();
    }

    public updateCheckButtonState() {
        if(this.selectedTalentIndices.length === this._limitSelectedTalentNum) {
            this.checkButtonLbl.string = "完成";
            this.checkButton.interactable = true;
        } else {
            const left = this._limitSelectedTalentNum - this.selectedTalentIndices.length;
            this.checkButtonLbl.string = `还差${left}个天赋`
            this.checkButton.interactable = false;
        }
    }

    public onTalentItemClicked(itemIndex: number) {
        const idx = this.selectedTalentIndices.indexOf(itemIndex);
        if (idx >= 0) {
            this.selectedTalentIndices.splice(idx, 1);
        } else {
            // 超过数量则替换掉上个选择的对象
            if (this.selectedTalentIndices.length === this._limitSelectedTalentNum) {
                this.selectedTalentIndices.splice(this._limitSelectedTalentNum - 1, 1);
            }
            this.selectedTalentIndices.push(itemIndex);
        }

        this.talentItems.forEach((item, index) => {
            if (this.selectedTalentIndices.indexOf(index) >= 0) {
                item.setSelected(true);
            } else {
                item.setSelected(false);
            }
        })
        this.updateCheckButtonState();
    }

    public onCheckButtonClicked() {
        const selectedTalentList: ITalentInfo[] = [];
        this.selectedTalentIndices.forEach((idx) => {
            selectedTalentList.push(this._talentList[idx]);
        })
        eventMsg.emit(Message.TalentSelectEnd, selectedTalentList);
    }

    public onShow(talentList: ITalentInfo[]) {
        this.init(talentList);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
