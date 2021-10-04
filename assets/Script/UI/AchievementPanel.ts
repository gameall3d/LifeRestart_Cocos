
import { _decorator, Component, Node, Prefab, instantiate, UITransform } from 'cc';
import { getGrade, getRate } from '../functions/addition';
import { lifeMgr } from '../Life';
import { AchievementItem, IAchievementItemData } from './AchievementItem';
import { StatisticsItem } from './StatisticsItem';
import { UIPanel } from './UIPanel';
const { ccclass, property } = _decorator;


 
@ccclass('AchievementPanel')
export class AchievementPanel extends UIPanel {
    @property({type: Node})
    public achievementItemsGroup: Node;
    @property({type: Prefab})
    public achievementItemPrfb: Prefab;

    @property({type: Node})
    public statisticsItemsGroup: Node;
    @property({type: Prefab})
    public statisticsItemPrfb: Prefab;

    private _contentUITrans!: UITransform;
    private _itemHeight = 150;
    private _spacingY = 20;

    start () {
        // [3]
        this._contentUITrans = this.achievementItemsGroup._uiProps.uiTransformComp;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    createAchievementItem(data: IAchievementItemData) {
        const itemNode = instantiate(this.achievementItemPrfb);
        itemNode.setParent(this.achievementItemsGroup);
        const item = itemNode.getComponent(AchievementItem);
        item.setData(data);

        const itemNum = this.achievementItemsGroup.children.length;
        const lines = Math.round(itemNum / 2);
        this._contentUITrans.height = lines * this._itemHeight + this._spacingY * (lines - 1);
    }

    createStatisticsItem(title: string, desc: string, grade: number) {
        const itemNode = instantiate(this.statisticsItemPrfb);
        itemNode.setParent(this.statisticsItemsGroup);
        const item = itemNode.getComponent(StatisticsItem);
        item.setData(title, desc, grade);
    }

    protected onShow() {
        this.achievementItemsGroup.removeAllChildren();
        this._contentUITrans = this.achievementItemsGroup._uiProps.uiTransformComp;
        const achievementsData = lifeMgr.getAchievements();
        achievementsData.forEach(({name, description, hide, grade, isAchieved}) => {
            this.createAchievementItem({
                name,
                description,
                hide,
                grade,
                isAchieved
            });
        });

        this.generateStatisticsData();
    }

    generateStatisticsData() {
        this.statisticsItemsGroup.removeAllChildren();
        const { times, achievement, talentRate, eventRate } = lifeMgr.getTotal();
        this.createStatisticsItem(`已重开${times}次`, `${this.formatRate('times', times)}`, getGrade('times', times));
        this.createStatisticsItem(`成就达成${achievement}个`, `${this.formatRate('achievement', achievement)}`, getGrade('achievement', achievement));
        this.createStatisticsItem(`事件收集率`, `${Math.floor(eventRate * 100)}%`, getGrade('eventRate', eventRate));
        this.createStatisticsItem(`天赋收集率`, `${Math.floor(talentRate * 100)}%`, getGrade('talentRate', talentRate));
    }

    formatRate (type, value) {
        const rate = getRate(type, value);
        let color = Object.keys(rate)[0];
        switch(parseInt(color)) {
            case 0: color = '白色'; break;
            case 1: color = '蓝色'; break;
            case 2: color = '紫色'; break;
            case 3: color = '橙色'; break;
            default: break;
        }
        let r = Object.values(rate)[0];
        switch(parseInt(r)) {
            case 1: r = '不变'; break;
            case 2: r = '翻倍'; break;
            case 3: r = '三倍'; break;
            case 4: r = '四倍'; break;
            case 5: r = '五倍'; break;
            case 6: r = '六倍'; break;
            default: break;
        }
        return `抽到${color}概率${r}`;
    }
}
