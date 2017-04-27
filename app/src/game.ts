/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private status:IGameStatus;

    init(status:IGameStatus) : void {
        this.status = status;
        var r:IView = new GameView(this.game,24);
        var l:ILevel = new DungeonLevel(r,1,23,40);

        var p:number[] = l.findSpace(CELLTYPE.PASSAGE);
        if (p == null) p = l.findSpace(CELLTYPE.FLOOR);
        r.addActor(p[0],p[1],"player");

        l.openVisibility(r,4,4,2);
        l.openVisibilityAll(r);

    }

    create() : void {
    }

    destroy() : void {
    }

    update() : void {    
    }
}    
