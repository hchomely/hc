/*******************
* author :hchomely
* create time :2025-12-02 13:29:23
*******************/
const { ccclass, property } = _decorator;
import { Button,Node, Label,Sprite,Toggle, _decorator,EditBox } from 'cc';
import uiBaseEX from "../uiBaseEX";


@ccclass
export default class auto_grade1chapter1 extends uiBaseEX{
    @property(Button)
    btnBack: Button = null; 
    @property(Button)
    btnMenu: Button = null; 
    @property(Button)
    btnFresh: Button = null; 
    @property(Button)
    btnEditor: Button = null; 
    @property(Button)
    btnEditorConfirm: Button = null; 
    @property(Label)
    slTips: Label = null; 
    @property(Label)
    slTipsToEditor: Label = null; 
    @property(Node)
    customStep1: Node = null; 
    @property(Label)
    slLeftNumber: Label = null; 
    @property(EditBox)
    edtLeft: EditBox = null; 
    @property(Label)
    slAdd: Label = null; 
    @property(Label)
    slRightNumber: Label = null; 
    @property(EditBox)
    edtRight: EditBox = null; 
    @property(Label)
    slResult: Label = null; 
    @property(Node)
    customStep2: Node = null; 
    @property(Label)
    slStep2LeftNumber: Label = null; 
    @property(Label)
    slStep2RightNumber: Label = null; 
    @property(Node)
    customStep3: Node = null; 
    @property(Node)
    customStep2Parent: Node = null; 
    @property(Label)
    slStep2Lab: Label = null; 
    @property(Label)
    slStep2Lab1: Label = null; 
    @property(Node)
    customStep4: Node = null; 
    @property(Node)
    customStep4Parent: Node = null; 
    @property(Label)
    slStep4Lab: Label = null; 
    @property(Button)
    btnNextStep: Button = null; 
    @property(Label)
    slEditor: Label = null; 
}