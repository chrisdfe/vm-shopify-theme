const fs = require("fs/promises");
const path = require("path");

const sass = require("sass");

const { getOutputFilePathFromSourceFile } = require('./utils');

const compileSourceFile = async (sourceFile) => {
  const outputFile = getOutputFilePathFromSourceFile(sourceFile);

  const compiled = sass.renderSync({
    file: sourceFile,
    outFile: outputFile,
  });
  
  await fs.writeFile(outputFile, compiled.css);
}

module.exports.compileSourceFile = compileSourceFile;

const compileSourceFiles = async (sourceFiles) => {
  for (const sourceFile of sourceFiles) {
    await compileSourceFile(sourceFile);
  }
}

module.exports.compileSourceFiles = compileSourceFiles;