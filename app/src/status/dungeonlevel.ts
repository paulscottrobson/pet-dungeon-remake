/// <reference path="../../lib/phaser.comments.d.ts"/>

class DungeonLevel implements ILevel {
    private width:number;
    private height:number;
    private level:number;
    private cell:CELLTYPE[][];
    private monsters:IMonster[];
    private treasures:ITreasure[];

    constructor(view:IView,level:number,width:number,height:number) {
        // Save information
        this.width = width;this.height = height;this.level = level;
        this.monsters = [];this.treasures = [];
        // Fill level with rock & initialise arrays
        this.cell = [];
        for (var x = 0;x < width;x++) {
            this.cell[x] = [];
            for (var y = 0;y < height;y++) {
                this.cell[x][y] = CELLTYPE.ROCK;
            }
        }
        // Frame
        this.frame();
        // Rooms
        var roomCount = Math.max(3,Math.round(width*height)/(40*23)*9);
        for (var n = 0;n < roomCount;n++) {
            this.drawRoom(view);
        }
        // Stairs
        var pos:number[] = this.findSpace(CELLTYPE.FLOOR);
        this.cell[pos[0]][pos[1]] = CELLTYPE.STAIRSD;
        var pos:number[] = this.findSpace(CELLTYPE.FLOOR);
        this.cell[pos[0]][pos[1]] = CELLTYPE.STAIRSU;
        // Gold
        var goldCount = Math.max(2,Math.round(width*height)/(40*23)*11);
        for (var n = 0;n < goldCount;n++) {
            var pos:number[] = this.findSpace(CELLTYPE.FLOOR);
            var trs:ITreasure = new Treasure(view,pos[0],pos[1]);
            this.treasures.push(trs);
        }
        // Copy to map.
        for (var x = 0;x < this.getWidth();x++) {
            for (var y = 0;y < this.getHeight();y++) {
                view.setCell(x,y,this.cell[x][y]);
            }
        }
        // Update actor visibility
        view.updateActorVisiblity();
    }

    public findSpace(reqd:CELLTYPE):number[] {
        var x:number;
        var y:number;
        var count:number = 0;

        do {
            if (count++ == 2000) return null;
            x = this.getIntRandom(this.width);
            y = this.getIntRandom(this.height);
        } while (this.cell[x][y] != reqd);
        return [x,y];
    }

    /**
     * Draw a single room
     * 
     * @private
     * 
     * @memberOf DungeonLevel
     */
    private drawRoom(view:IView) : void {
        var x:number;
        var y:number;
        var w:number;
        var h:number;
        var ok:boolean = false;
        var count:number = 0;
        // Find legal room.
        while (!ok) {
            if (count++ == 100) return;
            var sz:number = Math.max(2,Math.round((this.width+this.height)/63*9));
            // Pick a random position
            w = this.getIntRandom(sz)+2;
            h = this.getIntRandom(sz)+2;
            x = this.getIntRandom(this.width - w - 1) + 1;
            y = this.getIntRandom(this.height - h - 1) + 1;
            // Check if okay there.
            ok = true;
            for (var xt:number = x-1;xt <= x + w && ok;xt++) {
                for (var yt:number = y-1;yt <= y+h && ok;yt++) {
                    if (this.cell[xt][yt] != CELLTYPE.ROCK) { ok = false; }
                }
            }
        }
        // Open it up
        for (var xt:number = x;xt < x + w && ok;xt++) {
            for (var yt:number = y;yt < y+h && ok;yt++) {
                this.cell[xt][yt] = CELLTYPE.FLOOR;
            }
        }
        // Put a monster in it.
        var m:IMonster = new Monster(view,x+this.getIntRandom(w),y+this.getIntRandom(h));
        this.monsters.push(m);
        
        // Open up south and east passages - added - north and west passages too.
        this.passage(x+1,y+h,0,1);
        this.passage(x+w,y+1,1,0);
        this.passage(x+1,y-1,0,-1);
        this.passage(x-1,y+1,-1,0);
    }

    /**
     * See if a passage can be drawn in a given direction.
     * 
     * @private
     * @param {number} x 
     * @param {number} y 
     * @param {number} xi 
     * @param {number} yi 
     * 
     * @memberOf DungeonLevel
     */
    private passage(x:number,y:number,xi:number,yi:number) {
        var n = 0;
        // Follow till the end
        while (this.cell[x+xi*n][y+yi*n] == CELLTYPE.ROCK) {
            n++;
        }
        // If something can connect to, work back putting doors in place.
        if (this.cell[x+xi*n][y+yi*n] != CELLTYPE.FRAME) {
            var isFirst:boolean = true;
            while (--n >= 0) {
                this.cell[x+xi*n][y+yi*n] = (n == 0 || isFirst) ? CELLTYPE.DOOR:CELLTYPE.PASSAGE;
                isFirst = false;
            }
        }
    }

    /**
     * Draw frame
     * 
     * @private
     * 
     * @memberOf DungeonLevel
     */
    private frame():void {
        for (var x = 0;x < this.width;x++) {
            this.cell[x][0] = this.cell[x][this.height-1] = CELLTYPE.FRAME;
        }
        for (var y = 0;y < this.height;y++) {
            this.cell[0][y] = this.cell[this.width-1][y] = CELLTYPE.FRAME;
        }
    }

    /**
     * Get random value 0-1
     * 
     * @private
     * @returns {number} 
     * 
     * @memberOf DungeonLevel
     */
    private getRandom():number {
        return Math.random();
    }

    /**
     * Get random integer 0-(range-1)
     * 
     * @private
     * @param {number} range 
     * @returns {number} 
     * 
     * @memberOf DungeonLevel
     */
    private getIntRandom(range:number):number {
        return Math.floor(this.getRandom() * range);
    }

    get(x: number, y: number): CELLTYPE {
        return this.cell[x][y];
    }
    set(x: number, y: number, cell: CELLTYPE): void {
        this.cell[x][y] = cell;
    }
    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }
    getLevel(): number {
        return this.level;
    }

    openVisibility(view:IView,x: number, y: number, radius: number): void {
        for (var xc:number = x-radius;xc <= x+radius;xc++) {
            for (var yc:number = y-radius;yc <= y+radius;yc++) {
                if (xc >= 0 && yc >= 0 && xc < this.width && yc < this.height) {
                    view.setCellVisibility(xc,yc,true);
                }
            }
        }
        view.updateActorVisiblity();
    }

    openVisibilityAll(view:IView): void {
        for (var x = 0;x < this.getWidth();x++) {
            for (var y = 0;y < this.getHeight();y++) {
                view.setCellVisibility(x,y,true);
            }
        }
        view.updateActorVisiblity();
    }

}