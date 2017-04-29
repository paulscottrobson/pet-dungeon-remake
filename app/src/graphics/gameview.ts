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
    private status:Phaser.BitmapText[];
    private cellSize:number;
    private tileName:string[];
    private nextActorID:number; 
    private scrollGroup:Phaser.Group;
    private scroller:TextScroller;
    private cameraActor:number;
    public  onClickGameSpace:Phaser.Signal;

    constructor(game:Phaser.Game,cellSize:number) {
        super(game);
        this.actors = [];
        this.cells = [];
        this.status = [];
        this.cellSize = cellSize;
        this.tileName = [];
        this.nextActorID = 0;
        this.cameraActor = -1;
        this.onClickGameSpace = new Phaser.Signal();
        // Type -> Tilename mapping
        this.tileName[CELLTYPE.ROCK] = "rock";
        this.tileName[CELLTYPE.FRAME] = "frame";
        this.tileName[CELLTYPE.DOOR] = "door";
        this.tileName[CELLTYPE.FLOOR] = "floor";
        this.tileName[CELLTYPE.PASSAGE] = "passage";
        this.tileName[CELLTYPE.PIT] = "pit";
        this.tileName[CELLTYPE.STAIRSD] = "stairsd";
        this.tileName[CELLTYPE.STAIRSU] = "stairsu";
        this.tileName[CELLTYPE.TREASURE] = "treasure";
        // Cloud background
        var tile:Phaser.TileSprite = this.game.add.tileSprite(0,0,32,32,"sprites","bgrtile",this);
        tile.scale.x = tile.scale.y = this.cellSize / 32;
        tile.width = this.game.width;tile.height = this.game.height;
        // Enable touch info
        tile.inputEnabled = true;
        tile.events.onInputDown.add(this.clickHandler,this);
        // Status
        this.createStatusDisplay();
        // Group for the tiles
        this.scrollGroup = new Phaser.Group(this.game,this);
        // Scrolling info display.
        this.scroller = new TextScroller(this.game,this.game.width,this.game.height/4);        
        this.add(this.scroller);
        this.scroller.y = this.game.height - this.scroller.height;
    }

    destroy(): void {
        this.onClickGameSpace = this.scroller = this.actors = this.cells = this.status = null;
        super.destroy();
    }

    clickHandler(obj:any,pointer:Phaser.Pointer) {
        if (this.cameraActor >= 0) {
            var x:number = pointer.x-this.cellSize/2-this.actors[this.cameraActor].getBounds().x;
            var y:number = pointer.y-this.cellSize/2-this.actors[this.cameraActor].getBounds().y;
            x = Math.min(Math.max(-1,Math.round(x / this.cellSize)),1);
            y = Math.min(Math.max(-1,Math.round(y / this.cellSize)),1);
            this.onClickGameSpace.dispatch(this,x,y,pointer);
        }
    }
    write(s:string):void {
        this.scroller.write(s);
    }    

    setCell(x: number, y: number, cell: CELLTYPE): void {
        this.cells[x] = this.cells[x] || [];
        if (this.cells[x][y] == null) {
            var img:Phaser.Image;
            img = this.game.add.image(x*this.cellSize,y*this.cellSize,
                                  "sprites",this.tileName[cell],this.scrollGroup);
            this.cells[x][y] = img;        
            this.setCellVisibility(x,y,false);
        } else {
            this.cells[x][y].loadTexture("sprites",this.tileName[cell]);
        }
        this.cells[x][y].width = this.cells[x][y].height = this.cellSize;
        this.cells[x][y].sendToBack();
    }

    setCellVisibility(x:number,y:number,isVisible:boolean): void {
        this.cells[x] = this.cells[x] || [];
        if (this.cells[x][y] == null) {
            this.setCell(x,y,CELLTYPE.ROCK);
        }
        this.cells[x][y].alpha = isVisible ? 1.0:0.25;
    }

    addActor(x: number, y: number, sprite: string): number {
        var spr:Phaser.Sprite = this.game.add.sprite(x * this.cellSize,y * this.cellSize,
                                                     "sprites",sprite,this.scrollGroup);
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
        this.scrollGroup.x = -this.actors[actorID].x - this.cellSize/2 + this.game.width / 2;
        this.scrollGroup.y = -this.actors[actorID].y - this.cellSize/2 + this.scroller.y / 2;
        this.cameraActor = actorID;
    }

    private createStatusDisplay(): void {
        for (var x:number = 0;x < 2;x++) {
            for (var y:number = 0;y < 3;y++) {
                var txt:Phaser.BitmapText = this.game.add.bitmapText(0,0,
                                                                     "font","000",
                                                                     32,this);
                txt.x = -(1.1-x) * (txt.width) + this.game.width;                                                                     
                txt.y = (0.2+y) * txt.height * 1.1;
                txt.tint = (x == 0) ? 0xFFFF00 : 0x00FFFF;
                txt.anchor.setTo(1,0);
                if (x == 0) {
                    txt.text = ["HP:","XP:","GP:"][y];
                } else {
                    txt.text = "0";
                    this.status[y] = txt;
                }
            }
        }
    }

    updateStatus(status:IGameStatus): void {
        this.status[0].text = Math.floor(Math.max(0,status.hitPoints+0.5)).toString();
        this.status[1].text = (status.experience).toString();
        this.status[2].text = (status.gold).toString();
    }
}
