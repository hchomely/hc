import {
	_decorator,
	Enum,
	ScrollView,
	Node,
	Layout,
	instantiate,
	UITransform,
	ProgressBar,
	v3,
	Event,
	EventTouch,
	isValid,
} from "cc";
const { ccclass, property } = _decorator;

import { ICallback } from "../../interface/action";
import widgetList from "./widgetList";
import util from "../../controller/util";
import widgetListItem from "./widgetListItem";
import { ListView, ListViewDir } from "../listview/ListviewEx";
import uiController from "../../controller/uiController";
export enum LIST_TYPE {
	Dynamic = 0,
	Layout,
}

@ccclass("widgetDynamicList2")
export default class widgetDynamicList extends widgetList {
	@property({
		type: Enum(LIST_TYPE),
	})
	public listType = 0;
	listView: ListView;
	scrollView: ScrollView;
	_init: boolean = false;
	_tempData = null;
	cacheItem = true;
	showCount = 20;
	currentPage = 0;
	totalPage = 1;
	pullToLoadLock = true;
	listItems: Node[] = [];
	onLoad() {
		this.preInit();
	}
	preInit() {
		if (this._init) return;
		this._init = true;
		this.data = null;
		this.scrollView = this.node.parent.parent.getComponent(ScrollView);
		if (!this.itemPattern) {
			this.itemPattern = this.node.children[0].getComponent(widgetListItem);
		}
		if (!this.itemPrefab) {
			this.createPrefab();
		}

		this.layout = this.node.getComponent(Layout);
		if (this.listType == LIST_TYPE.Dynamic) {
			this.layout.enabled = false;

			let column = 1;
			if (this.layout.type == Layout.Type.GRID) {
				column = Math.floor(
					(this.layout.node.getComponent(UITransform).width - this.layout.paddingLeft) /
					(this.itemPattern.node.getComponent(UITransform).width + this.layout.spacingX),
				);
			}

			this.listView = new ListView({
				content: this.node,
				scrollview: this.scrollView,
				item_tpl: this.itemPattern.node,
				cb_host: this,
				gap_y: this.layout.spacingY,
				gap_x: this.layout.spacingX,
				gap_top: this.layout.paddingTop,
				gap_bottom: this.layout.paddingBottom,
				gap_left: this.layout.paddingLeft,
				column: column,
				direction: this.scrollView.horizontal ? ListViewDir.Horizontal : ListViewDir.Vertical,
				itemSetter: this.updateListItem,
				selectCb: this.onItemSelect,
				emptyNode: this.noDataNode,
			});

			this.listView.item_Prefab = this.itemPrefab;
		} else {
			if (this.pullDownRefreshNode) {
				this.layout.paddingTop =
					-this.pullDownRefreshNode.getComponent(UITransform).height *
					this.pullDownRefreshNode.scale.y;
				this.pullDownRefreshNode.setSiblingIndex(0);
			}
			if (this.pullUpRefreshNode) {
				this.layout.paddingBottom = this.pullUpRefreshNode.getComponent(UITransform).height + 50;
			}

			this.listItems.push(this.itemPattern.node);
			this.itemPattern.node.parent = null;

			this.scrollView.content.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
				if (this.listItems) {
					this.listItems.forEach((v, k) => {
						if (v.parent) {
							if (v.getComponent(UITransform).getBoundingBoxToWorld().contains(e.getLocation())) {
								this.onItemSelect(v.getComponent(widgetListItem).data, k);
							}
						}
					});
				}
			});
		}

		this.scrollView.cancelInnerEvents = true;

		let handler = null
		let isRefresh = false
		let vibrate = false
		if (this.pullDownRefreshNode) {
			this.scrollView['_calculateBoundary']()
			let progress = this.pullDownRefreshNode.getComponent(ProgressBar)
			this.scrollView['scroller'].activatePullToRefresh(180, () => {
			}, () => {
				progress.unscheduleAllCallbacks()
				progress.node.angle = 0
				isRefresh = false
				vibrate = false
			}, () => {
				progress.schedule(() => {
					progress.node.angle -= 30
				}, 0.1)
				if (handler) {
					clearTimeout(handler)
				}
				if (!isRefresh) {
					isRefresh = true
					handler = setTimeout(() => {
						handler = null
						this.node.emit('pullToRefresh', {
							startFrom: this.currentPage * this.showCount,
							showCount: this.showCount,
						})
					}, 300)
				} else {
					this.scrollView['scroller'].finishPullToRefresh()
				}

			}, (p) => {
				progress.progress = (p - 0.3) / 0.7
				if (progress.progress > 0.999 && !vibrate) {
					vibrate = true
					//nativeController.getInstance().shortVibrate()
				}
			})
		}

		if (this.pullUpRefreshNode) {
			this.pullUpRefreshNode.active = false;
			this.scrollView["_calculateBoundary"]();
			let progress = this.pullUpRefreshNode.getComponent(ProgressBar);
			// this.scrollView['scroller'].activatePullToLoading(100,()=>{
			// },()=>{
			//     progress.unscheduleAllCallbacks()
			//     progress.node.rotation = 0
			//     this.pullUpRefreshNode.active = false
			// },()=>{
			//     progress.schedule(()=>{
			//         progress.node.rotation += 30
			//     },0.1)
			// },(p)=>{
			//     // progress.progress = (p-0.3)/0.7
			// })

			this.scrollView.node.on("scroll-ended-with-threshold", () => {
				if (
					!this.pullToLoadLock &&
					!this.pullUpRefreshNode.active &&
					this.currentPage < this.totalPage - 1 &&
					this.data &&
					this.data.length >= this.showCount
				) {
					this.pullToLoadLock = true;
					this.scrollView.content.getComponent(UITransform).height += 50;
					this.scrollView["_calculateBoundary"]();
					//this.pullUpRefreshNode.y = - this.scrollView.content.getComponent(UITransform).height + 25;
					this.pullUpRefreshNode.setPosition(
						v3(0, -this.scrollView.content.getComponent(UITransform).height + 25),
					);
					this.pullUpRefreshNode.active = true;
					this.scrollView.schedule(() => {
						// let z: number = progress.node.rotation.z;
						// z += 30;
						// progress.node.setRotation(0, 0, z, 1)
						progress.node.angle += 30;
					}, 0.1);
					this.currentPage++;
					setTimeout(() => {
						console.log("pullToLoad");
						this.node.emit("pullToLoad");
					}, 300);
				}
			});
		}
	}
	setupPullToLoad() {
		if (!this.pullDownRefreshNode) {
			this.pullDownRefreshNode = instantiate(uiController.getInstance().loadingPrefab);
			this.pullDownRefreshNode.parent = this.node;
			let x =
				this.node.getComponent(UITransform).anchorX == 0
					? this.node.getComponent(UITransform).width / 2
					: 0;
			let y = 100;
			this.pullDownRefreshNode.setPosition(v3(x, 50));
			// this.pullDownRefreshNode.x = this.node.anchorX == 0 ? this.node.width / 2 : 0
			// this.pullDownRefreshNode.y = 100
		}

		let handler = null;
		let isRefresh = false;
		let vibrate = false;
		if (this.pullDownRefreshNode) {
			this.scrollView["_calculateBoundary"]();
			let progress = this.pullDownRefreshNode.getComponent(ProgressBar);
			this.scrollView["scroller"].activatePullToRefresh(
				180,
				() => { },
				() => {
					progress.unscheduleAllCallbacks();
					progress.node.angle = 0;
					isRefresh = false;
					vibrate = false;
				},
				() => {
					progress.schedule(() => {
						progress.node.angle += 30;
					}, 0.1);
					if (handler) {
						clearTimeout(handler);
					}
					if (!isRefresh) {
						isRefresh = true;
						handler = setTimeout(() => {
							handler = null;
							this.node.emit("pullToRefresh", {
								startFrom: this.currentPage * this.showCount,
								showCount: this.showCount,
							});
						}, 300);
					} else {
						this.scrollView["scroller"].finishPullToRefresh();
					}
				},
				(p) => {
					progress.progress = (p - 0.3) / 0.7;
					if (progress.progress > 0.999 && !vibrate) {
						vibrate = true;
						// nativeController.getInstance().shortVibrate()
					}
				},
			);
		}
	}
	refreshData() {
		this.init();
		if (this.noDataNode) {
			this.noDataNode.active = false;
		}

		setTimeout(() => {
			let progress = this.pullDownRefreshNode.getComponent(ProgressBar);
			progress.progress = 1;
			this.scrollView["scroller"].triggerPullToRefresh();
		});
	}
	setTotal(total) {
		this.totalPage = Math.ceil(total / this.showCount);
	}
	resetPage() {
		this.finishPullToLoading();
		this.pullToLoadLock = true;
		this.currentPage = 0;
		this.totalPage = 1;
	}

	finishPullToLoading() {
		setTimeout(() => {
			this.pullToLoadLock = false;
			if (this.pullUpRefreshNode && this.pullUpRefreshNode.active) {
				this.scrollView.unscheduleAllCallbacks();
				this.scrollView.content.getComponent(UITransform).height -= 50;
				this.pullUpRefreshNode.active = false;
			}
		});
	}
	finishPullDownToLoading() {

		setTimeout(() => {
			if (this.pullDownRefreshNode && this.pullDownRefreshNode.active) {
				this.scrollView["scroller"].finishPullToRefresh();
			}
		});
	}
	setData(
		rData: any,
		rHandler?: ICallback,
		isPullUpRefresh: boolean = false,
		getMoreDataRequest: Function = null,
	) {
		rData = rData || [];
		if (this.noDataNode) {
			this.noDataNode.active = rData.length == 0;
		}

		this.preInit();
		if (rHandler) {
			this.callBack = rHandler;
		}

		this.data = rData;
		if (this.listView) {
			this.listView.setData(this.data);
			this.scrollView["_calculateBoundary"]();
		} else {
			this.refreshLayout();
		}

		this.isInit = false;

		if (this.pullDownRefreshNode) {
			this.scrollView["scroller"].finishPullToRefresh();
		}

		if (this.pullUpRefreshNode) {
			this.finishPullToLoading();
		}

		this.node.emit("setData");
	}
	onEnable() {
		this.scrollView.content = this.node;
	}
	setAddOnData(rData: any, rHandler?: ICallback) {
		this.setData(rData, rHandler);
	}
	appendData(datas: any[]) {
		this.listView.appendData(...datas);
		if (this.pullUpRefreshNode) {
			this.finishPullToLoading();
		}
	}
	onItemSelect(data: any, index: number) {
		this.onChildClick(data);
	}
	updateListItem(node: Node, data: any, index: number, isUpdateItemSize: boolean = false) {
		let listItem = node.getComponent(widgetListItem);
		listItem.cacheItem = this.cacheItem;
		util.setVis(listItem.node, true, true);
		let ret = listItem.setData(
			data,
			this.onChildClick.bind(this),
			this.selectItemIndex == index,
			index,
			isUpdateItemSize,
		);
		if (ret !== false) {
			this.onUpdateItem(listItem, data, index);
		}
	}
	refreshLayout() {
		let layout = this.node.getComponent(Layout);
		layout.enabled = true;
		let i = 0;
		for (const d of this.data) {
			let node = this.listItems[i];
			if (!node) {
				if (this.itemPrefab) {
					node = instantiate(this.itemPrefab);
				} else {
					node = instantiate(this.itemPattern.node);
				}
				this.listItems[i] = node;
			}
			node.parent = this.scrollView.content;
			node.setSiblingIndex(i + 10);
			this.updateListItem(node, d, i, true);
			i++;
		}

		for (let j = i; j < this.listItems.length; j++) {
			this.listItems[j].parent = null;
		}
		setTimeout(() => {
			layout.updateLayout();
			layout.enabled = false;
		},100);
	}
	onDisable() {
		setTimeout(() => {
			if (isValid(this.node)) {
				this.setData([]);
			}
		});
		this.resetPage();
		super.onDisable();
	}
}

