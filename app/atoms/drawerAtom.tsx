import { atom } from "jotai";
import type { EDrawerContent } from "~/types";

export const drawerVisibilityAtom = atom(false);
export const drawerKeyAtom = atom<EDrawerContent>();
// TODO: remove this any
// biome-ignore lint/suspicious/noExplicitAny: <idk any data can be passed an used just assert type where i use or check if this support some kind of generic types>
export const drawerDataAtom = atom<Record<string, any>>({});
