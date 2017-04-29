var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameState.prototype.init = function (status) {
        this.status = status;
    };
    GameState.prototype.create = function () {
        this.view = new GameView(this.game, 80);
        this.level = new DungeonLevel(this.view, this.status.level, 40, 23);
        if (this.status.firstLevelVisited) {
            var p = this.level.findSpace(CELLTYPE.PASSAGE);
            if (p == null)
                p = this.level.findSpace(CELLTYPE.FLOOR);
            this.status.xPlayer = p[0];
            this.status.yPlayer = p[1];
            this.status.firstLevelVisited = false;
        }
        this.playerActor = this.view.addActor(this.status.xPlayer, this.status.yPlayer, "player");
        this.level.openVisibility(this.view, this.status.xPlayer, this.status.yPlayer, 1);
    };
    GameState.prototype.destroy = function () {
        this.view = this.level = null;
    };
    GameState.prototype.update = function () {
        this.view.setCameraOn(this.playerActor);
    };
    return GameState;
}(Phaser.State));
window.onload = function () {
    var game = new MainApplication();
};
var MainApplication = (function (_super) {
    __extends(MainApplication, _super);
    function MainApplication() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Game", new GameState());
        _this.state.start("Boot");
        return _this;
    }
    return MainApplication;
}(Phaser.Game));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        var _this = this;
        this.game.load.image("loader", "assets/sprites/loader.png");
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
    BootState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.stage.backgroundColor = "#000000";
        var loader = this.add.sprite(this.game.width / 2, this.game.height / 2, "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = ["font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        for (var _b = 0, _c = []; _b < _c.length; _b++) {
            var audioName = _c[_b];
            this.game.load.audio(audioName, ["assets/sounds/" + audioName + ".mp3",
                "assets/sounds/" + audioName + ".ogg"]);
        }
        this.game.load.onLoadComplete.add(function () {
            _this.game.state.start("Game", true, false, new GameStatus());
        }, this);
    };
    return PreloadState;
}(Phaser.State));
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView(game, cellSize) {
        var _this = _super.call(this, game) || this;
        _this.actors = [];
        _this.cells = [];
        _this.cellSize = cellSize;
        _this.tileName = [];
        _this.nextActorID = 0;
        _this.tileName[CELLTYPE.ROCK] = "rock";
        _this.tileName[CELLTYPE.FRAME] = "frame";
        _this.tileName[CELLTYPE.DOOR] = "door";
        _this.tileName[CELLTYPE.FLOOR] = "floor";
        _this.tileName[CELLTYPE.PASSAGE] = "passage";
        _this.tileName[CELLTYPE.PIT] = "pit";
        _this.tileName[CELLTYPE.STAIRSD] = "stairsd";
        _this.tileName[CELLTYPE.STAIRSU] = "stairsu";
        _this.tileName[CELLTYPE.TREASURE] = "treasure";
        return _this;
    }
    GameView.prototype.destroy = function () {
        this.actors = this.cells = null;
        _super.prototype.destroy.call(this);
    };
    GameView.prototype.setCell = function (x, y, cell) {
        this.cells[x] = this.cells[x] || [];
        if (this.cells[x][y] == null) {
            var img;
            img = this.game.add.image(x * this.cellSize, y * this.cellSize, "sprites", this.tileName[cell], this);
            img.sendToBack();
            this.cells[x][y] = img;
            this.setCellVisibility(x, y, false);
        }
        else {
            this.cells[x][y].loadTexture("sprites", this.tileName[cell]);
        }
        this.cells[x][y].width = this.cells[x][y].height = this.cellSize;
    };
    GameView.prototype.setCellVisibility = function (x, y, isVisible) {
        this.cells[x] = this.cells[x] || [];
        if (this.cells[x][y] == null) {
            this.setCell(x, y, CELLTYPE.ROCK);
        }
        this.cells[x][y].alpha = isVisible ? 1.0 : 0.33;
    };
    GameView.prototype.addActor = function (x, y, sprite) {
        var spr = this.game.add.sprite(x * this.cellSize, y * this.cellSize, "sprites", sprite, this);
        spr.width = spr.height = this.cellSize;
        var n = this.nextActorID++;
        this.actors[n] = spr;
        return n;
    };
    GameView.prototype.removeActor = function (actorID) {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        this.actors[actorID].destroy();
        this.actors[actorID] = null;
    };
    GameView.prototype.moveActor = function (actorID, x, y) {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        this.game.add.tween(this.actors[actorID]).
            to({ x: x * this.cellSize, y: y * this.cellSize }, 250, Phaser.Easing.Default, true);
    };
    GameView.prototype.updateActorVisiblity = function () {
        for (var _i = 0, _a = this.actors; _i < _a.length; _i++) {
            var actor = _a[_i];
            var x = Math.floor(actor.x / this.cellSize);
            var y = Math.floor(actor.y / this.cellSize);
            actor.alpha = this.cells[x][y].alpha;
            actor.visible = this.cells[x][y].visible;
        }
    };
    GameView.prototype.setCameraOn = function (actorID) {
        if (this.actors[actorID] == null) {
            throw Error("Unknown actor ID");
        }
        this.x = -this.actors[actorID].x - this.cellSize / 2 + this.game.width / 2;
        this.y = -this.actors[actorID].y - this.cellSize / 2 + this.game.height / 2;
    };
    return GameView;
}(Phaser.Group));
GameView.HIDDEN_ALPHA = 0.4;
GameView.SHOW_ALPHA = 1.0;
var ActorObject = (function () {
    function ActorObject(view, x, y) {
        this.xCell = x;
        this.yCell = y;
        this.view = view;
        this.initialiseObject(view, x, y);
        this.actorID = view.addActor(x, y, this.getSpriteName());
    }
    ActorObject.prototype.initialiseObject = function (view, x, y) {
    };
    ActorObject.prototype.destroy = function () {
        this.view.removeActor(this.actorID);
        this.view = null;
    };
    return ActorObject;
}());
var CELLTYPE;
(function (CELLTYPE) {
    CELLTYPE[CELLTYPE["FLOOR"] = 0] = "FLOOR";
    CELLTYPE[CELLTYPE["PASSAGE"] = 1] = "PASSAGE";
    CELLTYPE[CELLTYPE["ROCK"] = 2] = "ROCK";
    CELLTYPE[CELLTYPE["TREASURE"] = 3] = "TREASURE";
    CELLTYPE[CELLTYPE["FRAME"] = 4] = "FRAME";
    CELLTYPE[CELLTYPE["STAIRSD"] = 5] = "STAIRSD";
    CELLTYPE[CELLTYPE["STAIRSU"] = 6] = "STAIRSU";
    CELLTYPE[CELLTYPE["PIT"] = 7] = "PIT";
    CELLTYPE[CELLTYPE["DOOR"] = 8] = "DOOR";
})(CELLTYPE || (CELLTYPE = {}));
var DungeonLevel = (function () {
    function DungeonLevel(view, level, width, height) {
        this.width = width;
        this.height = height;
        this.level = level;
        this.monsters = [];
        this.treasures = [];
        this.cell = [];
        for (var x = 0; x < width; x++) {
            this.cell[x] = [];
            for (var y = 0; y < height; y++) {
                this.cell[x][y] = CELLTYPE.ROCK;
            }
        }
        this.frame();
        var roomCount = Math.max(3, Math.round(width * height) / (40 * 23) * 9);
        for (var n = 0; n < roomCount; n++) {
            this.drawRoom(view);
        }
        var pos = this.findSpace(CELLTYPE.FLOOR);
        this.cell[pos[0]][pos[1]] = CELLTYPE.STAIRSD;
        var pos = this.findSpace(CELLTYPE.FLOOR);
        this.cell[pos[0]][pos[1]] = CELLTYPE.STAIRSU;
        var goldCount = Math.max(2, Math.round(width * height) / (40 * 23) * 11);
        for (var n = 0; n < goldCount; n++) {
            var pos = this.findSpace(CELLTYPE.FLOOR);
            var trs = new Treasure(view, pos[0], pos[1]);
            this.treasures.push(trs);
        }
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                view.setCell(x, y, this.cell[x][y]);
            }
        }
        view.updateActorVisiblity();
    }
    DungeonLevel.prototype.findSpace = function (reqd) {
        var x;
        var y;
        var count = 0;
        do {
            if (count++ == 2000)
                return null;
            x = this.getIntRandom(this.width);
            y = this.getIntRandom(this.height);
        } while (this.cell[x][y] != reqd);
        return [x, y];
    };
    DungeonLevel.prototype.drawRoom = function (view) {
        var x;
        var y;
        var w;
        var h;
        var ok = false;
        var count = 0;
        while (!ok) {
            if (count++ == 100)
                return;
            var sz = Math.max(2, Math.round((this.width + this.height) / 63 * 9));
            w = this.getIntRandom(sz) + 2;
            h = this.getIntRandom(sz) + 2;
            x = this.getIntRandom(this.width - w - 1) + 1;
            y = this.getIntRandom(this.height - h - 1) + 1;
            ok = true;
            for (var xt = x - 1; xt <= x + w && ok; xt++) {
                for (var yt = y - 1; yt <= y + h && ok; yt++) {
                    if (this.cell[xt][yt] != CELLTYPE.ROCK) {
                        ok = false;
                    }
                }
            }
        }
        for (var xt = x; xt < x + w && ok; xt++) {
            for (var yt = y; yt < y + h && ok; yt++) {
                this.cell[xt][yt] = CELLTYPE.FLOOR;
            }
        }
        var m = new Monster(view, x + this.getIntRandom(w), y + this.getIntRandom(h));
        this.monsters.push(m);
        this.passage(x + 1, y + h, 0, 1);
        this.passage(x + w, y + 1, 1, 0);
        this.passage(x + 1, y - 1, 0, -1);
        this.passage(x - 1, y + 1, -1, 0);
    };
    DungeonLevel.prototype.passage = function (x, y, xi, yi) {
        var n = 0;
        while (this.cell[x + xi * n][y + yi * n] == CELLTYPE.ROCK) {
            n++;
        }
        if (this.cell[x + xi * n][y + yi * n] != CELLTYPE.FRAME) {
            var isFirst = true;
            while (--n >= 0) {
                this.cell[x + xi * n][y + yi * n] = (n == 0 || isFirst) ? CELLTYPE.DOOR : CELLTYPE.PASSAGE;
                isFirst = false;
            }
        }
    };
    DungeonLevel.prototype.frame = function () {
        for (var x = 0; x < this.width; x++) {
            this.cell[x][0] = this.cell[x][this.height - 1] = CELLTYPE.FRAME;
        }
        for (var y = 0; y < this.height; y++) {
            this.cell[0][y] = this.cell[this.width - 1][y] = CELLTYPE.FRAME;
        }
    };
    DungeonLevel.prototype.getRandom = function () {
        return Math.random();
    };
    DungeonLevel.prototype.getIntRandom = function (range) {
        return Math.floor(this.getRandom() * range);
    };
    DungeonLevel.prototype.get = function (x, y) {
        return this.cell[x][y];
    };
    DungeonLevel.prototype.set = function (x, y, cell) {
        this.cell[x][y] = cell;
    };
    DungeonLevel.prototype.getWidth = function () {
        return this.width;
    };
    DungeonLevel.prototype.getHeight = function () {
        return this.height;
    };
    DungeonLevel.prototype.getLevel = function () {
        return this.level;
    };
    DungeonLevel.prototype.openVisibility = function (view, x, y, radius) {
        for (var xc = x - radius; xc <= x + radius; xc++) {
            for (var yc = y - radius; yc <= y + radius; yc++) {
                if (xc >= 0 && yc >= 0 && xc < this.width && yc < this.height) {
                    view.setCellVisibility(xc, yc, true);
                }
            }
        }
        view.updateActorVisiblity();
    };
    DungeonLevel.prototype.openVisibilityAll = function (view) {
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                view.setCellVisibility(x, y, true);
            }
        }
        view.updateActorVisiblity();
    };
    return DungeonLevel;
}());
var GameStatus = (function () {
    function GameStatus() {
        this.firstLevelVisited = true;
        this.xPlayer = 0;
        this.yPlayer = 0;
        this.level = 1;
        this.gold = 0;
        this.lastLookGold = 0;
        this.hitPoints = 50;
        this.lastExperience = 0;
        this.killCount = 0;
    }
    return GameStatus;
}());
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Monster.prototype.getSpriteName = function () {
        return this.name;
    };
    Monster.prototype.initialiseObject = function (view, x, y) {
        var n = Math.floor(Math.random() * 6);
        if (n == 0) {
            this.name = "spider";
        }
        if (n == 1) {
            this.name = "dragon";
        }
        if (n == 2) {
            this.name = "grue";
        }
        if (n == 3) {
            this.name = "nuibus";
        }
        if (n == 4) {
            this.name = "snake";
        }
        if (n == 5) {
            this.name = "wyvern";
        }
    };
    return Monster;
}(ActorObject));
var Treasure = (function (_super) {
    __extends(Treasure, _super);
    function Treasure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Treasure.prototype.getSpriteName = function () {
        return "treasure";
    };
    return Treasure;
}(ActorObject));
