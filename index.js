const fs = require("fs");
const path = require('path');
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");

//List of Licences and Badges
const licenceList =['Apache Licence 2.0','GNU General Public License v3.0', 'MIT Licence', 'BSD 2-clause "Simplified" Licence', 'BSD 3-clause "New" or "Revised" Licence', 'Boost Software Licence 1.0', 'Creative Commons Zero Licence v1.0 Universal', 'Eclipse Public Licence 1.0', 'GNU Affero General Public Licence v3.0', 'GNU General Public Licence v2.0', 'GNU Lesser General Public Licence v3.0', 'Mozilla Public Licence 2.0', 'Unlicense'];
const licenceBadges = [{'Apache Licence 2.0': '[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)' },{'GNU General Public License v3.0':'[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)'}, {'MIT Licence': '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)'}, {'BSD 2-clause "Simplified" Licence':'[![License](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)'}, {'BSD 3-clause "New" or "Revised" Licence':'[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)'}, {'Boost Software Licence 1.0':'[![License](https://img.shields.io/badge/License-Boost_1.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)'}, {'Creative Commons Zero Licence v1.0 Universal':'[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)'}, {'Eclipse Public Licence 1.0':'[![License](https://img.shields.io/badge/License-EPL_1.0-red.svg)](https://opensource.org/licenses/EPL-1.0)'}, {'GNU Affero General Public Licence v3.0':'[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)'}, {'GNU General Public Licence v2.0':'[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)'}, {'GNU Lesser General Public Licence v3.0':'[![License: LGPL v3](https://img.shields.io/badge/License-LGPL_v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)'}, {'Mozilla Public Licence 2.0':'[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)'}, {'Unlicense': '[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)'}];

// array of questions for user
const master = [{
        type: 'input',
        name: 'title',
        message: 'Enter the title of the project:'
    },
    {
        type: 'checkbox',
        name: 'Table of Contents',
        message: 'Select the sections to be included:',
        choices: ['Table of Contents', 'Description', 'Installation', 'Usage', 'Contribution', 'Licence', 'Tests', 'Questions']
    },
    {
        type: 'input',
        name: 'Description',
        message: 'Enter the content for the description section:'
    },
    {
        type: 'input',
        name: 'Installation',
        message: 'Enter the installation instructions:'
    },
    {
        type: 'input',
        name: 'Usage',
        message: 'Enter the usage information:'
    },
    {
        type: 'input',
        name: 'Contribution',
        message: 'Enter the contribution guidelines:'
    },
    {
        type: 'list',
        name: 'Licence',
        message: 'Select a licence:',
        choices: licenceList,
    },
    {
        type: 'input',
        name: 'Tests',
        message: 'Enter the test instructions:'
    },
    {
        type: 'input',
        name: 'Questions',
        message: 'Enter your GitHub username:',
    },
    {
        type: 'input',
        name: 'Email',
        message: 'Enter your e-mail address:',
    }
];

//Global Variables
let questions = [];
let user = [];
let sections = [];

// function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(`./${fileName}.md`, data, (err)=>{
            if (err){
                console.log('There was an error creating your file.', err);
            } else{
                console.log('File  written');
                
            }
    });
}

// function to initialize program
function init() {
    //Prompt user for README title and push it to the user answers array
    questions=[];
    inquirer
    .prompt(master[0])
    .then((ans1)=>{
        user.push(ans1);
        console.log(user);
    })
    .then((ans1)=>{
        //Prompt user for the sections to be included in the README file and push answer to the user answers array
        inquirer
        .prompt(master[1])
        .then((ans2)=>{
            user.push(ans2);
            sections = user[1]['Table of Contents'];

            //Fill the questions array with the sections the user selected earlier
            for (i=2; i<master.length; i++){
                if (sections.includes(master[i].name)){
                    questions.push(master[i]);
                } else if(master[i].name === 'Email' && sections.includes('Questions')){
                    questions.push(master[i]);
                }
            }

            //Ask the questions and push the answers to the user array
            inquirer
            .prompt(questions)
            .then((ans3)=>{
                user.push(ans3);

                //Licence Section - add licence information and badges 
                const input = user[2];
                const licence = input.Licence;
                const licenceSection = `This application is covered by the ${licence}.`;
                input.Licence = licenceSection;
                let badge = '';
                licenceBadges.map((badges)=> { Object.keys(badges)[0] === licence ? badge = badges[`${licence}`] : badges});
                user.push(badge);

                //Questions Section - add github link and email address
                const github = input.Questions;
                const email = input.Email;
                const questionsSection = `For more information, see [${github}](https://github.com/${github}). \n\n Further questions can be e-mailed to: \n[${email}](mailto:${email}?subject=${user[0]?.title})`;
                input.Questions = questionsSection;

                //Create the README file layout
                const file = generateMarkdown(user);
                writeToFile('README', file);
            })
        })
    })        
}

// function call to initialize program
// node index.js
init();
