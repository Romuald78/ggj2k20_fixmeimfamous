import {Component} from "../../ecs/core/Component";

export class Life implements Component{
    getName(): string {
        return Life.name;
    }

    constructor(private life:number){

    }

    getLife():number{
        return this.life;
    }
    isDead():boolean{
        return this.life <= 0;
    }
    isAlive():boolean{
        return !this.isDead();
    }

    setLife(newLife:number){
        this.life = newLife;
    }
    hurt(inc:number){
        this.life += inc;
    }
    kill(){
        this.life = 0;
    }

}