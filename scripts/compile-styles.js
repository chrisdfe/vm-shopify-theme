const fs = require("fs/promises");
const path = require("path");
const sass = require("sass");

const util = require('util');

const render = util.promisify(sass.render);

const SOURCE_DIR = "src/styles/";
const OUTPUT_DIR = "assets/";

const sourceFile = "src/styles/styles.scss";

const outputFile = "assets/styles.css";

const getEntrypointFiles = async (directory, entrypointFiles = []) => {
  const directoryFiles = await fs.readdir(directory);
  
  for (file of directoryFiles) {
    const fullFilePath = path.join(directory, file)
    const stats = await fs.stat(fullFilePath);
    
    if (stats.isDirectory()) {
      await getEntrypointFiles(fullFilePath, entrypointFiles);
    } else {
      if (file.endsWith('.scss') && !file.startsWith('_')) {
        entrypointFiles.push(fullFilePath);
      }
    }
  }

  return entrypointFiles;
}

const getOutputFilePathFromSourceFile = (sourceFile) => {
  const cleanedFilepath = sourceFile
    // strip src/styles from front of filename
    .replace(SOURCE_DIR, '')
    // Shopify's cdn isn't able to handle nested subdirectories
    .replace('/', '_')
    .replace('.scss', '.css');

  return path.join(OUTPUT_DIR, cleanedFilepath);
}

const compileFile = async (sourceFile, outputFile) => {
  const compiled = sass.renderSync({
    file: sourceFile,
    outFile: outputFile,
  });
  
  await fs.writeFile(outputFile, compiled.css);
}

const compileSourceFiles = async (sourceFiles) => {
  for (const sourceFile of sourceFiles) {
    const outputFile = getOutputFilePathFromSourceFile(sourceFile);
    await compileFile(sourceFile, outputFile);
  }
}

async function main() {
  const sourceFiles = await getEntrypointFiles(SOURCE_DIR);

  console.log('sourceFiles', sourceFiles);
  await compileSourceFiles(sourceFiles);

  console.log('done.');
}

main();