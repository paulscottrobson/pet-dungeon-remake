/// <reference path="../../lib/phaser.comments.d.ts"/>


class GameStatus implements IGameStatus {
    public x: number;
    public y: number;
    public level: number;
    public gold: number;
    public experience: number;
    public hitPoints: number;
    public lastExperience: number;
    public killCount: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.level = 1;
        this.gold = 0;
        this.hitPoints = 50;
        this.lastExperience = 0;
        this.killCount = 0;
    }

}