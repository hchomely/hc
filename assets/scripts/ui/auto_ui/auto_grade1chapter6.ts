/*******************
* author :hchomely
* create time :2025-12-11 10:23:12
*******************/
const { ccclass, property } = _decorator;
import { Button,Node, Label,Sprite,Toggle, _decorator,EditBox } from 'cc';
import uiBaseEX from "../uiBaseEX";


@ccclass
export default class auto_grade1chapter6 extends uiBaseEX{
    @property(Button)
    btnBack: Button = null; 
    @property(Button)
    btnFresh: Button = null; 
    @property(Label)
    slTips: Label = null; 
    @property(Label)
    slTipsToEditor: Label = null; 
    @property(Node)
    customStep1: Node = null; 
    @property(Node)
    custom_sec: Node = null; 
    @property(Node)
    custom_min: Node = null; 
    @property(Node)
    custom_hour: Node = null; 
    @property(Label)
    slResult: Label = null; 
    @property(Button)
    btnNextStep: Button = null; 
    @property(Toggle)
    tgTips: Toggle = null; 
    @property(Toggle)
    tgShowSec: Toggle = null; 
}