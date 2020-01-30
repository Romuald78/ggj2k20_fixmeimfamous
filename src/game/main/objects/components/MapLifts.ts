import {Component} from "../../ecs/core/Component";
import {Entity} from "../../ecs/core/Entity";
import {GfxGenericComponent} from "../../ecs/system/gfx/GfxGenericComponent";
import {Tilemaps} from "phaser";


export class MapLifts implements Component{
    private lifts: Entity[] = [];
    LIFT = 77;

    constructor(mapGfx:GfxGenericComponent<Tilemaps.Tilemap>,liftFactory) {

        let map = mapGfx.getGfxObj();
        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {

                ///Process lift
                if (map.getTileAt(x, y, true, "Lifts").index === this.LIFT) {
                    // Init min and max values
                    let minx = x;
                    let maxx = x;
                    let miny = y;
                    let maxy = y;

                    // direction
                    for (let dir = 0; dir < 4; dir++) {
                        let dx = 0;
                        let dy = 0;
                        if (dir == 0) {
                            dy = -1;
                        } else if (dir == 1) {
                            dy = 1;
                        } else if (dir == 2) {
                            dx = 1;
                        } else if (dir == 3) {
                            dx = -1;
                        }

                        // distance
                        for (let dist = 1; dist < Math.max(map.width, map.height); dist++) {
                            if (map.getTileAt(x + dist * dx, y + dist * dy, true, "Lifts").index !== 73) {
                                // Store max X Y
                                minx = Math.min(minx, x + dist * dx - dx);
                                maxx = Math.max(maxx, x + dist * dx - dx);
                                miny = Math.min(miny, y + dist * dy - dy);
                                maxy = Math.max(maxy, y + dist * dy - dy);
                                // End of current direction
                                break;
                            }
                        }
                    }

                    // now try to find at most 2 switches for this lift (one switch on the upper side; one switch on the lower side)
                    // the switch MUST BE on the correct Y value AND MUST BE in range of 3 cells on X axis
                    let maxRange:number = 3;
                    let switchList = [];
                    // UPPER and LOWER SWITCHES
                    for(let dx=minx-maxRange; dx<=maxx+maxRange;dx++){
                        let dy = miny-1;
                        if ( map.getTileAt(dx, dy, true, "Lifts").index === 85 ){
                            switchList.push( [dx*100,dy*100] );
                        }
                        dy = maxy-1;
                        if ( map.getTileAt(dx, dy, true, "Lifts").index === 85 ){
                            switchList.push( [dx*100,dy*100] );
                        }
                    }

                    // Create lift objects according to found areas
                    this.lifts.push(liftFactory.createLift(minx * 100, miny * 100, (maxx - minx + 1) * 100, (maxy - miny + 1) * 100, y * 100, switchList) );
                }
            }
        }
    }

    public getName(): string {
        return MapLifts.name;
    }

    getLifts(): Entity[] {
        return this.lifts;
    }

}