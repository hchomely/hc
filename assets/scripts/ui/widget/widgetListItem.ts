import { _decorator, Component, Layout, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("widgetListItem")
export default class widgetListItem extends Component {
	//    //变量
	clickCallback = function (rData: any): void {};
	data: any = {};
	selected: boolean = false;
	_rowIndex: number = 0;
	_tempData = "";
	cacheItem = false;
	constructor() {
		super();
		this.clickCallback = null;
		this.data = {};
		this.selected = false;
	}
	//    //刷新ui控件
	setData(
		rData: any,
		rHandler: any,
		rSelected: boolean,
		rRowIndex: number,
		isUpdateItemSize: boolean = false,
	) {
		if (this.cacheItem) {
			if (JSON.stringify(rData)  == this._tempData) {
				// cc.log('skip item')
				return false;
			}
			this._tempData = JSON.stringify(rData);
		}

		this.preSetData();
		this.clickCallback = rHandler;
		this.data = rData;
		this.selected = rSelected;
		this._rowIndex = rRowIndex;
		this.onRefreshUI();
		if (isUpdateItemSize) {
			let layout = this.node.getComponent(Layout);
			if (layout) {
				layout.updateLayout();
			}
			return this.node.getComponent(UITransform).getBoundingBox();
		}
	}
	setVisable(rVisable: boolean) {
		this.node.active = rVisable;
	}
	isVisable(): boolean {
		return this.node.active;
	}
	//    //ui刷新,用在画ui内容
	onRefreshUI() {}
	preSetData() {}
	onClick(rData: any) {
		if (this.clickCallback) {
			this.clickCallback(rData);
		}
	}
	onNoticeFromParent(params) {}
}

