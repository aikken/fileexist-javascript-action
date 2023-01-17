const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
var readdir = require('readdir-absolute');
try {

  const jsonFolder = core.getInput('jsonFolder');
  const assetsFolder = core.getInput('assetsFolder');
  const workspaceFolder = core.getInput('workspaceFolder');
  //core.getInput('rootAssetsFolder');
  core.info(`jsonFolder ${jsonFolder}!`);
  core.info(`assetsFolder ${assetsFolder}!`);
  core.info(`workspaceFolder ${workspaceFolder}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow

  const directoryPath = path.join(workspaceFolder, jsonFolder);
  //core.info(`directoryPath ${directoryPath}!`);
  //passsing directoryPath and callback function
  readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return core.info('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      core.info(file);
      if (file.split('.').length > 2) {
        let rawdata = fs.readFileSync(file);
        let jsonFile = JSON.parse(rawdata);

        core.info(jsonFile[0].files.length);

        for (let i = 0; i < jsonFile[0].files.length; i++) {
          core.info(path.join(workspaceFolder, assetsFolder, jsonFile[0].files[i].path));

          if (fs.existsSync(path.join(workspaceFolder, assetsFolder, jsonFile[0].files[i].path))) {
            core.info("File found " + jsonFile[0].files[i].path + " referenced by file : " + file);
          } else {
            core.setFailed("File not found : " + jsonFile[0].files[i].path + " referenced by file : " + file);
          }
        }
      }
      else core.info("Ignore this file because of file pattern :" + file);


    });
  });



  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // core.info(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}