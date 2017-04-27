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
        var r = new GameView(this.game, 64);
        r.addArea(0, 0, 40, 23, CELLTYPE.FRAME);
        r.addArea(1, 1, 38, 21, CELLTYPE.ROCK);
        r.addArea(3, 3, 3, 4, CELLTYPE.FLOOR);
        r.setCell(4, 4, CELLTYPE.TREASURE);
        r.setCell(4, 4, CELLTYPE.PIT);
        var n = r.addActor(1, 1, "player");
        r.moveActor(n, 3, 7);
    };
    GameState.prototype.create = function () {
    };
    GameState.prototype.destroy = function () {
    };
    GameState.prototype.update = function () {
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
        _this.singleCells = [];
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
        this.actors = this.singleCells = null;
        _super.prototype.destroy.call(this);
    };
    GameView.prototype.setCell = function (x, y, cell) {
        var key = this.getKey(x, y);
        if (this.singleCells[key] == null) {
            var img;
            img = this.game.add.image(x * this.cellSize, y * this.cellSize, "sprites", this.tileName[cell], this);
            this.singleCells[key] = img;
            this.setCellVisible(x, y, false);
        }
        else {
            this.singleCells[key].loadTexture("sprites", this.tileName[cell]);
        }
        this.singleCells[key].width = this.singleCells[key].height = this.cellSize;
    };
    GameView.prototype.setCellVisible = function (x, y, isVisible) {
        if (isVisible === void 0) { isVisible = true; }
        var key = this.getKey(x, y);
        if (this.singleCells[key] == null) {
            throw Error("Cannot change visibility of no cell");
        }
        this.singleCells[key].alpha = isVisible ? GameView.SHOW_ALPHA : GameView.HIDDEN_ALPHA;
        for (var _i = 0, _a = this.actors; _i < _a.length; _i++) {
            var actor = _a[_i];
            if (actor.x == x * this.cellSize && actor.y == y * this.cellSize) {
                actor.alpha = this.singleCells[key].alpha;
            }
        }
    };
    GameView.prototype.getKey = function (x, y) {
        return (x + 10) * 1000 + y + 10;
    };
    GameView.prototype.addArea = function (x, y, width, height, cell) {
        for (var x1 = x; x1 < x + width; x1++) {
            for (var y1 = y; y1 < y + height; y1++) {
                this.setCell(x1, y1, cell);
            }
        }
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
        var key = this.getKey(x, y);
        if (this.singleCells[key] != null) {
            this.actors[actorID].alpha = this.singleCells[key].alpha;
        }
        else {
            this.actors[actorID].alpha = GameView.HIDDEN_ALPHA;
        }
    };
    return GameView;
}(Phaser.Group));
GameView.HIDDEN_ALPHA = 0.4;
GameView.SHOW_ALPHA = 1.0;
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
var GameStatus = (function () {
    function GameStatus() {
        this.x = 0;
        this.y = 0;
        this.level = 1;
        this.gold = 0;
        this.hitPoints = 50;
        this.lastExperience = 0;
        this.killCount = 0;
    }
    return GameStatus;
}());
