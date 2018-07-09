import { InjectionContext } from "./InjectionContext";

export type Constructor<TInterface> = (provider: InjectionContext) => TInterface;

