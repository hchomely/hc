import { _decorator, Component, SpriteFrame, Node, Canvas, Prefab, sys, input, Input, EventKeyboard, KeyCode, v3, resources, instantiate, assetManager, view, ResolutionPolicy, find, screen, Material, SpriteAtlas, profiler, director, ImageAsset, Widget, UITransform, Game, EventTouch, game, Texture2D, SafeArea, tween, EditBox } from 'cc';
const { ccclass, property } = _decorator;


import dataController from "./dataController";
import {
	ICallback,
	ICallbackWherUICreated
} from "../interface/action";
import {
	EUIType,
	EMessageType,
	EConfirmBoxType
} from "../interface/enum";
import messageController from "./messageController";
import util from "./util";
import uiBase from '../ui/uiBase';
import { NATIVE, PREVIEW } from 'cc/env';
import constConfig from '../config/constConfig';


@ccclass('uiController')
export default class uiController extends Component {

	curOpenUI: uiBase;
	curOpenUIName: string = "";
	uiAllInstance = {};
	xhrHandler: ICallback = null;
	_uiResourcePath: string = "ui/prefab/"
	xhrClient: XMLHttpRequest = null;
	_uiIndex: number = 1;
	_uiLoading: Object = {};
	_uiPreloadResources: SpriteFrame[] = [];
	_uiPreloadPrefab: Node[] = [];
	_preloadPrefab: Prefab[] = [];

	//proload progress
	_preloadTotal: number = 0;
	_preloadCur: number = 0;

	//last gameCenterui
	_lastGameCenterUI: string = "";

	@property(Canvas)
	canvas: Canvas = null;

	//单例
	static _instance: uiController = null;
	_isWidthScreenMode: boolean = false;
	_isHightScreenMode: boolean = false;
	_isDynamicIsland = false
	lastRoomID = ''
	isShowNewUI = false
	constructor() {
		super();
	}

	@property(Node)
	uiRoot: Node = null; //预加载缓冲ui

	@property(Node)
	fullRoot: Node = null;

	@property(Node)
	popRoot: Node = null;

	@property(Node)
	widgetRoot: Node = null;

	@property(Node)
	tipsRoot: Node = null;

	@property(Node)
	topRoot: Node = null;

	@property(Node)
	blockerPattern: Node = null;

	@property(Prefab)
	loadingPrefab: Prefab = null;

	@property(Material)
	roundIconMaterial: Material = null

	preloadUI: string[] = ["networkError", "loadingIndicator"];
	//子窗口
	preloadUI_subUI: string[] = ["gameCenter"];
	//父窗口窗口
	preloadUI_mainUI: string[] = ["clubMain", "mainWindow"];

	commonUI = ["mainWindow", "clubMain", "clubCounter", 'memberDetailsOfManagers', 'memberAdministration', 'tablePlayerProfile',
		'uiSet', 'clubData', 'tablePreset', 'gameSettingPlan', 'handDetailTexas', 'tableChatRoom', 'mttGameDetails', 'mttRealTimeResult'
	]

	_uiQueue: uiBase[] = [];

	_preBackTime: number = 0;
	_currentRoomId = ''
	gamecenterUIs = {}
	isFromGamecenter = false
	// LIFE-CYCLE CALLBACKS:
	onLoad() {
		uiController._instance = this;
		if (this.uiRoot) {
			let childs = this.uiRoot.children;
			let all: uiBase[] = [];
			childs.map(rNode => {
				let uiBaseObj = rNode.getComponent(uiBase);
				if (uiBaseObj) {
					all.push(uiBaseObj);
					this.uiAllInstance[rNode.name] = uiBaseObj;
				}
			})

			//reset
			all.map((ui) => {
				this.resetUI(ui);
			})
		}

		if (!sys.isNative) {
			this.commonUI = []
		}

		this.backKeyListener();
		window['uiCtrl'] = this


		messageController.getInstance().observe(EMessageType.newGameOpen, () => {
			if (this.curOpenUIName == 'gameCenter') {
				return
			}
			if (this.curOpenUI) {
				this.curOpenUI.hide()
			}
			this.closeAllPopupUI()
			this.curOpenUIName = 'gameCenter';
			this.curOpenUI = window['gamecenter']
		})
		screen.on('window-resize', () => {
			this.onSizeChange()
		})
	}
	public static getInstance(): uiController {
		return uiController._instance;
	}
	//绑定native后退
	onDestroy() {
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this)
	}

	backKeyListener() {
		if (sys.isNative) {
			input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
		}
	}

	onKeyUp(event: EventKeyboard) {
		if (event.keyCode == KeyCode.MOBILE_BACK) {
			console.log("触发后退");
			this.trigerBack();
		}
	}

	pushUIToBackQueue(rUIBase: uiBase) {
		if (this._uiQueue.length == 0 || this._uiQueue[this._uiQueue.length - 1] != rUIBase) {
			this._uiQueue.push(rUIBase);
		}

		let idx = this._uiQueue.indexOf(rUIBase)
		if (idx != -1) {
			this._uiQueue.splice(idx, 1)
		}

		let queue = uiController.getInstance()._uiQueue.filter(v => v.isFullScreenScene)

		let lastPop: uiBase = null
		if (rUIBase.isFullScreenScene) {
			if (queue.length > 0) {
				lastPop = queue[queue.length - 1]
			} else if (this.curOpenUIName == 'mainWindow') {
				lastPop = this.curOpenUI
			}
		}

		let gamecenter = window['gamecenter']
		if (gamecenter && gamecenter.isShow()) {
			lastPop = null
		}
		if (lastPop) {
			let pos = lastPop.node.position
			//console.error("pushUIToBackQueue ", lastPop.uiName, pos)
			if (lastPop.uiName == "mainWindow" && constConfig.showNewHall) {
			}
			else {
				if (lastPop.uiName != rUIBase.uiName) {
					lastPop.node.setPosition(v3(10000, pos.y, 0))
					util.setVis(lastPop.node, false, true)
				}
			}
		}

		this._uiQueue.push(rUIBase);
	}

	popUIToBackQueue(rUIBase: uiBase) {
		let idx = this._uiQueue.indexOf(rUIBase)
		if (idx != -1) {
			this._uiQueue.splice(idx, 1)
		}
	}

	trigerBack() {
		if ((Date.now() - this._preBackTime) < 300) return;
		this._preBackTime = Date.now();
		if (this._uiQueue.length > 0) {
			let found: boolean = true;
			while (found) {
				let ui = this._uiQueue[this._uiQueue.length - 1]
				if (ui) {
					if (ui.isShow()) {
						found = false;
						// if ((ui.closer && ui.closer.node.active) || ui.closerBG) {
						ui.closerClick();
						// }
					}
				} else {
					found = false;
					messageController.getInstance().dispatch(EMessageType.backKeyUp, {});
				}
			}
		} else {
			messageController.getInstance().dispatch(EMessageType.backKeyUp, {});
		}
	}

	loadPrefab(uiName) {
		return new Promise<Prefab>((resolve, reject) => {
			if (this._uiLoading[uiName]) {
				console.error('mutil-loading', uiName)
				reject('loading' + uiName)
				return
			}

			this._uiLoading[uiName] = 1;
			resources.load(`${this._uiResourcePath}${uiName}`, (err, fab) => {
				delete this._uiLoading[uiName];
				if (err) {
					console.error("加载ui资源失败: " + `${this._uiResourcePath}${uiName}`)
					reject()
				} else {
					resolve(fab as Prefab);
				}
			})
		})
	}

	protected resetUI(r_prepareUi: uiBase) {
		if (r_prepareUi) {
			this._uiIndex++;
			// r_prepareUi.node.active = false;
			switch (r_prepareUi.uiType) {
				case EUIType.fullScreen:
					r_prepareUi.node.parent = this.fullRoot;
					break;
				case EUIType.popUp:
				case EUIType.popUpNoHidePrePopup:
					r_prepareUi.node.parent = this.popRoot;
					break;
				case EUIType.widget:
					r_prepareUi.node.parent = this.widgetRoot;
					break;
				case EUIType.tips:
					r_prepareUi.node.parent = this.tipsRoot;
					break;
				case EUIType.top:
					r_prepareUi.node.parent = this.topRoot;
					break;
			}
			r_prepareUi.node.position = v3(100000, 0);
		}
	}

	//显示ui
	async show(uiName, rCb?, rRoomID: string = "") {
		console.time('show');
		if (typeof uiName != "string") {
			uiName = uiName.prototype.name;
		}
		// this.uiRoot.pauseSystemEvents(true)

		if (rRoomID != '') {
			this.lastRoomID = rRoomID
		}
		this.isShowNewUI = true
		console.error("showui >> " + uiName + ` << rRoomID=${rRoomID} `);

		let prepareUi = this.uiAllInstance[uiName]
		if (!prepareUi) {
			try {
				let fab = await this.loadPrefab(uiName)
				fab.optimizationPolicy = Prefab.OptimizationPolicy.SINGLE_INSTANCE
				let prefabObj = instantiate(fab)
				prepareUi = prefabObj.getComponent(uiBase)
				if (sys.isBrowser) {
					//遍历 prefabObj 所有子节点 如果有属性SafeArea 这个节点就设置为safeArea enable 为false
					if (prefabObj.getComponent(SafeArea)) {
						prefabObj.getComponent(SafeArea).enabled = false;
					}
					for (let child of prefabObj.children) {
						if (child.getComponent(SafeArea)) {
							child.getComponent(SafeArea).enabled = false;
						}
					}
				}

			} catch (e) {
				return
			}

			if (prepareUi) {
				this.uiAllInstance[uiName] = prepareUi
				//reset
				this.resetUI(prepareUi);
				if (!sys.isBrowser) {
					for (let child of prepareUi.node.children) {
						let tmpSafeArea = child.getComponent(SafeArea);
						let tmpWidget = child.getComponent(Widget);
						if (tmpSafeArea && tmpWidget) {
							if (tmpWidget.isAlignBottom) {
								setTimeout(() => {
									tmpWidget.bottom = 0;
									tmpWidget.updateAlignment();
								}, 200);
							}
						}
					}
				}

			} else {
				return
			}
		}
		prepareUi.uiName = uiName
		this._currentRoomId = rRoomID
		if (uiName == "mainWindow" || uiName == "clubMain") {
			//用于房间返回&reconnect回复后redirect ui
			this._lastGameCenterUI = uiName;
		}

		if (prepareUi.uiType == EUIType.fullScreen && !this.isFromGamecenter) {
			if (this.curOpenUIName == uiName) {
				if (!prepareUi.isShow()) {
					prepareUi.show()
				}
				if (rCb) {
					rCb(this.curOpenUI);
				}
				return this.curOpenUI;
			}
			if (uiName != 'gameCenter') {
				if (this.curOpenUI) {
					this.curOpenUI.hide()
				}
				this.closeAllPopupUI()
				this.curOpenUIName = uiName;
				this.curOpenUI = prepareUi;
			}
		}
		if (uiName == 'gameCenter') {
			prepareUi.node.setSiblingIndex(0);
		} else {
			prepareUi.node.setSiblingIndex(this._uiIndex++);
		}
		prepareUi.node.parent["_eventProcessor"].onUpdatingSiblingIndex();

		prepareUi.setRoomID(rRoomID);
		prepareUi.show()

		if (rCb) {
			rCb(prepareUi);
		}


		console.timeEnd('show')

		return prepareUi;
	}

	hide(uiName: string, roomID = null) {
		let ui: uiBase = this.getUI(uiName, roomID)
		if (ui && ui.isShow()) {
			ui.hide();
		}
	}


	preRefreshMessage(rMessage: any) {
		let msgTitle = `Message: ${rMessage.event || rMessage.route || "什么都没有"}`;

		let keys: string[] = Object.keys(this.uiAllInstance);
		keys.map((uiName: string) => {
			if (this.uiAllInstance[uiName].isShow()) {
				this.uiAllInstance[uiName].preRefreshMessage(rMessage);
			}
		})
	}

	refreshMessage(rMessage: any) {
		let msgTitle = `Message: ${rMessage.event || rMessage.route || "什么都没有"}`;

		let keys: string[] = Object.keys(this.uiAllInstance);
		keys.map((uiName: string) => {
			if (this.uiAllInstance[uiName].isShow()) {
				this.uiAllInstance[uiName].refreshMessage(rMessage)
			}
		})
	}

	endRefreshMessage(rMessage: any) {
		let msgTitle = `Message: ${rMessage.event || rMessage.route || "什么都没有"}`;

		let keys: string[] = Object.keys(this.uiAllInstance);
		keys.map((uiName: string) => {
			if (this.uiAllInstance[uiName].isShow()) {
				this.uiAllInstance[uiName].endRefreshMessage(rMessage);
			}
		})
	}

	/**
	 * 获取ui
	 * @param rID ui的id
	 */
	getUI(rID: string, roomID = null): uiBase {
		if (this.uiAllInstance[rID]) {
			return this.uiAllInstance[rID];
		}
	}

	/**
	 * 判断ui是否显示
	 * @param rID 
	 */
	isShow(rID: string, roomID = null): boolean {
		let ui = this.getUI(rID, roomID);
		if (!ui) {
			return false;
		}

		return ui.isShow();
	}

	/**
	 * 通用msgConfirm
	 * @param rTitle 
	 * @param rMsg 
	 * @param rCallBack 
	 */
	showConfirm(rTitle: string, rMsg: string, rCallBack: ICallback = null, rConfirm: string = "") {
		this.showBox(rTitle, rMsg, EConfirmBoxType.Confirm, rCallBack, rConfirm);
	}

	/**
		 * 通用msgConfirm
		 * @param rTitle 
		 * @param rMsg 
		 * @param rCallBack 
		 */
	showConfirmAwait(rTitle: string, rMsg: string, rConfirm: string = "", boxType: EConfirmBoxType = EConfirmBoxType.Confirm) {
		return new Promise(async (resolve, reject) => {
			this.showBox(rTitle, rMsg, boxType, (data) => {
				if (data.type == "confirm") {
					resolve(true)
				}
				else {
					resolve(false)
				}
			}, rConfirm);
		})
	}
	/**
	 * 同样msgBox
	 * @param rTitle 
	 * @param rMsg 
	 * @param rType 
	 * @param rCallBack 
	 * @param rConfirm
	 */
	showBox(rTitle: string, rMsg: string, rType: EConfirmBoxType, rCallBack: ICallback = null, rConfirm: string = "", rCancel: string = null) {
		dataController.getInstance().uiData.uiConfirmBox = {
			msg: rMsg,
			title: rTitle,
			type: rType,
			confirm: rConfirm,
			cancel: rCancel,
		};

		let ui = this.show("confirmBox", (rUI) => {
			dataController.getInstance().uiData.confirmBoxRoomID = null
			rUI.setCallBack(rCallBack);
		}, dataController.getInstance().uiData.confirmBoxRoomID || "");
	}

	/**
	* 同样msgBox
	* @param rTitle 
	* @param rMsg 
	* @param rType 
	* @param rCallBack 
	* @param rConfirm
	* @param rCancel
	* @param rConfirmTime
	* @param rCancelTime
	*/
	showBoxWithTime(rTitle: string, rMsg: string, rType: EConfirmBoxType, rCallBack: ICallback = null, rConfirm: string = "", rCancel: string = null, rConfirmTime: number = 0, rCancelTime: number = 0) {
		dataController.getInstance().uiData.uiConfirmBox = {
			msg: rMsg,
			title: rTitle,
			type: rType,
			confirm: rConfirm,
			cancel: rCancel,
			confirmTime: rConfirmTime,
			cancelTime: rCancelTime,
		};

		let ui = this.show("confirmBox", (rUI) => {
			dataController.getInstance().uiData.confirmBoxRoomID = null
			rUI.setCallBack(rCallBack);
		}, dataController.getInstance().uiData.confirmBoxRoomID || "");
	}

	hideConfirm() {
		this.hide("confirmBox");
	}


	showTips(rMsg: string, roomID = "") {
		if (rMsg == null || rMsg == "NaN") {
			return;
		}
		console.log("quickTips -- quickTips " + rMsg)
		uiController.getInstance().show("quickTips", (ui) => {
			ui.setUIData({
				msg: rMsg
			})
		}, roomID);
	}

	showErrTips(errCode, rMsg: string, roomID = "") {
		if (rMsg == null || rMsg == "NaN") {
			return;
		}
		console.log("quickTips -- quickTips " + rMsg)
		uiController.getInstance().show("quickTips", (ui) => {
			ui.setUIData({
				msg: rMsg,
			}, true, errCode)
		}, roomID);
	}

	showTipsGolden(rMsg: string, roomID = '') {
		if (rMsg == null || rMsg == "NaN") {
			return;
		}
		dataController.getInstance().uiData.uiQuickTipsGolden = rMsg;
		uiController.getInstance().show("quickTipsGolden", null, roomID);
	}
	showNotice(rMsg: string, rTimes?: number, rInterval?: number) {
		if (rMsg == null || rMsg == "NaN") {
			return;
		}
		let notice = {
			msg: rMsg,
		};
		(rTimes) && (notice["times"] = rTimes);
		(rInterval) && (notice["interval"] = rInterval);
		dataController.getInstance().uiData.uiNoticeTips = notice;
		this.show("noticeTips");
	}

	//关闭所有popup类ui
	closeAllPopupUI() {
		for (const uiID in this.uiAllInstance) {
			let ui = this.uiAllInstance[uiID];
			if (ui.isShow() && (ui.uiType == EUIType.popUp || ui.uiType == EUIType.popUpNoHidePrePopup)) {
				ui.hide();
			}
		}
	}

	//关闭所有popup类ui editbox 聚焦事件
	closeAllEditorfocus() {
		for (const uiID in this.uiAllInstance) {
			let ui = this.uiAllInstance[uiID];
			if (ui.isShow() && (ui.uiType == EUIType.popUp || ui.uiType == EUIType.popUpNoHidePrePopup)) {
				if (ui.node) {
					let editBoxs = ui.node.getComponentsInChildren(EditBox);
					editBoxs.map((editBox: EditBox) => {
						if (editBox) {
							editBox.blur();
						}
					});
				}
			}
		}
	}

	showLoadingIndicator() {
		this.show("loadingIndicator");
	}

	hideLoadingIndicator() {
		this.hide("loadingIndicator");
	}
	isShowLoadingIndicator() {
		return this.isShow("loadingIndicator")
	}

	/**
	 * 获取前一个gamecenter ui
	 */
	getLastGameCenterUI() {
		return this._lastGameCenterUI;
	}

	/**
	 * 用户登出
	 */
	onPlayerLogout() {
		this._lastGameCenterUI = "";
	}

	onComeback() {
		console.log("onComeback app 返回")
		let ids = Object.keys(this.uiAllInstance);
		ids.map(id => {
			if (this.uiAllInstance[id] && this.uiAllInstance[id].isShow()) {
				console.log("onComeback app " + this.uiAllInstance[id].name, this.uiAllInstance[id].isShow())
				this.uiAllInstance[id].onComeback();
			}
		})
	}

	//init屏幕参数
	initScreen() {
		if (sys.isBrowser) {
			console.warn("webController.initScreen");
			return;
		}
		let windowSize = view.getVisibleSize()
		var whRate = windowSize.height / windowSize.width;
		if (whRate >= 1.7) {
			view.setDesignResolutionSize(1080, 1920, ResolutionPolicy.FIXED_WIDTH)
			this._isWidthScreenMode = false;
		} else {
			view.setDesignResolutionSize(1080, 1920, ResolutionPolicy.FIXED_HEIGHT)
			this._isWidthScreenMode = true;
			this.uiRoot.getComponent(UITransform).width = Math.min(1440, view.getVisibleSize().width)
		}

		//高长模式，只在iphone x或2:1屏以上
		this._isHightScreenMode = whRate > 1.9

		if (this._isHightScreenMode) {
			let ipx = find('Canvas/ipx')
			if (ipx) {
				if (PREVIEW) {
					ipx.active = true
					this._isDynamicIsland = true
				} else {
					ipx.destroy()
				}
			}
		}

		console.warn("this._isHightScreenMode=" + this._isHightScreenMode, whRate)
	}

	//
	isWidthScreenMode() {
		return this._isWidthScreenMode;
	}

	isHightScreenMode() {
		return this._isHightScreenMode;
	}

	isDynamicIsland() {
		return this._isDynamicIsland;
	}

	getTopPadding() {
		let padding = 0
		if (this._isHightScreenMode) {
			padding = 60
		}

		if (this._isDynamicIsland) {
			padding = 93
		}

		return padding
	}

	showWithCallBack(uiName, data = null, roomId) {
		return new Promise<any>((resolve) => {
			uiController.getInstance().show(uiName, (ui: uiBase) => {
				if (data) {
					ui.setUIData(data)
				}
				ui.setCallBack((r) => {
					resolve(r)
				})
			}, roomId)
		})
	}


	onSizeChange() {
		let keys: string[] = Object.keys(this.uiAllInstance);
		if (sys.isBrowser && keys.length > 0) {
			this.initScreen();
			keys.map((uiName: string) => {
				if (this.uiAllInstance[uiName].isShow()) {
					let base: uiBase = this.uiAllInstance[uiName];
					let windowSize = view.getVisibleSize()
					if (base.uiType == EUIType.fullScreen && base.node.getComponent(UITransform).height > windowSize.height) {
						base.node.getComponent(UITransform).height = windowSize.height
					}
				}
			})
		}
	}
}
