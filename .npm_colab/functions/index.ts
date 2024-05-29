
import * as ts from "typescript";
import { LHLint } from "../.LHLint";
import { EChecks, ErrorExist } from "../constants/checks";
import { C_CHECK_REGEX } from "../constants/regex";
import { TChecks } from "../types/types";
import { reportBlock } from "./report-block";
export function checkLinting(sourceFile: ts.SourceFile) {
  delintNode(sourceFile);
  function delintNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.EnumDeclaration:
        const C_ENUM_NODE = node as ts.EnumDeclaration;
        const C_CHECK_ENUM_IDENTIFIER = EChecks[EChecks.ENUM_IDENTIFIER];
        if (LHLint[C_CHECK_ENUM_IDENTIFIER as TChecks] && !C_CHECK_REGEX.ENUM_IDENTIFIER.test(C_ENUM_NODE.name.getText())) {
          reportBlock(sourceFile, node, "IDENTIER_ERROR", C_CHECK_ENUM_IDENTIFIER as TChecks)
        }

        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        const C_TYPE_NODE = node as ts.TypeAliasDeclaration;
        const C_CHECK_TYPE_IDENTIFIER = EChecks[EChecks.TYPE_IDENTIFER];
        if (LHLint[C_CHECK_TYPE_IDENTIFIER as TChecks] && !C_CHECK_REGEX.TYPE_IDENTIFER.test(C_TYPE_NODE.name.getText())) {
          reportBlock(sourceFile, node, "IDENTIER_ERROR", C_CHECK_TYPE_IDENTIFIER as TChecks)
        }
        break;
      case ts.SyntaxKind.VariableDeclaration:
        const C_IDENTIFIER_NODE = node as ts.VariableDeclaration;
        switch (C_IDENTIFIER_NODE.parent.flags) {
          case ts.NodeFlags.Const:
            const C_CHECK_CONST_IDENTIFIER = EChecks[EChecks.CONST_IDENTIFIER];
            if (LHLint[C_CHECK_CONST_IDENTIFIER as TChecks] && !C_CHECK_REGEX.CONST_IDENTIFIER.test(C_IDENTIFIER_NODE.name.getText())) {
              reportBlock(sourceFile, node, "IDENTIER_ERROR", C_CHECK_CONST_IDENTIFIER as TChecks)
            }
            break;

        }
        break;
      case ts.SyntaxKind.InterfaceDeclaration:
        const C_INTERFACE_NODE = node as ts.InterfaceDeclaration;
        const C_CHECK_INTERFACE_IDENTIFIER = EChecks[EChecks.INTERFACE_IDENTIFIER];
        if (LHLint[C_CHECK_INTERFACE_IDENTIFIER as TChecks] && !C_CHECK_REGEX.INTERFACE_IDENTIFIER.test(C_INTERFACE_NODE.name.getText())) {
          reportBlock(sourceFile, node, "IDENTIER_ERROR", C_CHECK_INTERFACE_IDENTIFIER as TChecks)
        }
        break;
      case ts.SyntaxKind.ModuleDeclaration:
        const C_NAMESPACE_NODE = node as ts.NamedDeclaration;
        const C_CHECK_NAMESPACE_IDENTIFIER = EChecks[EChecks.NAMESPACE_IDENTIFER];
        if (LHLint[C_CHECK_NAMESPACE_IDENTIFIER as TChecks] && !C_CHECK_REGEX.NAMESPACE_IDENTIFER.test(C_NAMESPACE_NODE.name?.getText()!)) {
          reportBlock(sourceFile, node, "IDENTIER_ERROR", C_CHECK_NAMESPACE_IDENTIFIER as TChecks)
        }
        break;

      case ts.SyntaxKind.ClassDeclaration:
        const C_CLASS_NODE = node as ts.ClassDeclaration;
        const C_CHECK_CLASS_IDENTIFIER = EChecks[EChecks.CLASS_IDENTIFIER];
        const C_CLASS_ABSTRACT_MODIFIERS = C_CLASS_NODE.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.AbstractKeyword)

        if (C_CLASS_ABSTRACT_MODIFIERS && LHLint[C_CHECK_CLASS_IDENTIFIER as TChecks] && !C_CHECK_REGEX.ABSTRACT_IDENTIFIER.test(C_CLASS_NODE.name?.getText()!)) {
          reportBlock(sourceFile, node, "IDENTIER_ERROR", EChecks[EChecks.ABSTRACT_IDENTIFIER] as TChecks)
          break;
        }
        if (LHLint[C_CHECK_CLASS_IDENTIFIER as TChecks] && !C_CHECK_REGEX.CLASS_IDENTIFIER.test(C_CLASS_NODE.name?.getText()!)) {
          reportBlock(sourceFile, node, "IDENTIER_ERROR", C_CHECK_CLASS_IDENTIFIER as TChecks)
        }
        break;

    }

    ts.forEachChild(node, delintNode);
  }

  if (ErrorExist.state) {
    process.exit(1)
  }

}