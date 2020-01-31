import { ScriptComponent } from "../../ecs/system/script/ScriptComponent";
import { PlayerMovement } from "../../ggj2020/PlayerMovement";
import { InputComponent } from "../../ecs/system/controls/InputComponent";

export class PlayerControl implements ScriptComponent {


    constructor(private playerMovement: PlayerMovement, private input: InputComponent) {
    }

    public getName(): string {
        return PlayerControl.name;
    }

    public updateScript(delta: number) {
    }

}