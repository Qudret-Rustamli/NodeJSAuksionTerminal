const inquirer = require('inquirer');
const auksion = require('./auksion');
const { addElement } = require('./element');

async function start() {
  while (true) {
    let res = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: 'Choise action',
        choices: ['Bid', 'Order'],
      },
    ]);
    if (res.action === 'Bid') {
      auksion();
    } else {
      addElement();
    }
  }
}
start();
