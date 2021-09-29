const fs = require("fs/promises");
const path = require("path");

const postcss = require("postcss");
const sass = require("sass");
const autoprefixer = require("autoprefixer");

const { getOutputFilePathFromSourceFile } = require("./utils");

const compileSourceFile = async (sourceFile) => {
  const outputFile = getOutputFilePathFromSourceFile(sourceFile);

  const compiled = sass.renderSync({
    file: sourceFile,
    outFile: outputFile,
  });

  const postCompiled = await postcss([autoprefixer]).process(compiled.css, {
    from: outputFile,
    to: outputFile,
  });

  await fs.writeFile(outputFile, postCompiled.css);
};

module.exports.compileSourceFile = compileSourceFile;

const compileSourceFiles = async (sourceFiles) => {
  for (const sourceFile of sourceFiles) {
    await compileSourceFile(sourceFile);
  }
};

module.exports.compileSourceFiles = compileSourceFiles;
