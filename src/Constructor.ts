import { Injector } from "./Injector";

export type Constructor<TInterface> = (injector: Injector) => TInterface;
