/// <reference path="../../lib/phaser.comments.d.ts"/>

interface ILevel {
    /**
     * Get the contents of a cell
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {CELLTYPE} 
     * 
     * @memberOf ILevel
     */
    get(x:number,y:number) : CELLTYPE;
    /**
     * Set the contents of a cell
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {CELLTYPE} cell 
     * 
     * @memberOf ILevel
     */
    set(x:number,y:number,cell:CELLTYPE): void;
    /**
     * Get the level width
     * 
     * @returns {number} 
     * 
     * @memberOf ILevel
     */
    getWidth():number;
    /**
     * Get the level height
     * 
     * @returns {number} 
     * 
     * @memberOf ILevel
     */
    getHeight():number;
    /**
     * Get the level number
     * 
     * @returns {number} 
     * 
     * @memberOf ILevel
     */
    getLevel():number;
    /**
     * Open view in given view
     * 
     * @param {IView} view 
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius 
     * 
     * @memberOf ILevel
     */
    openVisibility(view:IView,x:number,y:number,radius:number): void;
    /**
     * Open whole display in given view.
     * 
     * @param {IView} view 
     * 
     * @memberOf ILevel
     */
    openVisibilityAll(view:IView): void;

    /**
     * Find empty space in current level
     * 
     * @param {CELLTYPE} reqd type of tile which is 'empty'
     * @returns {number[]} [x,y]
     * 
     * @memberOf ILevel
     */
    findSpace(reqd:CELLTYPE):number[];
}