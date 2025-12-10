/*******************
* author :hchomely
* create time :2025-12-02 15:22:59
*******************/
const { ccclass, property } = _decorator;
import { Button, Node, Label, Sprite, Toggle, _decorator, EditBox } from 'cc';
import uiBaseEX from "../uiBaseEX";


@ccclass
export default class auto_mainwindow extends uiBaseEX {
    @property(Button)
    btnChapter1: Button = null;
    @property(Button)
    btnChapter2: Button = null;
    @property(Button)
    btnChapter3: Button = null;
    @property(Button)
    btnChapter4: Button = null;
    @property(Button)
    btnChapter5: Button = null;

}