import { _decorator, Component, Node } from 'cc';
import uiController from '../controller/uiController';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    start() {
        uiController.getInstance().show("mainwindow")
    }

    update(deltaTime: number) {
        
    }
}


