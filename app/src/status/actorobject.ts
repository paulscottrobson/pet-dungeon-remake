/// <reference path="../../lib/phaser.comments.d.ts"/>

abstract class ActorObject implements IObject {
    public xCell:number;
    public yCell:number;
    private view:IView;
    private actorID:number;

    constructor(view:IView,status:IGameStatus,x:number,y:number) {
        this.xCell = x;this.yCell = y;this.view = view;
        this.initialiseObject(view,status,x,y);
        this.actorID = view.addActor(x,y,this.getSpriteName());
    }

    initialiseObject(view:IView,status:IGameStatus,x:number,y:number):void {
    }

    abstract getSpriteName(): string;

    destroy() : void {
        this.view.removeActor(this.actorID);
        this.view = null;
    }

    static find(objectList:IObject[],x:number,y:number) : IObject {
        for (var listItem of objectList) {
            if (listItem.xCell == x && listItem.yCell == y) {
                return listItem;
            }
        }
        return null;
    }

    static removeListItem(objectList:IObject[],element:IObject) {
        var index:number = objectList.indexOf(element);
        if (index < 0) { 
            throw Error("Deleting list element which does not exist");
        }
        objectList.splice(index,1);
    }
}

