/// <reference path="../../lib/phaser.comments.d.ts"/>


class Monster extends ActorObject implements IMonster {
    public name:string;

    public getSpriteName():string {
        return this.name;
    }

    public initialiseObject(view:IView,x:number,y:number) {
        var n:number = Math.floor(Math.random() * 6);
        if (n == 0) {
            this.name = "spider";
        }
        if (n == 1) {
            this.name = "dragon";
        }
        if (n == 2) {
            this.name = "grue";
        }
        if (n == 3) {
            this.name = "nuibus";
        }
        if (n == 4) {
            this.name = "snake";
        }
        if (n == 5) {
            this.name = "wyvern";
        }
    }
}

