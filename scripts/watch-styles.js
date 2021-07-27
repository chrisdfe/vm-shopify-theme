const watch = require('node-watch');

const { SOURCE_DIR } = require('./lib/styles/constants');
const { isDirectory, isEntrypointFile, getEntrypointFiles} = require('./lib/styles/utils');
const { compileSourceFile, compileSourceFiles } = require('./lib/styles/compile');

async function main() {
  console.log(`Watching ${SOURCE_DIR}`);
  
  watch(SOURCE_DIR, { recursive: true }, async (evt, filename) => {
    if (await isDirectory(filename)) {
      return;
    }

    const isEntrypoint = await isEntrypointFile(filename)

    if (isEntrypoint) {
      console.log(`recompiling ${filename}...`);
      await compileSourceFile(filename);
    } else {
      const entrypointFiles = await getEntrypointFiles(SOURCE_DIR);
      console.log(`recompiling ${entrypointFiles.length} entrypoint files...`);
      await compileSourceFiles(entrypointFiles);
    }
    console.log('...done.');
  });
}

main();