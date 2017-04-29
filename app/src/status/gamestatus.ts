/// <reference path="../../lib/phaser.comments.d.ts"/>


class GameStatus implements IGameStatus {
    public xPlayer: number;
    public yPlayer: number;
    public level: number;
    public gold: number;
    public experience: number;
    public hitPoints: number;
    public lastExperience: number;
    public killCount: number;
    public firstLevelVisited:boolean;
    public lastLookGold:number;
    
    constructor() {
        this.firstLevelVisited = true;
        this.experience = 0;
        this.xPlayer = 0;
        this.yPlayer = 0;
        this.level = 1;
        this.gold = 0;
        this.lastLookGold = 0;
        this.hitPoints = 50;
        this.lastExperience = 0;
        this.killCount = 0;
    }

}