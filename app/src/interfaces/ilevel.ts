/// <reference path="../../lib/phaser.comments.d.ts"/>

interface ILevel {
    get(x:number,y:number) : CELLTYPE;
    set(x:number,y:number,cell:CELLTYPE): void;
    getWidth():number;
    getHeight():number;
    getLevel():number;
    openVisibility(x:number,y:number,radius:number): void;
    openVisibilityAll(): void;
}