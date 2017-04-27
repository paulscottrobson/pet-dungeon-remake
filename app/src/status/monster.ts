/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IMonster {
    x:number;
    y:number;
    name:string;
    actorID:number;

    destroy(): void;
}

class Monster implements IMonster {
    public x:number;
    public y:number;
    public name:string;
    public actorID:number;
    private view:IView;

    constructor(view:IView,x:number,y:number) {
        this.x = x;this.y = y;this.view = view;
        this.getMonster();
        this.actorID = view.addActor(x,y,this.name);
    }

    destroy() : void {
        this.view.removeActor(this.actorID);
        this.view = null;
    }

    private getMonster(): void {
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

