import { _decorator, Component, Node, Layout, ScrollView, Prefab, Label, RichText, instantiate, v3, Tween, tween, Button } from 'cc';
const { ccclass, property } = _decorator;

import widgetListItem from "./widgetListItem";
import { ICallback } from "../../interface/action";
import util from "../../controller/util";
import uiBase from '../uiBase';
import dataController from '../../controller/dataController';

@ccclass('widgetList')
export default class widgetList extends Component {
    dirty: boolean = false;
    data: any[] = [];
    allItems: Node[] = [];
    layout: Layout = null;
    callBack: ICallback = null;
    selectItemIndex: number = -1;
    isPullUpRefresh: boolean = false;
    getMoreDataRequest: Function = null;
    scrollView: ScrollView = null;
    @property(Node)
    pullUpRefreshNode: Node = null;
    @property(Node)
    pullDownRefreshNode: Node = null;
    @property(Node)
    noDataNode: Node = null;
    @property(widgetListItem)
    itemPattern: widgetListItem = null;

    itemPrefab: Prefab = null
    isInit = true

    public showAnimation = false;
    public showAnimationDelay = false;
    public showAnimationDelayTime = 0.05;
    onLoad() {
        this.preOnload();
        this.layout = this.node.getComponent(Layout);
        this.scrollView = this.node.parent.parent.getComponent(ScrollView);
        if (this.itemPattern) {
            this.itemPattern.setVisable(false);
        }
        if (this.pullUpRefreshNode) {
            this.pullUpRefreshNode.active = false;
            this.pullUpRefreshNode.parent = null;
        }
        if (this.scrollView) {
            this.scrollView.node.on("scroll-to-bottom", (rEvent) => {
                if (this.isPullUpRefresh && this.pullUpRefreshNode) {
                    this.pullUpRefreshNode.active = true;
                    this.pullUpRefreshNode.parent = this.node;
                }
            })
            this.scrollView.node.on("scroll-ended", (rEvent) => {
                if (this.isPullUpRefresh && this.pullUpRefreshNode) {
                    this.pullUpRefreshNode.active = false;
                    this.pullUpRefreshNode.parent = null;
                }
            })
            this.scrollView.node.on("bounce-bottom", (rEvent) => {
                if (this.isPullUpRefresh) {
                    this.pullUpRefresh();
                }
            })
        }
        if (this.noDataNode) {
            this.noDataNode.active = false;
        }
        this.createInit();
    }
    createPrefab() {
        if (this.itemPrefab) {
            return this.itemPrefab
        }
        this.itemPrefab = util.createPrefab(this.itemPattern.node)
        return this.itemPrefab
    }
    async pullUpRefresh() {
        let addOnData = await this.getMoreDataRequest();
        this.data = addOnData;
        this.onRefreshUI();
    }
    preOnload() {

    }

    createInit() {

    }
    start() {
        this.init();
    }
    init() {

    }
    resetSelectItem() {
        this.selectItemIndex = -1;
        this.onChildClick(null);
    }
    //    //刷新数据，必须是array类型
    setData(rData: any, rHandler?: ICallback, isPullUpRefresh: boolean = false, getMoreDataRequest: Function = null) {
        this.preSetData();
        let parent = this.node.parent;
        while (parent && !parent.getComponent(uiBase)) {
            parent = parent.parent;
        }
        this.data = rData;
        if (parent && parent.getComponent(uiBase)) {
            let _roomID = parent.getComponent(uiBase)._roomID;
            if (_roomID) {
                this.data.map(d => {
                    if (typeof d == "object")
                        d._roomID = _roomID
                });
            }
        }
        this.callBack = rHandler;
        this.isPullUpRefresh = isPullUpRefresh;
        this.getMoreDataRequest = getMoreDataRequest;
        this.dirty = true;
    }
    preSetData() {

    }
    update(dt) {
        if (this.dirty) {
            this.dirty = false;
            this.onRefreshUI();
        }
    }
    createItem(rCount: number) {
        if (rCount > 0) {
            for (let index = 0; index < rCount; index++) {
                var item = instantiate(this.createPrefab());
                item.parent = this.node;
                item.position = v3(0, 0);
                this.allItems.push(item);
            }
        }
    }
    //    //触发更新数据
    onRefreshUI() {
				for(let i = 0; i < this.allItems.length; i++) {
					this.allItems[i].active = false;
				}
        let dataCount = this.data && this.data.length;
        let itemCount = this.allItems.length;
        if (dataCount > itemCount) {
            this.createItem(dataCount - itemCount);
        }

        for (let index = 0; index < this.allItems.length; index++) {
            let item = this.allItems[index];
						item.active = true;
            let widgetListItemCom = item.getComponent(widgetListItem);
            if (widgetListItemCom) {
                widgetListItemCom.setVisable(index < dataCount);
                if (widgetListItemCom.isVisable()) {
                    let ret = widgetListItemCom.setData(this.data[index], this.onChildClick.bind(this), this.selectItemIndex == index, index);
                    if (ret !== false) {
                        this.onUpdateItem(widgetListItemCom, this.data[index], index)
                    }
                }
            }
            let button = item.getComponent(Button);
            if (item && this.showAnimation) {
                Tween.stopAllByTarget(item);
                item.setScale(0, 0, 0);
                if (button) button.interactable = false;
                tween(item).delay(this.showAnimationDelay ? this.showAnimationDelayTime * index : 0)
                .to(0.15, { scale: v3(1.2, 1.2, 1) }, { easing: "sineIn" })
                .to(0.1, { scale: v3(1, 1, 1) }, { easing: "sineOut" })
                .call(() => {
                    if (index + 1 == this.allItems.length) {
                        this.showAnimation = false;
                        dataController.getInstance().persistData.isShowedShopItemAni = true;
                        dataController.getInstance().savePersistData()
                    }
                    if (button) button.interactable = true;
                    
                }).start();
            } else {
                if (button) button.interactable = true;
            }
        }

        //刷新layout排序
        if (!this.layout) {
            this.layout = this.node.getComponent(Layout);
        }
        this.layout.updateLayout();
        if (this.noDataNode) {
            this.noDataNode.active = dataCount == 0 ? true : false;
        }
    }

    onUpdateItem(item, data, idx) {

    }

    //    //选中判断，需要实现更新Item
    onPreSelectItemChange(rData: any) {

    }
    onChildClick(rData: any) {
			// console.error(rData)
        this.onPreSelectItemChange(rData);
        if (this.callBack) {
            this.callBack(rData);
        }
    }
    noticeAllChild(params) {
        this.allItems.forEach(item => {
            item.getComponent(widgetListItem).onNoticeFromParent(params);
        })
    }
 
    onDisable() {
        if (this.scrollView) {
            if (this.scrollView.getComponent(ScrollView)) {
                this.scrollView.getComponent(ScrollView).scrollToTop();
            }
        }

        this.isInit = false
    }
}
