/*******************
* author :hchomely
* create time :2025-12-11 10:23:12
*******************/
const { ccclass, property } = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox, Vec3 } from 'cc';
import auto_grade1chapter6 from "./auto_ui/auto_grade1chapter6";

@ccclass("grade1chapter6")
export default class grade1chapter6 extends auto_grade1chapter6 {

    createInit() {//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 

        util.bindClickEventFX(this.btnBack.node, this.btnBack_Click.bind(this));
        util.bindClickEventFX(this.btnFresh.node, this.btnFresh_Click.bind(this));
        util.bindClickEventFX(this.btnNextStep.node, this.btnNextStep_Click.bind(this));

        this.tgTips.node.on('toggle', this.onTipsToggle.bind(this));
        this.tgShowSec.node.on('toggle', this.onShowSecToggle.bind(this));
    }
    init() {//每次打开都会执行，初始化函数
        this.data = this.getQuestionData();
        this.step = 1;
        this.refreshUI();
    }
    preInit() {//和init类似 在init之前执行

    }
    refreshUI() {//刷新函数，页面某些数据需要刷新的时候使用
        this.freshTips();
        this.slTipsToEditor.string =   this.tgShowSec.isChecked?this.data.question1:this.data.question;

        this.custom_hour.eulerAngles = new Vec3(0, 0, -this.data.hourAngle);
        this.custom_min.eulerAngles = new Vec3(0, 0, -this.data.minuteAngle);
        this.custom_sec.eulerAngles = new Vec3(0, 0, -this.data.secondAngle);
        
        this.custom_sec.active = this.tgShowSec.isChecked;
        this.slResult.string = this.tgShowSec.isChecked?this.data.answer1:this.data.answer;
        this.slResult.node.active = this.step == 2;
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

    btnBack_Click() {

    }
    btnFresh_Click() {
        this.data = this.getQuestionData();
        this.step = 1;
        this.refreshUI();
    }
    btnNextStep_Click() {
        this.step++;
        if(this.step >2){
            this.step =1;
        }
        this.refreshUI();
    }

    onTipsToggle() {
        this.freshTips();   
    }
    onShowSecToggle() {
        this.refreshUI();   
    }
    data;
    step: number = 0; // 当前步骤

    freshTips() {
        // this.tgTips.isChecked ? this.slTips.string = this.data.tips : this.slTips.string = "点击提示查看知识点";
    }

    getQuestionData() {
        //随机一个时间，根据随机出的时间钟的小时 分钟 秒 计算出时针 分针 秒针的 度数
        let hour = Math.floor(Math.random() * 12) + 1;
        let minute = Math.floor(Math.random() * 60);
        let second = Math.floor(Math.random() * 60);

        let hourAngle = hour * 30 + minute * 0.5;
        let minuteAngle = minute * 6;
        let secondAngle = second * 6;

        
        return {
            question: `写出下图的小时分钟`,
            question1: `写出下图的小时分钟秒钟`,
            tips: `时针每小时走30度，每分走0.5度，分针每分钟走6度，秒针每秒走6度`,
            answer: `时间${hour}:${minute}`,
            answer1: `时间${hour}:${minute}:${second}`,
            hourAngle: hourAngle.toFixed(2),
            minuteAngle: minuteAngle.toFixed(2),
            secondAngle: secondAngle.toFixed(2)
        }
    }
}