import {GameObjects,Scene,Cameras} from "phaser";
import * as GameConstants from "../ggj2020/GameConstants";

export class GameCamera extends GameObjects.GameObject {

    private prevRatio:number

    constructor(scene:Scene) {
        super(scene, "");
        this.create();
        this.prevRatio = 0;
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
        let margin = GameConstants.ZOOM_MARGIN;
        let screen = this.scene.cameras.main.scaleManager.displaySize;
        let ratioX = (maxX-minX+margin)/screen.width;
        let ratioY = (maxY-minY+margin)/screen.height;
        let ratio  = Math.max( ratioX, ratioY );


        //* beugué O_o
        let TL = this.scene.cameras.main.getWorldPoint(0,0);
        let BR = this.scene.cameras.main.getWorldPoint(screen.width,screen.height);

        let isGoingOut:boolean = false;
        isGoingOut = isGoingOut || (minX-margin*0.5<=TL.x);
        isGoingOut = isGoingOut || (minY-margin*0.5<=TL.y);
        isGoingOut = isGoingOut || (maxX+margin*0.5>=BR.x);
        isGoingOut = isGoingOut || (maxY+margin*0.5>=BR.y);

        // force setZoom  when on edge
        if( minX <=2*margin || maxX >= GameConstants.MAP_W-2*margin || minY <=2*margin || maxY >= GameConstants.MAP_H-2*margin){
            this.scene.cameras.main.setZoom(1/ratio);
        }
        else{
            // DO other stuff in middle of area
            if(ratio > this.prevRatio && isGoingOut){
                this.scene.cameras.main.setZoom(1/ratio);
            }
            else  {
                this.scene.cameras.main.zoomTo(1/ratio);
            }
        }
        this.prevRatio = ratio;
         //*/

        this.scene.cameras.main.centerOn( (minX+maxX)/2, (minY+maxY)/2);
    }


}
