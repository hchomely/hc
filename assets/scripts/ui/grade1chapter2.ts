/*******************
* author :hchomely
* create time :2025-12-02 10:50:58
*******************/
const { ccclass, property } = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox, Vec3, UITransform, Graphics, Vec2, UIOpacity } from 'cc';
import auto_grade1chapter1 from "./auto_ui/auto_grade1chapter1";

@ccclass("grade1chapter2")
export default class grade1chapter2 extends auto_grade1chapter1 {

    createInit() {//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 

        util.bindClickEventFX(this.btnBack.node, this.btnBack_Click.bind(this));
        util.bindClickEventFX(this.btnMenu.node, this.btnMenu_Click.bind(this));
        util.bindClickEventFX(this.btnFresh.node, this.btnFresh_Click.bind(this));
        util.bindClickEventFX(this.btnNextStep.node, this.btnNextStep_Click.bind(this));

        util.bindClickEventFX(this.btnEditor.node, this.btnEditor_Click.bind(this));
        util.bindClickEventFX(this.btnEditorConfirm.node, this.btnEditorConfirm_Click.bind(this));


    }
    init() {//每次打开都会执行，初始化函数
        this.refreshUI();
    }
    data;
    step: number = 0; // 当前步骤
    isEditor: boolean = false; // 是不是出题模式
    preInit() {//和init类似 在init之前执行
        this.data = this.getQuestionData();
        this.step = 1;
        this.refreshUI();
    }
    refreshUI() {//刷新函数，页面某些数据需要刷新的时候使用
        this.edtLeft.node.active = this.isEditor;
        this.edtRight.node.active = this.isEditor;
        this.btnEditorConfirm.node.active = this.isEditor;
        this.slEditor.string = this.isEditor ? "出题模式（点击退出）" : "正常模式（点击出题）";
        if (this.isEditor) {

            return;
        }
        this.slTipsToEditor.string = "";
        this.slLeftNumber.string = this.data.leftNumber.toString();
        this.slRightNumber.string = this.data.rightNumber.toString();
        this.slResult.string = this.data.result.toString();
        this.slStep2LeftNumber.string = this.data.splitParts[0].toString();
        this.slStep2RightNumber.string = this.data.splitParts[1].toString();
        let worldPos_left = this.slLeftNumber.node.parent.getComponent(UITransform).convertToWorldSpaceAR(this.slLeftNumber.node.position);
        let worldPos_rigth = this.slRightNumber.node.parent.getComponent(UITransform).convertToWorldSpaceAR(this.slRightNumber.node.position);

        let bigNumber = this.data.isRightBig ? this.slRightNumber : this.slLeftNumber;
        let smallNumber = !this.data.isRightBig ? this.slStep2LeftNumber : this.slStep2RightNumber;
        let smallNumber_other = this.data.isRightBig ? this.slStep2LeftNumber : this.slStep2RightNumber;
        this.customStep2.position = new Vec3((this.data.isRightBig ?
            this.customStep2.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(worldPos_left.x, worldPos_left.y, worldPos_left.z)) :
            this.customStep2.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(worldPos_rigth.x, worldPos_rigth.y, worldPos_rigth.z))).x, this.customStep2.position.y, 0);
        //起点 大数的位置
        let poss: Array<Vec2> = [];
        let bigNumberPos = this.customStep3.getComponent(UITransform).convertToNodeSpaceAR(
            bigNumber.node.parent.getComponent(UITransform).convertToWorldSpaceAR(bigNumber.node.position))
        poss.push(new Vec2(bigNumberPos.x, bigNumberPos.y - 60));
        poss.push(new Vec2(poss[poss.length - 1].x, 0));

        //终点 小数的位置
        let smallNumberPos = this.customStep3.getComponent(UITransform).convertToNodeSpaceAR(
            smallNumber.node.parent.getComponent(UITransform).convertToWorldSpaceAR(smallNumber.node.position))
        poss.push(new Vec2(smallNumberPos.x, poss[poss.length - 1].y));
        poss.push(new Vec2(poss[poss.length - 1].x, smallNumberPos.y - 40));
        util.drawLine(this.customStep3, poss);
        this.customStep2Parent.position = new Vec3((poss[1].x + poss[2].x)/2, this.customStep2Parent.position.y, 0);

        //起点 大数的位置
        let poss2: Array<Vec2> = [];
        let step4StartPos = this.customStep4.getComponent(UITransform).convertToNodeSpaceAR(
            this.slStep2Lab1.node.parent.getComponent(UITransform).convertToWorldSpaceAR(this.slStep2Lab1.node.position))
        poss2.push(new Vec2(step4StartPos.x, step4StartPos.y - 40));
        poss2.push(new Vec2(poss2[poss2.length - 1].x, 0));
        //终点 小数的位置
        let step4EndPos = this.customStep4.getComponent(UITransform).convertToNodeSpaceAR(
            smallNumber_other.node.parent.getComponent(UITransform).convertToWorldSpaceAR(smallNumber_other.node.position))
        poss2.push(new Vec2(step4EndPos.x, poss2[poss2.length - 1].y));
        poss2.push(new Vec2(poss2[poss2.length - 1].x, step4EndPos.y - 40));
        util.drawLine(this.customStep4, poss2);


        this.slStep2Lab1.string = (10 - this.data.rightNumber).toString();

        this.slStep4Lab.string = this.data.result.toString();
        this.customStep4Parent.position = new Vec3((poss2[1].x + poss2[2].x) / 2, this.customStep4Parent.position.y, 0);
        this.customStep2.active = this.step >= 2;
        this.customStep3.active = this.step >= 3;
        this.customStep4.active = this.step >= 4;
        this.slResult.node.getComponent(UIOpacity).opacity = this.step >= 4 ? 255 : 0;

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
        if (this.isEditor) {
            return;
        }
        this.data = this.getQuestionData();
        console.log("题目数据", this.data);
        this.step = 1;
        this.refreshUI();
    }
    btnNextStep_Click() {
        if (this.isEditor) {
            return;
        }
        this.step++;
        if(this.step >4){
            this.step =1;
        }
        this.refreshUI();
    }
    btnEditor_Click() {
        this.isEditor = !this.isEditor;
        this.edtLeft.string = "";
        this.edtRight.string = "";
        this.refreshUI();
    }
    btnEditorConfirm_Click() {
        if (this.checkQuestionData()) {
            this.isEditor = false;
            this.refreshUI();
        }
    }
    checkQuestionData() {
        let left = parseInt(this.edtLeft.string);
        let right = parseInt(this.edtRight.string);
        if (isNaN(left) || isNaN(right)) {
            this.slTipsToEditor.string = "请输入有效数字";
            return false;
        }
        //生成数据 随机生成两个数字 左边的数字大于10 小于20 右边的数字小于10 并且左边的数字个位数要小于 右边的数字
        if (left < 11 || left > 19 || right < 1 || right > 9) {
            this.slTipsToEditor.string = "左边数字必须在11到19之间 右边数字必须在1到9之间";
            return false;
        }
        if (left % 10 >= right) {
            this.slTipsToEditor.string = "左边数字的个位数必须小于右边数字";
            return false;
        }
           
        this.data = this.getQuestionDataByNumber(left, right);
        return true;
    }
    getQuestionData() {
        //破十法 解题步骤
        //生成数据 随机生成两个数字 左边的数字大于10 小于20 右边的数字小于10 并且左边的数字个位数要小于 右边的数字
        let leftNumber = Math.floor(Math.random() * 9) + 1;
        leftNumber += 10;
        let rightNumber = Math.floor(Math.random() * 9) + 1;
        while ( leftNumber % 10 >= rightNumber) {
            leftNumber = Math.floor(Math.random() * 9) + 1;
        leftNumber += 10;
            rightNumber = Math.floor(Math.random() * 9) + 1;
        }
        return this.getQuestionDataByNumber(leftNumber, rightNumber);
    }

    //整理数据
    getQuestionDataByNumber(leftNumber, rightNumber) {
        //step2 分解上面两个数字中小的哪一个数  分解为 一个是 和另外一个相加为10 的数 另一个是剩下的数
        let part1 = leftNumber - 10;
        let part2 = 10;
        //在返回数据中 返回大数在哪边
        return {
            leftNumber: leftNumber,
            rightNumber: rightNumber,
            isRightBig: true,
            result: leftNumber - rightNumber,

            splitParts: [part1, part2]
        };
    }
}