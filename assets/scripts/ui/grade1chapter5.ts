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
            this.freshTips();
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
    showTips: boolean = false;
    refreshUI() {//刷新函数，页面某些数据需要刷新的时候使用
        this.freshTips();
        this.slTipsToEditor.string = this.data.question;
        this.customStep1.active = this.step >= 2;
        this.slResult.node.active = this.step == 3;
        this.slResult.string = this.data.answer;
        let animTime = 0.2;
        let animDelay = 0.1;
        let animPoxX = -20;
        if (this.step == 2) {
            this.customStep1.destroyAllChildren();
            let type = this.data.type;
            let tmpPosX = 0;
            let tmpPosy = 0;
            let width = this.widgetPlayer.node.getComponent(UITransform).width;
            let leftNumb = this.data.num;
            if (type == 2 || type == 3) {
                leftNumb = leftNumb - 1;
            }
            else if (type == 4 || type == 5) {
                leftNumb = leftNumb - 1;
            }
            let rightNum = this.data.num1;
            if (type == 2) {
                rightNum = rightNum - 1;
            }
            else if (type == 3) {
                rightNum = this.data.num1 - this.data.num - 1;
            }
            else if (type == 4) {
                rightNum = this.data.num1 - this.data.num + 1;
            }
            else if (type == 5) {
                rightNum = this.data.num1;
            }
            this.slResult.node.getComponent(UIOpacity).opacity = 0;
            if (type == 1 || type == 2 || type == 3) {
                for (let i = 0; i < leftNumb; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    child.node.setScale(new Vec3(0, 0, 0));
                    child.setUIData({
                        isme: false,
                        leftNum: 1 + i,
                        type: type
                    });
                    let index = i + 1;
                    this.doTween(child.node, animTime, childPosX, tmpPosy, index * animDelay);
                }

                let me = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                let space = this.data.num;
                if (type == 2 || type == 3) {
                    space = space - 1;
                }
                if (tmpPosX > 900) {
                    tmpPosX = 0;
                    tmpPosy = -100;
                }
                let mePosX = tmpPosX; tmpPosX = tmpPosX + width;
                me.node.setPosition(new Vec3(mePosX, animPoxX, 0));
                me.setUIData({
                    isme: true,
                    leftNum: this.data.num,
                    rightNum: this.data.num1,
                    num: 0,
                    playerName: this.data.playerName,
                    type: type
                });
                this.doTween(me.node, animTime, mePosX, tmpPosy, 0);

                for (let i = 0; i < rightNum; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
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
                    this.doTween(child.node, animTime, childPosX, tmpPosy, (this.data.num + 1 + index) * animDelay);
                }
                if (type == 3) {
                    //在后面再加一个人
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    child.setUIData({
                        isme: true,
                        playerName: this.data.player2Name,

                        rightNum: this.data.num1,
                        type: type
                    });
                    this.doTween(child.node, animTime, childPosX, tmpPosy, 0);
                }
            }
            else if (type == 4 || type == 5) {
                for (let i = 0; i < leftNumb; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    child.node.setScale(new Vec3(0, 0, 0));
                    child.setUIData({
                        isme: false,
                        leftNum: 1 + i,
                        type: type
                    });
                    let index = i + 1;
                    this.doTween(child.node, animTime, childPosX, tmpPosy, index * animDelay);
                }
                for (let i = 0; i < rightNum; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    let tmpNum = this.data.num + i;
                    child.setUIData({
                        isme: true,
                        rightNum: tmpNum,
                        type: type
                    });
                    let index = i;
                    this.doTween(child.node, animTime, childPosX, tmpPosy, (this.data.num + 1 + index) * animDelay);
                }
                {
                    if (type == 5) {
                        let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                        if (tmpPosX > 900) {
                            tmpPosX = 0;
                            tmpPosy = -100;
                        }
                        let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                        child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                        child.node.setScale(new Vec3(0, 0, 0));
                        let index = this.data.num1 + this.data.num;
                        child.setUIData({
                            isme: false,
                            leftNum: index,
                            type: type
                        });
                        this.doTween(child.node, animTime, childPosX, tmpPosy, index * animDelay);
                    }
                }
            }
            else if (type == 6) {
                for (let i = 0; i < leftNumb; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    child.node.setScale(new Vec3(0, 0, 0));
                    child.setUIData({
                        isme: i == leftNumb - 1,
                        leftNum: this.week[1 + i],
                        type: type
                    });
                    let index = i + 1;
                    this.doTween(child.node, animTime, childPosX, tmpPosy, index * animDelay);
                }
                for (let i = 0; i < rightNum; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    let tmpNum = this.data.num + i + 1;
                    child.setUIData({
                        isme: false,
                        leftNum: this.week[tmpNum],
                        rightNum: i + 1,
                        type: type
                    });
                    let index = i;
                    this.doTween(child.node, animTime, childPosX, tmpPosy, (this.data.num + 1 + index) * animDelay);
                }
            }
            else if (type == 7) {
                for (let i = 0; i < leftNumb; i++) {
                    let child = widgetPlayer.CreateNew(widgetPlayer, this.widgetPlayer.node, this.customStep1);
                    if (tmpPosX > 900) {
                        tmpPosX = 0;
                        tmpPosy = -100;
                    }
                    let childPosX = tmpPosX; tmpPosX = tmpPosX + width;
                    child.node.setPosition(new Vec3(childPosX, animPoxX, 0));
                    child.node.setScale(new Vec3(0, 0, 0));
                    child.setUIData({
                        isme: i == leftNumb - 1,
                        leftNum: this.week[1 + i],
                        type: type,
                        rightNum: leftNumb-i-1>0 && leftNumb-i-1<=rightNum?leftNumb-i-1:null,
                    });
                    let index = i + 1;
                    this.doTween(child.node, animTime, childPosX, tmpPosy, index * animDelay);
                }
            }
        }
        if (this.step == 2) {
            // 做一个从下到上的动画
            this.slResult.node.getComponent(UIOpacity).opacity = 0;
            tween(this.slResult.node.getComponent(UIOpacity))
                .to(animTime, { opacity: 255 })
                .start();
        }
    }
    freshTips() {
        this.tgTips.isChecked ? this.slTips.string = this.data.tips : this.slTips.string = "点击提示查看知识点";
    }
    doTween(child, animTime, childPosX, childPosY, animDelay) {
        child.setScale(new Vec3(0, 0, 0));
        tween(child)
            .delay(animDelay)
            .to(animTime, { scale: new Vec3(1, 1, 1) })
            .to(animTime, { position: new Vec3(childPosX, childPosY, 0) })
            .start();
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
        if (this.step > 3) {
            this.step = 1;
        }
        this.refreshUI();
    }

    questioIndex = 0;
    getQuestionData() {
        //随机生成一个排队问题
        // 问题1是：小明前面有3个人，后面有2人，一共有几人？
        // 问题2是：小明从前面数是第2，从后面数是第4，一共多少人？
        // 问题3是：同学们排队做操，小明排第三，小花排第9，他们之间有几人？
        //随机生成一个读书问题
        // 问题4是：小花读一本故事书，今天从第5页开始读，读到第10页，明天开始读第11页，今天一共读了多少页？
        // 问题5是：小花读一本故事书，今天从第5页开始读，读了10页，明天开始从第几页读？
        //随机生成一个推迟问题
        // 问题6是：学校计划在星期二开运动会，因为天气原因推迟3天，运动会在星期几开？
        // 问题7是：学校计划在星期五开运动会，因为天气原因提前3天，运动会在星期几开？
        // let type = Math.floor(Math.random() * 4) + 1;
        let type = this.questioIndex % 7 + 1;
        this.questioIndex++;
        let num = Math.floor(Math.random() * 9) + 1;
        let num1 = Math.floor(Math.random() * 9) + 1;
        if (type == 1) {
            //前有几后有几的问题jiren
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
        else if (type == 4) {
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
            let question = "小花读一本故事书，今天从第" + num + "页开始读，读到第" + num1 + "页，明天开始读第" + (num1 + 1) + "页，今天一共读了多少页？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "读书一共读几页，两数相减再加一 几-几+1",
                //题目
                question: question,
                //4 表示小花读一本故事书，今天从第几页开始读，读到第几页，明天开始读第几页，今天一共读了多少页？
                type: 4,
                //答案
                answer: `列式：${num1}-${num}+1=${num1 - num + 1} （页）`,
                playerName: "",
            }
        }
        else if (type == 5) {

            let question = "小花读一本故事书，今天从第" + num + "页开始读，读了" + num1 + "页，明天开始从第几页读？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "明天该读第几页，两数相加就可以 几+几",
                //题目
                question: question,
                //5 表示小花读一本故事书，今天从第几页开始读，读了几页，明天开始从第几页读？
                type: 5,
                //答案
                answer: `列式：${num}+${num1}=${num + num1} （页）`,
                playerName: "",
            }
        }
        else if (type == 6) {
            num = Math.floor(Math.random() * 2) + 1;
            num1 = Math.floor(Math.random() * 3) + 1;
            //数字1-7转换星期 中文的
            let question = "学校计划在星期" + this.week[num] + "开运动会，因为天气原因推迟" + num1 + "天，运动会在星期几开？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "求推迟真容易，推迟几天就加几  几+几",
                //题目
                question: question,
                //6 表示学校计划在星期二开运动会，因为天气原因推迟3天，运动会在星期几开？
                type: 6,
                //答案
                answer: `列式：${num}+${num1}=${num + num1}`,
                playerName: "",
            }
        }
        else if (type == 7) {
            num = Math.floor(Math.random() * 2) + 5;
            num1 = Math.floor(Math.random() * 3) + 1;
            //数字1-7转换星期 中文的
            let question = "学校计划在星期" + this.week[num] + "开运动会，因为天气原因提前" + num1 + "天，运动会在星期几开？";
            //保存这两个数字
            return {
                num: num,
                num1: num1,
                tips: "提前问题更简单，提前几天就减几  几-几",
                //题目
                question: question,
                //7 表示学校计划在星期五开运动会，因为天气原因提前3天，运动会在星期几开？
                type: 7,
                //答案
                answer: `列式：${num}-${num1}=${num - num1}`,
                playerName: "",
            }
        }
    }
    week = ["", "一", "二", "三", "四", "五", "六", "日"];
}


