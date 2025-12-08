import { Color } from "cc";

export default class constConfig {
  /**道具 路径*/
  static shopItemPath: string = 'ui/shopItem/'
  static preLoadPoker = ['cardOpoker', 'cardPoker', 'cardSpoker', 'cards0b', 'cards0c', "cards2", "cards3"];
  static cardsNames = ["cards/bpoker_", "cards/poker_", "cards/opoker_", "cards/cpoker_", "cards/s2_poker_", "cards/s3_poker_"];
  static blackJackCardsNames = ["blackJack/cards1", "blackJack/cards1", "blackJack/cards1", "blackJack/cards2", "blackJack/cards3", "blackJack/cards4"];
  static smallCardsBG = ["cards/spoker_0b", "cards/spoker_0b", "cards/spoker_0b", "cards/spoker_0c", "cards/spoker_0_s2", "cards/spoker_0_s3"];
  static defaultCard = "cards/bpoker_"
  static blackJackAniBG = ["bj_poker/puke_cards1", "bj_poker/puke_cards1", "bj_poker/puke_cards1", "bj_poker/puke_cards1", "bj_poker/puke_cards2", "bj_poker/puke_cards3"];
  static blackJackAniPAI = ["bj_poker/paihe_b_cards1", "bj_poker/paihe_b_cards1", "bj_poker/paihe_b_cards1", "bj_poker/paihe_b_cards1", "bj_poker/paihe_b_cards2", "bj_poker/paihe_b_cards3"];
  static blackJackAniJISHEN = ["bj_poker/ji_shen_b_cards1", "bj_poker/ji_shen_b_cards1", "bj_poker/ji_shen_b_cards1", "bj_poker/ji_shen_b_cards1", "bj_poker/ji_shen_b_cards2", "bj_poker/ji_shen_b_cards3"];



  static OFC_DATAKEYS = ["hands", "fantasy", "refantasy", "fish"];
  static COLOR_YELLOW = new Color(231, 150, 69);
  static COLOR_GREEN = new Color(41, 205, 153);
  static COLOR_RED = new Color(233, 47, 47);

  static LOBBY_UNIONID = 27;
  static GAMETYPE_POKER = 0;
  static GAMETYPE_TGAME = 0;

  static SHOW_NNCHIP: boolean = true;
  //当后台回来后抛出的事件
  static TOUCH_RESET_SHOW: string = "TOUCH_RESET_SHOW";
  static FLASHSTARTID: number = 80;;

  static Permission_sendOutChip_ban: string = "sendOutChip_ban";
  static Permission_tradeRecord_ban: string = "tradeRecord_ban";
  static Permission_claimBackChip_ban: string = "claimBackChip_ban";
  static Permission_memberList_ban: string = "memberList_ban";
  static Permission_sendGift_ban: string = "sendGift_ban";
  static Permission_changeMemberRole_ban: string = "changeMemberRole_ban";
  static Permission_acceptNewMember_ban: string = "acceptNewMember_ban";
  static Permission_deleteMember_ban: string = "deleteMember_ban";
  static Permission_viewData_ban: string = "viewData_ban";
  static Permission_exportData_ban: string = "exportData_ban";
  static Permission_downlineChange_ban: string = "downlineChange_ban";
  //createTable_ban": 1, // 创建牌桌功能，默认有权限
  // "editNotice_ban": 1, // 修改俱乐部公告功能，默认有权限
  // "editProfile_ban": 1, // 修改俱乐部简介功能，默认有
  static Permission_createTable_ban: string = "createTable_ban";
  static Permission_editNotice_ban: string = "editNotice_ban";
  static Permission_editProfile_ban: string = "editProfile_ban";
  static Permission_jackpotSet_ban: string = "jackpotSet_ban";
  static Permission_unionSet_ban: string = "unionSet_ban";

  static USER_Items: Array<Number> = [1, 3, 8];

  static skipError: number[] = [
    4146,
    1394, // 1394 后端不改他的逻辑，让前端跳过不显示 29660
    1393, // 先忽略，之后改好再放出来
    1137, // https://apredmine.topwhitech.com/issues/30648
    4161,
    7004, //提款密码错误
    7005, //提款被锁
    4195, //要特殊处理
    6012, // flash这类型房间不能直接加入,
    4202, //充值数据对不上
    4203, //充值数据已过期
  ];
  static showNewHall: boolean = true;
  /**
   *6花 用来显示 创建的开关
  */
  static CMS_Lucky6Set8Player = "Lucky6Set8Player";
  /**
   *flash 用来显示 创建的开关
  */
  static CMS_FLASH = "Flash";
  /**
   * sikip 用来显示 创建的开关
  */
  static CMS_SIKIPI = "Sikipi";
  /**
 * SLOT 用来显示 创建的开关
*/
  static CMS_SLOT = "Slot";
  /**
 * VPLUS 用来显示 创建的开关
*/
  static CMS_VPLUS = "VPLUS";
  /**
* SixPlusNLO 用来显示 创建的开关
*/
  static CMS_SIXPLUSNLO = "SixPlusNLO";
  /**
 * BACCARAT 用来显示 创建的开关
*/
  static CMS_BACCARAT = "Baccarat";
  /**
 * AFO 用来显示 创建的开关
*/
  static CMS_AFO = "AFO";

  /**
 * shortdesk 用来显示 创建的开关
*/
  static CMS_SHORTDESK = "SixPlusNLO";
}
