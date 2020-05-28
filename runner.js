const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const render = require('./render')

const forbiddenDirs = ['node_modules'];

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests(){
    for(let file of this.testFiles) {
        console.log(chalk.white(`---${file.shortName}`));
        const beforeEaches = [];
        global.render = render;
        global.beforeEach = (fn) => {
            beforeEaches.push(fn);
        };

        global.it = async (desc, fn) => {
            beforeEaches.forEach(func => func());
            try {
                await fn();
                console.log(chalk.greenBright(`\t OK - ${desc}`));
            } catch (error) {
                const message = error.message.replace(/\n/g, '\n\t\t');
                console.log(chalk.redBright(`\t X - ${desc}`));
                console.log(chalk.redBright('\t', message));
            }
        };
        try {
            require(file.name);

        } catch (error) {
            console.log(chalk.redBright(error));
        }
    }
  }

  async collectFiles (targetPath) {
    const files = await fs.promises.readdir(targetPath);
    
    for(let file of files){
        const filepath = path.join(targetPath, file);
        const stats = await fs.promises.lstat(filepath);

        if(stats.isFile() && file.includes('.test.js')){
            this.testFiles.push({ name: filepath, shortName: file });
        } else if (stats.isDirectory() && !forbiddenDirs.includes(file)){
            const childFiles = await fs.promises.readdir(filepath);
            // note on map at bottom
            files.push(...childFiles.map(f => path.join(file, f)));
        }
    }
  }

}



module.exports = Runner;
/*
  targetPath:  targetPath === /Users/yourUserName/Documents/folderName/folder

  Map: The map statement in collectFiles gets the full file path. Without it the path would not include
       the containing folders. ex: rebecca/pandas vs rebecca/animals/mammals/pandas
       So, without the map statement the file path will be incorrect and throw an error.
  
  beforeEach: Mocha's beforeEach handles a lot of corner cases that we're not worrying about here.
    beforeEaches gets all the beforeEach functions.  
    it takes the array of all the beforeEach functions and executes them (with the forEach() statement), 
    before executing the function it is testing

*/