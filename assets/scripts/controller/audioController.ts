import { _decorator, Component, AudioSource, Node, resources, AudioClip, assetManager, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

import dataContorller from "./dataController";
import util from "./util";

@ccclass('audioController')
export default class audioController extends Component {

  audioBgm = {};
  audioFx = {};
  playingBG: AudioSource = null;
  curAudioBgmClipName: string = "";
  lastAudioBgmClipName: string = "";
  soundList = {};

  @property(Node)
  bgmRoot: Node = null;
  @property(Node)
  FXRoot: Node = null;

  static _instance: audioController;

  public static getInstance() {
    return audioController._instance;
  }

  onLoad() {
    audioController._instance = this;
  }

  start() {
    //load all sonund reference
    var bgms = this.bgmRoot.children;
    bgms.forEach(element => {
      var clip = element.getComponent(AudioSource);
      this.audioBgm[element.name] = clip;
    });

    var fxs = this.FXRoot.children;
    fxs.forEach(element => {
      var clip = element.getComponent(AudioSource);
      this.audioFx[element.name] = clip;
    });
  }
  addBgMusic(rClipName: string, rClip: AudioSource) {
    this.audioBgm[rClipName] = rClip;
  }

  //播放背景music
  playBgMusic(rClipName: string) {
    let chipName = rClipName == null ? null : rClipName.replace("/", "_");
    this.lastAudioBgmClipName = chipName;

    if (this.curAudioBgmClipName == chipName) {
      return;
    }

    this.curAudioBgmClipName = chipName;

    if (this.playingBG /*&& this.playingBG.isPlaying*/) {
      this.playingBG.stop();
    }
    if (chipName == null) {
      return;
    }

    if (this.audioBgm[chipName] != null) {
      this.playingBG = this.audioBgm[chipName];
      this.playingBG.volume = 0.3
      this.playingBG.loop = true
      this.playingBG.play();
    }
    else {
      let node = new Node(chipName);
      node.parent = this.bgmRoot;
      node.position = v3(0, 0, 0);
      let audio = node.addComponent(AudioSource);
      this.audioBgm[chipName] = audio;
      resources.load(rClipName, AudioClip, (err, clip) => {
        if (clip) {
          this.audioBgm[chipName].clip = clip;
          if (this.curAudioBgmClipName == chipName) {
            this.playingBG = this.audioBgm[chipName];
            this.playingBG.volume = 0.3;
            this.playingBG.loop = true;
            this.playingBG.play();
          }
        }
      });
    }
  }

  stopBgMusic() {
    if (this.playingBG /*&& this.playingBG.isPlaying*/) {
      this.playingBG.stop();
      this.curAudioBgmClipName = "";
    }
  }

  clearBgMusic() {
    this.stopBgMusic();
    this.lastAudioBgmClipName = "";
  }

  replayBgMusic() {
    if (this.lastAudioBgmClipName && this.lastAudioBgmClipName != "") {
      this.playBgMusic(this.lastAudioBgmClipName);
    }
  }

  playFX(rClipName: string, loadOnly = false, looping = false, delayTime = 50) {
  
    if (typeof rClipName !== 'string') {
      return;
    }
    if (!!this.soundList[rClipName]
      && (Date.now() - this.soundList[rClipName] < delayTime)) {
      return;
    }
    // play sound time
    this.soundList[rClipName] = Date.now();

    return new Promise<AudioSource>((resolve, reject) => {
      if (this.audioFx[rClipName]) {
        this.audioFx[rClipName].loop = looping;
        if (!loadOnly){
          this.audioFx[rClipName].play();
        }
        resolve(this.audioFx[rClipName])
      } else {
        resources.load("sound/fx/" + rClipName, AudioClip, (err, clip) => {
          if (err) {
            console.error("声音加载异常 " + "resources/sound/fx/" + rClipName);
            reject()
          } else {
            let audio = new AudioSource();
            audio.clip = clip;
            this.audioFx[rClipName] = audio;
            this.audioFx[rClipName].loop = looping;
            if (!loadOnly)
              this.audioFx[rClipName].play();
            resolve(this.audioFx[rClipName])
          }
        })
      }
    })
  }

  stopFX(rClipName) {
    if (this.audioFx[rClipName]) {
      this.audioFx[rClipName].stop()
    }
  }

  playLocalAudio(path) {
    return new Promise((r) => {
      assetManager.loadRemote(path, function(err, audioClip) {
        let audio = new AudioSource();
        audio.clip = audioClip;
        audio.play()
        setTimeout(r, audio.duration * 1000)
        // audio.node.on(AudioSource.EventType.ENDED, r, this);
      });
    })

  }
}
