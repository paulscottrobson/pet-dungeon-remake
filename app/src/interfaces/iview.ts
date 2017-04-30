/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IView {
    /**
     * Destroy the view object (called automatically on scene end)
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
    /**
     * Update the status display.
     * 
     * @param {IGameStatus} status 
     * 
     * @memberOf IView
     */
    updateStatus(status:IGameStatus): void;
    /**
     * Write to the status display
     * 
     * @param {string} s 
     * 
     * @memberOf IView
     */
    write(s:string):void;
    /**
     * Signal raised when click on game area. Sends (view,dx,dy,pointer) where
     * dx/dy are -1 0 1 , pointer is Phaser.pointer
     * 
     * @type {Phaser.Signal}
     * @memberOf IView
     */
    onClickGameSpace:Phaser.Signal;

    /**
     * Show game over etc. message
     * 
     * 
     * @memberOf IView
     */
    showResult(msg:string):void;

}