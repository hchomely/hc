import { _decorator,Node, Component,instantiate, Vec2, Vec3, find, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import util from "../../controller/util";

@ccclass
export default abstract class widgetBase extends Component {
    onLoad() {
        this.initNode();
    }
    public initNode() {
        if (this.m_bInit == false) {
            this.m_bInit = true;
            this.bindInit();
            this.createInit();
            this.init();
            this.InitEvent();
        }
    }
    private m_bInit: boolean = false;
    bindInit() {
        util.bindNode(this, this.node);
    }
    /**
   * 创建时候init
   */
    protected abstract createInit();
    protected abstract init();
    protected abstract InitEvent();
    protected abstract InitEvent();
    public abstract setUIData(params: any);
    _isHide = false
    //显示ui
    show() {
        this._isHide = false
        this.node.active = true;
        //默认show时候触发init
        this.showInit();
        return this;
    }
    //隐藏ui
    hide() {
        this.node.active = false;
    }
    protected async showInit() {

    }


    m_onclickList: { [key: string]: Function } = {};

    public observes(r_callBack: { [key: string]: Function }) {
        this.m_onclickList = r_callBack;
    }

    public observe(r_key: string, r_callBack: Function): widgetBase {
        if (r_key && r_callBack) {
            this.m_onclickList[r_key] = r_callBack;
        }
        return this;
    }
    public dispatch(r_key: string) {
        if (this.m_onclickList != null && this.m_onclickList[r_key]) {
            this.m_onclickList[r_key](this);
        }
    }
    public static CreateCallBack(r_key, callBack: (cell: widgetBase) => void): { [key: string]: Function } {
        let ret = {};
        ret[r_key] = callBack;
        return ret;
    }

    public SetActive(show: boolean) {
        if (this.node != null)
            this.node.active = show;
    }
    public GetActive(): boolean {
        if (this.node != null)
            return this.node.active;
        return false;
    }

    public static CreateNew<T extends widgetBase>(r_type: { prototype: T }, r_node: Node, r_parentNode?: Node): T|null {
        let node: Node = instantiate(r_node);
        if (r_parentNode != null) {
            node.parent = r_parentNode;
            node.setPosition(Vec3.ZERO);
            node.setScale(Vec3.ONE);
        }
        else
        {
            node.parent = r_node.parent;
            node.setPosition(Vec3.ZERO);
            node.setScale(Vec3.ONE);
        }
        let ret= node.getComponent(r_type.prototype.name) as T ;
        if (ret == null) {
            ret = node.addComponent(r_type.prototype.name) as T ;
        }
        node.active = true;
        (ret as widgetBase).initNode();
        return ret as T;
    }
    public static CreateNewByPrefab<T extends widgetBase>(r_type: { prototype: T }, r_node:Prefab, r_parentNode: Node): T|null {
        let node: Node = instantiate(r_node);
        if (r_parentNode != null) {
            node.parent = r_parentNode;
            node.setPosition(Vec3.ZERO);
            node.setScale(Vec3.ONE);
        }
        let ret= node.getComponent(r_type.prototype.name) as T ;
        if (ret == null) {
            ret = node.addComponent(r_type.prototype.name) as T ;
        }
        node.active = true;
        (ret as widgetBase).initNode();
        return ret as T;
    }
    public static Create<T extends widgetBase>(r_type: { prototype: T }, node: Node): T {
        let ret= node.getComponent(r_type.prototype.name) as T ;
        if (ret == null) {
            ret = node.addComponent(r_type.prototype.name) as T ;
        }
        (ret as widgetBase).initNode();
        return ret as T;
    }


    public static CreateItemByCount<ItemCell extends widgetBase>(r_type: { prototype: ItemCell }, voCount: number, items: Array<ItemCell>, parent: Node, gameItemeCell: Node, callback: { [key: string]: Function }) {

        let itemCount: number = items.length;
        //数据数目和列表数目不一样，增加或者隐藏
        if (voCount > itemCount) {  //增加列表项
            for (let index = 0; index < voCount - itemCount; index++) {
                let go: Node = instantiate(gameItemeCell);
                // go.setParent(parent);
                go.parent = parent;
                let item: ItemCell = go.addComponent(r_type.prototype.name) as ItemCell;
                item.initNode();
                item.observes(callback);
                item.SetActive(true);
                items.push(item);
            }
        }
        //隐藏多出来的列表
        for (let index = 0; index < items.length; index++) {
            if (index < voCount) {
                items[index].SetActive(true);
            }
            else {
                items[index].SetActive(false);
            }
        }

    }
}
