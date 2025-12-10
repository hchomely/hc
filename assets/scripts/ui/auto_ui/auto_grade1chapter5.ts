/*******************
* author :hchomely
* create time :2025-12-10 10:14:42
*******************/
const { ccclass, property } = _decorator;
import { Button,Node, Label,Sprite,Toggle, _decorator,EditBox } from 'cc';
import uiBaseEX from "../uiBaseEX";
import widgetPlayer from "../widget/widgetPlayer";


@ccclass
export default class auto_grade1chapter5 extends uiBaseEX{
    @property(Button)
    btnBack: Button = null; 
    @property(Toggle)
    tgTips: Toggle = null; 
    @property(Button)
    btnFresh: Button = null; 
    @property(Label)
    slTips: Label = null; 
    @property(Label)
    slTipsToEditor: Label = null; 
    @property(Node)
    customStep1: Node = null; 
    @property(widgetPlayer)
    widgetPlayer: widgetPlayer = null; 
    @property(Label)
    slResult: Label = null; 
    @property(Button)
    btnNextStep: Button = null; 

}