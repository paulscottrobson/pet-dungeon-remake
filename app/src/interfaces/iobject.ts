/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IObject {
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
     * @param {number} x 
     * @param {number} y 
     * 
     * @memberOf IObject
     */
    initialiseObject(view:IView,x:number,y:number):void;
}

