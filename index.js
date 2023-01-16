const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
try {

  const jsonFolder = core.getInput('jsonFolder');
  const rootAssetsFolder = core.getInput('rootAssetsFolder');
  console.log(`jsonFolder ${jsonFolder}!`);
  console.log(`rootAssetsFolder ${rootAssetsFolder}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow

  const directoryPath = path.join(__dirname, jsonFolder);
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          console.log(file); 

          
          let rawdata = fs.readFileSync(file);
          let jsonFile = JSON.parse(rawdata);
          console.log(jsonFile[0].files.length);
          for(let i=0;i<jsonFile[0].files.length;i++){
            console.log(jsonFile[0].files[i].path);
            try {
              if (fs.existsSync(jsonFile[0].files[i].path)) {
                console.log("File found " + jsonFile[0].files[i].path + " referenced by file : " + file);
              }
            } catch(err) {
              core.setFailed("File not found : " + jsonFile[0].files[i].path + " referenced by file : " + file);
            }
          }
        
      });
  });



  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}