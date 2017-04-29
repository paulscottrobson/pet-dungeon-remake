/// <reference path="../../lib/phaser.comments.d.ts"/>

abstract class ActorObject implements IObject {
    public xCell:number;
    public yCell:number;
    private view:IView;
    private actorID:number;

    constructor(view:IView,x:number,y:number) {
        this.xCell = x;this.yCell = y;this.view = view;
        this.initialiseObject(view,x,y);
        this.actorID = view.addActor(x,y,this.getSpriteName());
    }

    initialiseObject(view:IView,x:number,y:number):void {
    }

    abstract getSpriteName(): string;

    destroy() : void {
        this.view.removeActor(this.actorID);
        this.view = null;
    }
}

