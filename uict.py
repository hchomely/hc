from importlib.resources import path
import json
import string
import sys
import time
import os
import subprocess  
import platform

def is_windows():
    return platform.system() == "Windows"
  
def get_git_username():  
    try:  
        # 运行 git config 命令来获取用户名  
        result = subprocess.run(['git', 'config', '--get', 'user.name'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)  
        if result.returncode == 0:  
            # 如果命令成功执行，返回用户名  
            return result.stdout.decode('utf-8').strip()  
        else:  
            # 如果命令执行失败，打印错误信息并返回 None  
            print(f"Error running git config: {result.stderr.decode('utf-8')}")  
            return None  
    except subprocess.CalledProcessError as e:  
        # 如果发生异常，打印错误信息并返回 None  
        print(f"Error running git config: {e}")  
        return None  
  
# 获取 Git 用户名并打印  
username = get_git_username()  
if username:  
    print(f"Git username: {username}")  
else:  
    print("Failed to retrieve Git username.")


defaultNodeListPre = ["sl", "btn", "edt","node", "page", "custom", "widget", "tgc", "tg", "img"]
excludeNode =["btnBloker","btnCloser"]
skipParent=[]
Parent=[]
jsondata:any
uiname:any="123"
proertyName=[]
btnBind=""
btnFunction=""
tgBind=""
tgFunction=""
path = sys.argv[1]
creatType =0
onlyCreateUI =False
widgetName = ""
if sys.argv.__len__() == 3 and sys.argv[2]=="ui":
    onlyCreateUI = True   
if sys.argv.__len__() == 4 and sys.argv[2]=="widget":
    creatType=1
    widgetName=sys.argv[3]
if sys.argv.__len__() == 5 and sys.argv[2]=="widget"and sys.argv[4]=="ui":
    creatType=1
    onlyCreateUI = True   
    widgetName=sys.argv[3]
print(sys.argv.__len__())
print(creatType)
space ="    "
spaceFunc ="        "

def  getProperty(nodeName):
    global space
    if nodeName.startswith("node"):
        return f"{space}@property(Node)\n{space}{nodeName}: Node = null; \n"
    if nodeName.startswith("img"):
        return f"{space}@property(Sprite)\n{space}{nodeName}: Sprite = null; \n"
    if nodeName.startswith("sl"):
        return f"{space}@property(Label)\n{space}{nodeName}: Label = null; \n"
    if nodeName.startswith("btn"):
        return f"{space}@property(Button)\n{space}{nodeName}: Button = null; \n" 
    if nodeName.startswith("widget"):
        return f"{space}@property({nodeName.split('_')[0]})\n{space}{nodeName}: {nodeName.split('_')[0]} = null; \n"  
    if nodeName.startswith("edt"):
        return f"{space}@property(EditBox)\n{space}{nodeName}: EditBox = null; \n" 
    if nodeName.startswith("page"):
        return f"{space}@property(Node)\n{space}{nodeName}: Node = null; \n" 
    if nodeName.startswith("tg"):
        return f"{space}@property(Toggle)\n{space}{nodeName}: Toggle = null; \n" 
    if nodeName.startswith("custom"):
        return f"{space}@property(Node)\n{space}{nodeName}: Node = null; \n"
    return ""

def parseJson():
    global uiname
    global proertyName
    for key in range(len(jsondata)):
        tmpData = jsondata[key]
        if tmpData["__type__"]=="cc.Node":
            if '_name' not in tmpData:
                continue
            tmpName:string = tmpData["_name"]
            for preIndex in range(len(defaultNodeListPre)):
                if tmpData["_parent"]==None:
                    uiname = tmpName
                    break
                parentid = tmpData["_parent"]["__id__"]
                childrenLen =len(tmpData["_children"])
                if parentid in skipParent:
                    if childrenLen > 0 :
                        skipParent.append(tmpData["_children"][0]["__id__"]-1)
                    continue
                if tmpName.startswith(defaultNodeListPre[preIndex]) and tmpName not in excludeNode:
                    if tmpName.startswith("widget") and  childrenLen > 0:
                        skipParent.append(tmpData["_children"][0]["__id__"]-1)
                    if tmpName in proertyName:
                        print("存在相同的节点"+tmpName)
                    else:
                        proertyName.append(tmpName)
def parseJsonTargetNode(nodeName):
    global uiname
    global proertyName
    flag=False
    uiname = nodeName
    for key in range(len(jsondata)):
        tmpData = jsondata[key]
        if tmpData["__type__"]=="cc.Node":
            if '_name' not in tmpData:
                continue
            tmpName:string = tmpData["_name"]
            if flag == False:
                flag=tmpName==nodeName
                if flag == True:
                    Parent.append(tmpData["_children"][0]["__id__"]-1)
                    continue
            if flag ==False:
                continue
            parentid =tmpData["_parent"]["__id__"]
            childrenLen =len(tmpData["_children"])
            if parentid not in Parent:
                flag=False
                continue
            if childrenLen > 0:
                Parent.append(tmpData["_children"][0]["__id__"]-1)
            for preIndex in range(len(defaultNodeListPre)):
                if tmpName.startswith(defaultNodeListPre[preIndex]) and tmpName not in excludeNode:
                    if tmpName in proertyName:
                        print("存在相同的节点"+tmpName)
                    else:
                        proertyName.append(tmpName)

with open(path,"r",encoding="utf-8") as f:
    jsondata = json.loads(f.read())

def createScript_widget():
    global space
    global spaceFunc
    tmp =f"""/*******************
* author :hchomely
* create time :{time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())}
*******************/
const {"{"} ccclass, property {"}"} = _decorator;
import util from "../../controller/util";
import widgetListItem from "./widgetListItemEX";
import {"{"} Button,Node, Label,Sprite,Toggle, _decorator,EditBox {"}"} from 'cc';


@ccclass('{uiname}')
export default class {uiname} extends widgetListItem{"{"}
{checkProperty()}
{space}createInit(){"{"}//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 
{btnBind}
{tgBind}
{space}{"}"}
{space}init(){"{"}//每次打开都会执行，初始化函数

{space}{"}"}
{space}onRefreshUI(){"{"}//每次打开都会执行，初始化函数

{space}{"}"}
{btnFunction}
{tgFunction}

{"}"}"""
    return tmp
def createScript_ui():
    global space
    global spaceFunc
    global uiname
    tmpName = f"auto_{uiname}"

    # uiname=uiname[:1].upper() + uiname[1:]
    # uiname = f"ui{uiname}"
    tmp =f"""/*******************
* author :{username}
* create time :{time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())}
*******************/
const {"{"} ccclass, property {"}"} = _decorator;
import util from "../controller/util";
import uiBaseEX from "./uiBaseEX";
import {"{"} Button,Node, Label,Sprite,Toggle, _decorator,EditBox {"}"} from 'cc';
import {tmpName} from "./auto_ui/{tmpName}";

@ccclass("{uiname}")
export default class {uiname} extends {tmpName}{"{"}

{space}createInit(){"{"}//ui打开第一次的时候运行，用于绑定各种事件，btn，tg ，edt等事件 
{btnBind}
{tgBind}
{space}{"}"}
{space}init(){"{"}//每次打开都会执行，初始化函数

{space}{"}"}
{space}preInit(){"{"}//和init类似 在init之前执行

{space}{"}"}
{space}refreshUI(){"{"}//刷新函数，页面某些数据需要刷新的时候使用

{space}{"}"}
{space}endRefreshMessage(rMsg){"{"}//接收分发数据
{spaceFunc}super.endRefreshMessage(rMsg);
{spaceFunc}if (rMsg.code == 0){"{"}
{spaceFunc}{space}if (rMsg.event == "httpConfig"){"{"}
{spaceFunc}{space}{"}"}
{spaceFunc}{"}"}

{space}{"}"}
{space}setUIData(data){"{"}//通过其他脚本打开UI的时候可以用来传参数

{space}{"}"}
{btnFunction}
{tgFunction}

{"}"}"""
    return tmp
def createScript_uibase():
    global space
    global spaceFunc
    global uiname
    widgetImport=checkWidgetProperty()
    tmpImport=""
    print("nihao")
    print(len(widgetImport))
    for index in widgetImport:
        tmpImport +=index
    tmpName = f"auto_{uiname}"
    tmp =f"""/*******************
* author :{username}
* create time :{time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())}
*******************/
const {"{"} ccclass, property {"}"} = _decorator;
import {"{"} Button,Node, Label,Sprite,Toggle, _decorator,EditBox {"}"} from 'cc';
import uiBaseEX from "../uiBaseEX";
{tmpImport}

@ccclass
export default class {tmpName} extends uiBaseEX{"{"}
{checkProperty()}
{"}"}"""
    return tmp,tmpName
def checkBtn():
    global space
    global spaceFunc
    global proertyName
    global btnBind
    global btnFunction
    for index in range(len(proertyName)):
        item = proertyName[index]
        if item.startswith("btn"):
            btnBind +=f"\n{spaceFunc}util.bindClickEventFX(this.{item}.node, this.{item}_Click.bind(this));"
            btnFunction +=f"\n{space}{item}_Click()"+"{\n\n    }"
def checkToggle():
    global space
    global spaceFunc
    global proertyName
    global tgBind
    global tgFunction
    for index in range(len(proertyName)):
        item = proertyName[index]
        if item.startswith("tg"):
            tgBind +=f"\n{spaceFunc}this.{item}.node.on('toggle', this.on{item[2:]}Toggle.bind(this));"
            tgFunction +=f"\n{space}on{item[2:]}Toggle()"+"{\n"+f"{spaceFunc}let isChecked = this.{item}.isChecked;"+f"\n{space}"+"}"
def checkProperty():
    global proertyName
    rt=""
    for index in range(len(proertyName)):
        item = proertyName[index]
        rt +=getProperty(item)
    return rt
def checkWidgetProperty():
    widgetImport=[]
    for index in range(len(proertyName)):
        nodeName = proertyName[index]
        if nodeName.startswith("widget"):
            tmpPath=f"import {nodeName.split('_')[0]} from \"../widget/{nodeName.split('_')[0]}\";\n"
            if not tmpPath in widgetImport:
                widgetImport.append(tmpPath)
    return widgetImport
# 查找需要的 节点 和ui名字
if creatType==0:
    parseJson()
else :
    parseJsonTargetNode(widgetName)
    print(proertyName)
checkBtn()
checkToggle()
# 创建模板
import pyperclip
if creatType ==0:
    show,baseName=createScript_uibase()
    if is_windows():
        with open(".\\assets\\scripts\\ui\\auto_ui\\"+baseName+".ts","w",encoding='utf8') as f:
            f.write(show)
    else :
        with open("./assets/scripts/ui/auto_ui/"+baseName+".ts","w",encoding='utf8') as f:
            f.write(show)
    pyperclip.copy(show)
    show=createScript_ui()
      
    if onlyCreateUI == False :
        if is_windows():
            sPath =".\\assets\\scripts\\ui\\"+uiname+".ts"
            if os.path.isfile(sPath):
                sPath = ".\\assets\\scripts\\ui\\"+uiname+"副本.ts"
            with open(sPath,"w",encoding='utf8') as f:
                f.write(show)
        else:
            sPath ="./assets/scripts/ui/"+uiname+".ts"
            if os.path.isfile(sPath):
                sPath = "./assets/scripts/ui/"+uiname+"副本.ts"
            with open(sPath,"w",encoding='utf8') as f:
                f.write(show)
        pyperclip.copy(show)
        print(skipParent)
else :
    show=createScript_widget()
    if onlyCreateUI == True :
        print(1111)
        print(show)
        print(2222)
        pyperclip.copy(show)
    else :
        if is_windows():
            with open(".\\assets\\scripts\\ui\\widget\\"+uiname+".ts","w",encoding='utf8') as f:
                f.write(show)
        else:
            with open("./assets/scripts/ui/widget/"+uiname+".ts","w",encoding='utf8') as f:
                f.write(show)



