/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private status:IGameStatus;

    init(status:IGameStatus) : void {
        this.status = status;
        var r:IView = new GameView(this.game,64);
        r.addArea(0,0,40,23,CELLTYPE.FRAME);
        r.addArea(1,1,38,21,CELLTYPE.ROCK);
        r.addArea(3,3,3,4,CELLTYPE.FLOOR);
        r.setCell(4,4,CELLTYPE.TREASURE);
        r.setCell(4,4,CELLTYPE.PIT);
        var n:number = r.addActor(1,1,"player");
        //r.removeActor(n);
        r.moveActor(n,3,7);
    }

    create() : void {
    }

    destroy() : void {
    }

    update() : void {    
    }
}    
