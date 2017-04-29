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
        this.level = new DungeonLevel(this.view,this.status,40,23,false);

        if (this.status.firstLevelVisited) {
            var p:number[] = this.level.findSpace(CELLTYPE.PASSAGE);
            if (p == null) p = this.level.findSpace(CELLTYPE.FLOOR);
            this.status.xPlayer = p[0];this.status.yPlayer = p[1];
            this.status.firstLevelVisited = false;
        }
        this.playerActor = this.view.addActor(this.status.xPlayer,
                                              this.status.yPlayer,"player");

        this.view.write("Welcome to level "+((this.level.getLevel().toString())));
        this.openAndGenerateWarnings();
        this.view.updateStatus(this.status);
        this.view.onClickGameSpace.add(this.inputHandler,this);
        //l.openVisibilityAll(r);
    }

    destroy() : void {
        this.view = this.level = null;
    }

    update() : void {    
        this.view.setCameraOn(this.playerActor);
    }

    /**
     * Handle input.
     * 
     * @param {*} obj 
     * @param {number} dx 
     * @param {number} dy 
     * 
     * @memberOf GameState
     */
    inputHandler(obj:any,dx:number,dy:number) : void {
        this.movePlayer(dx,dy);
    }

    /**
     * Move the player.
     * 
     * @param {number} dx 
     * @param {number} dy 
     * 
     * @memberOf GameState
     */
    movePlayer(dx:number,dy:number):void {
        // Not moving, things get better.
        if (dx == 0 && dy == 0) {
            this.status.hitPoints += 1 + Math.sqrt(this.status.experience / this.status.hitPoints);
            this.view.updateStatus(this.status);
            return;
        }
        // New position
        var x:number = this.status.xPlayer + dx;
        var y:number = this.status.yPlayer + dy;
        // On game area
        if (x >= 0 && y >= 0 && x < this.level.getWidth() && y < this.level.getHeight()) {
            // Find what hit
            var newCell:CELLTYPE = this.level.get(x,y);
            // Can't go off frame, everywhere else doable
            if (newCell != CELLTYPE.FRAME) {
                // Rock has penalty
                if (newCell == CELLTYPE.ROCK) {
                    this.status.hitPoints -= 2;
                }
                this.status.hitPoints -= 0.15;
                // Do move.
                this.status.xPlayer = x;
                this.status.yPlayer = y;
                this.view.moveActor(this.playerActor,x,y);
                this.openAndGenerateWarnings();
                this.checkGold();
                this.view.updateStatus(this.status);
                // TODO: Hit monster
            }
        }
    }

    /**
     * See if there is a treasure chest here, if so grab its gold and remove it.
     * 
     * @private
     * 
     * @memberOf GameState
     */
    private checkGold(): void {
        var treasure:ITreasure = <ITreasure>ActorObject.find(this.level.getTreasureList(),
                                                             this.status.xPlayer,this.status.yPlayer);
        if (treasure != null) {
            var gp:number = treasure.getGold();
            this.view.write("You found "+gp.toString()+" gp.");
            this.status.gold += gp;
            treasure.destroy();
            ActorObject.removeListItem(this.level.getTreasureList(),treasure);
        }                                                             
    }
    /**
     * Scanning. Count treasure nearby and announce if rising. Look at nearby monsters
     * and wake them up or put them to sleep accordingly. Open display up.
     * 
     * @param {number} [range=1] 
     * 
     * @memberOf GameState
     */
    openAndGenerateWarnings(range:number = 1): void {
        var treasureScanned:number = 0;
        var monsterList:IMonster[] = [];
        
        for (var x:number = this.status.xPlayer-range;x <= this.status.xPlayer+range;x++) {
            for (var y:number = this.status.yPlayer-range;y <= this.status.yPlayer+range;y++) {
                if (x >= 0 && y >= 0 && x < this.level.getWidth() && y < this.level.getHeight()) {
                    this.view.setCellVisibility(x,y,true);
                    var treasure:ITreasure = <ITreasure>ActorObject.find(this.level.getTreasureList(),x,y);
                    // If treasure found add to total, putting a number in chest if needed.
                    if (treasure != null) {
                        treasure.fillChestIfNeeded(this.status);
                        treasureScanned += treasure.getGold();
                        //console.log("treasure!",treasure.getGold());
                    }
                    // Create list of monsters that should be awake.
                    var monster:IMonster = <IMonster>ActorObject.find(this.level.getMonsterList(),x,y);
                    if (monster != null) {
                        monsterList.push(monster);
                    }
                }            
            }
        }
        // Wake up or sleep the various monsters.
        for (monster of this.level.getMonsterList()) {
            // Should it be awake ?
            var shouldBeAwake:boolean = monsterList.indexOf(monster) >= 0;
            // If state of monster changed
            if (monster.isAwake() != shouldBeAwake) {
                //console.log(monster.name,shouldBeAwake);
                if (shouldBeAwake) {
                    // Wake up the monster, initialises gold.
                    monster.wakeUp(this.status);
                    var s:string = monster.name+" "+monster.getStrength()+" hp near";
                    this.view.write(s);
                }
                else {
                    monster.setToSleep();                    
                }
            }
        }
        // Update actor visibility
        this.view.updateActorVisiblity();
        // If more gold, announce it is near.
        if (treasureScanned > this.status.lastLookGold) {
            this.view.write("Gold is near!");
            this.status.lastLookGold = treasureScanned;
        }
    }
}    
