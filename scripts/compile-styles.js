const fs = require("fs/promises");
const sass = require("sass");

const util = require('util');

const render = util.promisify(sass.render);

const sourceFile = "src/styles/styles.scss";
const outputFile ="assets/styles.css";

async function main() {
  const compiled = sass.renderSync({
    file: sourceFile,
    outFile: outputFile,
  })
  
  await fs.writeFile(outputFile, compiled.css);

  console.log('done.');
}

main();