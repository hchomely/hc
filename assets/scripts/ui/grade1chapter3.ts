/*******************
* author :hchomely
* create time :2025-12-02 16:55:05
*******************/
const { ccclass, property } = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox, math, find, UIOpacity } from 'cc';
import auto_grade1chapter3 from "./auto_ui/auto_grade1chapter3";

@ccclass("grade1chapter3")
export default class grade1chapter3 extends auto_grade1chapter3 {

    createInit() {//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 

        util.bindClickEventFX(this.btnBack.node, this.btnBack_Click.bind(this));
        util.bindClickEventFX(this.btnMenu.node, this.btnMenu_Click.bind(this));
        util.bindClickEventFX(this.btnFresh.node, this.btnFresh_Click.bind(this));
        util.bindClickEventFX(this.btnEditor.node, this.btnEditor_Click.bind(this));
        util.bindClickEventFX(this.btnEditorConfirm.node, this.btnEditorConfirm_Click.bind(this));
        util.bindClickEventFX(this.btnNextStep.node, this.btnNextStep_Click.bind(this));

    }
    init() {//每次打开都会执行，初始化函数
        this.refreshUI();
    }
    data;
    step: number = 0; // 当前步骤
    isEditor: boolean = false; // 是不是出题模式
    isAddMode: boolean = false; // 是加法模式 还是减法模式
    preInit() {//和init类似 在init之前执行
        this.data = this.getQuestionData();
        this.step = 1;
        console.error("题目数据", this.data);
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
        this.slLeftNumber.string = this.data.leftNumber.toString();
        this.slRightNumber.string = this.data.rightNumber.toString();
        this.slResult.string = this.data.result.toString();


        this.slStep2TopNumber1.string = this.data.lettArr[0].toString();
        this.slStep2TopNumber2.string = this.data.lettArr.length > 1 ? this.data.lettArr[1].toString() : "";
        this.slStep2TopNumber3.string = this.data.lettArr.length > 2 ? this.data.lettArr[2].toString() : "";
        this.slStep2TopNumber4.string = this.data.lettArr.length > 3 ? this.data.lettArr[3].toString() : "";
        this.slStep2BottomNumber1.string = this.data.rightArr[0].toString();
        this.slStep2BottomNumber2.string = this.data.rightArr.length > 1 ? this.data.rightArr[1].toString() : "";
        this.slStep2BottomNumber3.string = this.data.rightArr.length > 2 ? this.data.rightArr[2].toString() : "";
        this.slStep2BottomNumber4.string = this.data.rightArr.length > 3 ? this.data.rightArr[3].toString() : "";
        this.slStep2BottomNumber1.node.active = this.data.rightArr.length >= 1;
        this.slStep2BottomNumber2.node.active = this.data.rightArr.length >= 2;
        this.slStep2BottomNumber3.node.active = this.data.rightArr.length >= 3;
        this.slStep2BottomNumber4.node.active = this.data.rightArr.length >= 4;

        this.slStep3TopNumber1.string = this.data.splitParts[0].sum.toString();
        this.slStep3TopNumber2.string = this.data.splitParts.length > 1 ? this.data.splitParts[1].sum.toString() : "";
        this.slStep3TopNumber3.string = this.data.splitParts.length > 2 ? this.data.splitParts[2].sum.toString() : "";
        this.slStep3TopNumber4.string = this.data.splitParts.length > 3 ? this.data.splitParts[3].sum.toString() : "";
        find("add", this.slStep3TopNumber1.node).active = !!this.data.splitParts[0].carry;
        find("sub", this.slStep3TopNumber1.node).active = !!this.data.splitParts[0].borrow;
        if (this.data.splitParts.length > 1) {
            find("add", this.slStep3TopNumber2.node).active = !!this.data.splitParts[1].carry;
            find("sub", this.slStep3TopNumber2.node).active = !!this.data.splitParts[1].borrow;
        }
        if (this.data.splitParts.length > 2) {
            find("add", this.slStep3TopNumber3.node).active = !!this.data.splitParts[2].carry;
            find("sub", this.slStep3TopNumber3.node).active = !!this.data.splitParts[2].borrow;
        }
        if (this.data.splitParts.length > 3) {
            find("add", this.slStep3TopNumber4.node).active = !!this.data.splitParts[3].carry;
            find("sub", this.slStep3TopNumber4.node).active = !!this.data.splitParts[3].borrow;
        }
        if (this.step >= 3) {
            let index = this.step - 3;
            let part = this.data.splitParts[index];
            if (this.isAddMode) {
                if (part.lowCarry) {
                    this.slStep3Tips.string = `${part.left}+${part.right}+${part.lowCarry}=${part.realSum}`;
                }
                else {
                    this.slStep3Tips.string = `${part.left}+${part.right}=${part.realSum}`;
                }
            }
            else {
                let borrow = part.borrow ? `(借1位)${-part.borrow * 10}+` : "";
                let lowBorrow = part.lowBorrow ? `-${-part.lowBorrow}(被借1位)` : "";
                this.slStep3Tips.string = `${borrow}${part.left}-${part.right}${lowBorrow}=${part.realSum}`;
            }

        }
        else {
            this.slStep3Tips.string = "";

        }
        this.slAdd.string = this.isAddMode ? "+" : "-";
        this.slStep2Action.string = this.isAddMode ? "+" : "-";
        this.customStep2.active = this.step >= 2;
        this.customStep3.active = this.step >= 3;
        this.slStep3TopNumber1.node.active = this.step >= 3;
        this.slStep3TopNumber2.node.active = this.step >= 4;
        this.slStep3TopNumber3.node.active = this.step >= 5;
        this.slStep3TopNumber4.node.active = this.step >= 6;
        this.slResult.node.getComponent(UIOpacity).opacity = this.step >= 2 + this.data.splitParts.length ? 255 : 0;

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
    btnEditor_Click() {

    }
    btnEditorConfirm_Click() {

    }
    btnNextStep_Click() {
        if (this.isEditor) {
            return;
        }
        this.step++;
        if (this.step > 2 + this.data.splitParts.length) {
            this.step = 1;
        }
        this.refreshUI();
    }

    checkQuestionData() {
        let left = parseInt(this.edtLeft.string);
        let right = parseInt(this.edtRight.string);
        if (isNaN(left) || isNaN(right)) {
            this.slTipsToEditor.string = "请输入有效数字";
            return false;
        }
        if (this.isAddMode) {
            //加法
        } else {
            //减法
            if (left <= right) {
                this.slTipsToEditor.string = "减法时左边数字必须大于右边数字";
                return false;
            }
        }
        this.data = this.getQuestionDataByNumber(left, right);
        return true;
    }
    /**
     * 生成竖式进位题目的数据
     * 
     * 随机生成两个100以内的数字，确保左边的数字大于右边的数字且左边数字大于9
     * 用于创建竖式进位减法或加法题目的基础数据
     * 
     * @returns {any} 通过getQuestionDataByNumber方法处理后的题目数据
     */
    getQuestionData() {
        //竖式进位 解题步骤
        //生成数据 随机生成两个数字100以内 左边的数字大于右边的数字 左边数字大于9
        let leftNumber = Math.floor(Math.random() * 90) + 10;
        let rightNumber = Math.floor(Math.random() * 90) + 10;
        this.isAddMode = Math.random() > 0.5;
        if (this.isAddMode) {
            return this.getQuestionDataByNumber(leftNumber, rightNumber);
        }

        while (leftNumber <= rightNumber) {
            leftNumber = Math.floor(Math.random() * 90) + 10;
            rightNumber = Math.floor(Math.random() * 90) + 10;
        }
        return this.getQuestionDataByNumber(leftNumber, rightNumber);
    }

    //整理数据
    getQuestionDataByNumber(leftNumber, rightNumber) {
        console.error("生成题目数据", leftNumber, rightNumber);
        let tmpLeft = leftNumber;
        let tmpRight = rightNumber;
        let leftArr = [];
        let rightArr = [];
        leftArr.push(leftNumber % 10);
        rightArr.push(rightNumber % 10);
        while (Math.floor(leftNumber / 10) > 0) {
            leftNumber = Math.floor(leftNumber / 10);
            leftArr.push(leftNumber % 10);
        }
        while (Math.floor(rightNumber / 10) > 0) {
            rightNumber = Math.floor(rightNumber / 10);
            rightArr.push(rightNumber % 10);
        }
        let maxLength = Math.max(leftArr.length, rightArr.length);

        if (this.isAddMode) {
            //加法
            let carry = 0;
            let splitParts = [];
            for (let i = 0; i < maxLength; i++) {
                let tmpCarry = carry;
                let left = leftArr.length > i ? leftArr[i] : 0;
                let right = rightArr.length > i ? rightArr[i] : 0;
                carry = left + right + tmpCarry >= 10 ? 1 : 0;
                splitParts.push({
                    left: left, right: right, carry: carry, lowCarry: tmpCarry,
                    sum: (left + right + tmpCarry) % 10, realSum: left + right + tmpCarry
                });
            }
            if (carry > 0) {
                splitParts.push({ left: 0, right: 0, carry: 0, lowCarry: carry, sum: carry, realSum: carry });
            }
            return {
                leftNumber: tmpLeft,
                rightNumber: tmpRight,
                isRightBig: true,
                result: tmpLeft + tmpRight,
                lettArr: leftArr,
                rightArr: rightArr,
                splitParts: splitParts
            };
        }
        else {
            //减法
            let splitParts = [];
            //是否向前借了10
            let borrow = 0;
            for (let i = 0; i < maxLength; i++) {
                let tmpBorrow = borrow;
                let left = leftArr.length > i ? leftArr[i] : 0;
                let right = rightArr.length > i ? rightArr[i] : 0;
                borrow = (tmpBorrow + left - right) < 0 ? -1 : 0;
                splitParts.push({
                    left: left,
                    right: right,
                    borrow: borrow,
                    lowBorrow: tmpBorrow,
                    sum: borrow * -10 + tmpBorrow + left - right,
                    realSum: borrow * -10 + tmpBorrow + left - right
                });
            }
            return {
                leftNumber: tmpLeft,
                rightNumber: tmpRight,
                lettArr: leftArr,
                rightArr: rightArr,
                isRightBig: false,
                result: tmpLeft - tmpRight,

                splitParts: splitParts
            };
        }

    }
}