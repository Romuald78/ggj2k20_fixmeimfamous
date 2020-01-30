import {GameObjects,Scene,Cameras} from "phaser";

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

    startFollow(object:any):Promise<void>{
        return new Promise<void>((resolve, reject) => {
            this.scene.cameras.main.stopFollow();
            this.scene.cameras.main.pan(object.x,object.y,300,"Power2", true,(camera: Phaser.Cameras.Scene2D.Camera, progress: number, x: number, y: number) => {
                if(progress>=0.85){
                    this.scene.cameras.main.startFollow(object,false,0.1,0.1);
                    resolve();
                }
            })
        })
    }

    update(delta): void {

    }

    destroy(){

    }
}
