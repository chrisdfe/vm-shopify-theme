const sass = require("sass");

sass.render({
  file: "src/styles/styles.scss",
}, function(err, result) {
  if (err) {
    throw err;
  }

  console.log('result', result.length);
});