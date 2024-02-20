// function to generate markdown for README
function generateMarkdown(data) {

  const title = `# ${data[0].title}`;
  const headings = data[1]['Table of Contents'];
  const answers = data[2];
  const badge = data[3];
  let includeTable;

  //Include Table of Contents if it was selected by the user during the question prompts
  data[1]['Table of Contents'].includes('Table of Contents') ? includeTable = true:  includeTable = false;
  const sections = headings.filter((item)=>
    item !== 'Table of Contents');

  //Generate the heading for the Table of Contents
  let table=`\n\n## ${headings[0]}\n`;
  let content ='';

  //Add the Table of Contents links
  for (i=0; i<sections.length; i++){
    includeTable ? table += `* [${sections[i]}](#${sections[i]})\n`: table = '';

    //Add the section headings and content
    let key = sections[i];
    content+= `\n\n## ${sections[i]}\n ${answers[key]}`;
  }

  //Compile the README file content
  return `${title} \n${badge} ${table} ${content}`;
}

//Export function
module.exports = generateMarkdown;
