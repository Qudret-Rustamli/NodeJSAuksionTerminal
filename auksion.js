const mysql = require('mysql2');
const inquirer = require('inquirer');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test',
  port: 3307,
});
function auksion() {
  conn.query('SELECT name,beginBin FROM element', (err, results) => {
    if (err) {
      console.log('Error first line', err);
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'name',
            message: 'Choose element',
            choices: results.map((result) => result.name),
          },
          {
            type: 'number',
            name: 'order',
            message: 'Order Bid',
          },
        ])
        .then((answers) => {
          conn.query(
            `SELECT id,name,bid 
              FROM (SELECT e.id , e.name , e.category , e.beginBin , b.bid
              FROM element e 
              LEFT JOIN bids b 
              ON e.id = b.elementID 
              WHERE e.name = '${answers.name}') as NT
              ORDER BY bid DESC
              LIMIT 1`,
            (err, result) => {
              if (err) {
                console.log('Error second line', err);
              } else {
                if (result[0].bid === null) {
                  console.log('null ifi');
                  conn.query(
                    `select * from element where name="${answers.name}"`,
                    (err, result1) => {
                      if (err) {
                        console.log('Error third line', err);
                      } else {
                        if (result1[0].beginBin > answers.order) {
                          console.log('Bid is too low', result1[0].beginBin);
                        } else {
                          conn.query(
                            'INSERT INTO bids (elementID,bid) VALUES (?, ?)',
                            [`${result1[0].id}`, `${answers.order}`],
                            (err, result) => {
                              if (err) {
                                console.log('Error fourth line', err);
                              } else {
                                console.log('Bid is accepted');
                              }
                            },
                          );
                        }
                      }
                    },
                  );
                } else {
                  console.log('not null ifi');
                  if (result[0].bid >= answers.order) {
                    console.log('Bid is too low', result[0].bid);
                  } else {
                    conn.query(
                      'INSERT INTO bids (elementID,bid) VALUES (?, ?)',
                      [result[0].id, answers.order],
                      (err, result) => {
                        if (err) {
                          console.log('Error third line', err);
                        } else {
                          console.log('Bid is accepted');
                        }
                      },
                    );
                  }
                }
              }
            },
          );
        });
    }
  });
}
module.exports =  auksion ;
