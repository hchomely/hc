import { _decorator, Node, Label, RichText, EditBox, Toggle, ToggleContainer, Button } from 'cc';
const { ccclass, property } = _decorator;

import widgetListItem from "./widgetListItem";
import { util } from "../../controller/util";

@ccclass('widgetListItemEX')
export default class widgetListItemEX extends widgetListItem {
    isBindInit: boolean = false;
    value: any = null;

    onLoad() {
        this.bindInit();
        this.createInit();
    }
    start() {
        this.init();
    }
    createInit() { }
    init() { }
    preSetData() {
        this.bindInit();
    }

    bindInit(node: Node = null) {
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
        this.afterBindInit();
    }
    afterBindInit() {
    }
    setLots(arr: any[], val: any, path: string = "") {
        util.setLots(arr, val, path, this);
    }
    slCache = {}
    setSlObj(params: object): void {
        let temp = {}
        let count = 0
        for (const key in params) {
            if (this.slCache[key] != params[key]) {
                this.slCache[key] = params[key]
                temp[key] = params[key]
                count++
            }
        }
        if (count > 0) {
            util.setSlObj(temp, this);
        }
    }
    visCache = {}
    setVisObj(params: object): void {
        let temp = {}
        let count = 0
        for (const key in params) {
            if (this.visCache[key] != !!params[key]) {
                this.visCache[key] = !!params[key]
                temp[key] = !!params[key]
                count++
            }
        }
        if (count > 0) {
            util.setVisObj(temp, this);
        }
    }
    clearSl(extend: object = {}) {
        util.clearSl(this, extend);
        this.slCache = {}
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
        util.setTgcObj(params, this);
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
    onDisable() {
        this.clearData();
    }
    clearData() {

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