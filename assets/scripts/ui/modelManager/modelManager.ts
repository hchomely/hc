import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('modelManager')
export class modelManager extends Component {
   

    //带框的文本
    @property(Node)
    kuang_lab: Node = null;
    //不带框的文本
    @property(Node)
    notKuang_lab: Node = null;
    @property(Node)
    line: Node = null;
    @property(Node)
    btn_node: Node = null;
    onLoad() {
        modelManager._instance = this;
    }
    static getInstance(){
        return this._instance;
    }
	static _instance: modelManager = null;
}


