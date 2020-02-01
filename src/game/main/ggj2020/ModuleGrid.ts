import {Component} from "../ecs/core/Component";







export class ModuleGrid implements Component{


    private grid:number[][]=[];

    getName(): string {
        return ModuleGrid.name;
    }

    constructor(private configID){
        let configs = [
            [[1,3,0],[0,2,4]],
            [[0,3,1],[4,2,2]],
            ];
        // Keep only value in the
        this.configID = this.configID % configs.length;
        this.grid = configs[this.configID];
    }

    doesModuleMatch(dx:number,dy:number,moduleValue:number):boolean{
        if (dx < 0 || dx > this.grid[0].length){
            throw new Error("X Out of bounds NOOB !!!!");
        }
        if (dy < 0 || dy > this.grid.length){
            throw new Error("Y Out of bounds NOOB !!!!");
        }

        return this.grid[dy][dx] === moduleValue;
    }



}