const mysql = require('mysql2');
const inquirer = require('inquirer');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test',
  port: 3307,
});
function addElement() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Elements name',
      },
      {
        type: 'input',
        name: 'category',
        message: 'Elements category',
      },
      {
        type: 'number',
        name: 'price',
        message: 'Begin Bid',
      },
    ])
    .then((answers) => {
      conn.query(
        'CREATE TABLE IF NOT EXISTS element (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), beginBin int)',
        (err, results) => {
          if (err) {
            return console.log(err);
          } else {
            conn.query(
              'INSERT INTO element (name, category, beginBin) VALUES (?, ?, ?)',
              [`${answers.name}`, `${answers.category}`, `${answers.price}`],
              (err, results) => {
                if (err) {
                  return console.log(err);
                } else {
                  return console.log(answers);
                }
              },
            );
          }
        },
      );
    });
}
module.exports = { addElement };
