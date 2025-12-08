import {
  _decorator,
  Component,
  Enum,
  Button,
  Node,
  instantiate,
  Widget,
  UITransform,
  size,
  view,
  Sprite,
  color,
  ScrollView,
  UIOpacity,
  Layout,
  sys,
  v3,
  Label,
  RichText,
  Tween,
  tween,
  Vec3,
  EditBox,
  game,
  SafeArea,
} from "cc";
const { ccclass, property } = _decorator;

import util from "../controller/util";
import audioController from "../controller/audioController";
import { ICallback } from "../interface/action";
import uiController from "../controller/uiController";
import { EUIType, EUIOpenEffect, EUIDelayInit, EMessageType } from "../interface/enum";
import { IRoomSetting } from "../interface/base";
import widgetList from "./widget/widgetList";
import messageController from "../controller/messageController";
import dataController from "../controller/dataController";
// import constConfig from "../config/constConfig";

const fullScreenScene = [
  "mainWindow",
  "clubMain",
  "createPokerTable",
  "tablePresetNew",
  "lobby",
  "tournament",
];
let sceneList = [];
window["sceneList"] = sceneList;
@ccclass("uiBase")
export default class uiBase extends Component {
  closeCallback: ICallback = null;
  _afterInitCallBack: ICallback = null;
  callBackData: any;
  uiName = "";
  isFullScreenScene = false;
  _isHide = false;
  lang = "en";

  constructor() {
    super();
    this.closeCallback = null;
  }

  @property({
    type: Enum(EUIType),
  })
  uiType: EUIType = EUIType.fullScreen; //ui基础类 0=全屏ui 1=pop up ui

  @property({
    type: Enum(EUIOpenEffect),
  })
  uiOpenEffect: EUIOpenEffect = EUIOpenEffect.popFromLeft; //默认自动

  @property(Number)
  popupAniTime = 0.2;
  @property(Number)
  popupMaskAniTime = 0.1;
  @property(Boolean)
  showHideAni = false;
  @property(Number)
  hideAniTime = 0.1;


  @property(Button)
  closer: Button = null;

  @property(Button)
  closerBG: Button = null;

  @property({
    type: Enum(EUIDelayInit),
  })
  delayInit: EUIDelayInit = EUIDelayInit.immedinate;

  bgBlocker: Node = null;

  _isReady: boolean = false;

  _inited: boolean = false;

  //房间id
  _roomID: string = "";
  _roomSetting: IRoomSetting = null;
  _updateRoomIDWhenChangeRoom: boolean = true;
  onLoad() {
    this.bindInit();
    this.closer = this.closer || this["btn"].btnCloser;
    if (this.closer) {
      util.bindClickEventFX(this.closer.node, this.closerClick.bind(this));
    }

    if (this.closerBG) {
      const uiTrans = this.closerBG.getComponent(UITransform);
      uiTrans.setContentSize(size(6000, 3000));
      this.closerBG.node.setSiblingIndex(0);
      // if (!constConfig.showNewHall) {
      util.bindClickEventFX(this.closerBG.node, this.closerClick.bind(this));
      // }
      this.bgBlocker = this.closerBG.node;
    }

    this.isFullScreenScene = this.uiOpenEffect == EUIOpenEffect.popFromBottom;
    // if (this.isFullScreenScene) {
    let widget = this.node.getComponent(Widget);
    if (widget && (this.uiType == EUIType.popUp || this.uiType == EUIType.popUpNoHidePrePopup)) {
      const uiTrans = this.node.getComponent(UITransform);
      const winSize = view.getVisibleSize();
      if (uiController.getInstance().isHightScreenMode() && this.isFullScreenScene) {
        uiTrans.height = winSize.height / 1.07;
        if (uiController.getInstance().isDynamicIsland()) {
          let mainNode = util.findEX("main", this.node);
          if (mainNode) {
            let tmpSafeArea = mainNode.getComponent(SafeArea);
            if (tmpSafeArea && tmpSafeArea.enabled) {
            } else {
              uiTrans.height -= 20;
            }
          } else {
            uiTrans.height -= 20;
          }

        }
      } else {
        uiTrans.height = winSize.height;
      }
      if (this.isFullScreenScene) {
        uiTrans.width = 1080;
      }

      this.node.getComponent(UITransform).setContentSize(uiTrans.contentSize);
      widget.enabled = false;
      widget.destroy();
      if (this.uiOpenEffect == EUIOpenEffect.popFromLeft && uiController.getInstance().isDynamicIsland()) {
        let mainNode = util.findEX("main", this.node);
        if (mainNode) {
          //let tmpWidget = mainNode.getComponent(Widget);
          let tmpSafeArea = mainNode.getComponent(SafeArea);
          if (tmpSafeArea) {
            for (let child of mainNode.children) {
              let tmpWidget = child.getComponent(Widget);
              if (tmpWidget) {
                if (tmpWidget.isAlignTop) {
                  setTimeout(() => {
                    tmpWidget.top -= 30;
                    tmpWidget.updateAlignment();
                  }, 200);
                }
              }
            }
          }
        }
      }
    }
    // }

    if (this.uiType == EUIType.fullScreen) {
      this.node.getComponent(UITransform).setContentSize(view.getVisibleSize());
    }

    this.createInit();

    if (this["btn"].btnCancel && (this.uiType == EUIType.popUp || this.uiType == EUIType.popUpNoHidePrePopup)) {
      let key = this["btn"].btnCancel.node["_id"]
      let btnCanelAddEvent = dataController.getInstance().uiData.btnCanelAddEvent && !!dataController.getInstance().uiData.btnCanelAddEvent[key];
      //console.log("key  btnCanelAddEvent", key, btnCanelAddEvent)
      if (!btnCanelAddEvent) {
        util.bindClickEventFX(this["btn"].btnCancel.node, () => {
          this.closerClick();
        });
      }

    }

    //宽模式横向推展
    if (uiController.getInstance().isWidthScreenMode()) {
      let width = this.node.parent.getComponent(UITransform).width;
      width = Math.min(width, 1440);
      this.node.getComponent(UITransform).width = width;
    }
    //长模式竖向推展
    if (
      uiController.getInstance().isHightScreenMode() &&
      this.uiOpenEffect != EUIOpenEffect.popFromBottom &&
      this.uiType != EUIType.widget
    ) {
      let height = this.node.parent.getComponent(UITransform).height;
      this.node.getComponent(UITransform).height = height;
    }
  }

  bindInit() {
    util.bindNode(this, this.node);
  }

  /**
   * 创建时候init
   */
  createInit() { }

  /**
   * 关联init后事件
   * @param rCaller
   */
  setAfterInit(rCaller: ICallback) {
    this._afterInitCallBack = rCaller;
  }

  hideMaskAni() {
    if (this.closerBG) {
      this.closerBG.node.active = false;
      let copyMask = instantiate(this.closerBG.node);
      copyMask.active = true;
      let curSlibingIndex = this.node.getSiblingIndex()
      copyMask.parent = this.node.parent;
      copyMask.setSiblingIndex(curSlibingIndex);
      let opacity = copyMask.getComponent(UIOpacity);
      opacity.opacity = this.isFullScreenScene ? 0 : 150;
      tween(opacity)
        .to(this.hideAniTime, { opacity: 0 }, { easing: "sineOut" })
        .call(() => {
          copyMask.destroy();
          this.closerBG.node.active = true;
        })
        .start();
    }
  }

  showMaskAni() {
    //copy a closerBG and put it on up to the node
    if (this.closerBG) {
      this.closerBG.node.active = false;
      let copyMask = instantiate(this.closerBG.node);
      copyMask.active = true;
      let curSlibingIndex = this.node.getSiblingIndex()
      copyMask.parent = this.node.parent;
      copyMask.setSiblingIndex(curSlibingIndex);
      let opacity = copyMask.getComponent(UIOpacity);
      opacity.opacity = 0;
      tween(opacity)
        .to(this.popupMaskAniTime, { opacity: this.isFullScreenScene ? 0 : 150 }, { easing: "sineOut" })
        .start();

      let leftTime = this.popupAniTime - this.popupMaskAniTime;
      if (leftTime > 0) {
        tween(opacity)
          .to(this.popupAniTime, { opacity: this.isFullScreenScene ? 0 : 150 }, { easing: "sineOut" })
          .call(() => {
            copyMask.destroy();
            this.closerBG.node.active = true;
          })
          .start();

      }
      else {
        tween(opacity)
          .to(this.popupMaskAniTime, { opacity: this.isFullScreenScene ? 0 : 150 }, { easing: "sineOut" })
          .call(() => {
            copyMask.destroy();
            this.closerBG.node.active = true;
          })
          .start();
      }
    }
  }

  protected async showInit() {
    // this.preInit();
    //全屏类强制无效果
    if (this.uiType == EUIType.fullScreen && this.uiOpenEffect != EUIOpenEffect.popFromLeftForce) {
      this.uiOpenEffect = EUIOpenEffect.none;
    }

    if (!this.isFullScreenScene && fullScreenScene.indexOf(this.uiName) != -1) {
      this.isFullScreenScene = true;
    }

    if (
      this.delayInit == EUIDelayInit.immedinate
      //  &&
      // this.uiOpenEffect != EUIOpenEffect.popFromBottom
    ) {
      this.safeCallInit();
    }

    this.showMaskAni()

    this._isReady = false;
    Tween.stopAllByTarget(this.node);
    this.node.setPosition(v3());
    const uiTrans = this.node.getComponent(UITransform);
    if (this.uiOpenEffect == EUIOpenEffect.none) {
      this._isReady = true;
      if (this.delayInit == EUIDelayInit.delay) {
        this.safeCallInit();
      }
    } else if (this.uiOpenEffect == EUIOpenEffect.popFromBottom || this.uiOpenEffect == EUIOpenEffect.popFade) {
      let isFade = this.uiOpenEffect == EUIOpenEffect.popFade;
      // uiTrans.width = 1080
      let scale = uiController.getInstance().isHightScreenMode() ? 1.07 : 1;
      this.node.setScale(scale, scale, 1);

      if (isFade) {
        this.node.position = v3(0, -100);
      }
      else {
        this.node.position = v3(0, -view.getVisibleSize().height);
      }
      let y = uiController.getInstance().isHightScreenMode() ? -50 : 0;
      if (uiController.getInstance().isDynamicIsland()) {
        y = -60;
      }
      let mainNode = util.findEX("main", this.node);
      if (mainNode) {
        let tmpSafeArea = mainNode.getComponent(SafeArea);
        if (tmpSafeArea && tmpSafeArea.enabled) {
          y = 0
        }
      }
      if (isFade) {
        let opacity = this.node.getComponent(UIOpacity);
        if (opacity == null) {
          this.node.addComponent(UIOpacity);
          opacity = this.node.getComponent(UIOpacity);
        }
        opacity.opacity = 0;
        tween(opacity)
          .to(this.popupAniTime, { opacity: 255 }, { easing: "sineOut" })
          .start();
      }
      tween(this.node)
        .to(this.popupAniTime, { position: v3(0, y) }, { easing: "sineOut" })
        .call(() => {
          this._isReady = true;
          if (this.delayInit == EUIDelayInit.delay) {
            this.safeCallInit();
          }
        })
        .start();
    } else if (this.uiOpenEffect == EUIOpenEffect.popFromTop) {
      let scale = uiController.getInstance().isHightScreenMode() ? 1.07 : 1;
      this.node.setScale(scale, scale, 1);
      this.node.position = v3(0, view.getVisibleSize().height);

      let y = uiController.getInstance().isHightScreenMode() ? 50 : 0;
      if (uiController.getInstance().isDynamicIsland()) {
        y = 60;
      }
      tween(this.node)
        .to(this.popupAniTime, { position: v3(0, y) }, { easing: "sineOut" })
        .call(() => {
          this._isReady = true;
          if (this.delayInit == EUIDelayInit.delay) {
            this.safeCallInit();
          }
        })
        .start();
    } else if (
      [
        EUIOpenEffect.popFromLeft,
        EUIOpenEffect.popFromLeftForce,
        EUIOpenEffect.popFromRight,
        EUIOpenEffect.popFromLeftForce,
      ].indexOf(this.uiOpenEffect) != -1
    ) {
      this.node.position = v3(
        this.uiOpenEffect == EUIOpenEffect.popFromLeft ||
          this.uiOpenEffect == EUIOpenEffect.popFromLeftForce
          ? 500
          : -500,
        0,
      );
      tween(this.node)
        .to(this.popupAniTime, { position: v3(0, 0) }, { easing: "sineOut" })
        .call(() => {
          this._isReady = true;
          if (this.delayInit == EUIDelayInit.delay) {
            this.safeCallInit();
          }
        })
        .start();
    } else {
      this.node.setScale(0.7, 0.7, 1);
      tween(this.node)
        .to(this.popupAniTime, { scale: v3(1, 1, 1) }, { easing: "backOut" })
        .call(() => {
          this._isReady = true;
          if (this.delayInit == EUIDelayInit.delay) {
            this.safeCallInit();
          }
        })
        .start();
    }
  }

  safeCallInit() {
    this.preInit();
    this.init();
    if (this.uiType == EUIType.popUp) {
      uiController.getInstance().pushUIToBackQueue(this);
    }
    this.afterInit();
  }

  /**
   * 弹出时候触发
   */
  init() { }

  /**
   * init前执行的轻量级别layout切换代码
   */
  preInit() { }

  afterInit() {
    this.scheduleOnce(() => {
      if (this._afterInitCallBack) {
        this._afterInitCallBack();
      }
    }, 0.2);
  }

  //刷新消息前
  preRefreshMessage(rMessage: any) { }
  // //刷新消息
  refreshMessage(rMessage: any) {
    //刷新消息
    this.onMessage(rMessage);
  }

  //刷新消息前
  endRefreshMessage(rMessage: any) { }

  onMessage(rMsg: any) { }

  //显示ui
  show() {
      this.bindInit();
      this._isHide = false;
      this.node.active = true;
      util.setVis(this.node, true, true);
      //默认show时候触发init
      this.showInit();
    return this;
  }

  //关闭后回调
  setCallBack(rCaller: ICallback) {
    this.closeCallback = rCaller;
  }

  preHide() {
    let queue = uiController.getInstance()._uiQueue.filter((v) => v.isFullScreenScene);
    let lastPop: uiBase = null;
    if (this.isFullScreenScene) {
      if (queue.length > 1) {
        lastPop = queue[queue.length - 2];
      }
    }
    if (queue.length == 1 && this == queue[0]) {
      if (uiController.getInstance().curOpenUIName == "mainWindow") {
        lastPop = uiController.getInstance().curOpenUI;
      }
    }

    if (lastPop && lastPop.node.position.x != 0) {
      let pos = lastPop.node.getPosition();
      lastPop.node.setPosition(v3(0, pos.y));
      util.setVis(lastPop.node, true, true);
      console.log(lastPop);
    }
  }

  showHideAniWhenCloserClick = true;
  ShowHideAni(callback) {
    if (!this.showHideAniWhenCloserClick) {
      callback();
      this.showHideAniWhenCloserClick = true;
      return;
    }
    if (!this.showHideAni) {
      callback();
    }
    else {
      this.hideMaskAni()
      if (this.uiOpenEffect == EUIOpenEffect.none) {
        callback();
      }
      else if (this.uiOpenEffect == EUIOpenEffect.popFromBottom || this.uiOpenEffect == EUIOpenEffect.popFade) {
        let isFade = this.uiOpenEffect == EUIOpenEffect.popFade;
        if (isFade) {
          let opacity = this.node.getComponent(UIOpacity);
          if (opacity == null) {
            this.node.addComponent(UIOpacity);
            opacity = this.node.getComponent(UIOpacity);
          }
          tween(opacity)
            .to(this.hideAniTime, { opacity: 0 }, { easing: "sineOut" })
            .start();
        }
        tween(this.node)
          .to(this.hideAniTime, { position: v3(0, -view.getVisibleSize().height) }, { easing: "sineIn" })
          .call(() => {
            callback();
          })
          .start();
      } else if (this.uiOpenEffect == EUIOpenEffect.popFromTop) {
        let y = uiController.getInstance().isHightScreenMode() ? 50 : 0;
        if (uiController.getInstance().isDynamicIsland()) {
          y = 60;
        }
        tween(this.node)
          .to(this.hideAniTime, { position: v3(0, view.getVisibleSize().height) }, { easing: "sineIn" })
          .call(() => {
            callback();
          })
          .start();
      } else if (
        [
          EUIOpenEffect.popFromLeft,
          EUIOpenEffect.popFromLeftForce,
          EUIOpenEffect.popFromRight,
          EUIOpenEffect.popFromLeftForce,
        ].indexOf(this.uiOpenEffect) != -1
      ) {
        tween(this.node)
          .to(this.hideAniTime, {
            position: v3(this.uiOpenEffect == EUIOpenEffect.popFromLeft || this.uiOpenEffect == EUIOpenEffect.popFromLeftForce
              ? 500
              : -500, 0)
          }, { easing: "sineIn" })
          .call(() => {
            callback();
          })
          .start();
      }
    }
  }

  //隐藏ui
  hide() {
    // uiController.getInstance().hide('widgetDropList')
    if (this._isHide) return;
    this._isHide = true;

    this.ShowHideAni(() => {
      this.preHide();
      if (this.uiType == EUIType.popUp) {
        uiController.getInstance().popUIToBackQueue(this);
        if (this.uiName == "clubMain") {
          if (uiController.getInstance().uiAllInstance["mainWindow"])
            uiController.getInstance().uiAllInstance["mainWindow"].fresh_backToMainwinow();
        }
      }

      if (this.closeCallback) {
        this.closeCallback(this.callBackData);
      }
      if (this.callBackData && this.callBackData.clearNow) {
        this.callBackData = null;
      }
      //关闭ui时候清空callback
      if (this.closeCallback) {
        this.setCallBack(null);
      }
      game.emit("switcherTouchEnd")
      game.emit("switcherRangeTouchEnd")

      Tween.stopAllByTarget(this.node);
      this.node.position = v3(100000, 100000);

      // if (uiController.getInstance().commonUI.indexOf(this.uiName) == -1) {
      //     this.node.active = false;
      // }

      util.setVis(this.node, false, true);
      // this.node.active = false;

    })
  }

  isShow() {
    return this.node && this.node.active && !this._isHide;
  }

  //click 點上
  closerClick() {
    console.log("closerClick");
    if (this._isReady) {
      // audioController.getInstance().playFX("button");
      this.hide();
    }
  }

  setUIData(params: any) {
    if (params && params.roomID) {
      this.setRoomID(params.roomID);
    }
  }

  isFlash() {
    return false
  }

  setRoomID(rRoomID: string) {
    if (uiController.getInstance().commonUI.indexOf(this.uiName) != -1) {
      if (this._roomID != rRoomID) {
        this.node.getComponentsInChildren(widgetList).map((v) => v.setData([]));
      }
    }

    this._roomID = rRoomID;
    this._roomSetting = util.explainRoomID(rRoomID);
  }

  getRoomID(): string {
    return this._roomID;
  }

  getNode(): Node {
    return this.node;
  }

  onComeback() { }

  destory() {
    // this.getComponentsInChildren(uiBase).map(v=>{
    //     util.setVis(v.node,true,true)
    // })
    // util.setVis(this.node,true,true)
    this.node.destroy();
  }

  /**
   * 最小化时候，整理ui尺寸
   */
  normalizeBGBlockerSize() {
    if (uiController.getInstance().isWidthScreenMode()) {
      let width = this.node.parent.getComponent(UITransform).width;
      width = Math.min(width, 1440);
      this.node.getComponent(UITransform).width = width;
    }

    if (this.bgBlocker) {
      let uiTrans = this.bgBlocker.getComponent(UITransform)
      uiTrans.setContentSize(this.node.parent.getComponent(UITransform).contentSize);
      uiTrans.height = 3000;
    }

    if (this.closerBG) {
      let uiTrnas = this.closerBG.getComponent(UITransform)
      uiTrnas.setContentSize(this.node.parent.getComponent(UITransform).contentSize);
      uiTrnas.height = 3000;
    }
  }

}
