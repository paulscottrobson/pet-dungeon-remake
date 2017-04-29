/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IGameStatus {
    /**
     * Set to true when not previously visited a level
     * 
     * @type {boolean}
     * @memberOf IGameStatus
     */
    firstLevelVisited:boolean;
    /**
     * Player cell position
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    xPlayer:number;
    /**
     * Player cell position
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    yPlayer:number;
    /**
     * Game level number
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    level:number;
    /**
     * Gold
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    gold:number;
    /**
     * Experience points
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    experience:number;
    /**
     * Hit points
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    hitPoints:number;
    /**
     * Last experience value where level went up
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    lastExperience:number;
    /**
     * Number of kills.
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    killCount:number;
    /**
     * Gold seen on last sscan
     * 
     * @type {number}
     * @memberOf IGameStatus
     */
    lastLookGold:number;
}
