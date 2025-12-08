import { _decorator } from 'cc';
export interface ISpoolObject{
    Init( rParent );
    Release( rParent );
}
export interface IResourceCallback {
    ( obj : ISpoolObject ) : void
}