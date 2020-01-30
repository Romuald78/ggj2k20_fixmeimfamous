import {GfxComponent} from "./GfxComponent";

export class GfxGenericComponent<T> implements GfxComponent {

    constructor(private go: T, private name: string = GfxGenericComponent.name) {
    }

    getGfxObj(): T {
        return this.go;
    }

    getName(): string {
        return this.name;
    }

    setPosition(x: number, y: number) {
        (this.go as any).setPosition(x, y);
    }

    setRotation(a: number) {
        (this.go as any).setRotation(a);
    }

}