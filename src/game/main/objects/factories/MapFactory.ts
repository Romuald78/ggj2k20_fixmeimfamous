import { InputComponent } from "../../ecs/system/controls/InputComponent";
import { ECSWorld } from "../../ecs/system/ECSWorld";
import { Scene } from "phaser";
import { Entity } from "../../ecs/core/Entity";
import { LiftPlayerInteraction } from "../components/LiftPlayerInteraction";
import { GfxGenericComponent } from "../../ecs/system/gfx/GfxGenericComponent";
import { LiftFactory } from "./LiftFactory";
import { MapLifts } from "../components/MapLifts";
import { Tilemaps } from "phaser";
import { MapPhysic } from "../components/MapPhysic";
import { Bound } from "../components/Bound";


export class MapFactory {

    TILE_SIZE = 128;

    constructor(private world: ECSWorld, private scene: Scene) {

    }


    public createMap(players: Entity[], liftFactory: LiftFactory): Entity {
        let entity = this.world.createEntity();

        let liftPlayer = new LiftPlayerInteraction(players);
        entity.addComponent(liftPlayer);
        let gfxComp = new GfxGenericComponent<Tilemaps.Tilemap>(this.scene.make.tilemap({ key: 'map' }));
        entity.addComponent(gfxComp);

        const PixelsPerMeter = this.TILE_SIZE / 100;

        // load the map
        let map = gfxComp.getGfxObj();

        // Load tile set
        let tileSet = map.addTilesetImage('teamCroco3');

        // tiles for decoration (BACK)
        this.createBackObjects(map, tileSet);

        // Spikes
        let spikeLayer = map.createDynamicLayer('Spikes', tileSet, 0, 0);
        spikeLayer.setScale(1.0 / PixelsPerMeter);
        entity.addComponent(new GfxGenericComponent<Tilemaps.DynamicTilemapLayer>(spikeLayer, "spikes"));


        entity.addComponent(new MapLifts(gfxComp, liftFactory));

        entity.addComponent(new MapPhysic(gfxComp));

        // create the ground layer
        let groundLayer = map.createDynamicLayer('Ground', tileSet, 0, 0);
        entity.addComponent(new GfxGenericComponent<Tilemaps.DynamicTilemapLayer>(groundLayer, "groundLayer"));
        groundLayer.setScale(1.0 / PixelsPerMeter);

        // set the boundaries of our game world
        entity.addComponent(new Bound({
            width: groundLayer.width / PixelsPerMeter,
            height: (groundLayer.height + 800) / PixelsPerMeter,
            y: -(800 / PixelsPerMeter),
            x: 0,
        }));

        // Create ladder objects
        let ladderLayer = map.createDynamicLayer('Ladders', tileSet, 0, 0);
        entity.addComponent(new GfxGenericComponent<Tilemaps.DynamicTilemapLayer>(ladderLayer, "ladderLayer"));
        ladderLayer.setScale(1.0 / PixelsPerMeter);

        this.createFrontObjects(map, tileSet);

        return entity;
    }

    createBackObjects(map, tileSet) {
        // tiles for decoration (BACK)
        const PixelsPerMeter = this.TILE_SIZE / 100;
        let backObjects = map.createDynamicLayer('Back Objects', tileSet, 0, 0);
        backObjects.setScale(1.0 / PixelsPerMeter);
    }

    createFrontObjects(map, tileSet) {
        // tiles for decoration (FRONT)
        const PixelsPerMeter = this.TILE_SIZE / 100;
        let frontObjects = map.createDynamicLayer('Front objects', tileSet, 0, 0);
        frontObjects.setDepth(1000);
        frontObjects.setScale(1.0 / PixelsPerMeter);
    }



}