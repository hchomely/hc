//     /**
//      * 创建时候init
//      */
//     /**
//      * show-init
//      */
//     /**
//      * 执行init前执行的代码，轻量级的layout切换代码
//      */
//     //刷新消息前
//     //刷新消息
//     //刷新消息前
//     //ui打开
//     //关闭后回调
//     //ui init完成后回调
//     //隐藏ui
//     //click 點上
//     //初始化UI数据
//     //释放ui obj
//     //设置ui归宿id
// //游戏基础模块
// //房间基本设置

import { _decorator, Node, Vec2, Vec3 } from 'cc';
import { EUIType, EMatchType } from "./enum";
import { ICallback } from "./action";

export interface IUIBase {
    uiType: EUIType;
    createInit();
    init();
    preInit();
    preRefreshMessage(rMessage: any);
    refreshMessage(rMessage: any);
    endRefreshMessage(rMessage: any);
    onMessage(rMsg: any);
    show();
    setCallBack(rCaller: ICallback);
    setAfterInit(rCaller: ICallback);
    hide();
    isShow(): boolean;
    closerClick();
    setUIData(params: any);
    destory(): void;
    setRoomID(rRoomID: string): void;
    getRoomID(): string;
    getNode(): Node;
}
export interface IUIGameBase extends IUIBase {
    node: Node;
    tableNode: Node;
    getGameType(): EMatchType;
    isShowProxy(rUI: string): Boolean;
    playerList: any;
    _roomID: string;
    wgPlayers: any[];
    playFX(rSound: string): void;
    initGame(rRoomID: string): void;
    releaseGame(): void;
    change2Min(rPos: Vec3, rParent?: Node): void;
    change2Max(rParent?: Node): void;
    getPrefabName(): string;
    onSwitch(r_show: boolean): void;
}
export interface IRoomSetting {
    /**
     * 年级
     * */
    gradeNumber: number,
    /**
     * 章节
     * */
    chapterNumber: number,
}
export interface IClubSetting {
    clubID: number, //操作的工会
    unionID: number,
    myClubID: number, //玩家所属工会
    myUnionID: number,
}