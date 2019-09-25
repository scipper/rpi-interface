const {exec} = require("child_process");
const fs = require("fs");

/**
 *
 */
function generateProdAngularApi() {
  console.log("Generating Angular Api...");

  exec(`ng-swagger-gen -i ./src/openapi/openapi.json -o src/api-interface -c ng-swagger-gen.json`,
    {maxBuffer: 1024 * 500},
    function(error, stdout, stderr) {
      if(error) {
        throw error;
      }

      if(stdout) {
        console.log(stdout);
      }

      if(stderr) {
        console.log("Error", stderr);
      }

      console.log("Angular Api successfully generated");

      // fixModels();
    });
}

/**
 *
 */
function fixModels() {
  console.log("fixing models ...");

  const filesToFix = [];

  filesToFix.forEach((fileName) => {
    let file = fs.readFileSync(`./src/api/models/${fileName}.ts`).toString();
    fs.writeFileSync(`./src/api/models/${fileName}.ts`, file);
  });
}

generateProdAngularApi();
