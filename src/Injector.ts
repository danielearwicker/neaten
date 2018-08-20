import { InjectionMap } from "./InjectionMap";
import { Interface } from "./Interface";
import { Scope } from "./Scope";

export class Injector {

    public readonly global: Scope;

    private namedScopes: { [name: string]: Scope } = {};

    constructor(public readonly map: InjectionMap) {
        this.global = new Scope(this);
    }

    public scope(name: string) {
        return this.namedScopes[name] || (this.namedScopes[name] = new Scope(this));
    }

    public get transient() {
        return new Scope(this);
    }

    public need<T extends object>(singleton: Interface<T>) {
        return this.global.one(singleton);
    }
}
