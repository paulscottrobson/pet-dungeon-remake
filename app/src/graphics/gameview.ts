/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * View manager
 * 
 * @class GameView
 * @extends {Phaser.Group}
 * @implements {IView}
 */
class GameView extends Phaser.Group implements IView {

    private actors:Phaser.Sprite[];
    private singleCells:Phaser.Image[];
    private cellSize:number;
    private tileName:string[];
    private nextActorID:number; 

    private static HIDDEN_ALPHA:number = 0.4;
    private static SHOW_ALPHA:number = 1.0;

    constructor(game:Phaser.Game,cellSize:number) {
        super(game);
        this.actors = [];
        this.singleCells = [];
        this.cellSize = cellSize;
        this.tileName = [];
        this.nextActorID = 0;
        this.tileName[CELLTYPE.ROCK] = "rock";
        this.tileName[CELLTYPE.FRAME] = "frame";
        this.tileName[CELLTYPE.DOOR] = "door";
        this.tileName[CELLTYPE.FLOOR] = "floor";
        this.tileName[CELLTYPE.PASSAGE] = "passage";
        this.tileName[CELLTYPE.PIT] = "pit";
        this.tileName[CELLTYPE.STAIRSD] = "stairsd";
        this.tileName[CELLTYPE.STAIRSU] = "stairsu";
        this.tileName[CELLTYPE.TREASURE] = "treasure";
    }

    destroy(): void {
        this.actors = this.singleCells = null;
        super.destroy();
    }
    
    setCell(x: number, y: number, cell: CELLTYPE): void {
        var key:number = this.getKey(x,y);
        if (this.singleCells[key] == null) {
            var img:Phaser.Image;
            img = this.game.add.image(x*this.cellSize,y*this.cellSize,
                                  "sprites",this.tileName[cell],this);
            img.sendToBack();
            this.singleCells[key] = img;        
        } else {
            this.singleCells[key].loadTexture("sprites",this.tileName[cell]);
        }
        this.singleCells[key].width = this.singleCells[key].height = this.cellSize;
    }

    getKey(x:number,y:number) : number {
        return (x + 10) * 1000 + y + 10;
    }

    addActor(x: number, y: number, sprite: string): number {
        var spr:Phaser.Sprite = this.game.add.sprite(x * this.cellSize,y * this.cellSize,
                                                     "sprites",sprite,this);
        spr.width = spr.height = this.cellSize;                                                     
        var n:number = this.nextActorID++;
        this.actors[n] = spr;
        //this.updateActorVisibility(n,x,y);
        return n;                                                     
    }

    removeActor(actorID: number): void {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        this.actors[actorID].destroy();
        this.actors[actorID] = null;
    }

    moveActor(actorID: number, x: number, y: number) : void {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        // Move it.
        this.game.add.tween(this.actors[actorID]).
                            to({ x: x*this.cellSize,y:y*this.cellSize },
                            250,
                            Phaser.Easing.Default,true);
        this.updateActorVisibility(actorID,x,y);                            
    }

    /**
     * Update the visibility of the actor who is at x,y
     * 
     * @param {number} actorID 
     * @param {number} x 
     * @param {number} y 
     * 
     * @memberOf IView
     */

    private updateActorVisibility(actorID: number, x: number, y: number) : void {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        this.actors[actorID].alpha = (this.singleCells[this.getKey(x,y)] != null) ? 1.0:0.35;
    }
}
