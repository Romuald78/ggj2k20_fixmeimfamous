import { Component } from "../ecs/core/Component";
import { Physic2D } from "../ecs/system/physics/Physic2D";
import { PhysicGenericComponent } from "../ecs/system/physics/PhysicGenericComponent";

export class ModuleInfo implements Component {

    private isCarried: boolean;
    private phyCarrier: Physic2D | PhysicGenericComponent;

    getName(): string {
        return ModuleInfo.name;
    }

    constructor(private id: number) {
        this.isCarried = false;
        this.phyCarrier = null;
    }

    getID(): number {
        return this.id;
    }

    take(carrier: Physic2D | PhysicGenericComponent) {
        this.phyCarrier = carrier;
        this.isCarried = true;
    }

    leave() {
        this.isCarried = false;
        this.phyCarrier = null;
    }

    getCarryMode(): boolean {
        return this.isCarried;
    }

    getPhyCarrier() {
        return this.phyCarrier;
    }
}