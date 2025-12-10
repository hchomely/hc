/*******************
* author :hchomely
* create time :2025-12-08 20:18:26
*******************/
const { ccclass, property } = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox, Tween, tween, Color, UIOpacity, UITransform, Vec3, sp } from 'cc';
import auto_grade1chapter5 from "./auto_ui/auto_grade1chapter5";
import widgetPlayer from "./widget/widgetPlayer";

@ccclass("grade1chapter5")
export default class grade1chapter5 extends auto_grade1chapter5 {

    createInit() {//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 

        util.bindClickEventFX(this.btnBack.node, this.btnBack_Click.bind(this));
        util.bindClickEventFX(this.btnFresh.node, this.btnFresh_Click.bind(this));
        util.bindClickEventFX(this.btnNextStep.node, this.btnNextStep_Click.bind(this));
        this.widgetPlayer.node.setParent(this.node);
        this.widgetPlayer.node.active = false;
        this.tgTips.node.on("toggle", (tg) => {
            this.showTips = tg.isChecked;
            this.showTips ? this.slTips.string = this.data.tips : this.slTips.string = "点击提示查看知识点";
        });
    }
    init() {//每次打开都会执行，初始化函数
        this.data = this.getQuestionData();
        this.step = 1;
        this.showTips = false;
        this.tgTips.setIsCheckedWithoutNotify(false);
        this.refreshUI();
    }
    preInit() {//和init类似 在init之前执行

    }
    data;
    step: number = 0; // 当前步骤
    showTips:boolean=false;
    refreshUI() {//刷新函数，页面某些数据需要刷新的时候使用
        if (this.showTips) {
            this.slTips.string = this.data.tips;
        }
        else {
            this.slTips.string = "点击提示查看知识点";
        }
        this.slTipsToEditor.string = this.data.question;
        this.customStep1.active = this.step == 2;
        this.slResult.node.active = this.step == 2;
        this.slResult.string = this.data.answer;
        if (this.step == 2) {
            let animTime = 0.2;
            let animDelay = 0.1;
            let animPoxX = -20;
            this.customStep1.destroyAllChildren();
            let type = this.data.type;
            let tmpPosX = 0;
            let width = this.widgetPlayer.node.getComponent(UITransform).width;
            let leftNumb = this.data.num;
            if (type == 2 || type == 3) {
                leftNumb = leftNumb - 1;
            }
            for (let i = 0; i < leftNumb; i++) {
                let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                let childPosX = tmpPosX;
                tmpPosX = tmpPosX + width;
                child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                child.node.setScale(new Vec3(0, 0, 0));
                child.setUIData({
                    isme: false,
                    leftNum: 1 + i,
                    type: type
                });
                let index = i + 1;
                tween(child.node)
                    .delay(index * animDelay)
                    .to(animTime, { scale: new Vec3(1, 1, 1) })
                    .to(animTime, { position: new Vec3(childPosX, 0, 0) })
                    .start();
            }

            let me = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
            let space = this.data.num;
            if (type == 2 || type == 3) {
                space = space - 1;
            }
            let mePosX = tmpPosX;
            tmpPosX = tmpPosX + width;
            me.node.setScale(new Vec3(0, 0, 0));
            me.node.setPosition(new Vec3(mePosX, animPoxX, 0));
            me.setUIData({
                isme: true,
                leftNum: this.data.num,
                rightNum: this.data.num1,
                num: 0,
                playerName: this.data.playerName,
                type: type
            });
            //做一个从下到上的动画
            tween(me.node)
                .to(animTime, { scale: new Vec3(1, 1, 1) })
                .to(animTime, { position: new Vec3(mePosX, 0, 0) })
                .start();

            let rightNum = this.data.num1;
            if (type == 2) {
                rightNum = rightNum - 1;
            }
            else if (type == 3) {
                rightNum = this.data.num1 - this.data.num - 1;
            }
            for (let i = 0; i < rightNum; i++) {
                let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                let childPosX = tmpPosX;
                tmpPosX = tmpPosX + width;
                child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                let tmpNum = 1 + i;
                if (type == 2) {
                    tmpNum = rightNum - i;
                }
                else if (type == 3) {
                    tmpNum = this.data.num + i + 1;
                }
                child.setUIData({
                    isme: false,
                    rightNum: tmpNum,
                    type: type
                });
                let index = i;
                child.node.setScale(new Vec3(0, 0, 0));
                tween(child.node)
                    .delay((this.data.num + 1 + index) * animDelay)
                    .to(animTime, { scale: new Vec3(1, 1, 1) })
                    .to(animTime, { position: new Vec3(childPosX, 0, 0) })
                    .start();
            }
            if (type == 3) {
                //在后面再加一个人
                let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                let childPosX = tmpPosX;
                tmpPosX = tmpPosX + width;
                child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                child.setUIData({
                    isme: true,
                    playerName: this.data.player2Name,
                    
                    rightNum: this.data.num1,
                    type: type
                });
                child.node.setScale(new Vec3(0, 0, 0));
                tween(child.node)
                    .to(animTime, { scale: new Vec3(1, 1, 1) })
                    .to(animTime, { position: new Vec3(childPosX, 0, 0) })
                    .start();
            }
        }
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
    btnMenu_Click() {

    }
    btnFresh_Click() {
        this.data = this.getQuestionData();
        this.step = 1;
        this.refreshUI();
    }
    btnNextStep_Click() {
        this.step++;
        if (this.step > 2) {
            this.step = 1;
        }
        this.refreshUI();
    }

    getQuestionData() {
        //随机生成一个排队问题
        // 问题1是：小明前面有3个人，后面有2人，一共有几人？
        // 问题2是：小明从前面数是第2，从后面数是第4，一共多少人？
        // 问题3是：同学们排队做操，小明排第三，小花排第9，他们之间有几人？
        let type = Math.floor(Math.random() * 3) + 1;
        if (type == 1) {
            //前有几后有几的问题jiren
            let num = Math.floor(Math.random() * 9) + 1;
            let num1 = Math.floor(Math.random() * 9) + 1;
            let question = "小明前面有" + num + "人，后面有" + num1 + "人，一共有几人？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "前有几，后有几，两数相加加自己 几+几+1",
                //题目
                question: question,
                //1 表示前有几后有几的的问题
                type: 1,
                //答案
                answer: `列式：${num}+${num1}+1=${num + num1 + 1} （人）`,
                playerName: "小明",
            }
        }
        else if (type == 2) {

            let num = Math.floor(Math.random() * 9) + 1;
            let num1 = Math.floor(Math.random() * 9) + 1;
            let question = "小明从前面数是第" + num + "，从后面数是第" + num1 + "，一共多少人？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "前第几，后第几，两数相加减自己 几+几-1",
                //题目
                question: question,
                //2 表示从前面数是第几，从后面数是第几的问题
                type: 2,
                //答案
                answer: `列式：${num}+${num1}-1=${num + num1 - 1} （人）`,
                playerName: "小明",
            }
        }
        else if (type == 3) {

            let num = Math.floor(Math.random() * 9) + 1;
            let num1 = Math.floor(Math.random() * 9) + 1;
            //确保num1大于num
            // //两个数不能相等
            if (num1 == num) {
                num1 = num + 2;
            }
            if (num1 < num) {
                let temp = num;
                num = num1;
                num1 = temp;
            }
            let question = "同学们排队做操，小明排第" + num + "，小花排第" + num1 + "，他们之间有几人？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "求之间，很简单，两数相减再减1 几-几-1",
                //题目
                question: question,
                //3 表示同学们排队做操，小明排第几，小花排第几，他们之间有几人？
                type: 3,
                //答案
                answer: `列式：${num1}-${num}-1=${num1 - num - 1} （人）`,
                playerName: "小明",
                player2Name: "小花",
            }
        }

    }
}


