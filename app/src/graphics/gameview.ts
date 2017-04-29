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
    private cells:Phaser.Image[][];
    private cellSize:number;
    private tileName:string[];
    private nextActorID:number; 

    private static HIDDEN_ALPHA:number = 0.4;
    private static SHOW_ALPHA:number = 1.0;

    constructor(game:Phaser.Game,cellSize:number) {
        super(game);
        this.actors = [];
        this.cells = [];
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
        this.actors = this.cells = null;
        super.destroy();
    }
    
    setCell(x: number, y: number, cell: CELLTYPE): void {
        this.cells[x] = this.cells[x] || [];
        if (this.cells[x][y] == null) {
            var img:Phaser.Image;
            img = this.game.add.image(x*this.cellSize,y*this.cellSize,
                                  "sprites",this.tileName[cell],this);
            img.sendToBack();
            this.cells[x][y] = img;        
            this.setCellVisibility(x,y,false);
        } else {
            this.cells[x][y].loadTexture("sprites",this.tileName[cell]);
        }
        this.cells[x][y].width = this.cells[x][y].height = this.cellSize;
    }

    setCellVisibility(x:number,y:number,isVisible:boolean): void {
        this.cells[x] = this.cells[x] || [];
        if (this.cells[x][y] == null) {
            this.setCell(x,y,CELLTYPE.ROCK);
        }
        this.cells[x][y].alpha = isVisible ? 1.0:0.33;
    }

    addActor(x: number, y: number, sprite: string): number {
        var spr:Phaser.Sprite = this.game.add.sprite(x * this.cellSize,y * this.cellSize,
                                                     "sprites",sprite,this);
        spr.width = spr.height = this.cellSize;                                                     
        var n:number = this.nextActorID++;
        this.actors[n] = spr;
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
    }

    updateActorVisiblity() : void {
        for (var actor of this.actors) {
            var x:number = Math.floor(actor.x / this.cellSize);
            var y:number = Math.floor(actor.y / this.cellSize);
            actor.alpha = this.cells[x][y].alpha;
            actor.visible = this.cells[x][y].visible;
        }    
    }

    setCameraOn(actorID:number) : void {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        this.x = -this.actors[actorID].x - this.cellSize/2 + this.game.width / 2;
        this.y = -this.actors[actorID].y - this.cellSize/2 + this.game.height / 2;
    }
}
