import { Component } from "../ecs/core/Component";
import * as GameConstants from "../ggj2020/GameConstants";

export class ModuleGrid implements Component {


    public grid: number[][] = [];

    getName(): string {
        return ModuleGrid.name;
    }

    mkRecipe(){
        let recipe: number[][]=[];
        for (let i=0;i<this.sizeY;i++){
            recipe[i]=[];
            for (let j=0;j<this.sizeX;j++){
                recipe[i].push(0);
                recipe[i][j] = Math.max(1,Math.ceil(Math.random()*this.maxModule));
            }
        }

        // Remove some parts
        for(let i=0;i<Math.round(this.sizeX*this.sizeY); i++){
            if( Math.random()<= GameConstants.ALEA_RECIPE ){
                // Pick a random position
                let rx = Math.floor(Math.random()*this.sizeX);
                let ry = Math.floor(Math.random()*this.sizeY);
                // check if there is at least one module on X AND one on Y
                let okX:boolean = false;
                let okY:boolean = false;
                // loop for 9 cells around the random pos
                for(let dx=-1;dx<=1;dx++){
                    for(let dy=-1;dy<=1;dy++){
                        // if not the center cell and not the upper left cell
                        if( (dx !=0 && dy != 0) && (rx !=0 && ry != 0) ){
                            // if position is in the recipe grid
                            if(rx+dx>=0 && rx+dx<this.sizeX){
                                if(ry+dy>=0 && ry+dy<this.sizeY){
                                    // if there is a module != 0 with y == 0
                                    if( recipe[ry][rx+dx] != 0 ){
                                        okX = true;
                                    }
                                    // if there is a module != with x == 0
                                    if( recipe[ry+dy][rx] != 0 ){
                                        okY = true;
                                    }
                                }
                            }
                        }
                    }
                }
                // Check if this is ok both for X and Y
                if( okX && okY ){
                    // remove module at rx,ry
                    recipe[ry][rx] = 0;
                }
            }
        }

        return recipe;
    }

    constructor(private configID,private sizeX:number = 3,private sizeY:number = 2,private maxModule = 6) {
        let configs = [
//            [[1,2,3],[4,5,6]],
//            [[6,5,4],[3,2,1]]
            this.mkRecipe(),
            this.mkRecipe()
        ];

        // Keep only value in the
        this.configID = this.configID % configs.length;
        this.grid = configs[this.configID];
    }

    doesModuleMatch(dx: number, dy: number, moduleValue: number): boolean {
        if (dx < 0 || dx > this.grid[0].length) {
            throw new Error("X Out of bounds NOOB !!!!");
        }
        if (dy < 0 || dy > this.grid.length) {
            throw new Error("Y Out of bounds NOOB !!!!");
        }

        return this.grid[dy][dx] === moduleValue;
    }



}