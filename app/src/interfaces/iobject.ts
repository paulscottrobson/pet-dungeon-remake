/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IObject {
    /**
     * ID of actor.
     * 
     * @type {number}
     * @memberOf IObject
     */
    actorID:number;
    /**
     * x Cell position
     * 
     * @type {number}
     * @memberOf IObject
     */
    xCell:number;
    /**
     * y Cell position
     * 
     * @type {number}
     * @memberOf IObject
     */
    yCell:number;
    /**
     * Get name of sprite to use for display object
     * 
     * @returns {string} 
     * 
     * @memberOf IObject
     */
    getSpriteName():string;
    /**
     * Initialise rest of object, pseudo constructor called before view actor
     * instantiated (so selects the monster for example).
     * 
     * @param {IView} view 
     * @param {IGameStatus} status
     * @param {number} x 
     * @param {number} y 
     * 
     * @memberOf IObject
     */
    initialiseObject(view:IView,status:IGameStatus,x:number,y:number):void;
    /**
     * Delete the object.
     * 
     * 
     * @memberOf IObject
     */
    destroy() : void;
}

