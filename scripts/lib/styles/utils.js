const fs = require("fs/promises");
const path = require("path");

const { SOURCE_DIR, OUTPUT_DIR } = require("./constants");

const isDirectory = async (fullFilePath) => {
  const stats = await fs.stat(fullFilePath);
  return stats.isDirectory();
};

module.exports.isDirectory = isDirectory;

// This assumes that this file is not a directory
const isEntrypointFile = async (fullFilePath) => {
  const pathChunks = fullFilePath.split("/");
  const filename = pathChunks[pathChunks.length - 1];

  return filename.endsWith(".scss") && !filename.startsWith("_");
};

module.exports.isEntrypointFile = isEntrypointFile;

const getEntrypointFiles = async (directory, entrypointFiles = []) => {
  const directoryFiles = await fs.readdir(directory);

  for (file of directoryFiles) {
    const fullFilePath = path.join(directory, file);

    if (await isDirectory(fullFilePath)) {
      await getEntrypointFiles(fullFilePath, entrypointFiles);
    } else {
      if (await isEntrypointFile(fullFilePath)) {
        entrypointFiles.push(fullFilePath);
      }
    }
  }

  return entrypointFiles;
};

module.exports.getEntrypointFiles = getEntrypointFiles;

const getOutputFilePathFromSourceFile = (sourceFile) => {
  const cleanedFilepath = sourceFile
    // strip src/styles from front of filename
    .replace(SOURCE_DIR, "")
    // Shopify's cdn isn't able to handle nested subdirectories
    .replace("/", "_")
    .replace(".scss", ".css");

  return path.join(OUTPUT_DIR, cleanedFilepath);
};

module.exports.getOutputFilePathFromSourceFile =
  getOutputFilePathFromSourceFile;
