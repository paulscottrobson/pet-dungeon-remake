/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IMonster extends IObject {
    name:string;
    getStrength() : number;
    setStrength(str:number) : void;
    getExperience():number;
    setToSleep() : void;
    isAwake():boolean;
    wakeUp(status:IGameStatus) : void;    
}

