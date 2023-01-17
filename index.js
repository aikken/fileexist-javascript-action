const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
try {

  const jsonFolder = core.getInput('jsonFolder');
  const rootFolder = process.env.GITHUB_WORKSPACE
  //core.getInput('rootAssetsFolder');
  core.info(`jsonFolder ${jsonFolder}!`);
  core.info(`rootFolder ${rootFolder}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow

  //const directoryPath = path.join(jsonFolder);
  //core.info(`directoryPath ${directoryPath}!`);
  //passsing directoryPath and callback function
  fs.readdir(path.resolve(jsonFolder), function (err, files) {
      //handling error
      if (err) {
          return core.info('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          core.info(file); 

          
          let rawdata = fs.readFileSync(file);
          let jsonFile = JSON.parse(rawdata);
          core.info(jsonFile[0].files.length);
          for(let i=0;i<jsonFile[0].files.length;i++){
            core.info(jsonFile[0].files[i].path);
            try {
              if (fs.existsSync(path.join(rootFolder,jsonFile[0].files[i].path))) {
                core.info("File found " + jsonFile[0].files[i].path + " referenced by file : " + file);
              }
            } catch(err) {
              core.setFailed("File not found : " + jsonFile[0].files[i].path + " referenced by file : " + file);
            }
          }
        
      });
  });



  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // core.info(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}