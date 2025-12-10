/*******************
* author :hchomely
* create time :2025-12-10 10:15:39
*******************/
const { ccclass, property } = _decorator;
import util from "../../controller/util";
import widgetBase from "./widgetBase";
import widgetListItem from "./widgetListItemEX";
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox } from 'cc';


@ccclass('widgetPlayer')
export default class widgetPlayer extends widgetBase {
    protected InitEvent(): any {
    }
    public setUIData(params: any) {
        if (params.type == 1) {
            this.slRight.string = "";
            if (params.isme) {
                this.img_me.node.active = true;
                this.img_other.node.active = false;
                this.slLeft.string = "";
                this.slMeName.string = params.playerName;
            }
            else {
                this.img_me.node.active = false;
                this.img_other.node.active = true;
                if (params.leftNum) {
                    this.slLeft.string = params.leftNum.toString();
                }
                else {
                    this.slLeft.string = params.rightNum.toString();
                }
            }
        }
        else if (params.type == 2) {
            if (params.isme) {
                this.img_me.node.active = true;
                this.img_other.node.active = false;
                this.slRight.string = params.rightNum.toString();
                this.slLeft.string = params.leftNum.toString();
                this.slMeName.string = params.playerName;
            }
            else {
                this.img_me.node.active = false;
                this.img_other.node.active = true;
                if (params.leftNum) {
                    this.slLeft.string = params.leftNum.toString();
                    this.slRight.string = "";

                }
                else {
                    this.slLeft.string = "";
                    this.slRight.string = params.rightNum.toString();
                }
            }

        }
        else if (params.type == 3) {
                this.slRight.string = "";
            if (params.isme) {
                this.img_me.node.active = true;
                this.img_other.node.active = false;
                this.slMeName.string = params.playerName;
            }
            else {
                this.img_me.node.active = false;
                this.img_other.node.active = true;
            }
            if (params.leftNum) {
                this.slLeft.string = params.leftNum.toString();
            }
            else {
                this.slLeft.string = params.rightNum.toString();
            }
        }
        else if (params.type == 4 || params.type == 5) {
            if (params.isme) {
                this.img_me.node.active = true;
                this.img_other.node.active = false;
                this.slMeName.string = "";
            }
            else {
                this.img_me.node.active = false;
                this.img_other.node.active = true;
            }
            if (params.leftNum) {
                this.slLeft.string = params.leftNum.toString();
            }
            else {
                this.slLeft.string = params.rightNum.toString();
            }
        }
    }
    @property(Sprite)
    img_other: Sprite = null;
    @property(Sprite)
    img_me: Sprite = null;
    @property(Label)
    slLeft: Label = null;
    @property(Label)
    slRight: Label = null;
    @property(Label)
    slMeName: Label = null;
    createInit() {//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 


    }
    init() {//每次打开都会执行，初始化函数

    }
    onRefreshUI() {//每次打开都会执行，初始化函数

    }



}