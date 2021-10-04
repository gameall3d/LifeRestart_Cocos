
import { _decorator, Component, Node, sys } from 'cc';
import { Message } from './Defines';
import { lifeMgr } from './Life';
import { ITalentInfo } from './Talent';
import { AchievementHint } from './UI/AchievementHint';
import { AchievementPanel } from './UI/AchievementPanel';
import { DistributePropPanel } from './UI/DistributePropPanel';
import { LifeTrackPanel } from './UI/LifeTrackPanel';
import { SelectTalentPanel } from './UI/SelectTalentPanel';
import { StartMenuPanel } from './UI/StartMenuPanel';
import ConfigManager from './Utils/ConfigManager';
import { eventMsg } from './Utils/EventMessage';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type: AchievementHint})
    public achievementHint: AchievementHint;
    @property({type: Node})
    public saveButtonNode: Node;
    @property({type: Node})
    public loadButtonNode: Node;
    @property({type: Node})
    public homeButtonNode: Node;
    @property({type: Node})
    public githubButtonNode: Node;
    @property({type: Node})
    public achievementButtonNode: Node;

    @property({type: StartMenuPanel})
    public startMenuPanel: StartMenuPanel;

    @property({type: AchievementPanel})
    public achievementPanel: AchievementPanel;

    @property({type: SelectTalentPanel})
    public selectTalentPanel: SelectTalentPanel;

    @property({type: DistributePropPanel})
    public distributePropPanel: DistributePropPanel;

    @property({type: LifeTrackPanel})
    public lifeTrackPanel: LifeTrackPanel;

    private _selectedTalentList: ITalentInfo[];

    start () {
        this.init();
    }

    async init() {
        const [,happyLife, specialthanks] = await Promise.all([
            lifeMgr.initial(),
            ConfigManager.readJson('happy_life'),
            ConfigManager.readJson('specialthanks')
        ]);

        eventMsg.on(Message.StartMenu, ()=> {
            this.startMenuPanel.show(happyLife);
            this.selectTalentPanel.hide();
            this.distributePropPanel.hide();
            this.lifeTrackPanel.hide();

            this.loadButtonNode.active = true;
            this.saveButtonNode.active = true;
            this.homeButtonNode.active = false;
            this.githubButtonNode.active = true;
            this.achievementButtonNode.active = true;
        });
        
        eventMsg.on(Message.StartGame, ()=> {
            this.startMenuPanel.hide();
            this.loadButtonNode.active = false;
            this.saveButtonNode.active = false;
            this.homeButtonNode.active = true;
            this.githubButtonNode.active = false;
            this.achievementButtonNode.active = false;
            this.openSelectTalentPanel();
        });

        eventMsg.on(Message.TalentSelectEnd, (selectedTalentList)=> {
            this._selectedTalentList = selectedTalentList;
            this.selectTalentPanel.hide();
            this.distributePropPanel.show(selectedTalentList);
        })

        eventMsg.on(Message.DistributePropEnd, (propData) => {
            this.distributePropPanel.hide();
            this.lifeTrackPanel.show(this._selectedTalentList, propData);
        });

        eventMsg.on(Message.Replay, ()=> {
            this.lifeTrackPanel.hide();
            lifeMgr.times++;
            this.openSelectTalentPanel();
        });

        // achievement
        eventMsg.on(Message.Achievement, ({name})=> {
            this.achievementHint.show(name);
        });


        // start
        eventMsg.emit(Message.StartMenu);
    }

    openSelectTalentPanel() {
        const talentList = lifeMgr.talentRandom();
        this.selectTalentPanel.show(talentList); 
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public save() {
        if (sys.platform === sys.Platform.MOBILE_BROWSER ||
            sys.platform === sys.Platform.DESKTOP_BROWSER) {
                const data = {};
                Object
                    .keys(localStorage)
                    .filter(v=>v.substr(0,4)!='goog')
                    .forEach(key=>data[key] = localStorage[key]);

                let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                // @ts-ignore
                const slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                blob = slice.call(blob, 0, blob.size, 'application/octet-stream');
                const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;

                a.href = URL.createObjectURL(blob);
                a.download = `Remake_save_${new Date().toISOString().replace(':','.')}.json`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
        }
    }

    public load() {
        if (sys.platform === sys.Platform.MOBILE_BROWSER ||
            sys.platform === sys.Platform.DESKTOP_BROWSER) {
                const file = document.createElement('input');
                file.type = 'file';
                file.name = 'file';
                file.accept = "application/json";
                // @ts-ignore
                file.style = "display: none;";
                file.append('body');
                file.click();
                file.addEventListener('change', (e)=>{
                    // @ts-ignore
                    const file = e.target.files[0];
                    if(!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                        const data = JSON.parse(reader.result as string);
                        for(const key in data) {
                            localStorage[key] = data[key];
                        }
                        this.achievementHint.show('加载存档成功');
                    }
                    reader.readAsText(file);
                });
        }
    }

    public onHomeButtonClicked() {
        eventMsg.emit(Message.StartMenu);
    }

    public onGithubButtonClicked() {
        sys.openURL("https://github.com/gameall3d/LifeRestart_Cocos");
    }

    public onOpenAchievementButtonClicked() {
        this.achievementPanel.show();
    }
}