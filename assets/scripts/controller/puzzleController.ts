/*******************
* author :Zulu
* create time :2025-12-03 11:15:00
* description :数字华容道游戏控制器
*******************/
const { ccclass, property } = _decorator;
import { _decorator, Component, Node, Vec2, Tween, tween, UIOpacity } from 'cc';

export enum PuzzleDifficulty {
    EASY = 3,      // 3x3
    MEDIUM = 4,    // 4x4  
    HARD = 5,      // 5x5
    VERY_HARD = 6  // 6x6
}

@ccclass("puzzleController")
export default class puzzleController extends Component {

    private _difficulty: PuzzleDifficulty = PuzzleDifficulty.EASY;
    private _board: number[][] = [];
    private _emptyPosition: Vec2 = new Vec2(0, 0);
    private _movementCount: number = 0;
    private _isGameStarted: boolean = false;
    private _startTime: number = 0;
    private _elapsedTime: number = 0;

    // 初始化游戏
    public initGame(difficulty: PuzzleDifficulty): void {
        this._difficulty = difficulty;
        this._movementCount = 0;
        this._isGameStarted = false;
        this._elapsedTime = 0;
        this.generateBoard();
        this.shuffleBoard();
    }

    // 生成初始棋盘
    private generateBoard(): void {
        const size = this._difficulty;
        this._board = [];
        
        for (let i = 0; i < size; i++) {
            this._board[i] = [];
            for (let j = 0; j < size; j++) {
                this._board[i][j] = i * size + j + 1;
            }
        }
        
        // 设置最后一个位置为空
        this._emptyPosition = new Vec2(size - 1, size - 1);
        this._board[this._emptyPosition.x][this._emptyPosition.y] = 0;
    }

    // 随机打乱棋盘
    private shuffleBoard(): void {
        const size = this._difficulty;
        const totalMoves = size * size * 100; // 足够多的随机移动
        
        for (let i = 0; i < totalMoves; i++) {
            const directions = this.getValidDirections();
            if (directions.length > 0) {
                const randomDir = directions[Math.floor(Math.random() * directions.length)];
                this.moveEmptySpace(randomDir);
            }
        }
    }

    // 获取有效的移动方向
    private getValidDirections(): Vec2[] {
        const directions: Vec2[] = [];
        const size = this._difficulty;
        
        if (this._emptyPosition.x > 0) directions.push(new Vec2(-1, 0)); // 上
        if (this._emptyPosition.x < size - 1) directions.push(new Vec2(1, 0)); // 下
        if (this._emptyPosition.y > 0) directions.push(new Vec2(0, -1)); // 左
        if (this._emptyPosition.y < size - 1) directions.push(new Vec2(0, 1)); // 右
        
        return directions;
    }

    // 移动空格
    private moveEmptySpace(direction: Vec2): void {
        const newX = this._emptyPosition.x + direction.x;
        const newY = this._emptyPosition.y + direction.y;
        
        if (this.isValidPosition(newX, newY)) {
            // 交换数字和空格
            this._board[this._emptyPosition.x][this._emptyPosition.y] = this._board[newX][newY];
            this._board[newX][newY] = 0;
            this._emptyPosition = new Vec2(newX, newY);
        }
    }

    // 玩家移动数字
    public moveTile(row: number, col: number): boolean {
        if (!this._isGameStarted) {
            this.startGame();
        }

        if (this.isAdjacentToEmpty(row, col)) {
            // 交换数字和空格
            const temp = this._board[row][col];
            this._board[row][col] = 0;
            this._board[this._emptyPosition.x][this._emptyPosition.y] = temp;
            this._emptyPosition = new Vec2(row, col);
            
            this._movementCount++;
            
            // 检查是否完成
            if (this.isSolved()) {
                this.endGame(true);
            }
            
            return true;
        }
        return false;
    }

    // 检查位置是否与空格相邻
    private isAdjacentToEmpty(row: number, col: number): boolean {
        return (Math.abs(row - this._emptyPosition.x) === 1 && col === this._emptyPosition.y) ||
               (Math.abs(col - this._emptyPosition.y) === 1 && row === this._emptyPosition.x);
    }

    // 检查位置是否有效
    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < this._difficulty && col >= 0 && col < this._difficulty;
    }

    // 检查是否完成
    public isSolved(): boolean {
        const size = this._difficulty;
        let expected = 1;
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i === size - 1 && j === size - 1) {
                    if (this._board[i][j] !== 0) return false;
                } else {
                    if (this._board[i][j] !== expected) return false;
                    expected++;
                }
            }
        }
        return true;
    }

    // 开始游戏
    private startGame(): void {
        this._isGameStarted = true;
        this._startTime = Date.now();
        this._elapsedTime = 0;
    }

    // 结束游戏
    private endGame(isWin: boolean): void {
        this._isGameStarted = false;
        this._elapsedTime = Date.now() - this._startTime;
        
        // 触发游戏结束事件
        this.node.emit('gameEnd', {
            isWin: isWin,
            moves: this._movementCount,
            time: this._elapsedTime,
            difficulty: this._difficulty
        });
    }

    // 获取当前棋盘状态
    public getBoard(): number[][] {
        return this._board.map(row => [...row]);
    }

    // 获取游戏统计信息
    public getGameStats(): { moves: number, time: number, difficulty: PuzzleDifficulty } {
        const currentTime = this._isGameStarted ? Date.now() - this._startTime : this._elapsedTime;
        return {
            moves: this._movementCount,
            time: currentTime,
            difficulty: this._difficulty
        };
    }

    // 重置游戏
    public resetGame(): void {
        this.initGame(this._difficulty);
    }

    // 更改难度
    public changeDifficulty(difficulty: PuzzleDifficulty): void {
        this.initGame(difficulty);
    }

    // 获取难度名称
    public getDifficultyName(difficulty: PuzzleDifficulty): string {
        switch (difficulty) {
            case PuzzleDifficulty.EASY: return '简单 (3×3)';
            case PuzzleDifficulty.MEDIUM: return '中等 (4×4)';
            case PuzzleDifficulty.HARD: return '困难 (5×5)';
            case PuzzleDifficulty.VERY_HARD: return '非常难 (6×6)';
            default: return '未知';
        }
    }
}