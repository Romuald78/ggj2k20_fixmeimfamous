import {Entity} from "../../ecs/core/Entity";
import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import {GameObjects, Tilemaps} from "phaser";
import {PlayerMovement} from "./PlayerMovement";


export class PlayerLadderIntercation implements ScriptComponent{


    constructor(private players:Entity[], private mapEntity:Entity) {

    }

    public getName(): string {
        return PlayerLadderIntercation.name;
    }

    public updateScript(delta: number) {

        // Set climb booleans for each player
        this.players.forEach(player => {
            // Player-Ladder interactions
            let ladderLayer = this.mapEntity.getFirstComponentByName<GfxGenericComponent<Tilemaps.DynamicTilemapLayer>>("ladderLayer").getGfxObj();
            let playerMov = player.getFirstComponentByName<PlayerMovement>(PlayerMovement.name);
            let playerGfx = player.getFirstComponentByName<GfxGenericComponent<GameObjects.Image>>("gfx").getGfxObj();
            playerMov.setClimb(ladderLayer.hasTileAtWorldXY(playerGfx.x, playerGfx.y + (playerGfx.scaleY*playerGfx.height/2) - 1));    // Let the character be able to climb when at bottom
        });

    }

}