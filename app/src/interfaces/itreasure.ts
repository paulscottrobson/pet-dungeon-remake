/// <reference path="../../lib/phaser.comments.d.ts"/>

interface ITreasure extends IObject {
    fillChestIfNeeded(status:IGameStatus): void;
    getGold(): number;
}

