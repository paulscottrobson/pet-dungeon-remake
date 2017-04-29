/// <reference path="../../lib/phaser.comments.d.ts"/>


class Monster extends ActorObject implements IMonster {
    public name:string;
    private strength:number;
    private fullHealth:number;
    private asleep:boolean;
    private basePower:number;

    public getSpriteName():string {
        return this.name;
    }

    public initialiseObject(view:IView,status:IGameStatus,x:number,y:number) {
        var n:number = Math.floor(Math.random() * 6);
        this.asleep = true;
        this.fullHealth = -1;
        if (n == 0) {
            this.name = "spider";
            this.basePower = 3;
        }
        if (n == 1) {
            this.name = "dragon";
            this.basePower = 1;
        }
        if (n == 2) {
            this.name = "grue";
            this.basePower = 7;
        }
        if (n == 3) {
            this.name = "nuibus";
            this.basePower = 9;
        }
        if (n == 4) {
            this.name = "snake";
            this.basePower = 2;
        }
        if (n == 5) {
            this.name = "wyvern";
            this.basePower = 5;
        }
    }

    public getStrength() : number {
        return this.strength;
    }

    public setStrength(str:number) : void {
        this.strength = str;
    }

    public setToSleep() : void {
        this.asleep = true;
    }

    public wakeUp(status:IGameStatus) : void {
        this.asleep = false;
        if (this.fullHealth < 0) {
            this.fullHealth = Math.random() * status.hitPoints + 
                              (status.lastExperience / this.basePower) + 
                              status.hitPoints / 4;
        }
        this.strength = Math.round(this.fullHealth);                            
    }

    public isAwake():boolean {
        return !this.asleep;
    }

}

