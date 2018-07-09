import { Interface, InjectionMap } from "../src";

interface Pig {
    tail: string;

    be(): void;
}

const Pig = new Interface<Pig>("Pig");

interface Stye {
    wallow(): void;
}

const Stye = new Interface<Stye>("Stye");

interface Insect {
    buzz(): void;
}

const Insect = new Interface<Insect>("Insect");

class PigImpl implements Pig {

    tail = "curly";

    constructor(private stye: Stye, private insects: Insect[]) { }

    be() {
        this.stye.wallow();
        this.insects.forEach(i => i.buzz());
    }
}

const services = new InjectionMap();
services.singleton(Pig, x => new PigImpl(Stye.one(x), Insect.many(x)));
