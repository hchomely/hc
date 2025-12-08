enum EOperatorStat {
  normal = 0, //正常
  allin = 1,
  fold = 2, //
}

enum ERoletype {
  none = 0, //没角色
  d = 1, //庄家
  s = 2, //小盲
  b = 3, //大盲
}

/**
 * 玩家控件类型
 */
enum EWidgetPlayerType {
  normal = 0, //正常
  seat = 1,
  invisable = 2, //
  empty = 3,
}

/**
 * 玩家状态条状态
 */
enum EStatboardType {
  leave = -1, //离开
  none = 0, //没状态
  check = 1, //过牌
  allin = 2, //晒冷啊
  call = 3, //跟
  fold = 4, //盖牌
  raise = 5, //加注
  new = 6, //新玩家
  bet = 7, //bet加注
  sBlind = 8, //小盲 ,角色状态
  sBigBlind = 9, //大盲 ,角色状态
  newSitIn = 10, //过牌
  straddle = 11,
  loading = 98, //loading
  sitOut = 99, //过渡优先状态，在 game_seat { sitout = true , = false }
}

enum ECardType {
  normal,
  private, //自己的大牌
  public, //公共牌
}

enum EMessageType {
  playCardEffect,
  restoreCardEffect,
  checkCardType,
  openUI, //消息方式打開ui
  networkDown,
  networkRestore,
  facebookLogin,
  loadingProgress,
  hotUpdate,
  backKeyUp,
  TrigerHandsetViber,
  TrigerTimer,
  nativeGpsStat,
  nativeLocation,
  homeStart, //监测home出去事件
  homeBack, //监测home返回事件
  payCallback, //支付回到
  switchRoom, //
  gameRoleDChange, //玩家庄移动
  inSeatChanging, //玩家座位变动
  jackpotRefresh, //jackpot推送刷新
  unionLeave, //离开联盟
  debug, //触发测试
  closeWidget, //关闭widget层上挂载的控件ui节点
  gameFull, //游戏4分屏放大
  gameScale, //游戏4分屏缩小
  gameCenter, //gameCenter消息
  newGameOpen, //新游戏打开
  refreshNameBorder, //刷新牌桌名牌，结构 { playerID : xxx }
  refreshCardStyle, //刷新卡片样式
  // closeAllPopui,  //关闭popui
  playVoice, //播放开始
  endVoice, //播放结束
  endOFGame,
  closePingClient, //关闭未完成的pingclient
  refreshClubMainIngame,
  logout, // 玩家登出
  GameCenterAddButtonActive, //刷新gamecenter add按钮的控制消息
  switchBBChip,
  themeChange,
  AppleSignIn,
  /**海报改变 */
  posterChange,
  /*分享回调*/
  shareBack,
  preBet,
  settingChanged,
  refreshGameStatistic,
  chatroom,
  VIPCHANGE,
  OpenClub,
  Event_ButtonClick, //按钮点击事件
  webMulWinCustomEvent, //多窗口自定义事件
  onVplusClose, //mobile web vplus关闭事件
  updateNotice, //更新notice item
  notifyExitAllGames, //提示通知退出所有游戏
  notifyExitOneGames, //提示通知退出某个游戏
}

enum EConnectMode {
  gate = 0, //断线，重连模式
  normal = 1, //connecter模式
}

//EClubDuty
enum EClubDuty {
  common = 0, //一般会员
  agent = 10, //代理（subAgent）
  superagent = 20, //代理头
  manager = 30, //经理
  chairman = 90, //主席
}

//比赛类型1=holdem（德州），2=Short Deck, 3=OFC, 4=PLO-4，5=PLO-5 ，100=MTT, 200=SNG（高位是联赛类型，低位是游戏玩法 ，如mtt - 德州 101 ，mtt - short deck = 102）99-newAdd(client defined)
enum EMatchType {
  none = 0, //holdem（德州）
  holdem = 1, //holdem（德州）
  shortDesk = 2, //short desk
  OFC = 3,
  plo4 = 4, //plo-4
  plo5 = 5, //plo-5
  plo6 = 6,
  sdk_plo = 8, //sdk - plo
  nlo4 = 14,
  nlo5 = 15, //nlo-5
  nlo6 = 16, //nlo-6
  sdk_nlo4 = 17, //sdk + nlo4
  //cowBoy=9,
  SCH = 9,
  Baccarat = 50,
  Bull = 51,
  BlackJack = 52,
  MataAces = 53,
  Rodeo = 54, //  德州牛仔
  SLOT = 55, // SLOT
  VPLUS = 56, // VPLUS
  SSZ = 60, // 十三支
  PokerMaster = 61, // PokerMaster
  Lucky6 = 66, // 六花
  SouthernPoker = 67, //南方poker
  Sikipi = 65, //Sikipi
  FLASHNLH = 81, // NLH_flash
  FLASHPLO4 = 84, // PLO4_flash
  FLASHPLO5 = 85, // PLO5_flash
  MataMixed = 97,
  mixed = 98, // mixed game
  mtt = 100, //mtt联赛类型
  sng = 200, //SNG联赛类型
  spin = 400, //SPIN联赛类型
  tlt = 500, //限时锦标赛类型
  newAdd = 99,
  /**十三支-菲律宾*/
  SSZPH = 4060, // 十三支-菲律宾
  /**十三支-台湾*/
  SSZTW = 5060, // 十三支-台湾
  /**十三支-越南*/
  SSZVN = 6060, // 十三支-越南
  AOFHOLDEM = 3001, // nlh aof玩法
  AFONLO4 = 9014, // nlo4 aof玩法
  AFONLO5 = 9015, // nlo4 aof玩法
  AFONLO6 = 9016, // nlo4 aof玩法
  SLOT_1 = 50055, // slot
  Leaderboard = 123321, //排行榜
}

/**
 * ui類型
 */
enum EUIType {
  fullScreen = 0, //全屏唯一ui（ 打開前會關閉其他全屏ui,除强制打开效果 ）
  popUp, //疊加ui,需手動關閉, 带背景，点解背景关闭ui
  tips, //叠加ui，需手动关闭
  widget, //
  top, //常驻消息类ui，如断线，debug ui
  popUpNoHidePrePopup, //弹出ui,打开前不关闭其他popui
}

/**
 * ui打开效果，留意全屏类会强制none类型
 */
enum EUIOpenEffect {
  none,
  popFromLeft,
  popByScale,
  popFromLeftForce,
  popFromRight,
  popFromBottom,
  popFromTop,
  popFade,
}

/**
 * ui执行init时机
 */
enum EUIDelayInit {
  immedinate,
  delay,
}

/*
 * Data 1 or 7 or 14 days
 */
enum EClubData {
  _1day = 1, //一天
  _7days = 2, //两天
  _3days = 3, //三天
}

/**
 * 查看邮件类型
 */
enum EMailType {
  All = 2, //全部邮件
  System = 0, //系统邮件
  Club = 1, //俱乐部邮件
  Alert = 3, //告警
}

/**
 * 网络执行状态
 */
enum ENetworkStat {
  offline = 1, //离线状态，未登陆时候
  connected2Gate = 2, //连上gate，gateHandler调用后
  connected2Connecter = 3, //连接上connecter,连接上connector
  inGameCenter = 4, //在游戏大厅里
  inRoom = 5, //在游戏房
  inRoomReady = 6, //游戏ready状态(废弃)
  outOfApp = 7, //home出去，离开状态，
  disconnect = 8, //网络断线中
  retry = 9, //重连中
  retrying = 10, //尝试连接connecter
  changeGate = 11, //切换出去网关
  changeRoom = 12, //切换房间
  fastConnect = 13, //断时候切回来后，进行重新获取房间信息 & reenter
  inited = 99, //进入游戏初始状态,什么都不做
}

/**
 * 坐的位置
 */
enum EDeskPosition {
  left = 1,
  leftLower,
  right,
  rightLower,
  center,
}

/**
 * 热更新进程
 */
enum EHotUpdateStat {
  none,
  initlize,
  checkUpdate, //检查更新
  downloading, //下载中
  fatalError, //致命错误
  fatalErrorInDown, //致命错误
  fatalErrorInLocal, //致命错误
  finished, //更新成功
}

enum ELanguage {
  English,
  TrtChinese, //繁体中文
  Vietnamese, //越南语
  Portuguese, //葡萄牙语
}

/**
 * 小键盘类型
 */
enum EPadType {
  normal,
  skipDot,
}

/**
 * newLobby下方按钮
 */
enum NewLobbyBtnBelowType {
  CLUB = 0,
  NLH = 1,
  MTT = 2,
  CASINO = 3,
  SHOP = 4,
}

/**
 * mainWindow下方按钮
 */
enum BtnBelowType {
  LOBBY,
  MTT,
  CLUB,
  CAREER,
  SHOP,
}

/**
 * 游戏阶段
 */
enum EGameState {
  GAME_OVER = 0,
  INIT = 1,
  BIG_BLIND = 2,
  PREFLOP = 3,
  FLOP = 4,
  TURN = 5,
  RIVER = 6,
  SHOWDOWN = 7,
}

enum EGameStateOFC {
  GAME_OVER = 0,
  INIT = 1,
  TURN1ST = 2,
  TURN2ND = 3,
  TURN3RD = 4,
  TURN4TH = 5,
  TURN5TH = 6,
  TURNFANTASY = 7,
  SHOWDOWN = 8,
}

/**
 * Blinds Structure 界面UI 按钮
 */
enum EBlindsType {
  Standard = 1,
  Turbo = 2,
  HKPPA = 3,
  AnteOnly = 4,
  AnteOnlyTurbo = 5,
}

/**
 * mtt报名状态
 */
enum EMTTInMatch {
  NoRegister = 0,
  WaitConfirm = 1,
  NotThisClub = 2, //玩家注册的工会id不一致
  Success = 3,
}

/**
 * 联盟 身份
 */
enum EUnionDutyType {
  Member = 0, //成员
  Originator = 1, //创建者
}

/**
 * mtt 管理进程状态
 */
enum EMTTManagerStat {
  Waitting = 0,
  Starting = 1,
  Rebuy = 2,
  Addon = 3,
  Middle = 4,
  Bubble = 5,
  Money = 6,
  Gameover = 7,
}

/**
 * 特殊工会效果
 */
enum ESPClub {
  none = 0, //holdem（德州）
  hkpp = 1,
}

/**
 * 进度条刻度显示模式
 */
enum EProgressTagMode {
  show = 1,
  hide = 2,
  interval = 3,
}

/**
 * native 操作
 */
enum ENativeFunction {
  GPS,
  FacebookLogin,
  GoogleLogin,
  Imagepacker,
  CameraCapture,
  Voice,
  Push,
  HardwareInfo,
  ImagepackerEnhance,
  PaymentUpdate,
  HttpsUpdate,
  Baccarat,
  ShareLink,
}

enum EChildEvent {
  confirm = 1,
  cancel = 2,
  timeout = 3,
  setData = 4,
}

enum ENodeInQueue {
  out = 1,
  in = 2,
}

/**
 * 选择图片类型
 */
enum EImagePickerType {
  FaceIcon,
  AdvertisementTitle,
  AdvertisementDetail,
}

/**
 * 信息box的类型，Confirm 确定&取消，Info
 */
enum EConfirmBoxType {
  Confirm, //确认or取消，只有在确认才回掉
  Info, //通知信息，只有confirm
  Force, //强制显示，ui打开后不会离开 for强制更新使用
  JustCanConfirm, //只能确认
  ConfirmOrCancel, //确认或者取消均返回
  ConfirmTopCancle, //确认右上角取消均返回
}
enum EConfirmBoxCancleType {
  CANCLE_CONFIRM, //取消按钮
  CANCLE_X, //右上角X按钮
}
/**
 * 弹出公告
 */
enum EUpgradeBoxType {
  Daily = 0, ////0=例行公告，每天弹一次，1=强制更新恢复，2=强制弹url
  Force = 1,
  Url = 2,
}
/**
 * toggle是checkBox或者RadioButton
 */
enum EToggleType {
  CheckBox = 0,
  RadioButton = 1,
}

enum EGameCenterState {
  Init = 1,
  Running, //开始自检roomList
  Changing, //调整roomList
  enterRoom, //增加房间
  AddRoom, //增加房间
  RelaseRoom, //释放资源
  ChangeRoom, //改变房间id
  WaittingChangeRoom, //等待改变房间
  Suppend,
  gobackToClub, //没晒房了，回退到公会
  showGameStats, //播放游戏结算
  confirmTakeseat, //发送确认Takeseat信息
}

enum ECardColorType {
  FourColorCard = 0,
  TwoColorCard = 1,
}

enum BETTYPENAME {
  PWIN = 0, //閒胜
  BWIN, //庄胜
  DRAW, //平手
  SMALL, //小
  BIG, //大
  PPAIR, //閒对
  BPAIR, //庄对
  LUCKY6, //lucky6
  SUPER6, //super6
}

enum BULLPATTERNS {
  NONE = 0, //無牛
  BULL1 = 1, //牛1
  BULL2 = 2, //牛2
  BULL3 = 3, //牛3
  BULL4 = 4, //牛4
  BULL5 = 5, //牛5
  BULL6 = 6, //牛6
  BULL7 = 7, //牛7
  BULL8 = 8, //牛8
  BULL9 = 9, //牛9
  BULLBULL = 10, //牛牛
  BULLS5 = 15, //5牛
}

export {
  ERoletype,
  EStatboardType,
  EOperatorStat,
  EWidgetPlayerType,
  ECardType,
  EMessageType,
  EConnectMode,
  EClubDuty,
  EMatchType,
  EUIType,
  EClubData,
  EMailType,
  ENetworkStat,
  EDeskPosition,
  EUIOpenEffect,
  EUIDelayInit,
  EHotUpdateStat,
  ELanguage,
  EPadType,
  NewLobbyBtnBelowType,
  BtnBelowType,
  EGameState,
  EBlindsType,
  EUnionDutyType,
  EMTTManagerStat,
  EMTTInMatch,
  ESPClub,
  EProgressTagMode,
  ENativeFunction,
  EImagePickerType,
  EConfirmBoxType,
  EConfirmBoxCancleType,
  EGameStateOFC,
  EToggleType,
  EGameCenterState,
  ECardColorType,
  EChildEvent,
  ENodeInQueue,
  EUpgradeBoxType,
  BETTYPENAME,
  BULLPATTERNS,
};
