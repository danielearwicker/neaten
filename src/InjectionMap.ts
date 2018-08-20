import { List, Map } from "immutable";
import { Constructor } from "./Constructor";
import { Injector } from "./Injector";
import { Interface } from "./Interface";

export class InjectionMap {

    private entries: Map<Interface<object>, List<Constructor<object>>>;

    constructor(entries?: Map<Interface<object>, List<Constructor<object>>>) {
        this.entries = entries || Map();
    }

    public getConstructors(iface: Interface<object>) {

        const entry = this.entries.get(iface);
        if (!entry) {
            throw new Error(`No constructor has been registered for ${iface.name}`);
        }

        return entry;
    }

    public add<TInterface extends object>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {

        return new InjectionMap(this.entries.update(iface,
            list => (list || List<Constructor<object>>()).push(ctor)));
    }

    public get injector() {
        return new Injector(this);
    }
}
