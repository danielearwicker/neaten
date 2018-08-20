import { Injector } from "./Injector";
import { Interface } from "./Interface";

export class Scope {

    private cache = new Map<Interface<object>, object[]>();

    constructor(private injector: Injector) { }

    public one<T extends object>(key: Interface<T>) {
        const instances = this.many(key);
        if (instances.length !== 1) {
            throw new Error(`Ambiguous mapping for ${key.name}`);
        }

        return instances[0];
    }

    public many<T extends object>(key: Interface<T>): T[] {

        const existing = this.cache.get(key);
        if (existing) {
            return existing as T[];
        }

        const objects = this.injector.map.getConstructors(key)
                                         .map(c => c!(this.injector) as T)
                                         .toArray();
        this.cache.set(key, objects);
        return objects;
    }
}
