//回调结构
import {IUIBase} from "./base";

export interface ICallback{
    ( rResult?: any ) :void
}

export interface ICallbackWherUICreated{
    ( rResult?: IUIBase ) :void
}

export interface IFilter{
    ( rItem: any ) :boolean
}

export interface IChecker{
    ( ) :boolean
}

//状态机
export interface IStateMethod {
    ( rStat : any ) :void
}

//状态跳转检查
export interface IStateTransChecker {
    ( rPreStat : number ) : boolean
}


export interface IPattern{
    ( rItem: any ) :string
}