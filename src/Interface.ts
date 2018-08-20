import { Scope } from "./Scope";

export class Interface<TInterface extends object> {

    constructor(public readonly name: string) { }

    public one(scope: Scope): TInterface {
        return scope.one(this);
    }

    public many(scope: Scope): TInterface[] {
        return scope.many(this);
    }
}
