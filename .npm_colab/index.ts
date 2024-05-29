import { readFileSync } from "fs";
import * as ts from "typescript";

import { checkLinting } from "./functions";

let fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
  // Parse a file
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );

  // delint it
  checkLinting(sourceFile);
});