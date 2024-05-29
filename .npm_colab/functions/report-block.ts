import ts from "typescript";
import { ErrorExist } from "../constants/checks";
import { C_INFO_TYPES, EColorCodes, EErrorTypes, EMessages, EOtherVariables, C_SUGGESTION_TYPES, ESymbols, C_SYNTAX_TYPES } from "../constants/error-prompts";
import { C_CHECK_REGEX } from "../constants/regex";
import { TChecks, TErrorTypes } from "../types/types";

export function reportBlock(sourceFile: ts.SourceFile, node: ts.Node, errorMessage: TErrorTypes, check: TChecks): void {
    ErrorExist.state=true;
    console.log(
        reportError(sourceFile, node, errorMessage),"\n",
        EOtherVariables.INFO_GAP,reportInfo(check),"\n",
        EOtherVariables.SYNTAX_GAP,reportSyntax(check),"\n",
        EOtherVariables.SUGGESTION_GAP,reportSuggestion(check)
    );
    // console.log(reportInfo(infoMessage));
    // reportSyntax();
    // reportSuggestion();
}

function reportError(sourceFile: ts.SourceFile, node: ts.Node, errorMessage: TErrorTypes): string {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const message = `${EMessages.ERROR} ${EErrorTypes[errorMessage]} in file ${EColorCodes.DEFAULT} ${ESymbols.UNDERLINE}${sourceFile.fileName}${ESymbols.REMOVE_UNDERLINE} ${EColorCodes.RED}at location ${EColorCodes.DEFAULT}(${line + 1},${character + 1})`
    return message;
}

function reportInfo(infoMessage: TChecks): string {
    const message = `${EMessages.INFO} ${C_INFO_TYPES[infoMessage]} `
    return message;
}

function reportSyntax(syntaxMessage:TChecks):string {
    const message=`${EMessages.INFO} ${EOtherVariables.SYNTAX} ${C_SYNTAX_TYPES[syntaxMessage]}\n\tPattern is: ${C_CHECK_REGEX[syntaxMessage]}`
    return message
 }
function reportSuggestion(syntaxMessage:TChecks):string {
    const message=`${EMessages.SUGGESTION} ${C_SUGGESTION_TYPES[syntaxMessage]}`;
    return message;
 }