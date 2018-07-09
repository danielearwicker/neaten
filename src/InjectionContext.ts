import { InjectionMap, InjectionKind } from "./InjectionMap";
import { Interface } from "./Interface";

export class InjectionContext {

    singletons: Map<Interface<object>, object[]>;
    scoped = new Map<Interface<object>, object[]>();

    constructor(
        private map: InjectionMap, 
        singletons?: Map<Interface<object>, object[]>
    ) { 
        this.singletons = singletons || new Map<Interface<object>, object[]>();        
    }

    scope(): InjectionContext {
        return new InjectionContext(this.map, this.singletons);
    }

    one(key: Interface<object>) {
        const instances = this.many(key);
        if (instances.length !== 1) {
            throw new Error(`Ambiguous mapping for ${key.name}`);
        }

        return instances[0];
    }

    many(key: Interface<object>): object[] {
        const entry = this.map.get(key);
        const ctor = () => entry[1].map(ctor => ctor(this));

        if (entry[0] === InjectionKind.Transient) {
            return ctor();
        }

        const map = entry[0] === InjectionKind.Scoped ? this.scoped : this.singletons;
        return getOrAdd(map, key, ctor);
    }
}
