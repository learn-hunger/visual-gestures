import { TChecks } from "../types/types";
export const C_CHECK_REGEX: { [key in TChecks]: RegExp } = {
    ENUM_IDENTIFIER: (/^E[A-Z]/),
    TYPE_IDENTIFER: (/^T[A-Z]/),
    INTERFACE_IDENTIFIER: (/^I[A-Z]/),
    ABSTRACT_IDENTIFIER: (/^A[A-Z]/),
    CLASS_IDENTIFIER: (/^[A-Z]/),
    NAMESPACE_IDENTIFER: (/^N[A-Z]/),

    CONST_IDENTIFIER: (/^C(_[A-Z]+)+$/)
}

