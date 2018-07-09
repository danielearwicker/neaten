export class InjectionContext {

}

// Acts as a runtime symbol identifying an interface
export class Interface<TInterface> {

    one(provider: InjectionContext): TInterface {

        return {} as TInterface;
    }

    many(provider: InjectionContext): TInterface[] {

        return [];
    }
}

export type Constructor<TInterface> = (provider: InjectionContext) => TInterface;

export class InjectionMap {

    singleton<TInterface>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {
        return this;
    }

    transient<TInterface>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {
        return this;
    }

    scoped<TInterface>(
        iface: Interface<TInterface>,
        ctor: Constructor<TInterface>) {
        return this;
    }

    context(): InjectionContext {
        return {};
    }
}

interface Pig {
    tail: string;
}

const Pig = new Interface<Pig>();

interface Stye {
    wallow(): void;
}

const Stye = new Interface<Stye>();

interface Insect {
    buzz(): void;
}

const Insect = new Interface<Insect>();

class PigImpl implements Pig {

    tail = "curly";

    constructor(private stye: Stye, private insects: Insect[]) { }
}

const services = new InjectionMap();
services.singleton(Pig, x => new PigImpl(Stye.one(x), Insect.many(x)));
