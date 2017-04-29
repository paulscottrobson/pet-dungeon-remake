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
     * Set a single cell item, make initially invisible
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {CELLTYPE} cell 
     * 
     * @memberOf IView
     */
    setCell(x:number,y:number,cell:CELLTYPE): void;
    /**
     * Set the cell visibility.
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} isVisible 
     * 
     * @memberOf IView
     */
    setCellVisibility(x:number,y:number,isVisible:boolean): void;
    /**
     * Add an actor at the given position.
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
     * Update visibility of all actors. 
     * 
     * @memberOf IView
     */
    updateActorVisiblity() : void;
    /**
     * Arrange so the camera is on the given actor.
     * 
     * @param {number} actorID 
     * 
     * @memberOf IView
     */
    setCameraOn(actorID:number) : void;
}