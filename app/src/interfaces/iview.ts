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
}