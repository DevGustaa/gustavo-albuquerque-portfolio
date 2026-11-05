import { en } from "./en";
import { pt } from "./pt";
import type { Content, Locale } from "./types";

export const content: Record<Locale, Content> = { pt, en };
export { profile } from "./profile";
export * from "./types";
