import { Interface } from "./Interface";
import { Constructor } from "./Constructor";
import { InjectionContext } from "./InjectionContext";

export const enum InjectionKind {
    Singleton,
    Scoped,
    Transient
}

type Injectable = [InjectionKind, Constructor<object>[]];

export class InjectionMap {

    private entries = new Map<Interface<object>, Injectable>();

    get(iface: Interface<object>) {

        const entry = this.entries.get(iface);
        if (!entry) {
            throw new Error(`No constructor has been registered for ${iface.name}`);
        }

        return entry;
    }

    add<TInterface extends object>(
        kind: InjectionKind,
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {
     
        getOrAdd(this.entries, iface, () => [kind, []] as Injectable)[1].push(ctor);
        return this;
    }

    singleton<TInterface extends object>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {

        return this.add(InjectionKind.Singleton, iface, ctor);
    }

    transient<TInterface extends object>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {

        return this.add(InjectionKind.Transient, iface, ctor);
    }

    scoped<TInterface extends object>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {

        return this.add(InjectionKind.Scoped, iface, ctor);
    }

    context(): InjectionContext {
        return new InjectionContext(this);
    }
}
