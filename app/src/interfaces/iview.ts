/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IView {
    /**
     * Destroy a rendered object
     * 
     * 
     * @memberOf IView
     */
    destroy(): void;
    /**
     * Set a single cell item.
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {CELLTYPE} cell 
     * 
     * @memberOf IView
     */
    setCell(x:number,y:number,cell:CELLTYPE): void;
    /**
     * Add a rectangular area of cell
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {CELLTYPE} cell 
     * 
     * @memberOf IView
     */
    addArea(x:number,y:number,width:number,height:number,cell:CELLTYPE): void;
    /**
     * Add a game actor (player, monster)
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} sprite 
     * @returns {number} 
     * 
     * @memberOf IView
     */
    addActor(x:number,y:number,sprite:string) : number;
    /**
     * Remove a game actor
     * 
     * @param {number} actorID 
     * 
     * @memberOf IView
     */
    removeActor(actorID:number) : void;
    /**
     * Move a game actor.
     * 
     * @param {number} actorID 
     * @param {number} x 
     * @param {number} y 
     * 
     * @memberOf IView
     */
    moveActor(actorID:number,x:number,y:number) : void;

    /**
     * Set cells visibility. (defaults to invisible).
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} [isVisible=true] 
     * 
     * @memberOf IView
     */
    setCellVisible(x:number, y:number,isVisible:boolean) : void;
}