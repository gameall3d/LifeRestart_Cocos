import { weightRandom } from './functions/util'
import Property from './property';
import Event from './event';
import { ITalentData, TalentManager, talentMgr } from './Talent';
import { Achievement, IListAchievementData } from './achievement';
import ConfigManager from './Utils/ConfigManager';

interface ITalentReplacementInfo {
    type: string;
    source: ITalentData;
    target: ITalentData;
}

interface ITrackData {
    age: number;
    content: any[];
    isEnd: boolean;
}

class LifeManager {
    constructor() {
        this._property = new Property();
        this._event = new Event();
        this._talent = talentMgr;
        this._achievement = new Achievement();
    }

    _property;
    _event;
    _talent: TalentManager;
    _achievement;
    _triggerTalents;

    async initial() {
        
        const [age, talents, events, achievements] = await Promise.all([
            ConfigManager.readJson('age'),
            ConfigManager.readJson('talents'),
            ConfigManager.readJson('events'),
            ConfigManager.readJson('achievement'),
        ])
        this._property.initial({age});
        this._talent.initial({talents});
        this._event.initial({events});
        this._achievement.initial({achievements});
    }

    restart(allocation) {
        this._triggerTalents = {};
        const contents = this.talentReplace(allocation.TLT);
        this._property.restart(allocation);
        this.doTalent();
        this._property.restartLastStep();
        this._achievement.achieve(
            this._achievement.Opportunity.START,
            this._property
        )
        return contents;
    }

    getTalentAllocationAddition(talents) {
        return this._talent.allocationAddition(talents);
    }

    getTalentCurrentTriggerCount(talentId) {
        return this._triggerTalents[talentId] || 0;
    }

    next(): ITrackData {
        const {age, event, talent} = this._property.ageNext();

        const talentContent = this.doTalent(talent);
        const eventContent = this.doEvent(this.random(event));

        const isEnd = this._property.isEnd();

        const content = [...talentContent, ...eventContent];
        this._achievement.achieve(
            this._achievement.Opportunity.TRAJECTORY,
            this._property
        )
        return { age, content, isEnd };
    }

    talentReplace(talents): ITalentReplacementInfo[] {
        const result = this._talent.replace(talents);
        const contents = [];
        for(const id in result) {
            talents.push(result[id]);
            const source = this._talent.get(id);
            const target = this._talent.get(result[id]);
            contents.push({
                type: 'talentReplace',
                source, target
            });
        }
        return contents;
    }

    doTalent(talents?: any[]) {
        if(talents) this._property.change(this._property.TYPES.TLT, talents);
        talents = this._property.get(this._property.TYPES.TLT)
            .filter(talentId => this.getTalentCurrentTriggerCount(talentId) < this._talent.get(talentId).max_triggers);

        const contents = [];
        for(const talentId of talents) {
            const result = this._talent.do(talentId, this._property);
            if(!result) continue;
            this._triggerTalents[talentId] = this.getTalentCurrentTriggerCount(talentId) + 1;
            const { effect, name, description, grade } = result;
            contents.push({
                type: this._property.TYPES.TLT,
                name,
                grade,
                description,
            })
            if(!effect) continue;
            this._property.effect(effect);
        }
        return contents;
    }

    doEvent(eventId) {
        const { effect, next, description, postEvent } = this._event.do(eventId, this._property);
        this._property.change(this._property.TYPES.EVT, eventId);
        this._property.effect(effect);
        const content = {
            type: this._property.TYPES.EVT,
            description,
            postEvent,
        }
        if(next) return [content, ...this.doEvent(next)];
        return [content];
    }

    random(events) {
        return weightRandom(
            events.filter(
                ([eventId])=>this._event.check(eventId, this._property)
            )
        );
    }

    talentRandom() {
        const times = this._property.get(this._property.TYPES.TMS);
        const achievement = this._property.get(this._property.TYPES.CACHV);
        return this._talent.talentRandom(this.getLastExtendTalent(), { times, achievement });
    }

    talentExtend(talentId) {
        this._property.set(this._property.TYPES.EXT, talentId);
    }

    getLastExtendTalent() {
        return this._property.get(this._property.TYPES.EXT);
    }

    getSummary() {
        this._achievement.achieve(
            this._achievement.Opportunity.SUMMARY,
            this._property
        )
        return {
            AGE: this._property.get(this._property.TYPES.HAGE),
            CHR: this._property.get(this._property.TYPES.HCHR),
            INT: this._property.get(this._property.TYPES.HINT),
            STR: this._property.get(this._property.TYPES.HSTR),
            MNY: this._property.get(this._property.TYPES.HMNY),
            SPR: this._property.get(this._property.TYPES.HSPR),
            SUM: this._property.get(this._property.TYPES.SUM),
        };
    }

    getLastRecord() {
        return this._property.getLastRecord();
    }

    exclusive(talents, exclusive) {
        return this._talent.exclusive(talents, exclusive);
    }

    getAchievements(): IListAchievementData[] {
        const ticks = {};
        this._property
            .get(this._property.TYPES.ACHV)
            .forEach(([id, tick]) => ticks[id] = tick);
        return this
            ._achievement
            .list(this._property)
            .sort((
                {id: a, grade: ag, hide: ah},
                {id: b, grade: bg, hide: bh}
            )=>{
                a = ticks[a];
                b = ticks[b];
                if(a&&b) return b - a;
                if(!a&&!b) {
                    if(ah&&bh) return bg - ag;
                    if(ah) return 1;
                    if(bh) return -1;
                    return bg - ag;
                }
                if(!a) return 1;
                if(!b) return -1;
            });
    }

    getTotal() {
        const TMS = this._property.get(this._property.TYPES.TMS);
        const CACHV = this._property.get(this._property.TYPES.CACHV);
        const CTLT = this._property.get(this._property.TYPES.CTLT);
        const CEVT = this._property.get(this._property.TYPES.CEVT);

        const totalTalent = this._talent.count();
        const totalEvent = this._event.count();

        return {
            times: TMS,
            achievement: CACHV,
            talentRate: CTLT / totalTalent,
            eventRate: CEVT / totalEvent,
        }
    }

    get times() { return this._property?.get(this._property.TYPES.TMS) || 0; }
    set times(v) {
        this._property?.set(this._property.TYPES.TMS, v) || 0;
        this._achievement.achieve(
            this._achievement.Opportunity.END,
            this._property
        )
    }
}

const lifeMgr = new LifeManager();
export { lifeMgr };
export type { ITrackData };


