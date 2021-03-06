
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
        this.createStatisticsItem(`?????????${times}???`, `${this.formatRate('times', times)}`, getGrade('times', times));
        this.createStatisticsItem(`????????????${achievement}???`, `${this.formatRate('achievement', achievement)}`, getGrade('achievement', achievement));
        this.createStatisticsItem(`???????????????`, `${Math.floor(eventRate * 100)}%`, getGrade('eventRate', eventRate));
        this.createStatisticsItem(`???????????????`, `${Math.floor(talentRate * 100)}%`, getGrade('talentRate', talentRate));
    }

    formatRate (type, value) {
        const rate = getRate(type, value);
        let color = Object.keys(rate)[0];
        switch(parseInt(color)) {
            case 0: color = '??????'; break;
            case 1: color = '??????'; break;
            case 2: color = '??????'; break;
            case 3: color = '??????'; break;
            default: break;
        }
        let r = Object.values(rate)[0];
        switch(parseInt(r)) {
            case 1: r = '??????'; break;
            case 2: r = '??????'; break;
            case 3: r = '??????'; break;
            case 4: r = '??????'; break;
            case 5: r = '??????'; break;
            case 6: r = '??????'; break;
            default: break;
        }
        return `??????${color}??????${r}`;
    }
}
