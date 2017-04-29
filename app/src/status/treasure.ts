/// <reference path="../../lib/phaser.comments.d.ts"/>

class Treasure extends ActorObject implements ITreasure {

    public gp:number;

    getSpriteName():string {
        return "treasure";
    }

    initialiseObject(view:IView,status:IGameStatus,x:number,y:number) {
        this.gp = -1;
    }

    fillChestIfNeeded(status:IGameStatus): void {
        if (this.gp < 0) {
            this.gp = Math.floor(Math.random() * status.gold) + 1;
        }
    }

    getGold(): number {
        return this.gp;
    }

}

