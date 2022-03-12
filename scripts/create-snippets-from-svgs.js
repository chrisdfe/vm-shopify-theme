const path = require("path");
const fs = require("fs/promises");
const { optimize } = require("svgo");

const SVG_SOURCE_PATH = path.join(__dirname, "..", "src", "icons");
const SNIPPET_BASE_FILEPATH = path.join(__dirname, "..", "snippets");
const DEFS_SNIPPET_FILENAME = path.join(
  SNIPPET_BASE_FILEPATH,
  "icon-defs.liquid"
);

async function getAllSvgFilenames() {
  const filenames = await fs.readdir(SVG_SOURCE_PATH);
  return filenames.filter((filename) => filename !== ".DS_Store");
}

function optimizeSvg(contents) {
  const result = optimize(contents, {
    multipass: true,
  });
  const optimizedSvgString = result.data;
  return optimizedSvgString;
}

const getIconName = (svgFilename) =>
  svgFilename.replace("icons", "icon").replace(".svg", "").replace("_", "-");

async function cleanSvgFile(svgFilename) {
  const fullFilepath = path.join(SVG_SOURCE_PATH, svgFilename);
  const contents = (await fs.readFile(fullFilepath)).toString();

  const iconName = getIconName(svgFilename);

  const replacedSvgString = contents
    .replace("Layer_1", iconName)
    .replace(/fill=\"none\"/g, "")
    // TODO - use a better regex
    .replace(/fill=\"#[\d\w]{6}"/g, "")
    .replace(/stroke=\"#[\d\w]{6}"/g, "");

  // const optimizedSvgString = optimizeSvg(replacedSvgString);
  // return optimizedSvgString;
  return replacedSvgString;
}

async function createSnippetFiles(svgFilenames) {
  const cleanedSvgs = await Promise.all(
    svgFilenames.map(async (svgFilename) => {
      const iconName = getIconName(svgFilename);
      const cleanedContents = await cleanSvgFile(svgFilename);
      return {
        filename: svgFilename,
        name: iconName,
        contents: cleanedContents,
      };
    })
  );

  const defs = await Promise.all(
    cleanedSvgs.map(async ({ name, contents }) => {
      return `<g id="${name}">${contents}</g>`;
    })
  );

  const fileContents = `<svg id="vm-svg-defs" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
  <defs>
    ${defs.join("\n    ")}
  </defs>
</svg>`;

  await fs.writeFile(DEFS_SNIPPET_FILENAME, fileContents);
  console.info("icon-defs.liquid created");

  await Promise.all(
    cleanedSvgs.map(async ({ name, contents }) => {
      // e.g icon.magnifying-glass
      const filename = name.replace("icon-", "icon.");
      const snippetFilepath = path.join(
        SNIPPET_BASE_FILEPATH,
        `${filename}.liquid`
      );

      const [, iconWidth, iconHeight] = contents.match(
        /viewBox="0 0 (\d+) (\d+)"/
      );

      const className = name.replace("icon-", "");
      const linkContents = `<span class="vm-icon vm-icon--${className}"><svg viewBox="0 0 ${iconWidth} ${iconHeight}"><use xlink:href="#${name}"></svg></span>`;

      // const linkContents = `<span class="vm-icon vm-icon-${name}">${contents}</span>`;

      await fs.writeFile(snippetFilepath, linkContents);
      console.info(`${filename}.liquid created.`);
    })
  );
}

async function main() {
  const svgFilenames = await getAllSvgFilenames();
  await createSnippetFiles(svgFilenames);
}

main();
