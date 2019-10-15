var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sql#333",
  port: 3306,
  database: "bamazon"
});

connection.connect();

connection.query("Select * from products", function(err, results) {
  if (err) throw err;
  results.forEach(function(item) {
    console.log(item.item_id);
    console.log(item.product_name);
    console.log(item.department);
    console.log(item.price);
    console.log(item.stock_quantity);
    console.log("--------------------------------------");
  });
});

connection.end();
