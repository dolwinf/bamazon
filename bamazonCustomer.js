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

var bamazon = "Bamazon";
figlet(bamazon, function(err, data) {
	if (err) {
		console.log("Something went wrong...");
		console.dir(err);
		return;
	}
	console.log(chalk.hex("#116133")(data));

	console.log(chalk.hex("#116133")(" Welcome to Bamazon."));
});

function showInventory() {
	queryStr = "SELECT * FROM products";

	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log(" Existing Inventory:");
		console.log(
			chalk.hex("#760ce8")(
				"---------------------------------------------------------------------\n"
			)
		);

		data.forEach(function(item) {
			var strOut = "";
			strOut += chalk.hex("#ff9900")(" Product ID: " + item.item_id + " | ");
			strOut += chalk.hex("#ff9900")(
				" Product Name: " + item.product_name + " | "
			);
			strOut += chalk.hex("#ff9900")(" Department: " + item.department + " | ");
			strOut += chalk.hex("#ff9900")(" Price: $" + item.price + "\n");

			console.log(strOut);
		});

		console.log(
			chalk.hex("#760ce8")(
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
									"\n This item is in stock. Placing order now.\n"
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
									chalk.hex("#116133")("\n Thanks for shopping at Bamazon.")
								);
								console.log(
									chalk.hex("#760ce8")(
										"\n---------------------------------------------------------------------\n"
									)
								);

								connection.end();
							});
						} else {
							console.log(chalk.hex("#FF0000")("\n Not enough stock.\n"));
							console.log(chalk.hex("#FF0000")(" Please modify your order."));
							console.log(
								chalk.hex("#760ce8")(
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

showInventory();
