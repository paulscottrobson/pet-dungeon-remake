/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IMonster extends IObject {
    name:string;
    getStrength() : number;
    setStrength(str:number) : void;
    setToSleep() : void;
    isAwake():boolean;
    wakeUp(status:IGameStatus) : void;    
}

