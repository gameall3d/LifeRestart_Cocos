class EventEmitter {
    private _listenerMap: Map<string, Function[]> = new Map<string, Function[]>();
    public emit(name: string, ...args: any[]) {
        const funcList = this._listenerMap.get(name);
        if (funcList) {
            funcList.forEach((func) => {
                func(...args);
            });
        }
    }

    public on(name: string, func: Function) {
        let funcList = this._listenerMap.get(name);
        if (!funcList) {
            funcList = [];
            this._listenerMap.set(name, funcList);
        }

        funcList.push(func);
    }

    public off(name: string, func: Function) {
        const funcList = this._listenerMap.get(name);
        if (funcList) {
            const idx = funcList.indexOf(func);
            if (idx >= 0) {
                funcList.splice(idx, 1);
            }
        }
    }
}

const eventMsg = new EventEmitter();

export { EventEmitter, eventMsg }