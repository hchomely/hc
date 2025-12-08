/*******************
* author :Zulu
* create time :2025-12-03 11:40:00
* description :数字华容道功能测试
*******************/
const { ccclass, property } = _decorator;
import { _decorator, Component } from 'cc';
import puzzleController, { PuzzleDifficulty } from '../controller/puzzleController';

@ccclass("puzzleTest")
export default class puzzleTest extends Component {

    protected start(): void {
        this.testPuzzleLogic();
    }

    private testPuzzleLogic(): void {
        console.log('开始测试数字华容道逻辑...');
        
        // 测试3x3难度
        this.testDifficulty(PuzzleDifficulty.EASY, '简单(3x3)');
        
        // 测试4x4难度  
        this.testDifficulty(PuzzleDifficulty.MEDIUM, '中等(4x4)');
        
        // 测试5x5难度
        this.testDifficulty(PuzzleDifficulty.HARD, '困难(5x5)');
        
        // 测试6x6难度
        this.testDifficulty(PuzzleDifficulty.VERY_HARD, '非常难(6x6)');
        
        console.log('所有测试完成！');
    }

    private testDifficulty(difficulty: PuzzleDifficulty, name: string): void {
        console.log(`\n测试难度: ${name}`);
        
        const controller = new puzzleController();
        controller.initGame(difficulty);
        
        // 测试初始状态
        const board = controller.getBoard();
        console.log(`初始棋盘大小: ${board.length}x${board[0].length}`);
        
        // 测试移动功能
        this.testMovements(controller);
        
        // 测试完成判断
        this.testCompletion(controller);
    }

    private testMovements(controller: puzzleController): void {
        console.log('测试移动功能...');
        
        const board = controller.getBoard();
        const size = board.length;
        
        // 尝试移动一些方块
        let moved = false;
        for (let i = 0; i < size && !moved; i++) {
            for (let j = 0; j < size && !moved; j++) {
                if (board[i][j] !== 0) {
                    moved = controller.moveTile(i, j);
                    if (moved) {
                        console.log(`成功移动方块: (${i}, ${j})`);
                    }
                }
            }
        }
        
        if (!moved) {
            console.log('警告: 无法移动任何方块，可能需要调整打乱算法');
        }
    }

    private testCompletion(controller: puzzleController): void {
        console.log('测试完成判断...');
        
        // 重置为完成状态测试
        const originalBoard = controller.getBoard();
        const size = originalBoard.length;
        
        // 创建完成的棋盘
        const solvedBoard: number[][] = [];
        let num = 1;
        for (let i = 0; i < size; i++) {
            solvedBoard[i] = [];
            for (let j = 0; j < size; j++) {
                if (i === size - 1 && j === size - 1) {
                    solvedBoard[i][j] = 0;
                } else {
                    solvedBoard[i][j] = num++;
                }
            }
        }
        
        // 手动设置完成状态
        controller['_board'] = solvedBoard;
        controller['_emptyPosition'] = { x: size - 1, y: size - 1 };
        
        const isSolved = controller.isSolved();
        console.log(`完成状态检测: ${isSolved ? '✓ 正确' : '✗ 错误'}`);
        
        if (!isSolved) {
            console.log('错误: 完成的棋盘应该被识别为已完成');
        }
    }
}