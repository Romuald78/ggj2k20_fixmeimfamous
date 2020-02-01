import {GameObjects,Scene,Cameras} from "phaser";
import * as GameConstants from "../ggj2020/GameConstants";

export class GameCamera extends GameObjects.GameObject {
    constructor(scene:Scene) {
        super(scene, "");
        this.create();
    }

    create() {
    }

    setBounds(x:number,y:number,width:number,height:number){
        this.scene.cameras.main.setBounds(x,y,width,height);
    }


    update(delta): void {

    }

    destroy(){

    }

    zoom(minX:number, minY:number, maxX:number, maxY:number){
//*
        let screen = this.scene.cameras.main.scaleManager.displaySize;
        let ratioX = 1.5*(maxX-minX)/screen.width;
        let ratioY = 1.5*(maxY-minY)/screen.height;
        let ratio  = Math.max( ratioX, ratioY );
        this.scene.cameras.main.zoomTo(1/ratio);
        this.scene.cameras.main.centerOn( (minX+maxX)/2, (minY+maxY)/2);
//*/
    }


}
