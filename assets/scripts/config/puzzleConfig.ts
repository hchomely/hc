/*******************
* author :Zulu
* create time :2025-12-03 11:30:00
* description :数字华容道游戏配置
*******************/
const { ccclass, property } = _decorator;
import { _decorator } from 'cc';

export const PuzzleConfig = {
    // 难度配置
    difficulties: [
        { 
            id: 3, 
            name: '简单', 
            size: 3, 
            description: '3×3 - 适合新手入门',
            tileSize: 100,
            spacing: 8
        },
        { 
            id: 4, 
            name: '中等', 
            size: 4, 
            description: '4×4 - 经典难度',
            tileSize: 80,
            spacing: 6
        },
        { 
            id: 5, 
            name: '困难', 
            size: 5, 
            description: '5×5 - 挑战自我',
            tileSize: 65,
            spacing: 5
        },
        { 
            id: 6, 
            name: '非常难', 
            size: 6, 
            description: '6×6 - 高手之选',
            tileSize: 55,
            spacing: 4
        }
    ],

    // 颜色配置
    colors: {
        tileColors: [
            { r: 255, g: 204, b: 153 }, // 浅橙色
            { r: 153, g: 204, b: 255 }, // 浅蓝色
            { r: 204, g: 255, b: 153 }, // 浅绿色
            { r: 255, g: 153, b: 204 }, // 浅粉色
            { r: 204, g: 153, b: 255 }, // 浅紫色
            { r: 153, g: 255, b: 204 }  // 浅青绿色
        ],
        background: { r: 240, g: 240, b: 240 },
        text: { r: 51, g: 51, b: 51 },
        accent: { r: 66, g: 133, b: 244 }
    },

    // 动画配置
    animations: {
        tileMoveDuration: 0.2,
        tileScaleDuration: 0.15,
        winShowDuration: 0.5,
        transitionDuration: 0.3
    },

    // 游戏配置
    game: {
        shuffleMovesMultiplier: 100, // 打乱步数倍数
        minShuffleMoves: 20,         // 最小打乱步数
        autoSaveInterval: 30000      // 自动保存间隔(ms)
    }
};

export default PuzzleConfig;