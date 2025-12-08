import { _decorator, Node, Label, RichText, EditBox, Toggle, ToggleContainer, Button } from 'cc';
const { ccclass, property } = _decorator;

import widgetList from "./widgetDynamicList2";
import util from "../../controller/util";
import { ICallback } from "../../interface/action";

@ccclass('widgetListEX')
export default class widgetListEX extends widgetList {
    isBindInit: boolean = false;
    value: any = null;
    preOnload() {
        this.bindInit();
    }
    preSetData() {
        this.bindInit();
    }
    bindInit(node: Node   = null) {
        if (this.isBindInit) {
            return;
        }
        this.isBindInit = true;
        node = node || this.node;
        (node) && (util.bindNode(this, node));
        util.autoBindBtn(this);
        util.autoBindEdt(this);
        util.autoBindTgc(this);
        util.autoBindTg(this);
        util.autoBindWidgetListItem(this);
        // if (this["widget"]) {
        //     let keys = Object.keys(this["widget"]);
        //     for (let i = 0; i < keys.length; i++) {
        //         if (keys[i].indexOf("ListItem") != -1) {
        //             this.itemPattern = this["widget"][keys[i]];
        //             break;
        //         }
        //     }
        // } else {
        //     console.log("没有绑定widgetListItem节点");
        // }
    }
    setLots(arr: any[], val: any, path: string = "") {
        util.setLots(arr, val, path, this);
    }
    setSlObj(params: object): void {
        util.setSlObj(params, this);
    }
    setVisObj(params: object): void {
        util.setVisObj(params, this);
    }
    clearSl(extend: object = {}) {
        util.clearSl(this, extend);
    }
    setBtnObj(params: object = {}) {
        util.bindBtnObj(params, this);
    }
    setEdtObj(params: object = {}) {
        util.bindEdtObj(params, this);
    }
    setEdtSlObj(params: object = {}) {
        util.setEdtSlObj(params, this);
    }
    bindTgc(name: string, checkFunc: Function = (tg, index, arr) => { }, unCheckFunc: Function = (tg, index, arr) => { }, defaultIndex: any = 0) {
        util.bindTgc(name, this, checkFunc, unCheckFunc, defaultIndex);
    }
    setTgObj(params: object) {
        util.setTgObj(params, this);
    }
    setTgcObj(params: object) {
        // util.setTgcObj(params, this);
    }
    getSl(obj: object, name: string): (Label | RichText) {
        return util.autoGetNodeByName("sl", obj, name);
    }
    getAllSL(obj: object): object {
        return util.autoGetAllNodeByName("sl", obj);
    }
    getEdt(obj: object, name: string): EditBox {
        return util.autoGetNodeByName("edt", obj, name);
    }
    getAllEdt(obj: object): object {
        return util.autoGetAllNodeByName("edt", obj);
    }
    getTg(obj: object, name: string): Toggle {
        return util.autoGetNodeByName("tg", obj, name);
    }
    getAllTg(obj: object): object {
        return util.autoGetAllNodeByName("tg", obj);
    }
    getTgc(obj: object, name: string): ToggleContainer {
        return util.autoGetNodeByName("tgc", obj, name);
    }
    getAllTgc(obj: object): object {
        return util.autoGetAllNodeByName("tgc", obj);
    }
    getBtn(obj: object, name: string): Button {
        return util.autoGetNodeByName("btn", obj, name);
    }
    getAllBtn(obj: object): object {
        return util.autoGetAllNodeByName("btn", obj);
    }
    getWidget(obj: object, name: string): object {
        return util.autoGetNodeByName("widget", obj, name);
    }
    getAllWidget(obj: object): object {
        return util.autoGetAllNodeByName("widget", obj);
    }
    clearEdt() {
        util.clearEdt(this);
    }

    setCallBackFunc(params) {

    }
    getValue() {
        return this.value;
    }
    setValue(newValue) {
        this.value = newValue;
    }
}