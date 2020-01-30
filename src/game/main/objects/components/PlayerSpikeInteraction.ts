import {ScriptComponent} from "../../ecs/system/script/ScriptComponent";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import {Life} from "./Life";
import {GameObjects, Tilemaps} from "phaser";


export class PlayerSpikeInteraction implements ScriptComponent {
    getName(): string {
        return PlayerSpikeInteraction.name;
    }

    constructor(private playerGfx:GfxGenericComponent<GameObjects.Image>, private spikeMap:GfxGenericComponent<Tilemaps.DynamicTilemapLayer>, private life:Life){

    }

    updateScript(delta: number) {
        let player:GameObjects.Image = this.playerGfx.getGfxObj();
        let map:Tilemaps.DynamicTilemapLayer = this.spikeMap.getGfxObj();
        if( map.hasTileAtWorldXY( this.playerGfx.getGfxObj().x, player.y + (player.scaleY*player.height/2) - 1)){
            this.life.kill();
        }
    }


}