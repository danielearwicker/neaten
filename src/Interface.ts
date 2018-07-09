import { InjectionContext } from "./InjectionContext";

export class Interface<TInterface extends object> {

    constructor(public readonly name: string) { }

    one(context: InjectionContext): TInterface {
        return context.one(this) as TInterface;
    }

    many(context: InjectionContext): TInterface[] {
        return context.many(this) as TInterface[];
    }
}
