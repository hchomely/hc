/*******************
* author :hchomely
* create time :2025-12-03 15:30:19
*******************/
const { ccclass, property } = _decorator;
import { Button,Node, Label,Sprite,Toggle, _decorator,EditBox } from 'cc';
import uiBaseEX from "../uiBaseEX";


@ccclass
export default class auto_grade1chapter4 extends uiBaseEX{
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

}