
import { _decorator, Component, Node, Button, EditBox, Sprite, Label, sys, RichText, Color, Vec3, native, dragonBones, Tween, tween, ParticleSystem2D, ToggleContainer, Toggle, find, resources, assetManager, AudioClip, AudioSource, Prefab, v2, UITransform, UIOpacity, math, sp, SpriteFrame, v3, utils, TiledUserNodeData, Graphics, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
declare global {
	interface String {
		padStart(rStartPos: number, rPattenString: string);
	}
}
import dataController from "./dataController";
import audioController from "./audioController";
import uiBase from '../ui/uiBase';
import { IRoomSetting } from '../interface/base';

@ccclass('util')
export default class util extends Component {


	//绑定点事件,带音效
	public static bindClickEventFX(rNode: Node, eventHandler, fx?) {
		if (rNode) {
			let btn = rNode.getComponent(Button);
			if (!btn) {
				btn = rNode.addComponent(Button)
				btn.target = rNode
				btn.transition = Button.Transition.NONE
			}
			btn.interactable = true;
			//按键范围点落去放大，放置难点的问题
			if (btn.transition == Button.Transition.SCALE) {
				btn.zoomScale = 1.05
			}
			rNode.on('click', (r) => {
				if (!util.isVisable(rNode)) {
					return;
				}
				let btn: Button = rNode.getComponent(Button);
				if (btn && !btn.interactable)
					return;
				//默认音效
				if (!!fx) {
					audioController.getInstance().playFX(fx);
				} else {
					audioController.getInstance().playFX("button");
				}
				eventHandler(r);
			});
		}
	}

	//绑定点事件
	public static bindClickEvent(rNode: Node, eventHandler) {
		if (rNode) {
			if (rNode.name == "btnCancel") {
				if (!dataController.getInstance().uiData.btnCanelAddEvent) {
					dataController.getInstance().uiData.btnCanelAddEvent = {};
				}
				dataController.getInstance().uiData.btnCanelAddEvent[rNode["_id"]] = true;
			}
			let btn = rNode.getComponent(Button);
			if (!btn) {
				btn = rNode.addComponent(Button)
				btn.target = rNode
				btn.transition = Button.Transition.NONE
			}
			btn.interactable = true;
			//按键范围点落去放大，放置难点的问题
			if (btn.transition == Button.Transition.SCALE) {
				btn.zoomScale = 1.05
			}
			rNode.targetOff(rNode)
			rNode.on('click', (r) => {
				eventHandler(r);

			}, rNode);
		}
	}

	//判断节点是否可显示
	protected static isVisable(rNode: Node) {
		// console.log("isVisable " + rNode.name + " >> " + ( rNode.active ? "true":"false");
		if (!rNode.active) {
			return false;
		}
		if (!!rNode.parent) {
			if (rNode.parent.name == "Canvas") {
				return true;
			}
			return util.isVisable(rNode.parent);
		}
		return true;
	}
	/**
	 * 节点递归查找
	 * @param rPath 
	 * @param rParent 
	 */
	public static findEX(rPath: string, rParent?: Node): Node {
		let node = find(rPath, rParent);
		if (node) {
			return node;
		} else {
			if (rParent) {
				for (const index in rParent.children) {
					if (rParent.children[index]) {
						let child = util.findEX(rPath, rParent.children[index]);
						if (child) return child;
					}
				}
			}
			return null;
		}
	}


	public static bindNode(bindObject, rRoot: Node, rDeepLevel?: number, rExcludeNodeChildrenNodeListPre?: string[], rExcludeCustomNodeListName?: string[], rCustomNodeListPre?: string[]) {
		// console.log("bindNode createInit",rRoot.name);
		if (bindObject.__uiName && bindObject.__uiName[rRoot.name]) {
			// console.log(bindObject, "已经被初始化");
			return;
		}
		if (!bindObject.__uiName) {
			bindObject.__uiName = {};
		}
		bindObject.__uiName[rRoot.name] = true;
		let startTime = new Date();
		let deep = rDeepLevel ? rDeepLevel : 10000;
		let defaultNodeListPre = ["img", "sl", "btn", "edt", "page", "node", "custom", "widget", "tgc", "tg"];
		let defaultExcludeNodeChildrenNodeListPre = ["widget", "tgc", "elet"];
		let excludeNodeChildrenNodeListPre = rExcludeNodeChildrenNodeListPre ? defaultExcludeNodeChildrenNodeListPre.concat(rExcludeNodeChildrenNodeListPre) : defaultExcludeNodeChildrenNodeListPre;
		let excludeNodeListName = rExcludeCustomNodeListName ? rExcludeCustomNodeListName : [];
		let nodeListPre = rCustomNodeListPre ? defaultNodeListPre.concat(rCustomNodeListPre) : defaultNodeListPre;
		bindObject["nodeListPre"] = nodeListPre;
		let nodeList = {};
		let root = null;
		nodeListPre.forEach(pre => {
			nodeList[pre] = {};
		})
		let top = 0;
		let nodeQueue = [];
		nodeQueue.push(rRoot);
		let click = 0;
		let deepLevel = [1];
		/**
		 * extra补充
		 */
		/************************************************************************************************ */
		let _roomID: string = bindObject._roomID || (bindObject.data && bindObject.data_roomID) || null;
		/************************************************************************************************ */
		while (top < nodeQueue.length) {
			click++;
			let root = nodeQueue[top];
			top++;
			if (!(root instanceof Node)) {
				continue;
			}
			if (top > nodeQueue.length) {
				break;
			}
			let children = root.children;
			children.forEach(child => {
				if (child.getComponent(uiBase)) {
					return
				}

				for (let i = 0; i < excludeNodeListName.length; i++) {
					if (excludeNodeListName[i] == child.name) {
						break;
					}
				}
				let flag = true;
				for (let i = 0; i < excludeNodeListName.length; i++) {
					if (child.name == excludeNodeListName[i]) {
						flag = false;
						break;
					}
				}
				if (!flag) {
					return;
				}
				flag = true;
				for (let i = 0; i < excludeNodeChildrenNodeListPre.length; i++) {
					if (child.name.indexOf(excludeNodeChildrenNodeListPre[i]) == 0) {
						flag = false;
						break;
					}
				}
				flag && nodeQueue.push(child);
				for (let i = 0; i < nodeListPre.length; i++) {
					let pre = nodeListPre[i];
					if (child.name.indexOf(pre) == 0) {
						let templateName = child.name;
						let tempName = templateName;
						for (let i = 2; nodeList[pre][tempName]; i++) {
							tempName = templateName + (`_num${i}`);
						}
						let ccNode = null;
						let skipNotice = "";
						if (pre == "img") {
							ccNode = child.getComponent(Sprite);
							skipNotice = "Sprite";
						}
						else if (pre == "sl") {
							ccNode = child.getComponent(Label) || child.getComponent(RichText);
							skipNotice = "Label/RichText";
						} else if (pre == "btn") {
							ccNode = child.getComponent(Button);
							skipNotice = "Button";
						} else if (pre == "edt") {
							ccNode = child.getComponent(EditBox);
							skipNotice = "EditBox";
						} else if (pre == "widget") {
							let widgetName = templateName.split("_")[0]
							ccNode = child.getComponent(widgetName) || child.getComponent('W' + widgetName.substr(1))
							if (ccNode) {
								if (ccNode._roomID == null && _roomID != null) {
									ccNode._roomID = _roomID;
								}
								if (ccNode.data && ccNode.data._roomID == null && _roomID != null) {
									ccNode.data._roomID = _roomID;
								}
							}
							skipNotice = `${templateName}脚本`;
						} else if (pre == "tgc") {
							ccNode = child.getComponent(ToggleContainer);
							skipNotice = "ToggleContainer";
						} else if (pre == "tg") {
							ccNode = child.getComponent(Toggle);
							skipNotice = "Toggle";
						} else {
							ccNode = child;
						}
						if (ccNode) {
							if (bindObject[`${tempName}`] == undefined) {
								bindObject[`${tempName}`] = ccNode;
							}
							nodeList[pre][tempName] = ccNode;
						} else {
							// console.log(`以${pre}开头的节点${tempName}下没有挂载${skipNotice}节点，将被忽略，请检查是否出错`)
						}
						break;
					}
				}
			})
			if (top == deepLevel[deepLevel.length - 1]) {
				deepLevel.push(nodeQueue.length);
			}
			if (deepLevel.length > deep) {
				break;
			}
		}
		nodeQueue = [];
		let keys = Object.keys(nodeList);
		keys.forEach(key => {
			if (bindObject[key]) {
				bindObject[key] = Object.assign(bindObject[key], nodeList[key]);
			} else {
				bindObject[key] = nodeList[key];
			}
		})


	}

	/**
	 * 自动绑定按钮
	 * @param obj 
	 */
	public static autoBindBtn(obj: object = null) {
		if (!obj) {
			return;
		}
		let exclude = ["btnCloser", "btnCloserBG"];
		let keys = Object.keys(obj["btn"]);
		keys.forEach(key => {
			for (let i = 0; i < exclude.length; i++) {
				if (exclude[i] == key) {
					return;
				}
			}
			if (obj["btn"][key]) {
				if (obj["btn"][key].node.__autoBind) {
					return;
				}
				obj["btn"][key].node.attr({
					__autoBind: true,
				})
				if (obj[`${key}Click`] && typeof obj[`${key}Click`] == "function") {
					util.bindClickEventFX(obj["btn"][key].node, (rEvent) => {
						obj[`${key}Click`].bind(obj)(rEvent);
					})
				}
			} else {
			}
		})
	}

	/**
	 * 批量绑定编辑框
	 * @param params 
	 * @param obj 
	 */
	public static bindEdtObj(params: object = {}, obj: object = null) {
		if (!obj) {
			return;
		}
		let keys = Object.keys(params);
		keys.forEach(key => {
			if (obj["edt"][key]) {
				if (typeof params[key] == "function") {
					return;
				}
				obj["edt"][key].node.on("text-changed", async (rEvent) => {
					obj["val"]["edt"][key] = obj["edt"][key].string;
					let resStr = await params[key].bind(obj)(rEvent);
					if (typeof resStr == "string" || typeof resStr == "number") {
						util.setEdtSl(obj["edt"][key], resStr);
					}
				});
				obj["edt"][key].node.on("editing-did-ended", async (rEvent) => {
					obj["val"]["edt"][key] = obj["edt"][key].string;
					let resStr = await params[key].bind(obj)(rEvent);
					if (typeof resStr == "string" || typeof resStr == "number") {
						util.setEdtSl(obj["edt"][key], resStr);
					}
				});
				obj["edt"][key].node.on("editing-return", async (rEvent) => {
					obj["val"]["edt"][key] = obj["edt"][key].string;
					let resStr = await params[key].bind(obj)(rEvent);
					if (typeof resStr == "string" || typeof resStr == "number") {
						util.setEdtSl(obj["edt"][key], resStr);
					}
				});
			} else {
			}
		})
	}

	/**
	 * 自动绑定编辑框
	 * @param obj 
	 */
	public static autoBindEdt(obj: object = null) {
		if (!obj) {
			return;
		}
		let keys = Object.keys(obj["edt"]);
		keys.forEach(key => {
			if (obj["edt"][key]) {
				if (obj["edt"][key].node.__autoBind) {
					return;
				}
				obj["edt"][key].node.attr({
					__autoBind: true
				})
				let edt = obj["edt"][key];
				edt.node.on("text-changed", async (rEvent) => {
					if (obj["edtChange"] && typeof obj["edtChange"] == "function") {
						let resStr = await obj["edtChange"].bind(obj)(rEvent, edt);
						if (typeof resStr == "string" || typeof resStr == "number") {
							util.setEdtSl(edt, resStr);
						}
					}
					if (obj[`${key}Change`] && typeof obj[`${key}Change`] == "function") {
						let resStr = await await obj[`${key}Change`].bind(obj)(rEvent, edt);
						if (typeof resStr == "string" || typeof resStr == "number") {
							util.setEdtSl(edt, resStr);
						}
					}
				});
				edt.node.on("editing-did-ended", async (rEvent) => {
					if (obj["edtEnd"] && typeof obj["edtEnd"] == "function") {
						let resStr = await obj["edtEnd"].bind(obj)(rEvent, edt);
						if (typeof resStr == "string" || typeof resStr == "number") {
							util.setEdtSl(edt, resStr);
						}
					}
					if (obj[`${key}End`] && typeof obj[`${key}End`] == "function") {
						let resStr = await obj[`${key}End`].bind(obj)(rEvent, edt);
						if (typeof resStr == "string" || typeof resStr == "number") {
							util.setEdtSl(edt, resStr);
						}
					}
				});
				edt.node.on("editing-return", async (rEvent) => {
					if (obj["edtEnd"] && typeof obj["edtEnd"] == "function") {
						let resStr = await obj["edtEnd"].bind(obj)(rEvent, edt);
						if (typeof resStr == "string" || typeof resStr == "number") {
							util.setEdtSl(edt, resStr);
						}
					}
					if (obj[`${key}End`] && typeof obj[`${key}End`] == "function") {
						let resStr = await obj[`${key}End`].bind(obj)(rEvent, edt);
						if (typeof resStr == "string" || typeof resStr == "number") {
							util.setEdtSl(edt, resStr);
						}
					}
				});
			} else {
			}
		})
	}
	public static setEdtSlObj(params: object, obj: object) {
		let keys = Object.keys(params);
		keys.forEach(key => {
			if (obj["edt"][key] instanceof EditBox) {
				util.setEdtSl(obj["edt"][key], params[key]);
			}
		})
	}

	public static setEdtSl(edt: EditBox, str: any) {
		if (typeof str == "string" || typeof str == "number") {
			if (edt.string != str + "") {
				edt.string = str + "";
			} else {
			}
		} else {
		}
	}

	/**
	 * 自动绑定单选框
	 * @param obj 
	 */
	public static autoBindTgc(obj: object = null) {
		if (!obj) {
			return;
		}
		let keys = Object.keys(obj["tgc"]);
		keys.forEach(key => {
			if (obj["tgc"][key]) {
				if (obj["tgc"][key].node.__autoBind) {
					return;
				}
				obj["tgc"][key].node.attr({
					__autoBind: true,
				})
				util.bindTgc(key, obj, (tg, index, arr, tgName) => {
					if (obj["tgcCheck"] && typeof obj["tgcCheck"] == "function") {
						obj["tgcCheck"].bind(obj)(tg, index, arr, tgName, "tog");
					}
					if (obj[`${key}Check`] && typeof obj[`${key}Check`] == "function") {
						obj[`${key}Check`].bind(obj)(tg, index, arr, tgName, "tog");
					}
				}, (tg, index, arr, tgName) => {
					if (obj["tgcUnCheck"] && typeof obj["tgcUnCheck"] == "function") {
						obj["tgcUnCheck"].bind(obj)(tg, index, arr, tgName, "tog");
					}
					if (obj[`${key}UnCheck`] && typeof obj[`${key}UnCheck`] == "function") {
						obj[`${key}UnCheck`].bind(obj)(tg, index, arr, tgName, "tog");
					}
				}, (tg, index, arr, tgName) => {
					if (obj["tgcClick"] && typeof obj["tgcClick"] == "function") {
						obj["tgcClick"].bind(obj)(tg, index, arr, tgName, "tog");
					}
					if (obj[`${key}Click`] && typeof obj[`${key}Click`] == "function") {
						obj[`${key}Click`].bind(obj)(tg, index, arr, tgName, "tog");
					}
				})
			} else {
			}
		})
	}

	public static bindTg(name: string, obj: object, checkFunc: Function = (tg) => { }, unCheckFunc: Function = (tg) => { }, clickFunc: Function = (tg) => { }) {
		if (!obj["tg"] || !obj["tg"][name]) {
			return;
		}
		// if (obj["tg"][name].isChecked) {
		//     checkFunc.bind(obj)(obj["tg"][name]);
		// } else {
		//     unCheckFunc.bind(obj)(obj["tg"][name]);
		// }
		obj["tg"][name].node.on("toggle", (rEvent) => {
			if (obj["tg"][name].isChecked) {
				checkFunc.bind(obj)(obj["tg"][name]);
			} else {
				unCheckFunc.bind(obj)(obj["tg"][name]);
			}
			clickFunc.bind(obj)(obj["tg"][name]);
		})
	}  /**
   * 绑定单选框
   * @param name 
   * @param obj 
   * @param checkFunc 
   * @param unCheckFunc 
   * @param clickFunc
   * @param defaultIndex 
   */
	public static bindTgc(name: string, obj: object, checkFunc: Function = (tg, index, arr) => { }, unCheckFunc: Function = (tg, index, arr) => { }, clickFunc: Function = (tg, index, arr) => { }) {
		if (!obj["tgc"] || !obj["tgc"][name]) {
			return;
		}
		obj["tgc"][name].toggleItems.forEach((tg, index, arr) => {
			tg.node.on("toggle", (rEvent) => {
				obj["tgc"][name].toggleItems.forEach((tg, index, arr) => {
					let tgName = tg.name.replace("toggle", "").replace("<Toggle>", "");
					if (tg.isChecked) {
						checkFunc.bind(obj)(tg, index, arr, tgName);
					} else {
						unCheckFunc.bind(obj)(tg, index, arr, tgName);
					}
					clickFunc.bind(obj)(tg, index, arr, tgName);
				})
			})
		})
	}

	public static autoBindTg(obj: object = null, params: object = null) {
		if (!obj) {
			return;
		}
		if (params) {
			util.setTgObj(params, obj);
		}
		let keys = Object.keys(obj["tg"]);
		keys.forEach(key => {
			if (obj["tg"][key]) {
				if (obj["tg"][key].node.__autoBind) {
					return;
				}
				obj["tg"][key].node.attr({
					__autoBind: true,
				})
				util.bindTg(key, obj, (tg) => {
					if (obj["tgCheck"] && typeof obj["tgCheck"] == "function") {
						obj["tgCheck"].bind(obj)(tg);
					}
					if (obj[`${key}Check`] && typeof obj[`${key}Check`] == "function") {
						obj[`${key}Check`].bind(obj)(tg);
					}
				}, (tg) => {
					if (obj["tgUnCheck"] && typeof obj["tgUnCheck"] == "function") {
						obj["tgUnCheck"].bind(obj)(tg);
					}
					if (obj[`${key}UnCheck`] && typeof obj[`${key}UnCheck`] == "function") {
						obj[`${key}UnCheck`].bind(obj)(tg);
					}
				}, (tg) => {
					if (obj["tgClick"] && typeof obj["tgClick"] == "function") {
						obj["tgClick"].bind(obj)(tg);
					}
					if (obj[`${key}Click`] && typeof obj[`${key}Click`] == "function") {
						obj[`${key}Click`].bind(obj)(tg);
					}
				})
			} else {
			}
		})
	}
	public static autoBindWidgetListItem(obj: object) {
		if (obj["widget"] && obj["itemPattern"] !== undefined && !obj["itemPattern"]) {
			let keys = Object.keys(obj["widget"]);
			for (let i = 0; i < keys.length; i++) {
				if (keys[i].indexOf("ListItem") != -1) {
					obj["itemPattern"] = obj["widget"][keys[i]];
					break;
				}
			}
		}
	}
	public static setTgObj(params: object, obj: object): void {
		if (util.isObj(params) && obj) {
			let keys = Object.keys(params);
			keys.forEach((key, index) => {
				obj["tg"][key].isChecked = params[key];
			})
		}
	}
	/**
 * 批量设置属性
 * @param arr 中间属性
 * @param val 传进来的值 如果是 数组则按位赋值
 * @param path 后面相同的后缀
 * @param parent 前面相同的前缀
 */
	public static setLots(arr: any[], val: any, path: string = "", parent: object = null) {
		let pathAttr: string[] = util.parsePath(path);
		arr.forEach((i, k) => {
			let temp = null;
			let tempPath = [];
			if (parent) {
				let iArr = i.split("/");
				tempPath = iArr.concat(pathAttr);
				temp = parent;
			} else {
				temp = i;
			}
			for (let j = 0; j < tempPath.length - 1; j++) {
				temp = temp[tempPath[j]];
			}
			(tempPath.length > 0) && (temp[tempPath[tempPath.length - 1]] = (val instanceof Array) ? val[k] : val);
			(tempPath.length <= 0) && (temp = (val instanceof Array) ? val[k] : val);
		})
	}

	/**
	 * 批量为Label或RichText节点赋值
	 * @param params 对象数组 {key: value} => {节点的名字：节点的值}
	 * @param obj 节点所在的对象
	 */
	public static setSlObj(params: object, obj: object): void {
		if (util.isObj(params)) {
			let keys = Object.keys(params);
			keys.forEach((key, index) => {
				if (obj["slChange"] && typeof obj["slChange"] == "function") {
					obj["slChange"].bind(obj)(obj["sl"][key].string, params[key], obj["sl"][key])
				}
				if (obj[`${key}Change`] && typeof obj[`${key}Change`] == "function") {
					obj[`${key}Change`].bind(obj)(obj["sl"][key].string, params[key], obj["sl"][key]);
				}
				if (params[key] === null) {
					return;
				} else if (params[key] === undefined) {
					return;
				} else if (typeof params[key] == "function") {
					return;
				} else if (params[key] instanceof Array) {
					return;
				} else if (util.isObj(params[key])) {
					return;
				} else if (!obj["sl"][key] || !(obj["sl"][key] instanceof Label || obj["sl"][key] instanceof RichText)) {
				} else {
					let tempString = params[key];
					if (typeof params[key] == "number") {
						tempString = `${util.fixFloat(params[key])}`
					}
					if (tempString != obj["sl"][key].string) {
						try {
							obj["sl"][key].string = tempString;
						} catch (err) {
						}
					} else {
					}
				}
			})
		}
	}
	/**
	/**
	 * 修复数值
	 * @param rNumber 
	 * @param rLen 小数点的位数
	 */
	public static fixFloat(rNumber: number, rLen: number = 3) {
		let base: number = Math.pow(10, rLen);
		return Math.round(rNumber * base) / base;
	}
	/**
   * 批量清空label string 
   * @param obj 
   */
	public static clearSl(obj: object, exclude: object = {}) {
		if (obj["sl"]) {
			let keys = Object.keys(obj["sl"]);
			keys.forEach(key => {
				(exclude[key] != true) && (obj["sl"][key].string = "");
			})
		}
	}
	/**
	 * 批量绑定按钮
	 * @param params 
	 * @param obj 
	 */
	public static bindBtnObj(params: object = {}, obj: object = null) {
		if (!obj) {
			return;
		}
		let keys = Object.keys(params);
		keys.forEach(key => {
			if (obj["btn"][key]) {
				util.bindClickEventFX(obj["btn"][key].node, (rEvent) => {
					if (typeof params[key] == "function") {
						params[key].bind(obj)(rEvent);
					} else {
					}
				})
			} else {
			}
		})
	}
	/**
	 * 批量设置节点可视化
	 * @param params {key: value} => {name: boolean}
	 * @param obj this
	 */
	public static setVisObj(params: object, obj: object, fast = false): void {
		if (util.isObj(params) && obj) {
			let keys = Object.keys(params);
			if (!obj["nodeListPre"] || !obj["nodeListPre"].length) {
				return;
			}
			keys.forEach((key, index) => {
				for (let i = 0; i < obj["nodeListPre"].length; i++) {
					let item = obj["nodeListPre"][i];
					if (key.indexOf(item) === 0) {
						let tempNode: Node = null;
						if (obj[item][key] && obj[item][key].node) {
							tempNode = obj[item][key].node;
						} else if (obj[item][key] instanceof Node) {
							tempNode = obj[item][key];
						} else {
							return;
						}
						util.setVis(tempNode, params[key], fast);
						return;
					}
				}
			})
		}
	}
	public static setTgcObj(params: object, obj: object) {
		if (util.isObj(params) && obj) {
			let keys = Object.keys(params);
			keys.forEach((key, index) => {
				obj["tgc"][key].toggleItems.forEach((tg, index, arr) => {
					let tgName = tg.name.replace("toggle", "").replace("<Toggle>", "");
					if (typeof params[key] == "number" && index == params[key]) {
						tg.isChecked = true;
						if (obj[`${key}Check`] && typeof obj[`${key}Check`] == "function") {
							obj[`${key}Check`].bind(obj)(tg, index, arr, tgName, "def");
						}
					} else if (typeof params[key] == "string" && tgName.indexOf(params[key]) != -1) {
						tg.isChecked = true;
						if (obj[`${key}Check`] && typeof obj[`${key}Check`] == "function") {
							obj[`${key}Check`].bind(obj)(tg, index, arr, tgName, "def");
						}
					} else {
						tg.isChecked = false;
						if (obj[`${key}UnCheck`] && typeof obj[`${key}UnCheck`] == "function") {
							obj[`${key}UnCheck`].bind(obj)(tg, index, arr, tgName, "def");
						}
					}
				})
			})
		}
	}

	/**
 * 解析路径
 * @param path 路径
 */
	public static parsePath(path) {
		let res = [];
		try {
			if (path.indexOf(".") != -1) {
				res = path.split(".");
			} else if (path.indexOf("/") != -1) {
				res = path.split("/");
			} else {
				res = [path];
			}
		} catch (err) {
		} finally {
			return res;
		}
	}
	public static autoGetNodeByName(pre: string, obj: object, name: string) {
		if (!obj[pre]) {
			return null;
		}
		if (!obj[pre][name]) {
			return null;
		}
		return obj[pre][name];
	}
	/**
 * 批量清空editBox string 
 * @param obj 
 */
	public static clearEdt(obj) {
		if (obj["edt"]) {
			let keys = Object.keys(obj["edt"]);
			keys.forEach(key => {
				obj["edt"][key].string = "";
			})
		}
	}
	public static isObj(obj: any) {
		return Object.prototype.toString.call(obj).indexOf("Object") != -1;
	}
	public static autoGetAllNodeByName(pre: string, obj: object) {
		if (!obj[pre]) {
			return null;
		}
		return obj[pre];
	}
	public static setVis(node: Node, active: boolean, fast = false) {
		if (fast) {
			let opacity = node.getComponent(UIOpacity);
			if (opacity) {
				opacity.opacity = active ? 255 : 0
			}
			else {
				node.active = active
			}
		} else {
			node.active = active
		}
	}


	public static createPrefab(node) {
		let prefab = new Prefab()
		prefab.data = node
		node["_prefab"] = prefab
		prefab.optimizationPolicy = Prefab.OptimizationPolicy.MULTI_INSTANCE
		prefab.compileCreateFunction()
		return prefab
	}
	static _roomIDBuff: {} = {};
	static explainRoomID(rID: string): IRoomSetting {
		let words4 = rID.split('%');
		let words3 = words4[0].split('@');
		let words2 = words3[0].split('#');
		let words = words2[0].split('_');
		let unionID = words2[1] || "0";
		let clubID = words[0] || "0";
		let matchID = words[1] || "0";
		let tableID = words[2] || "0";
		let myClubID = words3[1] || (unionID == "0" ? clubID : "0");
		let myUnionID = words4[1] || unionID;
		util._roomIDBuff[rID] = {
			unionID: parseInt(unionID),
			clubID: parseInt(clubID),
			matchID: parseInt(matchID),
			tableID: parseInt(tableID),
			myClubID: parseInt(myClubID),
			myUnionID: parseInt(myUnionID),
			roomID: rID
		};
		return Object.assign({}, util._roomIDBuff[rID])
	}
	static drawLine(Node: Node, arr: Vec2[], offset: Vec2 = new Vec2(0, 0)) {
		if (arr.length < 2) {
			return;
		}
		let graphics = Node.getComponent(Graphics);
		if (!graphics) {
			graphics = Node.addComponent(Graphics);
		}
		graphics.clear();
		graphics.moveTo(arr[0].x + offset.x, arr[0].y + offset.y); // 移动到起点
		for (let i = 1; i < arr.length; i++) {
			graphics.lineTo(arr[i].x + offset.x, arr[i].y + offset.y); // 画线到下一个点
		}
		graphics.stroke();	// 描边

	}
}
window['gUtil'] = util
export { util };
