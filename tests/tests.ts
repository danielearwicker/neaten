import test from "blue-tape";

import { InjectionMap, Interface } from "../src";

type Channel = (message: string) => void;

interface Pig {
    tail: string;

    be(send: Channel): void;
}

const Pig = new Interface<Pig>("Pig");

interface Stye {
    wallow(send: Channel): void;
}

const Stye = new Interface<Stye>("Stye");

interface Insect {
    buzz(send: Channel): void;
}

const Insect = new Interface<Insect>("Insect");

class PigImpl implements Pig {

    public tail = "curly";

    constructor(public readonly stye: Stye, public readonly insects: Insect[]) { }

    public be(send: Channel) {
        this.stye.wallow(send);
        this.insects.forEach(i => i.buzz(send));
    }
}

class StyeImpl implements Stye {
    public wallow(send: Channel): void {
        send("Wallowing");
    }
}

class BeeImpl implements Insect {
    public buzz(send: Channel): void {
        send("Buzzing");
    }
}

class WaspImpl implements Insect {
    public buzz(send: Channel): void {
        send("Stinging");
    }
}

test("Requires one dependency to be registered", assert => {

    const injector = new InjectionMap()
        .add(Pig, i => new PigImpl(i.global.one(Stye), i.transient.many(Insect)))
        .injector;

    assert.throws(() => injector.transient.one(Pig), "No constructor has been registered for Stye");

    assert.end();
});

test("Requires many dependency to be registered", assert => {

    const injector = new InjectionMap()
        .add(Pig, i => new PigImpl(i.global.one(Stye), i.transient.many(Insect)))
        .add(Stye, () => new StyeImpl())
        .injector;

    assert.throws(() => injector.transient.one(Pig), "No constructor has been registered for Insect");

    assert.end();
});

const goodInjector = new InjectionMap()
    .add(Pig, i => new PigImpl(i.global.one(Stye), i.transient.many(Insect)))
    .add(Stye, () => new StyeImpl())
    .add(Insect, () => new BeeImpl())
    .add(Insect, () => new WaspImpl())
    .injector;

test("Resolves as expected", assert => {

    const messages: string[] = [];

    goodInjector.transient.one(Pig).be(m => messages.push(m));

    assert.equals(1, messages.filter(m => m === "Wallowing").length);
    assert.equals(1, messages.filter(m => m === "Buzzing").length);
    assert.equals(1, messages.filter(m => m === "Stinging").length);

    assert.end();
});

test("One instance of globals", assert => {

    const a = goodInjector.global.one(Pig);
    const b = goodInjector.global.one(Pig);

    assert.true(a === b);

    assert.end();
});

test("Method 'need' is just alias for global.one", assert => {

    const a = goodInjector.need(Pig);
    const b = goodInjector.need(Pig);

    assert.true(a === b);

    assert.end();
});

test("Separate instances of transients", assert => {

    const a = goodInjector.transient.one(Pig);
    const b = goodInjector.transient.one(Pig);

    assert.true(a !== b);

    assert.end();
});

test("Single instance of a global injected into multiple transients", assert => {

    const a = goodInjector.transient.one(Pig) as PigImpl;
    const b = goodInjector.transient.one(Pig) as PigImpl;

    assert.true(a.stye === b.stye);

    assert.end();
});

test("Separate instances from named scopes", assert => {

    const a = goodInjector.scope("a").one(Pig);
    const b = goodInjector.scope("b").one(Pig);
    const a2 = goodInjector.scope("a").one(Pig);

    assert.true(a !== b);
    assert.true(a === a2);

    assert.end();
});

test("Cannot resolve one if many registered", assert => {

    assert.throws(() => goodInjector.transient.one(Insect), "Ambiguous mapping for Insect");

    assert.end();
});
