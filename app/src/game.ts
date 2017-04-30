/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private status:IGameStatus;
    private view:IView;
    private playerActor:number;
    private level:ILevel;
    private moveState:boolean;
    private negotiateMonster:IMonster;
    private hasLost:boolean;

    init(status:IGameStatus) : void {
        this.status = status;
    }

    create() : void {
        this.status.gold = 100;
        this.view = new GameView(this.game,80);
        this.level = new DungeonLevel(this.view,this.status,40,23,false);
        this.moveState = true;
        this.hasLost = false;
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
        this.negotiateMonster = null;
    }

    update() : void {    
        // Centre on player
        this.view.setCameraOn(this.playerActor);        
        // Check if dead.
        if (this.status.hitPoints <= 1) {
            // If first time dead show game over message.
            if (!this.hasLost) {
                this.hasLost = true;
                this.view.showGameOver();
            }
        }
        // Check all monsters to see if one will move and maybe attack
        if (this.status.hitPoints > 1 && this.moveState) {
            var attackMonster:IMonster = null;
            for (var monster of this.level.getMonsterList()) {
                if (monster.isAwake()) {
                    attackMonster = monster;
                }
            }
            // Monster attacking.
            if (attackMonster != null) {
                // Try to move towards player if time.
                var hasMoved:boolean = this.moveToPlayer(attackMonster,this.game.time.elapsedMS);
                // If moved onto the player fight.
                if (hasMoved && attackMonster.xCell == this.status.xPlayer && 
                                        attackMonster.yCell == this.status.yPlayer) {
                    this.fight(attackMonster);
                }
            }
        }
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
        // Moving, i.e. normal state
        if (this.moveState) {
            // Only move if alive.
            if (this.status.hitPoints > 1) {
                this.movePlayer(dx,dy);
            }
            return;
        }
        // Waiting for surrender option.
        if (dx == 0 && dy == 0) {
            this.status.gold = Math.floor(this.status.gold/2);
            // Remove the monster object.
            this.negotiateMonster.destroy();
            ActorObject.removeListItem(this.level.getMonsterList(),this.negotiateMonster);
            // Update the status.
            this.view.updateStatus(this.status);
        }
        this.moveState = true;
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
                // Check for monster attack.
                var monster:IMonster = <IMonster>ActorObject.find(this.level.getMonsterList(),
                                                                  this.status.xPlayer,
                                                                  this.status.yPlayer);
                if (monster != null) {
                    this.fight(monster);
                }                                                                  
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

    /**
     * Fight with monster.
     * 
     * @private
     * @param {IMonster} monster 
     * 
     * @memberOf GameState
     */
    private fight(monster:IMonster) : void {
        this.view.write("An attack !");
        // Calculate damage done.
        var power = this.status.hitPoints + this.status.experience;
        var playerDamage:number = Math.random() * monster.getStrength() / 2 + 
                                  monster.getStrength() / 4
        var monsterDamage:number = Math.random() * power / 2 + power / 4;
        // Adjust strengths.
        monster.setStrength(Math.floor(monster.getStrength() - monsterDamage));
        this.status.hitPoints = this.status.hitPoints - playerDamage;
        this.view.updateStatus(this.status);
        // End fight if HP run out, you have died.
        if (this.status.hitPoints < 1) { return; }
        // Check if monster dead
        if (monster.getStrength() > 1) {
            this.view.write(monster.name+" now "+monster.getStrength().toString()+" hp");

            // Move the monster away from the player.
            do {
                monster.xCell = this.status.xPlayer + (Math.floor(Math.random() * 3)) - 1;
                monster.yCell = this.status.yPlayer + (Math.floor(Math.random() * 3)) - 1;
            } while (this.level.get(monster.xCell,monster.yCell) != CELLTYPE.FLOOR ||
                    (monster.xCell == this.status.xPlayer && monster.yCell == this.status.yPlayer));
            this.view.moveActor(monster.actorID,monster.xCell,monster.yCell);

            // Think about surrender ?
            if (monster.getStrength() / (this.status.hitPoints+1) > 2) {
                this.view.write("Leave for half gold");
                this.view.write("Tap player to accept");
                this.negotiateMonster = monster;
                this.moveState = false;                
            }            
            return;
        }
        // Monster has died.
        this.view.write(monster.name+" is dead!");
        
        // Update EXP and Kill Count
        this.status.experience += monster.getExperience();
        this.status.killCount++;

        // Time to be uprated
        if (this.status.experience > this.status.lastExperience * 2) {
            this.status.lastExperience = this.status.experience;
            this.status.hitPoints = this.status.hitPoints * 3;
            this.view.write("HP have been raised.");
        }
        // Remove the monster object.
        monster.destroy();
        ActorObject.removeListItem(this.level.getMonsterList(),monster);
        // Update the status.
        this.view.updateStatus(this.status);
    }

    /**
     * Move the monster to attack the player. 
     * 
     * @private
     * @param {IMonster} monster 
     * @param {number} elapsedMS
     * @returns {boolean} true if moved.
     * 
     * @memberOf GameState
     */
    private moveToPlayer(monster:IMonster,elapsedMS:number):boolean {
        if (!monster.timeToMove(elapsedMS)) {
            return false;
        }
        // TODO: Chase down player.
        console.log("Move !");
        return false;
    }
}    
