//     // mask:Node;

import {
	_decorator,
	ScrollView,
	Node,
	Prefab,
	isValid,
	UITransform,
	Tween,
	tween,
	v3,
	v2,
	Vec3,
	EventTouch,
	instantiate,
	Button,
} from "cc";

import widgetListItem from "../widget/widgetListItem";
import uiController from "../../controller/uiController";
import util from "../../controller/util";
import { NATIVE } from "cc/env";

export class ListView {
	private scrollview: ScrollView;
	private content: Node;
	private item_tpl: Node;
	public item_Prefab: Prefab;
	private node_pool: Node[];

	private dir: number;
	private gap_x: number;
	private gap_y: number;
	public gap_top: number;
	private gap_bottom: number;
	private gap_left: number;
	private row: number;
	private col: number;
	private item_width: number;
	private item_height: number;
	private cb_host: any;
	private itemSetter: (item: Node, data: any, index: number) => void;
	private recycleCb: (item: Node) => void;
	private selectCb: (data: any, index: number) => void;
	private selectSetter: (item: Node, isSelect: boolean, index: number) => void;
	private scrollToEndCb: () => void;
	private autoScrolling: boolean;
	private items: ListItem[];
	private start_index: number;
	private stop_index: number;
	private _datas: any[] = [];
	private _selected_index: number = -1;
	private emptyNode: Node = null;
	private renderQueue = [];
	public showAnimation = false;
	public showAnimationDelay = false;
	public showAnimationDelayTime = 0.05;
	private showAnimation2 = false;
	public lazyRender = true;
	public isLoop = false;
	private item_anchorX: number = 0;

	constructor(params: ListViewParams) {
		this.scrollview = params.scrollview;
		// this.mask = params.mask;
		this.content = params.content || this.scrollview.content;
		this.item_tpl = params.item_tpl;
		this.item_tpl.active = false;
		this.item_anchorX = this.item_tpl.getComponent(UITransform).anchorX;
		this.item_width = this.item_tpl.getComponent(UITransform).width;
		this.item_height = this.item_tpl.getComponent(UITransform).height;
		this.dir = params.direction || ListViewDir.Vertical;
		this.gap_x = params.gap_x || 0;
		this.gap_y = params.gap_y || 0;
		this.gap_top = params.gap_top || 0;
		this.gap_bottom = params.gap_bottom || 0;
		this.gap_left = params.gap_left || 0;
		this.row = params.row || 1;
		this.col = params.column || 1;
		this.cb_host = params.cb_host;
		this.itemSetter = params.itemSetter;
		this.recycleCb = params.recycleCb;
		this.selectCb = params.selectCb;
		this.selectSetter = params.selectSetter;
		this.scrollToEndCb = params.scrollToEndCb;
		this.autoScrolling = params.autoScrolling || false;
		this.node_pool = [];
		this.emptyNode = params.emptyNode;
		if (this.emptyNode) {
			this.emptyNode.active = false;
		}

		let size = this.scrollview.getComponent(UITransform);
		if (this.dir == ListViewDir.Vertical) {
			let real_width: number = (this.item_width + this.gap_x) * this.col - this.gap_x;
			if (real_width > size.width) {
				size.width = real_width;
			}
			this.content.getComponent(UITransform).width = size.width;

			// if (this.item_width > 700) {
			//     this.showAnimation = true
			// }
		} else {
			let real_height: number = (this.item_height + this.gap_y) * this.row - this.gap_y;
			if (real_height > size.height) {
				size.height = real_height;
			}
			this.content.getComponent(UITransform).height = size.height;
		}

		// this.mask.setContentSize(this.scrollview.node.width, this.scrollview.node.height);
		// this.mask.addComponent(Mask);
		this.scrollview.vertical = this.dir == ListViewDir.Vertical;
		this.scrollview.horizontal = this.dir == ListViewDir.Horizontal;
		this.scrollview.inertia = true;
		this.scrollview.node.on("scrolling", this.on_scrolling, this);
		this.scrollview.node.on("scroll-to-bottom", this.on_scroll_to_end, this);
		this.scrollview.node.on("scroll-to-right", this.on_scroll_to_end, this);

		if (this.selectCb) {
			this.content.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
				if (this.items) {
					this.items.forEach((v, k) => {
						if (v && v.node && v.node.active) {
							if (NATIVE) {
								let rect = v.node.getComponent(UITransform).getBoundingBoxToWorld()
								if (rect.contains(e.getUILocation())) {
									this.selectCb.call(this.cb_host, v.data, k, v.node);
								}
							} else {
								if (v.node.getComponent(UITransform).hitTest(e.getLocation())) {
									this.selectCb.call(this.cb_host, v.data, k, v.node);
								}
							}
						}
					});
				}
			});
		}

		this.scrollview["update"] = this.update.bind(this);
	}

	private on_scroll_to_end() {
		if (this.scrollToEndCb) {
			this.scrollToEndCb.call(this.cb_host);
		}
	}

	private on_scrolling() {
		if (!this.items || !this.items.length) {
			return;
		}
		let containSize = this.content.getComponent(UITransform);
		let scrollViewSize = this.scrollview.getComponent(UITransform);
		if (this.dir == ListViewDir.Vertical) {
			let posy: number = this.content.position.y;
			if (posy < 0) {
				posy = 0;
			}
			if (posy > containSize.height - scrollViewSize.height) {
				posy = containSize.height - scrollViewSize.height;
			}
			let start: number = 0;
			let stop: number = this.items.length - 1;
			let viewport_start: number = -posy - this.gap_top;
			let viewport_stop: number = viewport_start - scrollViewSize.height;
			while (this.items[start].y - this.item_height * 3 - this.gap_y > viewport_start) {
				start++;
			}
			while (this.items[stop].y + this.item_height * 2 + this.gap_y < viewport_stop) {
				stop--;
			}
			if (start != this.start_index || stop != this.stop_index) {
				this.start_index = start;
				this.stop_index = stop;
				this.render_items();
			}
		} else {
			let posx: number = this.content.position.x;
			if (posx > 0) {
				posx = 0;
			}
			if (posx < scrollViewSize.width - containSize.width) {
				posx = scrollViewSize.width - containSize.width;
			}
			let start: number = 0;
			let stop: number = this.items.length - 1;
			let viewport_start: number = -posx;
			let viewport_stop: number = viewport_start + scrollViewSize.width;
			while (this.items[start].x + this.item_width * this.item_anchorX < viewport_start) {
				start++;
			}
			while (this.items[stop].x - this.item_width * this.item_anchorX > viewport_stop) {
				stop--;
			}
			if (start != this.start_index && stop != this.stop_index) {
				this.start_index = start;
				this.stop_index = stop;
				this.render_items();
			}
		}
	}

	public selectItem(index) {
		if (index == this._selected_index) {
			return;
		}
		if (this._selected_index != -1) {
			this.inner_select_item(this._selected_index, false);
		}
		this.inner_select_item(index, true);
	}

	private inner_select_item(index: number, isSelect: boolean) {
		let item: ListItem = this.items[index];
		if (!item) {
			return;
		}
		item.isSelect = isSelect;
		if (item.node && this.selectSetter) {
			this.selectSetter.call(this.cb_host, item.node, isSelect, index);
		}
		if (isSelect) {
			this._selected_index = index;
			if (this.selectCb) {
				this.selectCb.call(this.cb_host, item.data, index);
			}
		}
	}

	private spawn_node(item) {
		let node: Node = this.node_pool.pop();
		if (!node) {
			if (this.lazyRender) {
				this.renderQueue.push(item);
				return;
			} else {
				//@ts-ignore
				node = instantiate(this.item_Prefab || this.item_tpl);
				node.active = true;
				node.parent = this.content;
			}
		}
		item.node = node;
		if (this.showAnimation2) {
			this.renderQueue.push(item);
			return;
		}

		return node;
	}

	private recycle_item(item: ListItem) {
		if (item.node && isValid(item.node)) {
			if (this.recycleCb) {
				this.recycleCb.call(this.cb_host, item.node);
			}
			item.node.emit("recycle");
			// item.node.removeFromParent();

			item.node.setPosition(v3(-100000, item.node.position.y));
			util.setVis(item.node, false, true);
			this.node_pool.unshift(item.node);
			item.node = null;
		}
	}

	private clear_items() {
		if (this.items) {
			this.items.forEach((item) => {
				this.recycle_item(item);
			});

			if (this.node_pool.length > 0 && this.node_pool[0].getComponent(widgetListItem)) {
				this.node_pool.sort((a, b) => {
					return (
						b.getComponent(widgetListItem)._rowIndex - a.getComponent(widgetListItem)._rowIndex
					);
				});
			}
		}

		this.renderQueue = [];
	}

	private render_items() {
		if (this.renderQueue.length > 0) {
			return;
		}
		this.renderQueue = [];
		let item: ListItem;
		for (let i: number = 0; i < this.start_index; i++) {
			item = this.items[i];
			if (item.node) {
				this.recycle_item(item);
			}
		}
		for (let i: number = this.items.length - 1; i > this.stop_index; i--) {
			item = this.items[i];
			if (item.node) {
				this.recycle_item(item);
			}
		}
		for (let i: number = this.start_index; i <= this.stop_index; i++) {
			item = this.items[i];
			if (!item.node) {
				item.idx = i;
				let node = this.spawn_node(item);
				if (!node) {
					continue;
				}
				this.itemSetter.call(this.cb_host, item.node, item.data, i);
				if (this.selectSetter) {
					this.selectSetter.call(this.cb_host, item.node, item.isSelect, i);
				}
			}

			if (item.node) {
				let button = item.node.getComponent(Button);
				if (this.lazyRender && this.showAnimation) {
					Tween.stopAllByTarget(item.node);
					item.node.setPosition(item.x, item.y);
					item.node.setScale(0, 0, 1);
					if (button) button.interactable = false;
					tween(item.node).delay(this.showAnimationDelay ? this.showAnimationDelayTime * item.idx : 0)
						.to(0.15, { scale: v3(1.2, 1.2, 1) }, { easing: "sineIn" })
						.to(0.05, { scale: v3(1, 1, 1) }, { easing: "sineOut" })
						.call(() => {
							if (item.idx == this.stop_index) {
								this.showAnimation = false;
							}
							if (button) button.interactable = true;
						}).start();
				} else {
					if (button) button.interactable = true;
				}

				if (item.node.position.y != item.y || item.node.position.x != item.x) {
					item.node.setPosition(item.x, item.y);
				}

				if (item.node.scale.x != 1 || item.node.scale.y != 1) {
					item.node.setScale(1, 1, 1);
				}


			}
		}
	}

	update(dt) {
		if (this.renderQueue.length > 0) {
			let item: ListItem = this.renderQueue.shift();
			let node = item.node;
			if (!item.node) {
				//@ts-ignore
				node = instantiate(this.item_Prefab || this.item_tpl);
				item.node = node;
				node.active = true;
				node.parent = this.content;
			}

			this.itemSetter.call(this.cb_host, node, item.data, item.idx);
			if (this.selectSetter) {
				this.selectSetter.call(this.cb_host, item.node, item.isSelect, item.idx);
			}
			let button = node.getComponent(Button);
			if (this.showAnimation) {
				Tween.stopAllByTarget(item.node);
				item.node.setPosition(item.x, item.y);
				item.node.setScale(0, 0, 1);
				if (button) button.interactable = false;
				tween(item.node).delay(this.showAnimationDelay ? this.showAnimationDelayTime * item.idx : 0)
					.to(0.15, { scale: v3(1.2, 1.2, 1) }, { easing: "sineIn" })
					.to(0.1, { scale: v3(1, 1, 1) }, { easing: "sineOut" })
					.call(() => {
						if (this.renderQueue.length == 0) {
							this.showAnimation = false;
						}
						//item.node.setScale(1, 1, 1);
						if (button) button.interactable = true;
					}).start();
				// if (this.item_width < 540) {
				// 	item.node.setPosition(item.x, item.y);
				// 	item.node.setScale(0, 0);
				// 	tween(item.node).to(0.3, { scale: v3(1, 1) }, { easing: "sineOut" }).start();
				// } else {
				// 	item.node.setPosition(item.x - this.item_width, item.y);
				// 	tween(item.node).by(0.3, { position: v3(this.item_width, 0) }, { easing: "sineOut" }).start();
				// }
			} else {
				item.node.setScale(1, 1, 1);
				item.node.setPosition(item.x, item.y);
				if (button) button.interactable = true;
			}
		}
	}

	private pack_item(data: any): ListItem {
		return {
			x: 0,
			y: 0,
			data: data,
			node: null,
			isSelect: false,
			idx: 0,
		};
	}

	private layout_items(start: number) {
		for (let index: number = start, stop: number = this.items.length; index < stop; index++) {
			let item: ListItem = this.items[index];
			if (this.dir == ListViewDir.Vertical) {
				[item.x, item.y] = this.verticalLayout(index);
			} else {
				[item.x, item.y] = this.horizontalLayout(index);
			}
		}
	}

	private resize_content() {
		let size = this.content.getComponent(UITransform);
		let size2 = this.scrollview.getComponent(UITransform);
		if (this.items.length <= 0) {
			size.width = 0;
			size.height = 0;
			return;
		}
		let last_item: ListItem = this.items[this.items.length - 1];
		if (this.dir == ListViewDir.Vertical) {
			size.height = Math.max(
				size2.height,
				this.item_height - last_item.y + this.gap_top + this.gap_bottom,
			);
			size.width = size2.width;
		} else {
			size.width = Math.max(size2.width, last_item.x + this.item_width / 2);
			size.height = size2.height;
		}
	}

	public setData(datas: any[]) {
		this.clear_items();
		if (
			this._datas.length == 0 &&
			datas.length > 0 &&
			uiController.getInstance().isShowNewUI &&
			this.showAnimation
		) {
			this.showAnimation2 = true;
			uiController.getInstance().isShowNewUI = false;
		}

		this.items = [];
		this._datas = datas;
		datas.forEach((data) => {
			let item: ListItem = this.pack_item(data);
			this.items.push(item);
		});
		this.layout_items(0);
		this.resize_content();
		this.start_index = -1;
		this.stop_index = -1;

		if (this.items.length > 0) {
			this.on_scrolling();
		} else {
			let pos = Vec3.clone(this.content.position);
			if (this.dir == ListViewDir.Vertical) {
				pos.y = 0;
			} else {
				pos.x = 0;
			}
			this.content.setPosition(pos);
		}

		if (this.emptyNode) {
			this.emptyNode.active = datas.length == 0;
		}

		this.showAnimation2 = false;
	}

	public insertData(index: number, ...datas: any[]) {
		if (datas.length == 0) {
			return;
		}
		if (!this.items) {
			this.items = [];
		}
		if (!this._datas) {
			this._datas = [];
		}
		if (index < 0 || index > this.items.length) {
			return;
		}
		let is_append: boolean = index == this.items.length;
		let items: ListItem[] = [];
		datas.forEach((data) => {
			let item: ListItem = this.pack_item(data);
			items.push(item);
		});
		this._datas.splice(index, 0, ...datas);
		this.items.splice(index, 0, ...items);
		this.layout_items(index);
		this.resize_content();
		this.start_index = -1;
		this.stop_index = -1;

		if (this.autoScrolling && is_append) {
			this.scrollToEnd();
		}
		this.on_scrolling();
	}

	public removeData(index: number, count: number = 1) {
		if (!this.items) {
			return;
		}
		if (index < 0 || index >= this.items.length) {
			return;
		}
		if (count < 1) {
			return;
		}
		let old_length: number = this.items.length;
		let del_items: ListItem[] = this.items.splice(index, count);
		this._datas.splice(index, count);
		//回收node
		del_items.forEach((item) => {
			this.recycle_item(item);
		});

		//重新排序index后面的
		if (index + count < old_length) {
			this.layout_items(index);
		}
		this.resize_content();
		if (this.items.length > 0) {
			this.start_index = -1;
			this.stop_index = -1;
			this.on_scrolling();
		}
	}

	public appendData(...datas: any[]) {
		if (!this.items) {
			this.items = [];
		}
		this.insertData(this.items.length, ...datas);
	}

	private verticalLayout(index) {
		let x = this.item_tpl.position.x;
		let y =
			-Math.floor(index / this.col) * (this.item_height + this.gap_y) -
			this.item_height * (1 - this.item_tpl.getComponent(UITransform).anchorY) -
			this.gap_top;

		if (this.col > 1) {
			x = ((index % this.col) + (1 - this.col) / 2) * (this.item_width + this.gap_x);
			if (this.content.getComponent(UITransform).anchorX == 0) {
				x += this.scrollview.getComponent(UITransform).width / 2;
			}
		}

		return [x, y];
	}

	private horizontalLayout(index) {
		let x =
			Math.floor(index / this.row) * (this.item_width + this.gap_x) +
			this.item_width * this.item_anchorX -
			this.gap_left;
		let y = this.item_tpl.position.y;
		if (this.row > 1) {
			y += -(index % this.row) * (this.item_height + this.gap_y);
		}
		return [x, y];
	}

	public scrollTo(index: number, timeInSecond = null) {
		if (timeInSecond === true) {
			timeInSecond = 0.1
		}
		if (this.dir == ListViewDir.Vertical) {
			const min_y = this.scrollview.node.getComponent(UITransform).height - this.content.getComponent(UITransform).height;
			if (min_y >= 0) {
				//info("no need to scroll");
				return;
			}
			let [_, y] = this.verticalLayout(index);
			if (y < min_y) {
				y = min_y;
				//info("content reach bottom");
			}
			if (y > 0) {
				y = 0;
			}
			this.scrollview.scrollTo(v2(this.content.position.x, -y - this.item_height / 2), timeInSecond);
			this.on_scrolling();
		} else {
			const max_x = this.content.getComponent(UITransform).width - this.scrollview.node.getComponent(UITransform).width;
			if (max_x <= 0) {
				return;
			}

			let [x, _] = this.horizontalLayout(index);
			if (x > max_x) {
				x = max_x;
			}
			if (x < 0) {
				x = 0;
			}
			this.scrollview.scrollTo(v2(x - this.item_width / 2, this.content.position.y), timeInSecond);
			this.on_scrolling();
		}
	}

	public scrollToEnd() {
		if (this.dir == ListViewDir.Vertical) {
			this.scrollview.scrollToBottom();
		} else {
			this.scrollview.scrollToRight();
		}
		this.on_scrolling();
	}

	public refreshItem(index: number, data: any) {
		if (!this.items) {
			return;
		}
		if (index < 0 || index >= this.items.length) {
			return;
		}
		let item: ListItem = this.items[index];
		item.data = data;
		this._datas[index] = data;
		if (item.node) {
			if (this.recycleCb) {
				this.recycleCb.call(this.cb_host, item.node);
			}
			this.itemSetter.call(this.cb_host, item.node, item.data, index);
		}
	}

	public destroy() {
		this.clear_items();
		this.node_pool.forEach((node) => {
			node.destroy();
		});
		this.node_pool = null;
		this.items = null;
		this._datas = null;

		if (isValid(this.scrollview.node)) {
			this.scrollview.node.off("scrolling", this.on_scrolling, this);
			this.scrollview.node.off("scroll-to-bottom", this.on_scroll_to_end, this);
			this.scrollview.node.off("scroll-to-right", this.on_scroll_to_end, this);
		}
	}

	get datas(): any[] {
		return this._datas;
	}

	get selectedIndex(): number {
		return this._selected_index;
	}

	get selectData(): any {
		let item: ListItem = this.items[this._selected_index];
		if (item) {
			return item.data;
		}
		return null;
	}
}

export enum ListViewDir {
	Vertical = 1,
	Horizontal = 2,
}

type ListViewParams = {
	scrollview: ScrollView;
	// mask:Node;
	content?: Node;
	item_tpl: Node;
	item_Prefab?: Node;
	direction?: ListViewDir;
	width?: number;
	height?: number;
	gap_x?: number;
	gap_y?: number;
	gap_top?: number;
	gap_bottom?: number;
	gap_left?: number;
	row?: number; //水平方向排版时，垂直方向上的行数
	column?: number; //垂直方向排版时，水平方向上的列数
	cb_host?: any; //回调函数host
	itemSetter: (item: Node, data: any, index: number) => void; //item更新setter
	recycleCb?: (item: Node) => void; //回收时的回调
	selectCb?: (data: any, index: number) => void; //item选中回调
	selectSetter?: (item: Node, isSelect: boolean, index: number) => void; //item选中效果setter
	scrollToEndCb?: () => void; //滚动到尽头的回调
	autoScrolling?: boolean;
	emptyNode?: Node; //append时自动滚动到尽头
};

type ListItem = {
	x: number;
	y: number;
	data: any;
	idx: number;
	node: Node;
	isSelect: boolean;
};
