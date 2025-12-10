/*******************
* author :hchomely
* create time :2025-12-03 15:30:19
*******************/
const { ccclass, property } = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import { Button,Node, Label,Sprite,Toggle, _decorator,EditBox, WebView } from 'cc';
import auto_grade1chapter4 from "./auto_ui/auto_grade1chapter4";

@ccclass("grade1chapter4")
export default class grade1chapter4 extends auto_grade1chapter4{

    @property(WebView)
    web:WebView=null;
    createInit(){//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 

        util.bindClickEventFX(this.btnBack.node, this.btnBack_Click.bind(this));
        util.bindClickEventFX(this.btnGameWZQ.node, this.btnGameWZQ_Click.bind(this));
        util.bindClickEventFX(this.btnGameHRD.node, this.btnGameHRD_Click.bind(this));

    }
    init(){//每次打开都会执行，初始化函数

    }
    preInit(){//和init类似 在init之前执行

    }
    refreshUI(){//刷新函数，页面某些数据需要刷新的时候使用

    }
    endRefreshMessage(rMsg){//接收分发数据
        super.endRefreshMessage(rMsg);
        if (rMsg.code == 0){
            if (rMsg.event == "httpConfig"){
            }
        }

    }
    setUIData(data){//通过其他脚本打开UI的时候可以用来传参数

    }

    btnBack_Click(){

    }
    btnGameWZQ_Click(){
        if (this.web){
            this.web.url = "http://119.45.185.223:89/web/index1.html";
        }
    }
    btnGameHRD_Click(){
        if (this.web){
            this.web.url = "http://119.45.185.223:89/web/index.html";
        }
    }

}