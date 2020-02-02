import { Component } from "../ecs/core/Component";


export class ModuleGrid implements Component {


    public grid: number[][] = [];

    getName(): string {
        return ModuleGrid.name;
    }

    mkRecipe(){
        let recipe: number[][]=[];
        for (let i=0;i<this.size-1;i++){
            recipe[i]=[];
            for (let j=0;j<this.size;j++){
                recipe[i].push(0);
                let module = Math.random()>0.10;
                if(module){
                    recipe[i][j] = Math.max(1,Math.ceil(Math.random()*this.maxModule));
                }else{
                    recipe[i][j] = 0;
                }
            }
        }
        //
        recipe[0][0] = Math.max(1,Math.ceil(Math.random()*this.maxModule));
        return recipe;
    }

    constructor(private configID,private size:number = 3,private maxModule = 5) {
        let configs = [
            this.mkRecipe(),
            this.mkRecipe(),
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