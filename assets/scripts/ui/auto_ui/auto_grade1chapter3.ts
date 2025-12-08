/*******************
* author :hchomely
* create time :2025-12-02 16:55:04
*******************/
const { ccclass, property } = _decorator;
import { Button,Node, Label,Sprite,Toggle, _decorator,EditBox } from 'cc';
import uiBaseEX from "../uiBaseEX";


@ccclass
export default class auto_grade1chapter3 extends uiBaseEX{
    @property(Button)
    btnBack: Button = null; 
    @property(Button)
    btnMenu: Button = null; 
    @property(Button)
    btnFresh: Button = null; 
    @property(Button)
    btnEditor: Button = null; 
    @property(Label)
    slEditor: Label = null; 
    @property(Label)
    slTips: Label = null; 
    @property(Label)
    slTipsToEditor: Label = null; 
    @property(EditBox)
    edtRight: EditBox = null; 
    @property(EditBox)
    edtLeft: EditBox = null; 
    @property(Button)
    btnEditorConfirm: Button = null; 
    @property(Node)
    customStep1: Node = null; 
    @property(Label)
    slLeftNumber: Label = null; 
    @property(Label)
    slAdd: Label = null; 
    @property(Label)
    slRightNumber: Label = null; 
    @property(Label)
    slResult: Label = null; 
    @property(Node)
    customStep2: Node = null; 
    @property(Label)
    slStep2TopNumber4: Label = null; 
    @property(Label)
    slStep2TopNumber3: Label = null; 
    @property(Label)
    slStep2TopNumber2: Label = null; 
    @property(Label)
    slStep2TopNumber1: Label = null; 
    @property(Label)
    slStep2Action: Label = null; 
    @property(Label)
    slStep2BottomNumber4: Label = null; 
    @property(Label)
    slStep2BottomNumber3: Label = null; 
    @property(Label)
    slStep2BottomNumber2: Label = null; 
    @property(Label)
    slStep2BottomNumber1: Label = null; 
    @property(Button)
    btnNextStep: Button = null; 
    @property(Node)
    customStep3: Node = null; 
    @property(Label)
    slStep3TopNumber4: Label = null; 
    @property(Label)
    slStep3TopNumber3: Label = null; 
    @property(Label)
    slStep3TopNumber2: Label = null; 
    @property(Label)
    slStep3TopNumber1: Label = null; 
    @property(Label)
    slStep3Tips: Label = null; 

}