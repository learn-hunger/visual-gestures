import { TChecks } from "./types/types";

export const LHLint: { [key in TChecks]: boolean } = {
    ENUM_IDENTIFIER: true,
    TYPE_IDENTIFER: true,
    INTERFACE_IDENTIFIER: true,
    ABSTRACT_IDENTIFIER: true,
    CLASS_IDENTIFIER: true,
    NAMESPACE_IDENTIFER: true,
    CONST_IDENTIFIER: false
}
