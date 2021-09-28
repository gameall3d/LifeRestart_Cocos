import { _decorator, loader, resources } from 'cc';
export default class ConfigManager {
    public static readJson(path:string) {
        return new Promise((resolve, reject) => {
            resources.load(path, function(err, jsonObj: any) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(jsonObj.json);
                }
            });
        });

    }
}