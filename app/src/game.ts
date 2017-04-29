/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private status:IGameStatus;
    private view:IView;
    private playerActor:number;
    private level:ILevel;

    init(status:IGameStatus) : void {
        this.status = status;
    }

    create() : void {
        this.view = new GameView(this.game,80);
        this.level = new DungeonLevel(this.view,this.status.level,40,23);

        if (this.status.firstLevelVisited) {
            var p:number[] = this.level.findSpace(CELLTYPE.PASSAGE);
            if (p == null) p = this.level.findSpace(CELLTYPE.FLOOR);
            this.status.xPlayer = p[0];this.status.yPlayer = p[1];
            this.status.firstLevelVisited = false;
        }
        this.playerActor = this.view.addActor(this.status.xPlayer,
                                              this.status.yPlayer,"player");

        this.level.openVisibility(this.view,this.status.xPlayer,this.status.yPlayer,1);
        //l.openVisibilityAll(r);
    }

    destroy() : void {
        this.view = this.level = null;
    }

    update() : void {    
        this.view.setCameraOn(this.playerActor);
    }
}    
