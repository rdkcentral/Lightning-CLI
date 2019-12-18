const inquirer = require('inquirer')

// type = null, choices = null
const ask = (question, defaultAnswer = null, type = null, choices = []) => {
  return inquirer
    .prompt([{ name: 'q', message: question, default: defaultAnswer, type, choices }])
    .then(answers => answers.q)
}

module.exports = ask
