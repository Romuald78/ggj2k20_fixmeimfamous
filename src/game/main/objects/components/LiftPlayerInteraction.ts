import { ScriptComponent } from "../../ecs/system/script/ScriptComponent";
import { physicWorld } from "../../ecs/system/physics/PhysicWorld";
import { LiftMove } from "./LiftMove";
import { Entity } from "../../ecs/core/Entity";
import { PlayerMovement } from "../../ggj2020/PlayerMovement";
import { TouchBodyComponent } from "./TouchBodyComponent";
import { InputComponent } from "../../ecs/system/controls/InputComponent";


export class LiftPlayerInteraction implements ScriptComponent {


    constructor(private players: Entity[]) {

    }


    getName(): string {
        return "ListPlayerInteract";
    }

    updateScript(delta: number) {

        this.players.forEach(player => {
            let playerMov = player.getFirstComponentByName<PlayerMovement>(PlayerMovement.name);
            let playerInput = player.getFirstComponentByName<InputComponent>(InputComponent.name);
            let playerTouchControl = player.getFirstComponentByName<TouchBodyComponent>(TouchBodyComponent.name);
            if (playerMov.enableControl) {
                // Get all touch objects
                let to = playerTouchControl.getTouchObjects();
                // Find a lift
                Object.keys(to).forEach(key => {
                    let body = to[key];
                    physicWorld.getUserData(body).forEach(liftMoveScript => {
                        if (liftMoveScript instanceof LiftMove) {
                            if (playerInput) {
                                if (playerInput.isON("WALK_UP") && playerInput.isOFF("WALK_DOWN")) {
                                    (liftMoveScript as LiftMove).liftUp();
                                } else if (playerInput.isOFF("WALK_UP") && playerInput.isON("WALK_DOWN")) {
                                    (liftMoveScript as LiftMove).liftDown();
                                }
                            }
                        }
                    });
                });
            }
        });

    }


}