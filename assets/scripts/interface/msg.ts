// //聊天信息

import { _decorator } from 'cc';
export interface IChatMsg {
    playerID : string ,
    displayID : string,
    msg : string,
    watcher : boolean ,
    iconID : string ,
    msgType : number ,//0=text , 1=mp3
    time : number, //timestamp
    roomID: string,
    length? :number 
}
