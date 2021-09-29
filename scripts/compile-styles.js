const { SOURCE_DIR } = require("./lib/styles/constants");
const { getEntrypointFiles } = require("./lib/styles/utils");
const { compileSourceFiles } = require("./lib/styles/compile");

async function main() {
  const sourceFiles = await getEntrypointFiles(SOURCE_DIR);
  console.log(sourceFiles);
  await compileSourceFiles(sourceFiles);
  console.log("done.");
}

main();
