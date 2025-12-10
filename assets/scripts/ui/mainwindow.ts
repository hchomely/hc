/*******************
* author :hchomely
* create time :2025-12-02 10:24:22
*******************/
const { ccclass, property } = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox } from 'cc';
import auto_mainwindow from "./auto_ui/auto_mainwindow";
import uiController from "../controller/uiController";

@ccclass("mainwindow")
export default class mainwindow extends auto_mainwindow {

    createInit() {//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 
        util.bindClickEventFX(this.btnChapter1.node, () => {
            uiController.getInstance().show("grade1chapter1");
        });
        util.bindClickEventFX(this.btnChapter2.node, () => {
            uiController.getInstance().show("grade1chapter2");
        });
        util.bindClickEventFX(this.btnChapter3.node, () => {
            uiController.getInstance().show("grade1chapter3");
        });
        util.bindClickEventFX(this.btnChapter4.node, () => {
            uiController.getInstance().show("grade1chapter4");
        });
        
        // 添加数字华容道游戏按钮
        if (this.btnChapter5) {
            util.bindClickEventFX(this.btnChapter5.node, () => {
                uiController.getInstance().show("grade1chapter5");
            });
        }

    }
    init() {//每次打开都会执行，初始化函数
        // uiController.getInstance().show("grade1chapter2");
    }
    preInit() {//和init类似 在init之前执行

    }
    refreshUI() {//刷新函数，页面某些数据需要刷新的时候使用

    }
    endRefreshMessage(rMsg) {//接收分发数据
        super.endRefreshMessage(rMsg);
        if (rMsg.code == 0) {
            if (rMsg.event == "httpConfig") {
            }
        }

    }
    setUIData(data) {//通过其他脚本打开UI的时候可以用来传参数

    }



}