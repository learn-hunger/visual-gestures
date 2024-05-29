import { EChecks } from "../constants/checks";
import { EErrorTypes } from "../constants/error-prompts";

export type TChecks=keyof typeof EChecks;
export type TErrorTypes=keyof typeof EErrorTypes;