import { InputComponent } from './../ecs/system/controls/InputComponent';
import { ScriptComponent } from "../ecs/system/script/ScriptComponent";
import * as Matter from "matter-js";
import { physicWorld } from "../ecs/system/physics/PhysicWorld";
import { TouchBodyComponent } from "../objects/components/TouchBodyComponent";
import * as GameConstants from "./GameConstants";
import { PhysicGenericComponent } from "../ecs/system/physics/PhysicGenericComponent";
import { GameCamera } from "../objects/GameCamera";
import { Entity } from "../ecs/core/Entity";


export class CameraZoom implements ScriptComponent {




    constructor(private playerList: Entity[], private gameCam: GameCamera) {
    }

    public getName(): string {
        return CameraZoom.name;
    }

    public updateScript(delta: number) {

        let minX = 1000000000;
        let minY = 1000000000;
        let maxX = -1000000000;
        let maxY = -1000000000;
        // Get min and max X and Y for each physic body
        this.playerList.forEach(ent => {
            let bdy = ent.getFirstComponentByName<PhysicGenericComponent>(PhysicGenericComponent.name)
            minX = Math.min(bdy.getX(), minX);
            minY = Math.min(bdy.getY(), minY);
            maxX = Math.max(bdy.getX(), maxX);
            maxY = Math.max(bdy.getY(), maxY);
        });


        this.gameCam.zoom(minX, minY, maxX, maxY, delta);

        this.gameCam.update(delta);
    }
}