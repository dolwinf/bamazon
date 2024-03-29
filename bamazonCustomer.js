var inquirer = require("inquirer");
var mysql = require("mysql");
var figlet = require("figlet");
var chalk = require("chalk");
require("dotenv").config();

var connection = mysql.createConnection({
	host: process.env.BAMAZON_HOST,
	port: 3306,
	user: process.env.BAMAZON_USER,
	password: process.env.BAMAZON_PASS,
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
});

function showBanner() {
	var bamazon = "Bamazon";
	figlet(bamazon, function(err, data) {
		if (err) {
			console.log("Something went wrong...");
			console.dir(err);
			return;
		}
		console.log(chalk.hex("#116133")(data));

		console.log(chalk.hex("#116133")(" Welcome to Bamazon."));
		showInventory();
	});
}

function showInventory() {
	queryStr = "SELECT * FROM products";

	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log(chalk.hex("#32a83a")(" Existing Inventory:"));
		console.log(
			chalk.hex("#33FFB8 ")(
				"---------------------------------------------------------------------\n"
			)
		);

		data.forEach(function(item) {
			var string = "";
			string += chalk.hex("#ff9900")(" Product ID: " + item.item_id + " | ");
			string += chalk.hex("#ff9900")(
				" Product Name: " + item.product_name + " | "
			);
			string += chalk.hex("#ff9900")(" Department: " + item.department + " | ");
			string += chalk.hex("#ff9900")(" Price: $" + item.price + "\n");

			console.log(string);
		});

		console.log(
			chalk.hex("#33FFB8 ")(
				"---------------------------------------------------------------------\n"
			)
		);

		promptPurchase();
	});
}

function promptPurchase() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "item_id",
				message: "Please enter the item ID you would like to purchase.",
				filter: Number
			},
			{
				type: "input",
				name: "quantity",
				message: "How many items do you need?",

				filter: Number
			}
		])
		.then(function(input) {
			var item = input.item_id;
			var quantity = input.quantity;

			var queryStr = "SELECT * FROM products WHERE ?";

			connection.query(
				queryStr,
				{
					item_id: item
				},
				function(err, data) {
					if (err) throw err;

					if (data.length === 0) {
						console.log(
							chalk.hex("#FF0000")("\n Error: Please select valid item ID\n")
						);

						showInventory();
					} else {
						var productData = data[0];

						if (quantity <= productData.stock_quantity) {
							console.log(
								chalk.hex("#116133")(
									"\n This item is in stock. Placing order.......\n"
								)
							);

							var updateQueryStr =
								"UPDATE products SET stock_quantity = " +
								(productData.stock_quantity - quantity) +
								" WHERE item_id = " +
								item;

							connection.query(updateQueryStr, function(err, data) {
								if (err) throw err;

								console.log(
									chalk.hex("#116133")(
										" Your total is $" + productData.price * quantity
									)
								);
								console.log(
									chalk.hex("#116133")("\n Thank you for shopping at Bamazon.")
								);
								console.log(
									chalk.hex("#33FFB8 ")(
										"\n---------------------------------------------------------------------\n"
									)
								);

								connection.end();
							});
						} else {
							console.log(chalk.hex("#FFC0CB")("\n Not enough stock.\n"));
							console.log(chalk.hex("#FFC0CB")(" Please modify your order."));
							console.log(
								chalk.hex("#33FFB8 ")(
									"\n---------------------------------------------------------------------\n"
								)
							);

							showInventory();
						}
					}
				}
			);
		});
}
showBanner();
