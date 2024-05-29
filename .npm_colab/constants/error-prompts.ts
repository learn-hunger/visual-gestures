import { TChecks } from "../types/types"

export enum EOtherVariables {
    INFO_GAP = "",
    SYNTAX_GAP = "",
    SUGGESTION_GAP = "",
    SYNTAX = "Syntax: "
}
export enum EColorCodes {
    RED = "\x1b[31m",
    GREEN = "\x1b[32m",
    YELLOW = "\x1b[33m",
    BLUE = "\x1b[34m",
    DEFAULT = "\x1b[0m"
}
export enum ESymbols {
    ERROR = "X",
    INFO = "!",
    SUCCESS = "",
    BULB = "\b\b\u{1F4A1}",
    BULLET = "*",
    UNDERLINE = '\x1b[4m',
    REMOVE_UNDERLINE = '\x1b[0m'
}

export enum EMessages {
    ERROR = `${EColorCodes.RED} ${ESymbols.ERROR} ${ESymbols.BULLET} `,
    INFO = `${EColorCodes.BLUE} ${ESymbols.INFO} ${ESymbols.BULLET} `,
    SUGGESTION = `${EColorCodes.YELLOW}  ${ESymbols.BULB} ${ESymbols.BULLET} `,
    SUCCESS = `${EColorCodes.GREEN} ${ESymbols.SUCCESS} ${ESymbols.BULLET} `,
    SYNTAX = `${EColorCodes.YELLOW}  ${ESymbols.BULB} ${ESymbols.BULLET} `,

}

export enum EErrorTypes {
    // SyntaxError=`${red}Syntax Error at${blue}`
    IDENTIER_ERROR = "Identier Name Invalid ",
    VALUE_ERROR = "Value Name Invalid "
}

export const C_INFO_TYPES: { [k in TChecks]: string } = {
    ENUM_IDENTIFIER: "Enum Should Start With Capital Letter E ",
    TYPE_IDENTIFER: "Type Should Start With Capital Letter T ",
    INTERFACE_IDENTIFIER: "Interface Should Start With Capital Letter I ",
    ABSTRACT_IDENTIFIER: "Abstract  Should Start With Capital Letter A ",
    CLASS_IDENTIFIER: "Class should be PascalCase ",
    NAMESPACE_IDENTIFER: "Namespace Should Start With Capital Letter N ",
    CONST_IDENTIFIER: "Const SHOULD follow SCREAMING_SNAKE_Case and starting with Capital letter C "
}

export const C_SYNTAX_TYPES: { [key in TChecks]: string } = {
    ENUM_IDENTIFIER: `<E><Prefix><Suffix>`,
    TYPE_IDENTIFER: "<T><Prefix><Suffix>",
    INTERFACE_IDENTIFIER: "<I><Prefix><Suffix>",
    ABSTRACT_IDENTIFIER: "<A><Prefix><Suffix>",
    CLASS_IDENTIFIER: "<StartingCapitalLetter><remainingword><StartingCapitalLetter><remainingword>",
    NAMESPACE_IDENTIFER: "<N><Prefix><Suffix>",
    CONST_IDENTIFIER: "<C><_><Prefix><_><Suffix>"
}

export const C_SUGGESTION_TYPES: { [key in TChecks]: string } = {
    ENUM_IDENTIFIER: "example: enum ELearnHunger {};",
    TYPE_IDENTIFER: "example: type TLearnHunger {};",
    INTERFACE_IDENTIFIER: "example interface ILearnHunger {}",
    ABSTRACT_IDENTIFIER: "example abstract ALearnHunger {}",
    CLASS_IDENTIFIER: "example class LearnHunger {}",
    NAMESPACE_IDENTIFER: "example namespace NLearnHunger {}",
    CONST_IDENTIFIER: "example const C_LEARN_Hunger {}"
}
