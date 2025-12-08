
import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

// declare function require( rPath:string ) : any;
import uiController from "./uiController";
import messageController from "./messageController";
//数据缓存
@ccclass('DataController')
export default class dataController extends Component {
    //ui缓冲，跨ui通信
    uiData: any = {};
    persistData: any = {};
    static _instance: dataController;
    public static getInstance() {
        return dataController._instance;
    }
    savePersistData(r_notifyChanged: boolean = true) {
        var persistDataString = JSON.stringify(this.persistData);
        sys.localStorage.setItem("persistDataAP", persistDataString);
    }
}