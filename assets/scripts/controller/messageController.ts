import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import { EMessageType } from "../interface/enum";
import {ICallback} from "../interface/action";
// //消息分发器

@ccclass('MessageController')
export default class messageController extends Component {

    messageHandler : any = {};

    static _instance : messageController;
    public static getInstance (){
        return messageController._instance ;
    }

    constructor (){
        super();
        this.messageHandler = {};
    }

    onLoad () {
        messageController._instance = this;
    }

    checkProcessList(){
        let keys = Object.keys(this.messageHandler);
        for (let index = 0; index < keys.length; index++) {
            const i = keys[index];
            if( this.messageHandler[i] )
                console.warn(">>>>>> message " + EMessageType[i] + " c:" + this.messageHandler[i].length);
        }
    }
    
    dispatch ( rEvent :EMessageType , rMsg : any){
        if( this.messageHandler[rEvent] ){
            this.messageHandler[rEvent].map(
                (handler)=>{
                    try {
                        handler(rMsg);
                    } catch (error) {
                        console.log("abnormal dispatch" ,error);
                    }
                }
            );
        }
    }

    observe ( rEvent:EMessageType, rHandler : ICallback){
        if( this.messageHandler[rEvent] == null ){
            this.messageHandler[rEvent] = [];
        }

        var index = this.messageHandler[rEvent].findIndex((e)=>{
            return e == rHandler;
        });

        if( index >= 0 ){
            console.log("observe return");
            return this.messageHandler[rEvent][index];
        }

        this.messageHandler[rEvent].push(rHandler);

        return rHandler;
    }
    
    remove ( rEvent:EMessageType , rHandler:ICallback){
        if( this.messageHandler[rEvent] == null ){
           return;
        }

        var index = this.messageHandler[rEvent].findIndex((e)=>{
            return e == rHandler;
        });

        if( index >= 0 ){
            this.messageHandler[rEvent].splice(index,1);
        }
    }

    removeAllByEvent ( rEvent:EMessageType ){
        if( this.messageHandler[rEvent] == null ){
           return;
        }

        for (let index = 0; index < this.messageHandler[rEvent].length; index++) {
            this.messageHandler[rEvent][index] = null
        }
        this.messageHandler[rEvent] = null;
    }
}
