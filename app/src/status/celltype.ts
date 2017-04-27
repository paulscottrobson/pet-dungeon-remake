/// <reference path="../../lib/phaser.comments.d.ts"/>

enum CELLTYPE {
	FLOOR = 0,                  // Cell Floor		 
	PASSAGE = 1,                // Passageway between rooms.
	ROCK = 2,                   // Rock wall		 
	TREASURE = 3,               // Treasure chest	 
	FRAME = 4,                  // Outside Frame
	STAIRSD = 5,		        // Stairs Down
	STAIRSU = 6, 	            // Stairs Up
	PIT = 7,			        // Pit
	DOOR = 8		            // Door
}